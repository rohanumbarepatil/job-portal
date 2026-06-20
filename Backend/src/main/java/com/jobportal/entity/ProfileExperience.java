package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profile_experience")
public class ProfileExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_uid", nullable = false)
    @JsonIgnore
    @lombok.ToString.Exclude
    private JobSeekerProfile profile;

    private String title;
    private String company;
    private String startDate;
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    private boolean isCurrent;
}
