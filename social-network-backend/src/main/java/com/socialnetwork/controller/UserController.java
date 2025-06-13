package com.socialnetwork.controller;

import com.socialnetwork.model.user.User;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Resource
    private UserService userService;

    // todo: adjust error, not use post??
    @PostMapping("/set-role")
    public ResponseObject setRoleUser(@RequestParam String uuid, @RequestParam String roleName) {
        User newRoleUser = userService.setRole(uuid, roleName);
        return new ResponseObject(HttpStatus.OK.value(), "Role set successfully", newRoleUser);
    }

    @GetMapping("/get-all-user")
    public ResponseObject getAllUser(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "username") String orderedBy,
            @RequestParam(defaultValue = "true") String isAscending,
            @RequestParam(defaultValue = "") String keyword) {

        Map<String, Object> result = new HashMap<>();
        Boolean isAsc = Boolean.parseBoolean(isAscending);
        Page<User> users = userService.getAllUser(page, size, orderedBy, isAsc, keyword);

        // Convert response to map
        result.put("users", users.getContent());
        result.put("totalPage", users.getTotalPages());
        result.put("totalElement", users.getTotalElements());
        result.put("size", users.getSize());
        result.put("pageNumber", users.getNumber());
        result.put("numberOfElement", users.getNumberOfElements());
        return new ResponseObject(
                HttpStatus.OK.value(), "Get all users successfully", result);
    }

    @GetMapping("/get-by-email")
    public ResponseObject getUserByEmail(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        return new ResponseObject(HttpStatus.OK.value(), "Get user by email successfully", user);
    }

    @PatchMapping("/{uuid}")
    public ResponseObject updateUserStatus(@PathVariable String uuid) {
        User user = userService.updateUserStatus(uuid);
        return new ResponseObject(HttpStatus.OK.value(), "User retrieved successfully", user);
    }

    @GetMapping("/{uuid}")
    public ResponseObject getUserByUUID(@PathVariable String uuid) {
        Optional<User> user = userService.getUserByUUID(uuid);
        return new ResponseObject(HttpStatus.OK.value(), "Get user successfully", user);
    }

    @DeleteMapping("/{uuid}")
    public ResponseObject deleteUser(@PathVariable String uuid) {
        userService.deleteUser(uuid);
        return new ResponseObject(HttpStatus.OK.value(), "Delete User successfully", uuid);
    }


    @MessageMapping("/user.addUser")
    public String addUser(
            @Payload String userUUID
    ) {
        userService.saveUser(userUUID);

        return userUUID;
    }
    @MessageMapping("/user.disconnectUser")
    public String disconnectUser(
            @Payload String userUUID
    ) {
        userService.disconnect(userUUID);
        return userUUID;
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> findAllActiveUser() {
        return ResponseEntity.ok(userService.findConnectedUsers());
    }
}
