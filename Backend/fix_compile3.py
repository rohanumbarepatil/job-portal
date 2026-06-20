import os
import re

replacements = {
    "src/main/java/com/jobportal/service/ResumeRankingService.java": [
        ("rankingRepository.findByJobIdOrderByAppliedAtDesc(jobId)", "rankingRepository.findByJobId(jobId)"),
        ("applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)", "applicationRepository.findByJobIdOrderByCreatedAtDesc(jobId)")
    ],
    "src/main/java/com/jobportal/service/ApplicationService.java": [
        ("job.getCompanyMetadata().getCompanyName()", "job.getCompanyMetadata() != null ? job.getCompanyMetadata().getCompanyName() : \"\""),
        ("applicationRepository.findByCandidateUidOrderByAppliedAtDesc(", "applicationRepository.findByCandidateUidOrderByCreatedAtDesc("),
        ("applicationRepository.findByJobIdOrderByAppliedAtDesc(", "applicationRepository.findByJobIdOrderByCreatedAtDesc("),
        ("applicationLogRepository.findByApplicationId(", "applicationLogRepository.findByApplicationIdOrderByTimestampDesc(")
    ],
    "src/main/java/com/jobportal/service/AuthService.java": [
        ("UserEntity existing = userRepository.findById(uid);", "UserEntity existing = userRepository.findById(uid).orElse(null);")
    ],
    "src/main/java/com/jobportal/service/InterviewService.java": [
        ("InterviewFeedbackEntity feedback = feedbackRepository.findByInterviewId(interviewId);", "InterviewFeedbackEntity feedback = feedbackRepository.findByInterviewId(interviewId).orElse(null);")
    ],
    "src/main/java/com/jobportal/service/JobSeekerProfileService.java": [
        ("JobSeekerProfile profile = profileRepository.findById(uid);", "JobSeekerProfile profile = profileRepository.findById(uid).orElse(null);"),
        ("return profileRepository.findById(uid);", "return profileRepository.findById(uid).orElse(null);")
    ],
    "src/main/java/com/jobportal/controller/NotificationController.java": [
        ("NotificationPreferenceEntity prefs = preferenceRepository.findByUserUid(uid);", "NotificationPreferenceEntity prefs = preferenceRepository.findByUserUid(uid).orElse(null);")
    ]
}

for filepath, reps in replacements.items():
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        for old, new in reps:
            content = content.replace(old, new)
        with open(filepath, 'w') as f:
            f.write(content)

# We can also do a general regex for any .findById or .findByCompanySlug that is assigned to Entity
def regex_fix(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Entity obj = repo.findById(id); -> Entity obj = repo.findById(id).orElse(null);
    content = re.sub(r'(= [a-zA-Z0-9_]+Repository\.find[a-zA-Z0-9_]+\([a-zA-Z0-9_, ]+\));', r'\1.orElse(null);', content)
    # Fix double orElse(null)
    content = content.replace('.orElse(null).orElse(null);', '.orElse(null);')
    # Or cases like return repo.findById(id);
    content = re.sub(r'(return [a-zA-Z0-9_]+Repository\.find[a-zA-Z0-9_]+\([a-zA-Z0-9_, ]+\));', r'\1.orElse(null);', content)
    content = content.replace('.orElse(null).orElse(null);', '.orElse(null);')
    
    with open(filepath, 'w') as f:
        f.write(content)

regex_fix("src/main/java/com/jobportal/service/CompanyService.java")
regex_fix("src/main/java/com/jobportal/service/AuthService.java")
regex_fix("src/main/java/com/jobportal/service/JobSeekerProfileService.java")
regex_fix("src/main/java/com/jobportal/service/InterviewService.java")
regex_fix("src/main/java/com/jobportal/controller/NotificationController.java")

print("Fixed round 3")
