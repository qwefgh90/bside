package io.github.qwefgh90.easiest.browser;

import io.github.qwefgh90.easiest.topic.TopicSearchBot;
import javassist.ClassPath;
import jdk.jshell.spi.ExecutionControl;
import org.apache.commons.exec.OS;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFileAttributes;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.concurrent.*;

@Service
public class BrowserService {

    Logger log = LoggerFactory.getLogger(BrowserService.class);

    private ExecutorService es = Executors.newSingleThreadExecutor();


    @Autowired
    ResourceLoader resourceLoader;

    private ChromeDriverEx driver;

    @PostConstruct
    public void init() throws IOException{
        Resource resource;
        if(OS.isFamilyWindows())
            resource = resourceLoader.getResource("classpath:chromedriver.exe");
        else
            resource = resourceLoader.getResource("classpath:chromedriver");
        var copiedDriver = Files.createTempDirectory("chromedriver").resolve(resource.getFilename());
        Files.copy(resource.getInputStream(), copiedDriver);
        if(!OS.isFamilyWindows())
            Files.setPosixFilePermissions(copiedDriver, PosixFilePermissions.fromString("rwxrwx---"));
        log.debug("driver path: " + copiedDriver.toAbsolutePath().toString());
        System.setProperty("webdriver.chrome.driver", copiedDriver.toAbsolutePath().toString());
        var opt = new ChromeOptions();
        opt.addArguments("--headless","--hide-scrollbars","--disable-dev-shm-usage", "--no-sandbox");
        driver = new ChromeDriverEx(opt);
    }

    @PreDestroy
    void clean(){
        if(driver != null){
            driver.quit();
        }
    }

    public CompletableFuture<Path> takeScreenshot(String url, Path dest) {
        return CompletableFuture.supplyAsync(() -> {
            driver.get(url);
            File src = driver.getFullScreenshotAs(OutputType.FILE);
            log.debug("" + src.toString() + " will be copied to " + dest.toString());
            try {
                Files.copy(src.toPath(), dest);
            }catch(IOException e){
                throw new RuntimeException("Tt failed to copy to " + dest.toString(), e);
            }
            return dest;
        }, es);
    }
}
