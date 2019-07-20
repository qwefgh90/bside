package io.github.qwefgh90.easiest.topic;

import java.util.ArrayList;
import java.util.List;

public class TopicSearchUrlFactory {

    public static final String apiUrl = "https://api.github.com/search/repositories";//?q=topic:jekyll-theme&per_page=100

    static String url(List<String> topicList, int page, int perPage){
        return url(topicList) + "&page="+page+"&per_page="+perPage;
    }

    static String url(List<String> topicList){
        return TopicSearchUrlFactory.apiUrl + "?q=" + topicQuery(topicList);
    }

    static String topicQuery(List<String> topicList){
        return topicList.stream().reduce("", (String s1, String s2) -> {
            return s1 + (s1.length() > 0 ? "+" : "") + ( "topic:" +s2);
        });
    }
}
