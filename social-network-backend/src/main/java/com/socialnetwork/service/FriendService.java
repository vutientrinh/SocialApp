package com.socialnetwork.service;

import com.socialnetwork.model.relationship.Friend;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.FriendRepository;
import com.socialnetwork.repository.ProfileRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FriendService {

    @Resource
    private FriendRepository friendRepository;
    @Resource
    private UserRepository userRepository;
    @Resource
    private ProfileRepository profileRepository;

    public Map<String, String> createFriend(String currentUser, String friendUser) {
        HashMap<String, String> response = new HashMap<>();
        Optional<User> user = userRepository.findByUUID(currentUser);
        Optional<User> friend = userRepository.findByUUID(friendUser);
        Map<String, String> checkRelationShip = checkRelationShip(currentUser, friendUser);
        if (!user.isEmpty() && !friend.isEmpty()
                && checkRelationShip.get("message").equals("Friendship does not exist") ) {
            // creating the relationship
            Friend friendship_1 = new Friend();
            friendship_1.setUser(user.get());
            friendship_1.setFriend(friend.get());
            friendship_1.setActive(true);
            friendRepository.save(friendship_1); // saving

            // creating the reverse relationship
            Friend friendship_2 = new Friend();
            friendship_2.setUser(friend.get());
            friendship_2.setFriend(user.get());
            friendship_2.setActive(true);
            friendRepository.save(friendship_2); // saving
            response.put("message", "Friend created successfully");
            return response;
        }
        return new HashMap<>();
    }

    public String removeRelationship(String currentUser, String friendUser) {
        Optional<User> user = userRepository.findByUUID(currentUser);
        Optional<User> friend = userRepository.findByUUID(friendUser);

        if (!user.isPresent() || !friend.isPresent()) {
            return "User or Friend does not exist";
        }
        List<Friend> friendships = friendRepository.findFriendships(currentUser, friendUser);
        if (friendships.isEmpty()) {
            return "Friendship does not exist";
        }
        for (Friend friendship : friendships) {
            friendRepository.delete(friendship);
        }
        return "Friendship removed successfully";
    }


    public Map<String, String> checkRelationShip(String currentUser, String friendUser){
        HashMap<String, String> response = new HashMap<>();
        Optional<User> user = userRepository.findByUUID(currentUser);
        Optional<User> friend = userRepository.findByUUID(friendUser);
        if (!user.isEmpty() && !friend.isEmpty()) {
            List<Friend> friendship = friendRepository.findFriendships(currentUser, friendUser);
            if (friendship.size() > 0){
                response.put("message", "Friendship exists");
            } else {
                response.put("message", "Friendship does not exist");
            }
            return response;
        }
        return new HashMap<>();
    }

    public List<Profile> getAllRelationshipOfUser (String currentUser){
        List<Profile> response = new ArrayList<>();
        Optional<User> user = userRepository.findByUUID(currentUser);
        if (!user.isEmpty()){
            List<Friend> friendList = friendRepository.getAllRelationshipOfUser(user.get());
            for (Friend friend : friendList) {
                response.add(profileRepository.findByUser(friend.getFriend()).get());
            }
            return response;
        }
        return new ArrayList<>();
    }

    public Boolean isFriend(String currentUser, String friendUser){
        Optional<User> user = userRepository.findByUUID(currentUser);
        Optional<User> friend = userRepository.findByUUID(friendUser);
        if (!user.isEmpty() && !friend.isEmpty()) {
            List<Friend> friendship = friendRepository.findFriendships(currentUser, friendUser);
            if (friendship.size() > 0){
                return true;
            }
        }
        return false;
    }
}
