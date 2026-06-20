package com.jobportal.repository;
import com.jobportal.entity.InterviewFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedbackEntity, String> {
    Optional<InterviewFeedbackEntity> findByInterviewId(String interviewId);
}
