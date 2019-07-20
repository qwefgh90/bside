package io.github.qwefgh90.easiest.http;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class HttpUtilImpl implements HttpUtil{

    Logger log = LoggerFactory.getLogger(HttpUtilImpl.class);

    public String formData(Map<String, String> paramMap){
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

    public Map<String, String> formData(String params){
        var paramList = params.split("&");
        var result = new HashMap<String, String>();
        Arrays.stream(paramList).forEach((entryString) ->{
            var kv = entryString.split("=");
            if(kv.length == 2)
                result.put(kv[0], kv[1]);
        });
        return result;
    }

    public Optional<HttpResponse<String>> get(String urlWithQuery, Map<String, Object> headers){
        HttpClient httpClient = HttpClient.newBuilder().build();
        var rb = HttpRequest.newBuilder().uri(URI.create(urlWithQuery)).GET();
        if(headers != null)
            headers.forEach((String k, Object v) -> rb.setHeader(k, v.toString()));
        var request = rb.build();

        log.debug(request.toString());
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.debug("Response status code: " + response.statusCode());
            log.debug("Response headers: " + response.headers());
            log.debug("Response body: " + response.body());
            var body = response;
            return Optional.of(body);
        }catch(Exception e){
            log.error("An error during process http request", e);
            return Optional.empty();
        }
    }
}
