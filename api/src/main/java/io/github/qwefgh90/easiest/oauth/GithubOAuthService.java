package io.github.qwefgh90.easiest.oauth;

import io.github.qwefgh90.easiest.http.HttpUtilImpl;
import org.eclipse.egit.github.core.User;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GithubOAuthService {

    Logger log = LoggerFactory.getLogger(GithubOAuthService.class);

    @Value("${github.client_id}")
    String client_id;

    @Value("${github.client_secret}")
    String client_secret;

    @Value("${github.access_token_url}")
    String access_token_url;

    @Resource
    HttpUtilImpl util;

    public Optional<String> getAccessToken(@RequestParam String state, @RequestParam String code) {
        HttpClient httpClient = HttpClient.newBuilder().build();
        var paramMap = new HashMap<String, String>();
        paramMap.put("client_id", client_id);
        paramMap.put("client_secret", client_secret);
        paramMap.put("state", state);
        paramMap.put("code", code);
        var rb = HttpRequest.newBuilder();
        var request = rb.uri(URI.create(access_token_url)).POST(HttpRequest.BodyPublishers.ofString(util.formData(paramMap))).build();
        log.debug(request.toString());
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.debug("Response status code: " + response.statusCode());
            log.debug("Response headers: " + response.headers());
            log.debug("Response body: " + response.body());
            Map<String, String> resultMap = util.formData(response.body());
            if (resultMap.containsKey("access_token")) {
                return Optional.of(resultMap.get("access_token"));
            } else {
                return Optional.empty();
            }
        }catch(Exception e) {
            log.error("An error during process http request", e);
            return Optional.empty();
        }
    }

    public User getUser(String token)  throws IOException {
        GitHubClient client = new GitHubClient();
        client.setOAuth2Token(token);
        UserService userService = new UserService(client);
        return userService.getUser();
    }
}
