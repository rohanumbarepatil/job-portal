import os

def replace_in_file(filepath, old, new):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

replace_in_file("src/main/java/com/jobportal/service/ApplicationService.java", 
                "job.getCompanyMetadata() != null ? job.getCompanyMetadata().getName() : \"\"", 
                "job.getCompanyMetadata() != null ? job.getCompanyMetadata().getCompanyName() : \"\"")

replace_in_file("src/main/java/com/jobportal/service/AuthService.java",
                "Optional<UserEntity> existing = userRepository.findById(uid).orElse(null);",
                "UserEntity existing = userRepository.findById(uid).orElse(null);")

replace_in_file("src/main/java/com/jobportal/service/CompanyService.java",
                "return companyRepository.findByTeamMemberUidsContaining(uid).orElse(null);",
                "return companyRepository.findByTeamMemberUidsContaining(uid);")

replace_in_file("src/main/java/com/jobportal/service/InterviewService.java",
                "return interviewRepository.findByCandidateUidOrderByScheduledAtDesc(candidateUid).orElse(null);",
                "return interviewRepository.findByCandidateUidOrderByScheduledAtDesc(candidateUid);")

replace_in_file("src/main/java/com/jobportal/service/InterviewService.java",
                "return interviewRepository.findByRecruiterUidOrderByScheduledAtDesc(recruiterUid).orElse(null);",
                "return interviewRepository.findByRecruiterUidOrderByScheduledAtDesc(recruiterUid);")

replace_in_file("src/main/java/com/jobportal/service/JobSeekerProfileService.java",
                "return repository.findById(uid);",
                "return repository.findById(uid).orElse(null);")

replace_in_file("src/main/java/com/jobportal/service/JobSeekerProfileService.java",
                "JobSeekerProfile existing = repository.findById(uid);",
                "JobSeekerProfile existing = repository.findById(uid).orElse(null);")

replace_in_file("src/main/java/com/jobportal/service/JobSeekerProfileService.java",
                "JobSeekerProfile profile = repository.findByUsername(username);",
                "JobSeekerProfile profile = repository.findByUsername(username).orElse(null);")

replace_in_file("src/main/java/com/jobportal/controller/NotificationController.java",
                "NotificationPreferenceEntity pref = preferenceRepository.findByUserUid(auth.getName());",
                "NotificationPreferenceEntity pref = preferenceRepository.findByUserUid(auth.getName()).orElse(null);")

print("Fixed round 4")
