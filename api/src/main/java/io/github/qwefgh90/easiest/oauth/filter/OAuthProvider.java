package io.github.qwefgh90.easiest.oauth.filter;

import io.github.qwefgh90.easiest.oauth.GithubOAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;

public class OAuthProvider implements AuthenticationProvider, InitializingBean {

    private final Logger log = LoggerFactory.getLogger(OAuthProvider.class);

    @Resource
    GithubOAuthService service;

    @Override
    public void afterPropertiesSet() throws Exception {
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        var req = (OAuthRequestToken)authentication;
        var accessTokenOpt = service.getAccessToken(req.getState(), req.getCode());
        if(accessTokenOpt.isPresent()){
            try {
                var githubUser = service.getUser(accessTokenOpt.get());
                OAuthUser user = new OAuthUser(githubUser.getLogin(), accessTokenOpt.get(), githubUser, githubUser.getId(), Set.of(new SimpleGrantedAuthority("user")));
                var token = new OAuthToken(user, user.getAuthorities());
                token.setAuthenticated(true);
                return token;
            }catch(IOException e){
                throw new AuthenticationServiceException("An error during getting user object from github. An accessToken is not sent from getAccessToken()");
            }
        }else
            throw new InsufficientAuthenticationException("An error during getting accessToken. An accessToken is not sent from getAccessToken()");
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return OAuthRequestToken.class.isAssignableFrom(aClass);
    }
}
