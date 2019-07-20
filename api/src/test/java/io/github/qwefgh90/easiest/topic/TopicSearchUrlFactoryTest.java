package io.github.qwefgh90.easiest.topic;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TopicSearchUrlFactoryTest {



    @Test
    public void url() {
        var topicList = new ArrayList<String>();
        topicList.add("jekyll-theme");
        topicList.add("jekyll-site");
        topicList.add("jekyll-themes");
        topicList.add("jekyll-website");
        var page = 1;
        var perPage = 100;

        //cache by sending the request
        String url1 = TopicSearchUrlFactory.url(topicList, page, perPage);
        String url2 = TopicSearchUrlFactory.url(topicList);

        //check the url is correct.
        Assert.assertEquals(TopicSearchUrlFactory.topicQuery(topicList)
                , "topic:" + topicList.get(0) + "+topic:" + topicList.get(1) + "+topic:" + topicList.get(2) + "+topic:" + topicList.get(3));
        Assert.assertEquals(url2, TopicSearchUrlFactory.apiUrl + "?q=" + "topic:" + topicList.get(0) + "+topic:" + topicList.get(1) + "+topic:" + topicList.get(2) + "+topic:" + topicList.get(3));
        Assert.assertEquals(url1
                , TopicSearchUrlFactory.apiUrl + "?q=" + "topic:" + topicList.get(0) + "+topic:" + topicList.get(1) + "+topic:" + topicList.get(2) + "+topic:" + topicList.get(3) + "&page=1&per_page=100");
    }

}
