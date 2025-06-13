package com.socialnetwork.controller;

import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.ReportService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Resource
    private ReportService reportService;

    @GetMapping("/all")
    public ResponseObject getAllProfilesInfo(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                             @RequestParam(value = "size", defaultValue = "10") Integer size) {
        HashMap<String, Object> result = reportService.getAllProfilesInfo(page, size);
        return new ResponseObject(200, "Success", result);

    }

    @GetMapping("/gender")
    public ResponseObject getNumberOfGender(){
        HashMap<String, Object> result = reportService.getNumberOfGender();
        return new ResponseObject(200, "Success", result);
    }

    @GetMapping("/posts")
    public ResponseObject getNumberOfPosts(){
        HashMap<String, Object> result = reportService.getNumberOfPosts();
        return new ResponseObject(200, "Success", result);
    }

    @GetMapping("/posts/week")
    public ResponseObject getNumberOfPostsCurrentWeek(){
        HashMap<String, Object> result = reportService.getNumberOfPostsCurrentWeek();
        return new ResponseObject(200, "Success", result);
    }

    @GetMapping("/actives")
    public ResponseObject getActiveList(){
        HashMap<String, Object> result = reportService.getActiveList();
        return new ResponseObject(200, "Success", result);
    }

    @GetMapping("/interactions")
    public ResponseObject getInteractions(){
        Integer likes = reportService.countLikesAllPosts();
        Integer comments = reportService.countCommentsAllPosts();
        HashMap<String, Object> result = new HashMap<>();
        result.put("totalReactions", likes);
        result.put("totalComments", comments);
        return new ResponseObject(200, "Success", result);
    }
}
