package com.socialnetwork.service;

import com.socialnetwork.exception.CannotCreateFileException;
import com.socialnetwork.exception.EmailNotFoundException;
import com.socialnetwork.model.enums.EFileType;
import com.socialnetwork.model.resource.MediaResources;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.FileRepository;
import com.socialnetwork.repository.UserRepository;
import com.socialnetwork.utils.EnvironmentUtils;
import com.socialnetwork.utils.FileUtils;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    @Resource
    private UserService userService;
    @Resource
    private FileRepository fileUploadRepository;
    @Resource
    private UserRepository userRepository;

    public String saveFileUploaded(MultipartFile multipartFile, Authentication authentication, String targetFolder, String extensionFile, String originNameFile) throws Exception {
        String baseFolder = EnvironmentUtils.getEnvironmentValue("public-folder");
        String baseFolderUpload = EnvironmentUtils.getEnvironmentValue("upload_files.base-folder");
        String savedFolder = baseFolderUpload + targetFolder;
        Date uploadedTime = new Date();
        String strUploadedTime = (new SimpleDateFormat("ddMMyyyyHHmmss").format(uploadedTime));
        String encodedFileName = FileUtils.encoding(Objects.requireNonNull(multipartFile.getOriginalFilename())) + "_" + strUploadedTime + extensionFile;
        log.info(baseFolder + savedFolder + encodedFileName);
        File file = new File(baseFolder + savedFolder + encodedFileName);
        try {
            file.createNewFile();
            log.info("File " + encodedFileName + " created");
            multipartFile.transferTo(file);
            long fileSize = file.length();

            saveFileUpLoadIntoDB(authentication, originNameFile, savedFolder + encodedFileName, fileSize, extensionFile);
            return encodedFileName;
        } catch (Exception e) {
            throw new CannotCreateFileException("Can not save new file: " + multipartFile.getOriginalFilename(), multipartFile.getOriginalFilename());
        }
    }
    private String saveFileUpLoadIntoDB(Authentication authentication, String encodeFileName, String path, long fileSize, String extensionFile) throws Exception {
        String uploadedByEmail = authentication.getName();
        Optional<User> optionalUploadedBy = userService.getActiveUserByUserName(uploadedByEmail);

        if (optionalUploadedBy.isPresent()) {
            User uploadedBy = optionalUploadedBy.get();
            MediaResources fileUpload = new MediaResources();

            // generate random UUID
            fileUpload.setUUID(UUID.randomUUID().toString());
            fileUpload.setCreatedBy(uploadedBy);
            fileUpload.setCreatedAt(LocalDateTime.now());

            // append suffix into fileName
            fileUpload.setFileName(encodeFileName);
            fileUpload.setFilePath(path);
            fileUpload.setFileSize(fileSize);
            fileUpload.setFileType(EFileType.toExtension(extensionFile));
            fileUpload.setExternal(true);

            // save information to db
            fileUploadRepository.save(fileUpload);

            return fileUpload.getUUID();
        } else
            throw new EmailNotFoundException("Not found Email " + uploadedByEmail, uploadedByEmail);
    }

    public List<MediaResources> getAllFileByUser(String username){
        Optional<User> currentUser = userRepository.findByUsername(username);
        if(currentUser.isPresent()){
            List<MediaResources> result = fileUploadRepository.findAllByCreatedBy(currentUser.get());
            return result;
        }
        return null;
    }

    private void compressedImage(File input, String des) throws IOException {
        File fileCompressed = new File(des);
        BufferedImage bimg = ImageIO.read(input);
        int width = bimg.getWidth();
        int height = bimg.getHeight();
        int maxWidth = 800;
        int maxHeight = 800;

        if (width >= height) {
            double rate = width / maxWidth;
            if (rate > 1) {
                width = maxWidth;
                height = (int) (height * (1 / rate));
            }
        } else {
            double rate = height / maxHeight;
            if (rate > 1) {
                height = maxHeight;
                width = (int) (width * (1 / rate));
            }
        }

        Thumbnails.of(input)
                .outputQuality(0.5)
                .size(width, height)
                .toFile(fileCompressed);

    }
}
