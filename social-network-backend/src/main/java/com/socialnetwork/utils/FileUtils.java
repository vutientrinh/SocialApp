package com.socialnetwork.utils;

import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@Slf4j
public class FileUtils {

    public static String getPath(String baseFolder, String file) {
        return baseFolder + File.separator + file;
    }

    public static String encoding(String fileName) {
        //use encoding base64
        return Base64.getEncoder().encodeToString(fileName.getBytes());
    }

    public static String decoding(String encodedString) {
        //use encoding base64
        byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
        return new String(decodedBytes);
    }

    public static boolean checkFileNameValid(MultipartFile multipartFile, String regex) {
        String fileName;
        fileName = multipartFile.getOriginalFilename();
        assert fileName != null;
        return fileName.toLowerCase().contains(regex);
    }

    public static byte[] readFileFromLocation(String fileUrl) {
        if (StringUtils.isBlank(fileUrl)) {
            return null;
        }
        try {
            Path filePath = new File(fileUrl).toPath();
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.warn("Nou file found in the path {}", fileUrl);
        }
        return null;
    }

    public static String getFileExtension(String fileName) {
        if (fileName == null) {
            return null;
        }
        int index = fileName.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return fileName.substring(index);
    }

    public static String getFileName(String fileName) {
        if (fileName == null) {
            return null;
        }
        int index = fileName.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return fileName.substring(0, index);
    }
}
