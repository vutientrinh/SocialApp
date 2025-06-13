package com.socialnetwork.Repository;


import com.socialnetwork.repository.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;

@SpringBootTest
public class TestProfileRepository {

    @Autowired
    private ProfileRepository profileRepository;

    @Test
    public void testFindAllUserOnline() {
        ArrayList<Object> results = profileRepository.findAllUserOnline(true);
        results.stream().map(result -> {
            Object[] row = (Object[]) result;
            return "First Name: " + row[0] + ", Last Name: " + row[1] + ", Is Online: " + row[2];
        }).forEach(System.out::println);
    }
}
