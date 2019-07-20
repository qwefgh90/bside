package io.github.qwefgh90.easiest.topic;

import io.github.qwefgh90.easiest.browser.BrowserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

@Service
public class ScreenshotService {
    Logger log = LoggerFactory.getLogger(ScreenshotService.class);
    @Autowired
    BrowserService browserService;

    @Value("${screenshot.cache:}")
    String providedCacheDir;
    Path storagePath;

    private ExecutorService es = Executors.newSingleThreadExecutor();
    private Map<String, File> cache = new HashMap<>();

    public ScreenshotService() throws IOException {
        Path temporaryDirectory = Files.createTempDirectory("screenshot");

        if(providedCacheDir == null || providedCacheDir.equalsIgnoreCase(""))
            storagePath = temporaryDirectory;
        else
            storagePath = Path.of(providedCacheDir);
        log.info("Sreenshot path: " + storagePath.toString());
    }

    public CompletableFuture<byte[]> getImage(String fullRepoName, String url){
        if(cache.containsKey(fullRepoName)){
            return CompletableFuture.supplyAsync(() -> {
                var f = cache.get(fullRepoName);
                try {
                    return Files.readAllBytes(f.toPath());
                }catch(IOException e){
                    throw new RuntimeException("It failed to read from " + f.toString(), e);
                }
            }, es);
        }else{
            var filePath = storagePath.resolve(fullRepoName + ".png");
            try {
                Files.createDirectories(filePath.getParent());
            }catch (Exception e){
                if(e instanceof FileAlreadyExistsException){
                }else{
                    log.error("An error occurs when creating " + filePath.getParent().toString(), e);
                }
            }
            var f = browserService.takeScreenshot(url, filePath);
            return f.thenApply((path) -> {
                try {
                    var bytes =  Files.readAllBytes(path);
                    cache.put(fullRepoName, path.toFile());
                    return bytes;
                }catch(IOException e){
                    throw new RuntimeException("It failed to read from " + f.toString(), e);
                }
            });
        }
    }
}
