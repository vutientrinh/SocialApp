package com.socialnetwork.Mapper;

import com.socialnetwork.dtos.Responses.ActiveUserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class TestProfileMapper {

    @Autowired
    private ProfileMapper profileMapper;

    @Test
    public void testToActiveUserResponseList() {
        List<Object> results = new ArrayList<>();
        results.add(new Object[]{"John", "Doe", true});
        results.add(new Object[]{"Jane", "Doe", false});
        List<ActiveUserResponse> activeUserResponses = profileMapper.toActiveUserResponseList(results);
        assertEquals(2, activeUserResponses.size());
        assertEquals("John", activeUserResponses.get(0).getFirstName());
        assertEquals("Doe", activeUserResponses.get(0).getLastName());
        assertEquals(true, activeUserResponses.get(0).getIsOnline());
        assertEquals("Jane", activeUserResponses.get(1).getFirstName());
        assertEquals("Doe", activeUserResponses.get(1).getLastName());
        assertEquals(false, activeUserResponses.get(1).getIsOnline());
    }
}
