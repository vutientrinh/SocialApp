package com.socialnetwork.Mapper;

import com.socialnetwork.dtos.Requests.MediaResourceRequest;
import com.socialnetwork.model.resource.MediaResources;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MediaResourceMapper {
    private final ModelMapper mapper = new ModelMapper();

    public MediaResources toMediaResources(MediaResourceRequest mediaResourceRequest) {
        return mapper.map(mediaResourceRequest, MediaResources.class);
    }
}
