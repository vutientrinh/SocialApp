package com.socialnetwork.service;

import com.socialnetwork.model.relationship.Follow;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.FollowRepository;
import com.socialnetwork.repository.ProfileRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FollowService {

    @Resource
    private FollowRepository followRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private ProfileRepository profileRepository;

    public Boolean createFollow(String following, String follower) {
        Optional<User> followingUser = userRepository.findByUUID(following);
        Optional<User> followerUser = userRepository.findByUUID(follower);
        Optional<Follow> isFollow = followRepository.isFollow(followingUser.get(), followerUser.get());
        if (followingUser.isPresent() && followerUser.isPresent() && !isFollow.isPresent()) {
            Follow follow = new Follow();
            follow.setFollowing(followingUser.get());
            follow.setFollower(followerUser.get());
            follow.setCreatedBy(followingUser.get());
            follow.setCreatedAt(LocalDateTime.now());
            Follow follow_request = followRepository.save(follow); // saving
            if (follow_request != null) {
                return true;
            }
        }
        return false;
    }

    public Boolean deleteFollow(String following, String follower) {
        Optional<User> followingUser = userRepository.findByUUID(following);
        Optional<User> followerUser = userRepository.findByUUID(follower);
        if (followingUser.isPresent() && followerUser.isPresent()) {
            Follow follow = followRepository.findByFollowingAndFollower(followingUser.get(), followerUser.get());
            if (follow != null) followRepository.deleteFollow(following, follower);
            Optional<Follow> isFollow = followRepository.isFollow(followingUser.get(), followerUser.get());
            if (!isFollow.isPresent()) {
                return true;
            }
        }
        return false;
    }

    public List<Profile> getAllNotFollowing(String currentUser) {
        List<Profile> profiles = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(currentUser);
        if (user.isPresent()) {
            List<User> users = followRepository.findAllNotFollowing(user.get());
            // change all to profile list
            for (User u : users) {
                Optional<Profile> optionalProfile = profileRepository.findProfileByCreatedBy(u);
                if (optionalProfile.isPresent()) {
                    profiles.add(optionalProfile.get());
                }
            }
            return profiles;
        }
        return new ArrayList<>();
    }

    public List<Profile> getAllFollowing(String currentUser) {
        List<Profile> profiles = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(currentUser);
        if (user.isPresent()) {
            List<User> users = followRepository.findAllFollowing(user.get());
            // change all to profile list
            for (User u : users) {
                Optional<Profile> optionalProfile = profileRepository.findProfileByCreatedBy(u);
                if (optionalProfile.isPresent()) {
                    profiles.add(optionalProfile.get());
                }
            }
            return profiles;
        }
        return new ArrayList<>();
    }

    public Boolean isFollow(String following, String follower) {
        Optional<User> followingUser = userRepository.findByUUID(following);
        Optional<User> followerUser = userRepository.findByUUID(follower);
        if (followingUser.isPresent() && followerUser.isPresent()) {
            Optional<Follow> follow = followRepository.isFollow(followingUser.get(), followerUser.get());
            return follow.isPresent();
        }
        return false;
    }

    public List<Integer> countFollow(String currentUser) {
        List<Integer> count = new ArrayList<>();
        Optional<User> user = userRepository.findByUsername(currentUser);
        if (user.isPresent()) {
            int following = followRepository.countFollowing(user.get());
            int follower = followRepository.countFollowers(user.get());
            count.add(following);
            count.add(follower);
            return count;
        }
        return new ArrayList<>();
    }
}
