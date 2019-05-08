package io.github.qwefgh90.easiest.security;

import io.github.qwefgh90.easiest.oauth.filter.OAuthToken;
import io.github.qwefgh90.easiest.oauth.filter.OAuthUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class SecurityService {
    public String getAccessToken(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var token = (OAuthToken)auth;
        var user = (OAuthUser)token.getPrincipal();
        var accessToken = user.getAccessToken();
        return accessToken;
    }
}
