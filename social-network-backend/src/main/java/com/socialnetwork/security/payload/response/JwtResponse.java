package com.socialnetwork.security.payload.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String refreshToken;
    private String UUID;
    private String username;
    private String email;
    private String defaultLocale;
    private List<String> roles;

    public JwtResponse(
            String accessToken,
            String refreshToken,
            String id,
            String username,
            String email,
            String defaultLocale,
            List<String> roles) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.UUID = id;
        this.username = username;
        this.email = email;
        this.defaultLocale = defaultLocale;
        this.roles = roles;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUUID() {
        return UUID;
    }

    public void setUUID(String id) {
        this.UUID = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
