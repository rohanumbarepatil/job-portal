import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    filename = os.path.basename(filepath)
    
    if filename == 'ResumeRankingService.java':
        content = content.replace('.findByJobId(', '.findByJobIdOrderByAppliedAtDesc(')
        
    elif filename == 'AdminController.java':
        content = content.replace('adminLogRepository.findAllLogs()', 'adminLogRepository.findAll()')
        
    elif filename == 'ApplicationService.java':
        content = content.replace('existsByCandidateAndJob', 'existsByCandidateUidAndJobId')
        content = content.replace('getCompany().getName()', 'getCompanyMetadata().getCompanyName()')
        content = content.replace('.findByCandidateUid(', '.findByCandidateUidOrderByAppliedAtDesc(')
        content = content.replace('.findByJobId(', '.findByJobIdOrderByAppliedAtDesc(')
        
    elif filename == 'AuthService.java':
        content = content.replace('Optional<UserEntity> existing = userRepository.findById(uid);', 'UserEntity existing = userRepository.findById(uid).orElse(null);')
        
    elif filename == 'CompanyService.java':
        content = content.replace('.findBySlug(', '.findByCompanySlug(')
        content = content.replace('.findByTeamMemberUid(', '.findByTeamMemberUidsContaining(')
        
    elif filename == 'InterviewService.java':
        content = content.replace('.findByCandidateUid(', '.findByCandidateUidOrderByScheduledAtDesc(')
        content = content.replace('.findByRecruiterUid(', '.findByRecruiterUidOrderByScheduledAtDesc(')
        
    elif filename == 'JobService.java':
        # jobRepository.save(jobId) ? Let's check what it is.
        # It's probably incrementMetric returning void or something. We commented it out earlier.
        # Oh, if it's "String cannot be converted to JobEntity" at line 80: jobRepository.save(jobId)?
        pass
        
    elif filename == 'JobSeekerProfileService.java':
        content = content.replace('JobSeekerProfile profile = profileRepository.findById(uid);', 'JobSeekerProfile profile = profileRepository.findById(uid).orElse(null);')
        content = content.replace('return profileRepository.findById(uid);', 'return profileRepository.findById(uid).orElse(null);')
        
    elif filename == 'ProfileMetricsEngine.java':
        content = content.replace('import com.jobportal.entity.JobSeekerProfile;', 'import com.jobportal.entity.JobSeekerProfile;\nimport com.jobportal.entity.ProfileExperience;\nimport com.jobportal.entity.ProfileEducation;\nimport com.jobportal.entity.ProfileProject;\nimport com.jobportal.entity.ProfileCertification;')
        
    elif filename == 'NotificationController.java':
        content = content.replace('NotificationPreferenceEntity prefs = preferenceRepository.findByUserUid(uid);', 'NotificationPreferenceEntity prefs = preferenceRepository.findByUserUid(uid).orElse(null);')
        
    with open(filepath, 'w') as f:
        f.write(content)

src_dir = 'src/main/java/com/jobportal'
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.java'):
            process_file(os.path.join(root, file))

print("Fixed round 2")
