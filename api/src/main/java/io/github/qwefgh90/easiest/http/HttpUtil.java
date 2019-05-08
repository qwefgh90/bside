package io.github.qwefgh90.easiest.http;

import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

@Service
public class HttpUtil {
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
}
