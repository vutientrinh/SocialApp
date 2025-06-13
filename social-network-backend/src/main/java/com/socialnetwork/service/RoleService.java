package com.socialnetwork.service;

import java.util.List;

import jakarta.annotation.Resource;

import org.springframework.stereotype.Service;

import com.socialnetwork.model.user.Role;
import com.socialnetwork.repository.RoleRepository;

@Service
public class RoleService {
    @Resource
    private RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
