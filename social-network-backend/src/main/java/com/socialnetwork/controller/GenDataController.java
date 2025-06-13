package com.socialnetwork.controller;

import jakarta.annotation.Resource;

import org.springframework.web.bind.annotation.*;

import com.socialnetwork.service.GenDataService;

@RestController
@RequestMapping("/api/gen")
public class GenDataController {

    @Resource
    private GenDataService genDataService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }

    // Gen Data for User and Profile
    @PostMapping("/user")
    public String genUserData(@RequestParam int numUser) {
        genDataService.genData(numUser);
        return "Data Generated";
    }
}
