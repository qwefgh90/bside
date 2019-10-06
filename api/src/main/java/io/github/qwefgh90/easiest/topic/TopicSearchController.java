package io.github.qwefgh90.easiest.topic;

import org.apache.coyote.Response;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@RestController
public class TopicSearchController {

    Logger log = LoggerFactory.getLogger(TopicSearchController.class);

    @Value("${topicsearch.http.thread-count}")
    int threadCount;

    ExecutorService imageEs;

    @PostConstruct
    void init(){
        imageEs = Executors.newFixedThreadPool(threadCount);
    }

    @Autowired
    TopicSearchService topicSearchService;

    @Autowired
    ScreenshotService screenshotService;

//    @GetMapping(path="/templates")
//    public ResponseEntity<String> templates(){
//        return topicSearchService.getAll().map(v ->
//                ResponseEntity.ok(v.toString())
//        ).orElse(ResponseEntity.status(503).build());
//    }

    @GetMapping(path="/templates")
    public ResponseEntity<String> templates(@RequestParam(value = "page", required = false) Integer page, @RequestParam(value = "per_page", required = false) Integer perPage, HttpServletResponse response){
        response.setHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=" + TimeUnit.HOURS.toSeconds(1));
        response.setHeader(HttpHeaders.PRAGMA, null);
        if(page == null && perPage == null){
            return topicSearchService.get().map(v -> ResponseEntity.ok(v.toString())).orElse(ResponseEntity.status(503).build());
        }else if(page != null && perPage != null){
            return topicSearchService.get(page, perPage).map(v -> ResponseEntity.ok(v.toString())).orElse(ResponseEntity.status(503).build());
        }else
            return ResponseEntity.badRequest().body("Both of page and perPage should be passed not be passed on requests.");
    }

    @GetMapping(path="/preview")
    public CompletableFuture<ResponseEntity<byte[]>> preview(@RequestParam("id") String id, @RequestParam("url") String previewUrl, HttpServletResponse response){

        response.setHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=" + TimeUnit.DAYS.toSeconds(7));
        response.setHeader(HttpHeaders.PRAGMA, null);
        return this.screenshotService.getImage(id, previewUrl).thenApplyAsync((b) -> ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG).body(b), imageEs)
                .exceptionally((t) -> {
                    log.error("It failed to get preview of " + id + ", " + previewUrl, t);
                    return ResponseEntity.badRequest().build();
                });
    }
}
