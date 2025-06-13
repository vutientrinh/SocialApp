package com.socialnetwork.Mapper;

import com.socialnetwork.model.news.Content;
import com.socialnetwork.model.news.Image;
import com.socialnetwork.model.resource.MediaResources;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ContentMapper {
    private final ModelMapper mapper = new ModelMapper();

    public Content toContent(String message, MediaResources fileUUID, List<Image> ImageURLs) {
        Content content = new Content();
        content.setMessage(message);
        content.setFileUUID(fileUUID);
        content.setImageURLs(ImageURLs);
        return content;
    }
}
