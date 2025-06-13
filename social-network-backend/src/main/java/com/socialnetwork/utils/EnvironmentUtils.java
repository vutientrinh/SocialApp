package com.socialnetwork.utils;

import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
@PropertySource("classpath:application.yml")
public class EnvironmentUtils implements EnvironmentAware {
    private static Environment env;

    public static String getEnvironmentValue(String propertyKey) {
        return env.getProperty(propertyKey);
    }

    @Override
    public void setEnvironment(Environment environment) {
        env = environment;
    }

    public static Dotenv dotenv() {
        return Dotenv.configure()
                .directory("./")
                .filename(".env")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();
    }

    static {
        System.setProperty("PORT", dotenv().get("PORT"));
        System.setProperty("DATABASE_URL", dotenv().get("DATABASE_URL"));
        System.setProperty("DATABASE_USERNAME", dotenv().get("DATABASE_USERNAME"));
        System.setProperty("DATABASE_PASSWORD", dotenv().get("DATABASE_PASSWORD"));
        System.setProperty("JWT_SECRET", dotenv().get("JWT_SECRET"));
        System.setProperty("IMPORTED_FILES", dotenv().get("IMPORTED_FILES"));
        System.setProperty("BASE_FOLDER-UPLOAD", dotenv().get("BASE_FOLDER-UPLOAD"));
        System.setProperty("PUBLIC_FOLDER", dotenv().get("PUBLIC_FOLDER"));
        System.setProperty("IMAGE_FOLDER", dotenv().get("IMAGE_FOLDER"));
        System.setProperty("CLOUDINARY_CLOUD_NAME", dotenv().get("CLOUDINARY_CLOUD_NAME"));
        System.setProperty("CLOUDINARY_API_KEY", dotenv().get("CLOUDINARY_API_KEY"));
        System.setProperty("CLOUDINARY_API_SECRET", dotenv().get("CLOUDINARY_API_SECRET"));
        System.setProperty("CLOUDINARY_URL", dotenv().get("CLOUDINARY_URL"));
    }
}
