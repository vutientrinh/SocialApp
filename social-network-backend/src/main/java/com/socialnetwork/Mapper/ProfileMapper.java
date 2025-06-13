package com.socialnetwork.Mapper;

import com.socialnetwork.dtos.Responses.ActiveUserResponse;
import com.socialnetwork.model.user.Profile;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProfileMapper {

    private final ModelMapper mapper = new ModelMapper();

    public List<ActiveUserResponse> toActiveUserResponseList(List<Object> results) {
        return results.stream().map(result -> {
            Object[] row = (Object[]) result;
            return new ActiveUserResponse((String) row[0], (String) row[1], (Boolean) row[2]);
        }).collect(Collectors.toList());
    }

    public Profile updateNewProfile(Profile profile, Profile newProfile) {
        mapper.map(newProfile, profile);
        return profile;
    }
}
