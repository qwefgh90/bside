package io.github.qwefgh90.easiest.topic;

import io.github.qwefgh90.easiest.http.HttpUtil;
import org.json.JSONObject;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.quartz.TriggerBuilder.newTrigger;

@Service
public class TopicSearchBot {

    Logger log = LoggerFactory.getLogger(TopicSearchBot.class);
    @Autowired
    HttpUtil httpUtil;

    private String currentGroupName;
    private JSONObject acc;
    private JSONObject last;

    @Value("${schedule_on}")
    boolean scheduleOn;

    private JSONObject result = new JSONObject();
    TopicSearchBot(){
        try {
            var p = new Properties();
            p.put("org.quartz.threadPool.threadCount", "3");
            schedFact = new org.quartz.impl.StdSchedulerFactory(p);
        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }

    SchedulerFactory schedFact;

    @PostConstruct
    void init(){
        try {
            if (scheduleOn) {
                var topicList = new ArrayList<String>();
                topicList.add("jekyll-theme");
        //        topicList.add("jekyll-site");
        //        topicList.add("jekyll-themes");
        //        topicList.add("jekyll-website");
                start(topicList,1, 100);
            }
        }catch(Exception e){
            log.error("An error occurs when starting quartz.",e);
        }
    }

    @PreDestroy
    void clean() throws SchedulerException{
        var sched = schedFact.getScheduler();
        sched.clear();
        sched.shutdown();
    }

    private Trigger immediateTrigger = newTrigger()
            .withIdentity("immediateTrigger:"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS"))) // because group is not specified, "trigger8" will be in the default group
            .startNow()
            .build();

    void start(List<String> topicList, int page, int perPage) throws SchedulerException{
        registerAggregation();
        var sched = schedFact.getScheduler();
        sched.getContext().put("httpUtil", httpUtil);
        sched.start();
        String topicListStr = String.join(",", topicList);
        String groupName = "group:"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS"));
        String url = TopicSearchUrlFactory.url(topicList, page, perPage);
        var job = JobBuilder.newJob(TopicSearchJob.class)
                .usingJobData("topicListStr", topicListStr)
                .usingJobData("groupName", groupName)
                .usingJobData("url", url).build();
        sched.scheduleJob(job, immediateTrigger);
    }

    public Optional<JSONObject> getLast() {

        return last == null ? Optional.empty() : Optional.of(last);
    }

    void registerAggregation() throws SchedulerException{
        var sched = schedFact.getScheduler();
        sched.getListenerManager().addJobListener(new JobListener() {
            @Override
            public String getName() {
                return "aggregation";
            }

            @Override
            public void jobToBeExecuted(JobExecutionContext jobExecutionContext) {
            }

            @Override
            public void jobExecutionVetoed(JobExecutionContext jobExecutionContext) {

            }

            @Override
            public void jobWasExecuted(JobExecutionContext jobExecutionContext, JobExecutionException e) {
                var res = jobExecutionContext.getResult();
                if(res != null){
                    var jobResult = (TopicSearchJob.JobResult)res;
                    if(currentGroupName == null || !currentGroupName.equals(jobResult.groupName)){
                        currentGroupName = jobResult.groupName;
                        acc = jobResult.obj;
                        if(jobResult.done){
                            log.info(currentGroupName + " is done. the json value is available now.");
                            last = acc;
                            currentGroupName = null;
                            acc = null;
                        }
                    }else if(currentGroupName.equals(jobResult.groupName)){
                        var finalCount = jobResult.obj.getInt("total_count");
                        var partialItems = jobResult.obj.getJSONArray("items");
                        var currentItems = acc.getJSONArray("items");
                        var newList =  partialItems.toList();
                        newList.addAll((currentItems.toList()));
                        acc.put("total_count", finalCount);
                        acc.put("items", newList);
                        if(jobResult.done){
                            log.info(currentGroupName + " is done. the json value is available now.");
                            var sortedItems = acc.getJSONArray("items").toList();
                            sortedItems.sort((e1, e2) -> {
                                var jobj1 = (HashMap)e1;
                                var jobj2 = (HashMap)e2;
                                var star1 = (int)jobj1.get("stargazers_count");
                                var star2 = (int)jobj2.get("stargazers_count");
                                return star1 < star2 ? 1 : (star1 == star2 ? 0 : -1);
                            });
                            acc.put("items", sortedItems);

                            last = acc;
                            currentGroupName = null;
                            acc = null;
                        }
                    }
                }

            }
        });


    }


    /**
     * LocalDateTime date = LocalDateTime.ofInstant(Instant.ofEpochMilli(1563355024000L) TimeZone.getDefault().toZoneId());
     * curl -H "Accept: application/vnd.github.mercy-preview+json"  "https://api.github.com/search/repositories?q=topic:jekyll-theme&per_page=1&page=791" -I
     * Date: Wed, 17 Jul 2019 09:16:04 GMT
     * Content-Type: application/json; charset=utf-8
     * Content-Length: 6266
     * Server: GitHub.com
     * Status: 200 OK
     * X-RateLimit-Limit: 30
     * X-RateLimit-Remaining: 29
     * X-RateLimit-Reset: 1563355024
     * Cache-Control: no-cache
     * X-OAuth-Scopes:
     * X-Accepted-OAuth-Scopes:
     * X-GitHub-Media-Type: github.mercy-preview; format=json
     * Link: <https://api.github.com/search/repositories?q=topic%3Ajekyll-theme&per_page=1&page=790>; rel="prev", <https://api.github.com/search/repositories?q=topic%3Ajekyll-theme&per_page=1&page=792>; rel="next", <https://api.github.com/search/repositories?q=topic%3Ajekyll-theme&per_page=1&page=792>; rel="last", <https://api.github.com/search/repositories?q=topic%3Ajekyll-theme&per_page=1&page=1>; rel="first"
     * Access-Control-Expose-Headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type
     * Access-Control-Allow-Origin: *
     * Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
     * X-Frame-Options: deny
     * X-Content-Type-Options: nosniff
     * X-XSS-Protection: 1; mode=block
     * Referrer-Policy: origin-when-cross-origin, strict-origin-when-cross-origin
     * Content-Security-Policy: default-src 'none'
     * Vary: Accept-Encoding
     * X-GitHub-Request-Id: C3EA:650C:1BFA6F:21AF4B:5D2EE754
     *
     */
}
