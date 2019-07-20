package io.github.qwefgh90.easiest.topic;

import org.apache.coyote.Response;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
public class TopicSearchController {

    Logger log = LoggerFactory.getLogger(TopicSearchController.class);

    ExecutorService imageEs = Executors.newFixedThreadPool(5);

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
    public ResponseEntity<String> templates(@RequestParam(value = "page", required = false) Integer page, @RequestParam(value = "per_page", required = false) Integer perPage){
        if(page == null && perPage == null){
            return topicSearchService.get().map(v -> ResponseEntity.ok(v.toString())).orElse(ResponseEntity.status(503).build());
        }else if(page != null && perPage != null){
            return topicSearchService.get(page, perPage).map(v -> ResponseEntity.ok(v.toString())).orElse(ResponseEntity.status(503).build());
        }else
            return ResponseEntity.badRequest().body("Both of page and perPage should be passed not be passed on requests.");
    }

    @GetMapping(path="/preview")
    public CompletableFuture<ResponseEntity<byte[]>> preview(@RequestParam("id") String id, @RequestParam("url") String previewUrl){
        return this.screenshotService.getImage(id, previewUrl).thenApplyAsync((b) -> ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(b), imageEs)
                .exceptionally((t) -> {
                    log.error("It failed to get preview of " + id + ", " + previewUrl, t);
                    return ResponseEntity.badRequest().build();
                });
    }
}
