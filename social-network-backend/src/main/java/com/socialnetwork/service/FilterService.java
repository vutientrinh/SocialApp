package com.socialnetwork.service;

import com.socialnetwork.repository.FileRepository;
import com.socialnetwork.repository.PostRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Slf4j
@Service
public class FilterService {

    @Resource
    private UserRepository userRepository;
    @Resource
    private PostRepository postRepository;
    @Resource
    private FileRepository fileRepository;

    public Map<String, Collection<String>> getUserFilter() {
        return null;
    }

    public Map<String, Collection<String>> getPostFilter() {
        return null;
    }

    public Map<String, Collection<String>> getFileFilter() {
        return null;
    }
}
