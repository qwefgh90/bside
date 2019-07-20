package io.github.qwefgh90.easiest.topic;

import io.github.qwefgh90.easiest.http.HttpUtil;
import org.json.JSONObject;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.http.HttpResponse;
import java.util.*;

@Service
public class TopicSearchService {

    @Autowired
    HttpUtil httpUtil;

    @Autowired
    TopicSearchBot topicSearchBot;

    private Map<String, Object> headers = new HashMap<>();

    TopicSearchService(){
        headers.put("Accept", "application/vnd.github.mercy-preview+json");
    }

    private JSONObject getNewJSONObject(int len, List<Object> items){
        var obj = new JSONObject();
        obj.put("total_count", len);
        obj.put("items", items);
        return obj;
    }

    Optional<JSONObject> get(){
        return getCount().map(len -> {
            var obj = new JSONObject();
            var items = new ArrayList<>(len);
            items.addAll(topicSearchBot.getLast().get().getJSONArray("items").toList());
            return getNewJSONObject(len, items);
        });
//        return topicSearchBot.getLast();
    }

    Optional<Integer> getCount(){
        return topicSearchBot.getLast().map(v -> v.getInt("total_count"));
    }

    Optional<JSONObject> get(Integer page, Integer perPage){
        return getCount().map(len -> {
            var obj = new JSONObject();
            var items = new ArrayList<>(len);
            items.addAll(topicSearchBot.getLast().get().getJSONArray("items").toList());

            var firstIndex = (page - 1) * perPage;
            var lastIndex = page * perPage;

            firstIndex = firstIndex < 0 ? 0 : (firstIndex > len ? len : firstIndex);
            lastIndex = lastIndex < firstIndex ? firstIndex : (lastIndex > len ? len : lastIndex);
            var sub = items.subList(firstIndex, lastIndex);

            return getNewJSONObject(len, sub);
        });
    }
}
