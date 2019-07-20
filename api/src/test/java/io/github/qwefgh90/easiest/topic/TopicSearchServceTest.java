package io.github.qwefgh90.easiest.topic;

import io.github.qwefgh90.easiest.http.HttpUtil;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.net.http.HttpHeaders;
import java.net.http.HttpResponse;
import java.util.*;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.spy;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {
        "schedule_on=false"
})
public class TopicSearchServceTest {

    @Mock
    HttpResponse<String> mockRes;

    HttpResponse<String> res1;
    HttpResponse<String> res2;
    HttpResponse<String> res3;
    HttpHeaders h1;
    HttpHeaders h2;
    HttpHeaders h3;


    HttpUtil httpUtil = spy(HttpUtil.class);

    @InjectMocks
    TopicSearchBot topicSearchBot = spy(TopicSearchBot.class);

    @InjectMocks
    TopicSearchService searchService;

    @Before
    public void setup(){
        //initial data
        Mockito.when(mockRes.body()).thenReturn("{\"total_count\": 1}");
        Mockito.when(httpUtil.get(Mockito.anyString(), Mockito.anyMap())).thenReturn(Optional.of(mockRes));
    }
    List<String> topicList = new ArrayList<>();
    {
        topicList.add("jekyll-theme");
    }
    String url1 = TopicSearchUrlFactory.url(topicList, 1, 2);
    String url2 = TopicSearchUrlFactory.url(topicList, 2, 2);
    String url3 = TopicSearchUrlFactory.url(topicList, 3, 2);

    private void setupPages(){
        res1 = Mockito.mock(HttpResponse.class);
        res2 = Mockito.mock(HttpResponse.class);
        res3 = Mockito.mock(HttpResponse.class);
        var m1 = new HashMap();
        m1.put("Link", Collections.singletonList("<" + url2 + ">; rel=\"next\"" +
                ", <" + url3 + ">; rel=\"last\""));
        m1.put("X-RateLimit-Remaining",Collections.singletonList("100"));
        m1.put("X-RateLimit-Limit",Collections.singletonList("100"));
        m1.put("X-RateLimit-Reset",Collections.singletonList("0"));
        h1 = HttpHeaders.of(m1, (s1,s2) -> true);

        var m2 = new HashMap();
        m2.put("Link", Collections.singletonList("<" + url3 + ">; rel=\"next\"" +
                ", <" + url3 + ">; rel=\"last\""));
        m2.put("X-RateLimit-Remaining",Collections.singletonList("100"));
        m2.put("X-RateLimit-Limit",Collections.singletonList("100"));
        m2.put("X-RateLimit-Reset",Collections.singletonList("0"));
        h2 = HttpHeaders.of(m2, (s1,s2) -> true);

        var m3 = new HashMap();
        m3.put("Link", Collections.singletonList("<" + url3 + ">; rel=\"last\""));
        m3.put("X-RateLimit-Remaining",Collections.singletonList("100"));
        m3.put("X-RateLimit-Limit",Collections.singletonList("100"));
        m3.put("X-RateLimit-Reset",Collections.singletonList("0"));
        h3 = HttpHeaders.of(m3, (s1,s2) -> true);

        //set body and header
        Mockito.when(res1.headers()).thenReturn(h1);
        Mockito.when(res1.body()).thenReturn("{total_count: 5, items: [{\"id\":1, stargazers_count: 0}, {\"id\":5, stargazers_count: 0}]}");
        Mockito.when(res1.statusCode()).thenReturn(200);

        Mockito.when(httpUtil.get(eq(url1), Mockito.anyMap())).thenReturn(Optional.of(res1));

        Mockito.when(res2.headers()).thenReturn(h2);
        Mockito.when(res2.body()).thenReturn("{total_count: 5, items: [{\"id\":2, stargazers_count: 0}, {\"id\":4, stargazers_count: 0}]}");
        Mockito.when(res2.statusCode()).thenReturn(200);
        Mockito.when(httpUtil.get(eq(url2), Mockito.anyMap())).thenReturn(Optional.of(res2));

        Mockito.when(res3.headers()).thenReturn(h3);
        Mockito.when(res3.body()).thenReturn("{total_count: 5, items: [{\"id\":10, stargazers_count: 0}]}");
        Mockito.when(res3.statusCode()).thenReturn(200);
        Mockito.when(httpUtil.get(eq(url3), Mockito.anyMap())).thenReturn(Optional.of(res3));
    }

    private void setupSignlePage(){
        res1 = Mockito.mock(HttpResponse.class);
        var m1 = new HashMap();
        m1.put("Link", Collections.singletonList("<" + url2 + ">; rel=\"last\""));
        m1.put("X-RateLimit-Remaining",Collections.singletonList("100"));
        m1.put("X-RateLimit-Limit",Collections.singletonList("100"));
        m1.put("X-RateLimit-Reset",Collections.singletonList("0"));
        h1 = HttpHeaders.of(m1, (s1,s2) -> true);

        //set body and header
        Mockito.when(res1.headers()).thenReturn(h1);
        Mockito.when(res1.body()).thenReturn("{total_count: 2, items: [{\"id\":1}, {\"id\":5}]}");
        Mockito.when(res1.statusCode()).thenReturn(200);
        Mockito.when(httpUtil.get(eq(url1), Mockito.anyMap())).thenReturn(Optional.of(res1));
    }

    @Test
    public void getAllItemsWhenThreePage() throws Exception{
        setupPages();

        var topicListStr = new ArrayList<String>();
        topicListStr.add("jekyll-theme");
        var page = 1;
        var perPage = 2;
        searchService.topicSearchBot.start(topicListStr, page, perPage);
        Optional<JSONObject> obj1 = searchService.get();
        Assert.assertTrue(obj1.isEmpty());

        Thread.sleep(2000);

        Optional<JSONObject> obj2 = searchService.get();
        Assert.assertTrue(obj2.isPresent());
    }

    @Test
    public void getAllItemsWhenOnePage() throws Exception{
        setupSignlePage();

        var topicListStr = new ArrayList<String>();
        topicListStr.add("jekyll-theme");
        var page = 1;
        var perPage = 2;
        searchService.topicSearchBot.start(topicListStr, page, perPage);
        Thread.sleep(2000);
        Optional<JSONObject> obj2 = searchService.get();
        Assert.assertTrue(obj2.isPresent());

    }
}
