package com.socialnetwork.controller;

import com.socialnetwork.model.user.Profile;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.ProfileService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Resource
    private ProfileService profileService;

    @GetMapping("/get-all-profiles")
    public ResponseObject getAllProfiles() {
        List<Profile> profiles = profileService.getAllProfiles();
        return new ResponseObject(HttpStatus.OK.value(), "Success", profiles);
    }

    @PostMapping("/create-profile")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject createProfile(@RequestBody Profile profile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Profile newProfile = profileService.createProfile(username, profile);
        if (newProfile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", newProfile);
    }

    @GetMapping("/get-profile-by-user")
    public ResponseObject getProfileByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Profile profile = profileService.getProfileByUser(username);
        if (profile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", profile);
    }

    @GetMapping("/get-profile-by-username/{username}")
    public ResponseObject getProfileByUsername(@PathVariable String username) {
        Profile profile = profileService.getProfileByUser(username);
        if (profile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", profile);
    }

    @GetMapping("/get-profile-by-user-uuid/{uuid}")
    public ResponseObject getProfileByUUID(@PathVariable String uuid) {
        Profile profile = profileService.getProfileByUserUUID(uuid);
        if (profile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", profile);
    }

    @GetMapping("/get-list-profile-not-friend")
    public ResponseObject getListProfileNotFriend() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<Profile> profiles = profileService.getListProfileNotFriend(username);
        if (profiles == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", profiles);
    }

    @GetMapping("/get-active-profiles")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject getActiveProfiles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<Profile> profiles = profileService.getProfileIsOnline(username);
        return new ResponseObject(HttpStatus.OK.value(), "Success", profiles);
    }

    @PostMapping("/update-profile")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject updateProfile(@RequestBody Profile newProfile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Profile updatedProfile = profileService.updateProfile(username, newProfile);
        if (updatedProfile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", updatedProfile);
    }

    @PostMapping("/update-profile-by-uuid")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject updateProfile(@RequestParam String uuid,
                                        @RequestBody Profile newProfile) {
        Profile updatedProfile = profileService.updateProfile(uuid, newProfile);
        if (updatedProfile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", updatedProfile);
    }

    @PostMapping("/update-status-online")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject updateStatusOnline() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Profile profile = profileService.updateStatusOnline(username);
        if (profile == null)
            return new ResponseObject(HttpStatus.BAD_REQUEST.value(), "Failed", null);
        return new ResponseObject(HttpStatus.OK.value(), "Success", profile);
    }
}
