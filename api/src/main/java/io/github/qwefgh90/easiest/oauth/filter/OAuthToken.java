package io.github.qwefgh90.easiest.oauth.filter;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class OAuthToken extends AbstractAuthenticationToken {

    private final OAuthUser principle;

    public OAuthToken(OAuthUser principle, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principle = principle;
        setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return principle;
    }
}
