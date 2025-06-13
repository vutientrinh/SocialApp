package com.socialnetwork.Service;

import com.socialnetwork.service.FileStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
public class TestFileStorageService {

    @Autowired
    private FileStorageService fileStorageService;

    @Test
    public void testSaveFileUploaded(MultipartFile file, Authentication authentication){

    }
}
