package com.socialnetwork.Mapper;

import com.socialnetwork.dtos.Requests.ImageRequest;
import com.socialnetwork.model.news.Image;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ImageMapper {
    private final ModelMapper mapper = new ModelMapper();

    public List<Image> toImages(List<ImageRequest> imageRequests) {
        return imageRequests.stream().map(imageRequest -> {
            Image image = new Image();
            image.setName(imageRequest.getName());
            image.setUrl(imageRequest.getUrl());
            return image;
        }).collect(Collectors.toList());
    }
}
