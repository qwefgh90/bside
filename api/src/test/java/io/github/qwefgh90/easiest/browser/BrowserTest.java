package io.github.qwefgh90.easiest.browser;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.nio.file.Files;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {
        "schedule_on=false"
})
public class BrowserTest {
    @Autowired
    BrowserService browserService;

    Logger log = LoggerFactory.getLogger(BrowserTest.class);
    @Test
    public void screenshotAndCopy() throws Exception {
        var f = browserService.takeScreenshot("https://www.naver.com");
        var temp = f.get(5000, TimeUnit.MILLISECONDS);
        Assert.assertTrue(Files.exists(temp));
        Assert.assertTrue(Files.size(temp) > 0);
    }

    @Test
    public void takeScreenshotAndCopyAtManyTimes() throws Exception {
        var f1 = browserService.takeScreenshot("https://www.naver.com");

        var f2 = browserService.takeScreenshot("https://www.naver.com");

        var f3 = browserService.takeScreenshot("https://www.naver.com");

        var temp1 = f1.get(5000, TimeUnit.MILLISECONDS);
        Assert.assertTrue(Files.exists(temp1));
        Assert.assertTrue(Files.size(temp1) > 0);

        var temp2 = f2.get(5000, TimeUnit.MILLISECONDS);
        Assert.assertTrue(Files.exists(temp2));
        Assert.assertTrue(Files.size(temp2) > 0);

        var temp3 = f3.get(5000, TimeUnit.MILLISECONDS);
        Assert.assertTrue(Files.exists(temp3));
        Assert.assertTrue(Files.size(temp3) > 0);

    }

}
