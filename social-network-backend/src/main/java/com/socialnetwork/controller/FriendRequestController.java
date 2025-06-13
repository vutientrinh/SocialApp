package com.socialnetwork.controller;

import com.socialnetwork.model.relationship.FriendRequest;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.FriendRequestService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friend-request")
public class FriendRequestController {

    @Resource
    private FriendRequestService friendRequestService;

    @PostMapping("/create")
    public ResponseObject createFriendRequest(@RequestParam String requester,
                                              @RequestParam String receiver){
        FriendRequest friendRequests = friendRequestService.createFriendRequest(requester, receiver);
        if (friendRequests == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Friend request not created", null);
        return new ResponseObject(HttpStatus.OK.value(),
                "Friend request created", friendRequests);
    }

    @PostMapping("/accept")
    public ResponseObject acceptFriendRequest(@RequestParam String requester,
                                              @RequestParam String receiver){
        FriendRequest friendRequests = friendRequestService.acceptFriendRequest(requester, receiver);
        if (friendRequests == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Friend request not accepted", null);
        return new ResponseObject(HttpStatus.OK.value(),
                "Friend request accepted", friendRequests);
    }

    @PostMapping("/reject")
    public ResponseObject rejectFriendRequest(@RequestParam String requester,
                                              @RequestParam String receiver){
        FriendRequest friendRequests = friendRequestService.rejectFriendRequest(requester, receiver);
        if (friendRequests == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Friend request not rejected", null);
        return new ResponseObject(HttpStatus.OK.value(),
                "Friend request rejected", friendRequests);
    }

    @GetMapping("/get-list-request")
    public ResponseObject getListRequest(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return new ResponseObject(HttpStatus.OK.value(),
                "List friend request", friendRequestService.getListPendingFriendRequest(username));
    }
}
