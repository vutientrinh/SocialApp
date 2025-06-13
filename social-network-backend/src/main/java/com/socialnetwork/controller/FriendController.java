package com.socialnetwork.controller;

import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.FriendService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/friend")
public class FriendController {

    @Resource
    private FriendService friendService;

    @PostMapping("/create")
    public ResponseObject createFriend(@RequestParam String currentUser,
                                       @RequestParam String friendUser) {
        Map<String, String> response = friendService.createFriend(currentUser, friendUser);
        if (!response.isEmpty()){
            return new ResponseObject(HttpStatus.OK.value(),
                    "Relationship created successfully", response);
        } else {
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Relationship created failed", response);
        }
    }

    @GetMapping("/check")
    public ResponseObject checkRelationShip(@RequestParam String currentUser,
                                            @RequestParam String friendUser) {
        Map<String, String> response = friendService.checkRelationShip(currentUser, friendUser);
        if (!response.isEmpty()){
            return new ResponseObject(HttpStatus.OK.value(),
                    "Relationship exists", response);
        } else {
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(),
                    "Relationship does not exist", response);
        }
    }

    @PostMapping("/remove")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject removeRelationship(@RequestParam String currentUser,
                                             @RequestParam String friendUser) {
        String responseMessage = friendService.removeRelationship(currentUser, friendUser);
        if (responseMessage.equals("Friendship removed successfully")) {
            return new ResponseObject(HttpStatus.OK.value(), responseMessage, null);
        } else {
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), responseMessage, null);
        }
    }


    @GetMapping
    public ResponseObject getAllRelationshipOfUser(@RequestParam String userUUID) {
        return new ResponseObject(HttpStatus.OK.value(),
                "All relationships of user", friendService.getAllRelationshipOfUser(userUUID));
    }
}
