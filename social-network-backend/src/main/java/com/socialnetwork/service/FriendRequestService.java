package com.socialnetwork.service;

import com.socialnetwork.model.enums.RequestStatus;
import com.socialnetwork.model.relationship.FriendRequest;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.User;
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
public class FriendRequestService {
    @Resource
    private FriendRequestRepository friendRequestRepository;
    @Resource
    private FriendService friendService;
    @Resource
    private UserRepository userRepository;
    @Resource
    private ProfileRepository profileRepository;

    public FriendRequest createFriendRequest(String requester, String receiver) {
        Optional<User> res = userRepository.findByUUID(requester);
        Optional<User> rec = userRepository.findByUUID(receiver);
        try{
            // check isFriend?
            if (friendService.isFriend(res.get().getUUID(), rec.get().getUUID())) return null;
            FriendRequest checkRequest = friendRequestRepository
                    .findByRequesterAndReceiverAndStatus(res.get(), rec.get(), RequestStatus.PENDING);
            if (checkRequest == null) {
                FriendRequest friendRequest = new FriendRequest();
                friendRequest.setRequester(res.get());
                friendRequest.setReceiver(rec.get());
                friendRequest.setStatus(RequestStatus.PENDING);
                friendRequest.setCreatedAt(LocalDateTime.now());
                friendRequest.setCreatedBy(res.get());
                return friendRequestRepository.save(friendRequest);
            } else return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public FriendRequest acceptFriendRequest(String requester, String receiver) {
        Optional<User> res = userRepository.findByUUID(requester);
        Optional<User> rec = userRepository.findByUUID(receiver);
        try {
            FriendRequest friendRequest = friendRequestRepository
                    .findByRequesterAndReceiverAndStatus(res.get(), rec.get(), RequestStatus.PENDING);
            if (friendRequest == null) return null;
            friendRequest.setStatus(RequestStatus.ACCEPTED);
            // new record in friend table
            friendService.createFriend(
                    friendRequest.getRequester().getUUID(),
                    friendRequest.getReceiver().getUUID());
            return friendRequestRepository.save(friendRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public FriendRequest rejectFriendRequest(String requester, String receiver) {
        Optional<User> res = userRepository.findByUUID(requester);
        Optional<User> rec = userRepository.findByUUID(receiver);
        try {
            FriendRequest friendRequest = friendRequestRepository
                    .findByRequesterAndReceiverAndStatus(res.get(), rec.get(), RequestStatus.PENDING);
            if (friendRequest == null) return null;
            friendRequest.setStatus(RequestStatus.REJECTED);
            friendService.createFriend(
                    friendRequest.getRequester().getUsername(),
                    friendRequest.getReceiver().getUsername());
            return friendRequestRepository.save(friendRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Profile> getListPendingFriendRequest(String user) {
        Optional<User> res = userRepository.findByUsername(user);
        List<Profile> profiles = new ArrayList<>();
        try {
            List<FriendRequest> friendRequests = friendRequestRepository
                    .findByReceiverAndStatus(res.get(), RequestStatus.PENDING);
            friendRequests.forEach(friend -> {
                User requester = friend.getRequester();
                Optional<Profile> profile = profileRepository.findByUser(requester);
                profiles.add(profile.get());
            });
            return profiles;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
