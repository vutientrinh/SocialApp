package com.socialnetwork.controller;

import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.FollowService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Resource
    private FollowService followService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject createFollow(@RequestParam String following,
                                       @RequestParam String follower) {
        Boolean response = followService.createFollow(following, follower);
        if (response){
            return new ResponseObject(HttpStatus.OK.value(),
                    "Follow created successfully", new HashMap<>());
        } else {
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Failed to create folow", new HashMap<>());
        }
    }

    @PostMapping("/delete")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject deleteFollow(@RequestParam String following,
                                       @RequestParam String follower) {
        Boolean response = followService.deleteFollow(following, follower);
        if (response){
            return new ResponseObject(HttpStatus.OK.value(),
                    "Follow deleted successfully", new HashMap<>());
        } else {
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Failed to deleted follow", new HashMap<>());
        }
    }

    @GetMapping("/get-all-following")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject getAllFollowing() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication.getName();
        return new ResponseObject(HttpStatus.OK.value(),
                "All following", followService.getAllFollowing(currentUser));
    }

    @GetMapping("/get-all-not-following")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject getAllNotFollowing() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication.getName();
        return new ResponseObject(HttpStatus.OK.value(),
                "All not following", followService.getAllNotFollowing(currentUser));
    }

    @GetMapping("/count-following")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject countFollow(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication.getName();
        List<Integer> count = followService.countFollow(currentUser);
        if (count.size() == 2){
            return new ResponseObject(HttpStatus.OK.value(),
                    "Count following and followers", count);
        } else {
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Failed to count following and followers", count);
        }
    }
}
