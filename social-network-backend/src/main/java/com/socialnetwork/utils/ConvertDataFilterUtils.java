package com.socialnetwork.utils;

public class ConvertDataFilterUtils {

    public static String convertFilter(String filter) {
        if (filter == null || filter.trim().isEmpty()) return null;
        return filter;
    }
}
