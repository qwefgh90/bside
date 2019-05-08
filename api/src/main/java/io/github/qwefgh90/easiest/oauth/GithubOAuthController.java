package io.github.qwefgh90.easiest.oauth;

import io.github.qwefgh90.easiest.config.InitialData;
import io.github.qwefgh90.easiest.http.HttpUtil;
import io.github.qwefgh90.easiest.oauth.filter.OAuthToken;
import io.github.qwefgh90.easiest.oauth.filter.OAuthUser;
import io.github.qwefgh90.easiest.security.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@RestController
@RequestMapping(path="/login/github")
public class GithubOAuthController {

    Logger log = LoggerFactory.getLogger(GithubOAuthController.class);

    @GetMapping(path="/")
    public String index(){
        return "home";
    }

    @Value("${github.client_id}")
    String client_id;

    @Value("${github.client_secret}")
    String client_secret;

    @Value("${github.access_token_url}")
    String access_token_url;

    @Resource
    GithubOAuthService oAuthService;

    @Resource
    SecurityService securityService;

    @GetMapping(path="/initialdata")
    public InitialData initialData(){
        var generator = new RandomValueStringGenerator();
        var state = generator.generate();
        var data = new InitialData(state, client_id);
        return data;
    }
    /*
    client_id	string	Required. The client ID you received from GitHub for your GitHub App.
    client_secret	string	Required. The client secret you received from GitHub for your GitHub App.
    code	string	Required. The code you received as a response to Step 1.
    redirect_uri	string	The URL in your application where users are sent after authorization.
    state
     */
    @RequestMapping(value = "/accesstoken", method = { RequestMethod.GET, RequestMethod.POST })
    public ResponseEntity<Map<String, String>> accessToken() throws IOException, InterruptedException {
        return ResponseEntity.ok(Collections.singletonMap("access_token", securityService.getAccessToken()));
    }

    @PostMapping(path="/logout")
    public ResponseEntity<Void> logout(){
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
}

