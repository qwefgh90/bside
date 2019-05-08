package io.github.qwefgh90.easiest.config;

import io.github.qwefgh90.easiest.oauth.filter.OAuthFilter;
import io.github.qwefgh90.easiest.oauth.filter.OAuthProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.annotation.Resource;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final Logger log = LoggerFactory.getLogger(WebSecurityConfig .class);
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        var httpSecurity = http
                .authorizeRequests()
                .antMatchers("/login/github/", "/login/github/initialdata").permitAll()
                .anyRequest().authenticated().and().csrf().disable();
        httpSecurity.addFilterBefore(oAuthFilter(authenticationManager()), BasicAuthenticationFilter.class);
//                .and()
//                .formLogin()
//                .loginPage("/login")
//                .permitAll()
//                .and()
//                .logout()
//                .permitAll();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    protected void configureGlobal(AuthenticationManagerBuilder builder, OAuthProvider oAuthProvider){
        builder.authenticationProvider(oAuthProvider);
    }

    @Bean
    public OAuthProvider oAuthProvider(){
        var oauthProvider = new OAuthProvider();
        return oauthProvider;
    }

    @Bean
    public OAuthFilter oAuthFilter(AuthenticationManager manager){
        var oauthFilter = new OAuthFilter();
        oauthFilter.setAuthenticationManager(manager);
        return oauthFilter;
    }

    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        UserDetails user =
                User.withDefaultPasswordEncoder()
                        .username("user")
                        .password("password")
                        .roles("USER")
                        .build();

        return new InMemoryUserDetailsManager(user);
    }
}