package com.jobportal.security;

import com.jobportal.entity.UserEntity;
import com.jobportal.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> 
                new UsernameNotFoundException("User not found with email: " + email));
        return new CustomUserDetails(user);
    }
    
    public UserDetails loadUserById(String uid) throws UsernameNotFoundException {
        UserEntity user = userRepository.findById(uid).orElseThrow(() -> 
                new UsernameNotFoundException("User not found with ID: " + uid));
        return new CustomUserDetails(user);
    }
}
