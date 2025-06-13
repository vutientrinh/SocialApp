package com.socialnetwork.service;

import com.socialnetwork.dtos.PostDayCount;
import com.socialnetwork.model.enums.EGender;
import com.socialnetwork.model.news.Post;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.repository.PostRepository;
import com.socialnetwork.repository.ProfileRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Resource
    private ProfileRepository profileRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private PostRepository postRepository;

    public HashMap<String, Object> getAllProfilesInfo(Integer page, Integer size) {
        if (page < 1)
            throw new IllegalArgumentException("Page number must be greater than 0");
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        Page<Profile> profiles = profileRepository.findAll(pageRequest);
        HashMap<String, Object> response = new HashMap<>();
        response.put("profiles", profiles.getContent());
        response.put("totalPage", profiles.getTotalPages());
        response.put("totalElement", profiles.getTotalElements());
        response.put("pageNumber", profiles.getNumber() + 1);
        response.put("totalElementPage", profiles.getNumberOfElements());
        response.put("size", profiles.getSize());
        return response;
    }

    public HashMap<String, Object> getNumberOfGender(){
        Integer countMaleProfile = profileRepository.countByGender(EGender.MALE);
        Integer countFemaleProfile = profileRepository.countByGender(EGender.FEMALE);
        HashMap<String, Object> response = new HashMap();
        response.put("male", countMaleProfile);
        response.put("female", countFemaleProfile);
        return response;
    }

    public HashMap<String, Object> getNumberOfPosts(){
        // Get number of Posts on this week
        List<Object[]> results = postRepository.countPostsByDayOfWeek();
        List<PostDayCount> dayCounts = results.stream()
                .map(PostDayCount::new)
                .collect(Collectors.toList());
//        dayCounts.forEach(dayCount -> System.out.println(dayCount.getDayOfWeek() + " " + dayCount.getCount()));
        HashMap<String, Object> response = new HashMap<>();
        response.put("dayCounts", dayCounts);
        return response;
    }

    public HashMap<String, Object> getNumberOfPostsCurrentWeek(){
        // Get number of Posts on this week
        List<Object[]> results = postRepository.countPostsByCurrentWeek();
        List<PostDayCount> dayCounts = results.stream()
                .map(PostDayCount::new)
                .collect(Collectors.toList());
        HashMap<String, Object> response = new HashMap<>();
        response.put("dayCountsWeek", dayCounts);
        return response;
    }

    public HashMap<String, Object> getActiveList(){
        Integer getActiveUsers = userRepository.getActiveUsers();
        Integer getInActiveUsers = userRepository.getInActiveUsers();
        HashMap<String, Object> response = new HashMap<>();
        response.put("active", getActiveUsers);
        response.put("inactive", getInActiveUsers);
        return response;
    }

    public Integer countLikesAllPosts(){
        List<Post> posts = postRepository.findAll();
        Integer count = 0;
        for (Post post : posts){
            count += post.getReactions().size();
        }
        return count;
    }

    public Integer countCommentsAllPosts(){
        List<Post> posts = postRepository.findAll();
        Integer count = 0;
        for (Post post : posts){
            count += post.getComments().size();
        }
        return count;
    }
}
