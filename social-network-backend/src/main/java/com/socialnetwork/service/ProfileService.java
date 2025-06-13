package com.socialnetwork.service;

import com.socialnetwork.Mapper.ProfileMapper;
import com.socialnetwork.model.relationship.Friend;
import com.socialnetwork.model.relationship.FriendRequest;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.FriendRepository;
import com.socialnetwork.repository.FriendRequestRepository;
import com.socialnetwork.repository.ProfileRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    @Resource
    private ProfileRepository profileRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private FriendRepository friendRepository;
    @Resource
    private FriendRequestRepository friendRequestRepository;
    @Resource
    private ProfileMapper profileMapper;

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Profile createProfile(String createdBy, Profile profile)
            throws IllegalArgumentException {
        if (profile == null)
            throw new IllegalArgumentException("Profile cannot be null");
        if (profileRepository.findProfileByCreatedBy(profile.getCreatedBy()).isPresent())
            throw new IllegalArgumentException("Profile with the same createdBy already exists");

        // add profile to the database
        Optional<User> user = userRepository.findByUsername(createdBy);
        profile.setOnline(true);
        profile.setCreatedBy(user.get());
        profile.setCreatedAt(LocalDateTime.now());
        profile.setLastModifiedBy(createdBy);
        profile.setLastModifiedDate(LocalDateTime.now());
        return profileRepository.save(profile);
    }

    public Profile getProfileByUser(String user) {
        Optional<User> userOptional = userRepository.findByUsername(user);
        if (userOptional.isPresent()) {
            Optional<Profile> profile = profileRepository.findProfileByCreatedBy(userOptional.get());
            return profile.orElse(null);
        }
        return null;
    }

    public Profile getProfileByUserUUID(String uuid) {
        Optional<User> userOptional = userRepository.findByUUID(uuid);
        if (userOptional.isPresent()) {
            Optional<Profile> profile = profileRepository.findProfileByCreatedBy(userOptional.get());
            return profile.orElse(null);
        }
        return null;
    }

    public List<Profile> getListProfileNotFriend(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        List<Profile> profiles = new ArrayList<>();
        if (user.isPresent()) {
            List<User> users = userRepository.findAll();
            List<Friend> friendList = friendRepository.getAllRelationshipOfUser(user.get());
            users.forEach(nguoidung -> {
                if (!nguoidung.getUsername().equals(username)) {
                    boolean isFriend = false;
                    // is not friend
                    for (Friend friend : friendList) {
                        if (friend.getFriend().getUsername().equals(nguoidung.getUsername())) {
                            isFriend = true;
                            break;
                        }
                    }
                    // check has request
                    FriendRequest listPending = friendRequestRepository.findByRequesterAndReceiverWithPending(nguoidung, user.get());
                    FriendRequest listAccept = friendRequestRepository.findByRequesterAndReceiverWithAccept(nguoidung, user.get());
                    if (!isFriend && listPending == null && listAccept == null) {
                        Optional<Profile> profile = profileRepository.findProfileByCreatedBy(nguoidung);
                        profile.ifPresent(profiles::add);
                    }
                }
            });
            return profiles;
        }
        return null;
    }

    public List<Profile> getProfileIsOnline(String username){
        // Get list active profiles online && friend
        Optional<User> currentUser = userRepository.findByUsername(username);
        List<User> friends = friendRepository.getAllFriendOfUser(currentUser.get());
        return profileRepository.getOnlineProfilesOfFriends(friends);
    }

    public Profile updateProfile(String currentUUID, Profile newProfile) {
        Optional<User> userOptional = userRepository.findByUUID(currentUUID);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + currentUUID);
        }

        Optional<Profile> profileUser = profileRepository.findProfileByCreatedBy(userOptional.get());
        if (profileUser.isPresent()) {
            Profile profileUpdate = profileUser.get();
            profileUpdate.setFirstName(newProfile.getFirstName());
            profileUpdate.setMiddleName(newProfile.getMiddleName());
            profileUpdate.setLastName(newProfile.getLastName());
            profileUpdate.setGender(newProfile.getGender());
            profileUpdate.setDateOfBirth(newProfile.getDateOfBirth());
            profileUpdate.setPhoneNumber(newProfile.getPhoneNumber());
            profileUpdate.setAvatar(newProfile.getAvatar());
            profileUpdate.setBio(newProfile.getBio());
            profileUpdate.setPhoneNumber(newProfile.getPhoneNumber());
            profileUpdate.setLastModifiedBy(userOptional.get().getUsername());
            profileUpdate.setLastModifiedDate(LocalDateTime.now());
            return profileRepository.save(profileUpdate);
        }

        return null;
    }


    public Profile updateStatusOnline(String username){
        Optional<User> user = userRepository.findByUsername(username);
        Optional<Profile> profile = profileRepository.findProfileByCreatedBy(user.get());
        if (profile.isPresent()){
            Profile updateProfile = profile.get();
            if (updateProfile.isOnline()){
                updateProfile.setOnline(false);
            } else {
                updateProfile.setOnline(true);
            }
            return profileRepository.save(profile.get());
        }
        return null;
    }
}
