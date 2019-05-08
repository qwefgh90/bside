package io.github.qwefgh90.easiest.oauth.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class OAuthFilter extends GenericFilterBean {
    private final Logger log = LoggerFactory.getLogger(OAuthFilter.class);

    @Value("${github.client_id}")
    String client_id;

    @Value("${github.client_secret}")
    String client_secret;

    @Value("${github.access_token_url}")
    String access_token_url;


    private AuthenticationManager authenticationManager;

    public AuthenticationManager getAuthenticationManager() {
        return authenticationManager;
    }

    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        final HttpServletRequest request = (HttpServletRequest)servletRequest;
        if(authenticationIsRequired(request)){
            var state = request.getParameter("state");
            var code = request.getParameter("code");
            var req = new OAuthRequestToken(client_id, client_secret, state, code);
            try {
                var result = authenticationManager.authenticate(req);
                SecurityContextHolder.getContext().setAuthentication(result);
                filterChain.doFilter(servletRequest, servletResponse);
                return;
            }catch(AuthenticationException e){
                log.error("An error when authenticating", e);
            }
        }
            filterChain.doFilter(servletRequest, servletResponse);
    }

    private boolean authenticationIsRequired(HttpServletRequest request){
        Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
        var isPostMethod = request.getMethod().equalsIgnoreCase("post");
        var isTokenRequest = "/login/github/accesstoken".equalsIgnoreCase(request.getRequestURI());
        var state = request.getParameter("state");
        var code = request.getParameter("code");
        if(isPostMethod && isTokenRequest && state != null && code != null
                && (existingAuth  == null || !existingAuth.isAuthenticated()))
            return true;
        else
            return false;
    }
}
