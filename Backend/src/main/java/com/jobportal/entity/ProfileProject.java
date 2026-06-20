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
@Table(name = "profile_projects")
public class ProfileProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_uid", nullable = false)
    @JsonIgnore
    @lombok.ToString.Exclude
    private JobSeekerProfile profile;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String link;
    private boolean featured;
}
