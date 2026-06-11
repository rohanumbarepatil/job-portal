package com.jobportal.service;

import com.jobportal.entity.EmailLogEntity;
import com.jobportal.repository.EmailLogRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.Instant;
import java.util.UUID;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    public EmailService(JavaMailSender mailSender, EmailLogRepository emailLogRepository) {
        this.mailSender = mailSender;
        this.emailLogRepository = emailLogRepository;
    }

    @Async
    public void sendEmailAsync(String userUid, String to, String subject, String htmlContent, String templateType) {
        EmailLogEntity log = EmailLogEntity.builder()
                .logId(UUID.randomUUID().toString())
                .userUid(userUid)
                .emailAddress(to)
                .templateType(templateType)
                .subject(subject)
                .status("PENDING")
                .createdAt(Instant.now().toString())
                .build();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content

            mailSender.send(message);

            log.setStatus("SENT");
            emailLogRepository.save(log);

        } catch (Exception e) {
            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
            try {
                emailLogRepository.save(log);
            } catch (Exception dbEx) {
                System.err.println("Failed to save email log: " + dbEx.getMessage());
            }
        }
    }
}
