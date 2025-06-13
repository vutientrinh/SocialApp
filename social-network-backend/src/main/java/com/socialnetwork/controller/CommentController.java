package com.socialnetwork.controller;

import com.socialnetwork.dtos.Requests.CommentRequest;
import com.socialnetwork.model.news.Comment;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.CommentService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    @Resource
    private CommentService commentService;

    @RequestMapping("/create")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject createComment(@RequestBody CommentRequest commentRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Comment comment = commentService.createComment(username, commentRequest);
        return new ResponseObject(HttpStatus.OK.value(),
                "Comment created successfully", comment);
    }
}
