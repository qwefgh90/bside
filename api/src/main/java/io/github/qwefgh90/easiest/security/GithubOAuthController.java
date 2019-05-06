package io.github.qwefgh90.easiest.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.util.RandomValueStringGenerator;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

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
    @PostMapping(path="/accesstoken")
    public ResponseEntity<Map<String, String>> accessToken(@RequestParam String state, @RequestParam String code) throws IOException, InterruptedException {
        HttpClient httpClient = HttpClient.newBuilder().build();
        var paramMap = new HashMap<String, String>();
        paramMap.put("client_id", client_id);
        paramMap.put("client_secret", client_secret);
        paramMap.put("state", state);
        paramMap.put("code", code);
        var rb = HttpRequest.newBuilder();
        var request = rb.uri(URI.create(access_token_url)).POST(HttpRequest.BodyPublishers.ofString(params(paramMap))).build();
        log.debug(request.toString());
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        log.debug("Response status code: " + response.statusCode());
        log.debug("Response headers: " + response.headers());
        log.debug("Response body: " + response.body());
        var resultMap = parse(response.body());
        if(resultMap.containsKey("access_token")){
            var t = resultMap.get("access_token");
            resultMap.clear();
            resultMap.put("access_token", t);
            return ResponseEntity.ok(resultMap);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    private String params(Map<String, String> paramMap){
        var joiner = new StringJoiner("&");
        return paramMap.entrySet().stream().map((entry) -> {
            try {
                return URLEncoder.encode(entry.getKey(), "UTF-8") + "=" +
                        URLEncoder.encode(entry.getValue(), "UTF-8");
            }catch(Exception e){
                return "";
            }
        }).reduce((p1, p2) -> {
            return p1 + "&" + p2;
        }).get();
    }

    private Map<String, String> parse(String params){
        var paramList = params.split("&");
        var result = new HashMap<String, String>();
        Arrays.stream(paramList).forEach((entryString) ->{
            var kv = entryString.split("=");
            result.put(kv[0], kv[1]);
        });
        return result;
    }
}

