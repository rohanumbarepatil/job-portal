package com.jobportal.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.GeminiRankingResponseDTO;
import com.jobportal.entity.JobEntity;
import com.jobportal.entity.JobSeekerProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiMatchingService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    public GeminiMatchingService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public GeminiRankingResponseDTO rankCandidate(JobEntity job, JobSeekerProfile profile) {
        String prompt = buildPrompt(job, profile);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        String urlWithKey = apiUrl + "?key=" + apiKey;

        try {
            String response = restTemplate.postForObject(urlWithKey, entity, String.class);
            return parseGeminiResponse(response);
        } catch (Exception e) {
            System.err.println("Failed to get AI score: " + e.getMessage());
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(JobEntity job, JobSeekerProfile profile) {
        // Strip PII and build context
        StringBuilder p = new StringBuilder();
        p.append(
                "You are an expert ATS AI Assistant. Your job is to strictly evaluate a candidate against a job posting.\n");
        p.append(
                "Output STRICTLY in JSON format with NO markdown wrapping, NO backticks. Only return the raw JSON object.\n\n");

        p.append("Expected JSON Schema:\n");
        p.append("{\n");
        p.append("  \"skillsMatch\": 0-40,\n");
        p.append("  \"experienceMatch\": 0-25,\n");
        p.append("  \"educationMatch\": 0-10,\n");
        p.append("  \"profileStrength\": 0-15,\n");
        p.append("  \"resumeQuality\": 0-10,\n");
        p.append("  \"totalScore\": 0-100,\n");
        p.append("  \"aiExplanation\": \"Brief 2 sentence explanation of the score.\"\n");
        p.append("}\n\n");

        p.append("--- JOB DESCRIPTION ---\n");
        p.append("Title: ").append(job.getTitle()).append("\n");
        p.append("Description: ").append(job.getDescription()).append("\n");
        p.append("Required Skills: ").append(job.getRequiredSkills()).append("\n");
        p.append("Experience Level: ").append(job.getExperienceLevel()).append("\n\n");

        p.append("--- CANDIDATE PROFILE ---\n");
        p.append("Headline: ").append(profile.getHeadline()).append("\n");
        p.append("Skills: ").append(profile.getSkills()).append("\n");
        p.append("Experience: ").append(profile.getExperience() != null ? profile.getExperience().toString() : "None")
                .append("\n");
        p.append("Education: ").append(profile.getEducation() != null ? profile.getEducation().toString() : "None")
                .append("\n");

        return p.toString();
    }

    private GeminiRankingResponseDTO parseGeminiResponse(String rawResponse) {
        try {
            // The actual JSON is inside a deeply nested response object from Gemini REST
            // API
            // Form: { "candidates": [ { "content": { "parts": [ { "text": "{ ... }" } ] } }
            // ] }
            var root = objectMapper.readTree(rawResponse);
            String jsonText = root.path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            // Clean markdown backticks if Gemini ignored instructions
            jsonText = jsonText.replace("```json", "").replace("```", "").trim();

            return objectMapper.readValue(jsonText, GeminiRankingResponseDTO.class);
        } catch (Exception e) {
            System.err.println("Failed to parse Gemini JSON: " + e.getMessage());
            return GeminiRankingResponseDTO.builder().totalScore(0).aiExplanation("Parse error.").build();
        }
    }
}
