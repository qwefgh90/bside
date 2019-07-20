package io.github.qwefgh90.easiest.http;

import java.net.http.HttpResponse;
import java.util.Map;
import java.util.Optional;

public interface HttpUtil {
    public Optional<HttpResponse<String>> get(String urlWithQuery, Map<String, Object> headers);
}
