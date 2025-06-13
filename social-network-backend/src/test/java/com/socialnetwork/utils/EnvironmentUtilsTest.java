package com.socialnetwork.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
public class EnvironmentUtilsTest {
    @Test
    public void testGetEnvironmentValue() {
        String propertyKey = "server.port";
        Assertions.assertEquals("8080", EnvironmentUtils.getEnvironmentValue(propertyKey));
    }

    @Test
    public void testGetEnvironmentValue_notFoundPropertyKey() {
        String propertyKey = "abc123123";
        Assertions.assertNull(EnvironmentUtils.getEnvironmentValue(propertyKey));
    }
}
