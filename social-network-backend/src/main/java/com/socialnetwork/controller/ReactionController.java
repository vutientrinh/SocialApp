package com.socialnetwork.controller;

import com.socialnetwork.dtos.Requests.ReactionPost;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.ReactionService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reaction")
public class ReactionController {
    @Resource
    private ReactionService reactionService;

    @PostMapping
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject createReaction(@RequestBody ReactionPost reactionPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        reactionService.createReaction(username, reactionPost);
        return new ResponseObject(HttpStatus.OK.value(),
                "Reaction created successfully", null);
    }

    @PostMapping("/remove")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject deleteReaction(@RequestBody ReactionPost reactionPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        reactionService.removeReactionPost(username, reactionPost);
        return new ResponseObject(HttpStatus.OK.value(),
                "Reaction remove successfully", null);
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject getReactions(@RequestParam String postUUID) {
        return new ResponseObject(HttpStatus.OK.value(),
                "Reactions retrieved successfully", reactionService.getReactionCount(postUUID));
    }

    @GetMapping("/check")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject checkUserReaction(@RequestParam String postUUID) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return new ResponseObject(HttpStatus.OK.value(),
                "User reaction retrieved successfully", reactionService.checkUserReaction(username, postUUID));
    }
}
