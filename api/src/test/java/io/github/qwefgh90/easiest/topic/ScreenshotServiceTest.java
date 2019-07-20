package io.github.qwefgh90.easiest.topic;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {
        "schedule_on=false"
})
public class ScreenshotServiceTest {

    @Autowired
    ScreenshotService screenshotService;

    @Test
    public void getImage() throws Exception{
        var future = screenshotService.getImage("qwefgh90/qwefgh90.github.io", "http://qwefgh90.github.io/");
        var arr = future.get();
        Assert.assertTrue(arr.length > 0);
    }
    @Test
    public void getImageAtManytimes() throws Exception{
        var future1 = screenshotService.getImage("qwefgh90/qwefgh90.github.io", "http://qwefgh90.github.io/");
        var arr1 = future1.get();
        var future2 = screenshotService.getImage("qwefgh90/qwefgh90.github.io", "http://qwefgh90.github.io/");
        var arr2 = future2.get();
        var future3 = screenshotService.getImage("random1", "https://www.google.com");
        var arr3 = future3.get();
        var future4 = screenshotService.getImage("random2", "https://github.com");
        var arr4 = future4.get();
        var future5 = screenshotService.getImage("random3", "http://qwefgh90.github.io/sphinx");
        var arr5 = future5.get();
        var future6 = screenshotService.getImage("random4", "https://naver.com");
        var arr6 = future6.get();
        Assert.assertTrue(arr1.length > 0);
        Assert.assertTrue(arr2.length > 0);;
        Assert.assertEquals(arr1.length, arr2.length);
        Assert.assertTrue(arr3.length > 0);
        Assert.assertTrue(arr4.length > 0);
        Assert.assertTrue(arr5.length > 0);
        Assert.assertTrue(arr6.length > 0);
    }
}
