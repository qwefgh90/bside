package io.github.qwefgh90.easiest.oauth.filter;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class OAuthRequestToken extends AbstractAuthenticationToken {

    final private String client_id;
    final private String client_secret;
    final private String state;
    final private String code;

    public OAuthRequestToken( String client_id,
             String client_secret,
             String state,
             String code) {
        super(Collections.emptySet());
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.state = state;
        this.code = code;
    }

    public String getClient_id() {
        return client_id;
    }

    public String getClient_secret() {
        return client_secret;
    }

    public String getState() {
        return state;
    }

    public String getCode() {
        return code;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }
}
