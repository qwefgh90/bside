package io.github.qwefgh90.easiest.topic;

import io.github.qwefgh90.easiest.http.HttpUtil;
import org.json.JSONObject;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.quartz.DateBuilder.nextGivenMinuteDate;
import static org.quartz.TriggerBuilder.newTrigger;

public class TopicSearchJob implements Job {

    Logger log = LoggerFactory.getLogger(TopicSearchJob.class);


    String topicListStr;
    String groupName;
    String url;

    private static Map<String, Object> headers = new HashMap<>();
    static{
        headers.put("Accept", "application/vnd.github.mercy-preview+json");
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        var scheduler = jobExecutionContext.getScheduler();
        HttpUtil httpUtil;
        try {
            httpUtil = (HttpUtil) scheduler.getContext().get("httpUtil");
        }catch(Exception e){
            log.error("Execution context has a problem.",e);
            return;
        }
        var resOpt = httpUtil.get(url, headers);
        if(resOpt.isPresent()){
            var res = resOpt.get();
            if(res.statusCode() == 200) {
                log.info("success with " + url);
                var linkString = res.headers().firstValue("Link");

                var remainingCount = res.headers().firstValue("X-RateLimit-Remaining");
                var limitCount = res.headers().firstValue("X-RateLimit-Limit");
                var resetTimeStamp = res.headers().firstValue("X-RateLimit-Reset");
                var nextUrlOpt = linkString.flatMap(link -> parseNextUrl(link));
                log.debug(res.headers().toString());

                try {
                    var obj = new JSONObject(res.body());
                    mergeAndApplyResult(jobExecutionContext, obj, nextUrlOpt.isEmpty());

                    if (remainingCount.get().equals("0")) {
                        if (nextUrlOpt.isPresent()) {
                            var nextUrl = nextUrlOpt.get();
                            var nextJob = createNextJob(groupName, url, topicListStr); // when reset time come, try again
                            scheduler.scheduleJob(nextJob, specificDateTrigger(Long.parseLong(resetTimeStamp.get()) * 1000 + 999));
                        }else
                            schduleInNextHour(scheduler);
                    } else {
                        if (nextUrlOpt.isPresent()) {
                            var nextUrl = nextUrlOpt.get();
                            var nextJob = createNextJob(groupName, nextUrl, topicListStr); // start immediatly
                            scheduler.scheduleJob(nextJob, immediateTrigger);
                        } else
                            schduleInNextHour(scheduler);
                    }
                }catch(Exception e){
                    log.error("It will try in next hour",e);
                    try {
                        schduleInNextHour(scheduler);
                    }catch(Exception e1){
                        log.error("Fetal error occurs. Every scheduler fully stopped", e1);
                        return;
                    }
                }
            }
        }
    }

    private void mergeAndApplyResult(JobExecutionContext jobExecutionContext, JSONObject obj, boolean done){
        jobExecutionContext.setResult(new JobResult(groupName, obj, done));
    }

    static class JobResult{
        String groupName;
        JSONObject obj;
        boolean done;

        public JobResult(String groupName, JSONObject obj, boolean done) {
            this.groupName = groupName;
            this.obj = obj;
            this.done = done;
        }
    }

    public void schduleInNextHour(Scheduler scheduler) throws SchedulerException{
        var nextUrl = TopicSearchUrlFactory.url(Arrays.asList(topicListStr.split(",")), 1, 100); // start in next hour
        var nextJob = createNextJob("group:"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), nextUrl, topicListStr);
        scheduler.scheduleJob(nextJob, nextHourTrigger);
    }

    public JobDetail createNextJob(String groupName, String nextUrl, String topicListStr){
        return JobBuilder.newJob(TopicSearchJob.class)
                .usingJobData("url", nextUrl)
                .usingJobData("groupName", groupName)
                .usingJobData("topicListStr", topicListStr)
                .withIdentity(nextUrl, groupName)
                .build();
    }

    public Optional<String> parseNextUrl(String headerValue){
        var nextOpt = Arrays.stream(headerValue.split(",")).filter((s) -> {
            return s.contains("rel=\"next\"");
        }).findFirst();

        return nextOpt.flatMap(nextValue -> {
            Pattern p = Pattern.compile("<(.*)>");
            Matcher m = p.matcher(nextValue);
            if(m.find() && m.groupCount() == 1){
                return Optional.of(m.group(1));
            }else{
                return Optional.empty();
            }
        });
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public void setTopicListStr(String topicListStr) {
        this.topicListStr = topicListStr;
    }

    private Trigger immediateTrigger = newTrigger()
            .withIdentity("immediateTriggerInJob:"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS"))) // because group is not specified, "trigger8" will be in the default group
            .startNow()
            .build();

    private Trigger nextHourTrigger = newTrigger()
            .withIdentity("nextHourTrigger:"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS"))) // because group is not specified, "trigger8" will be in the default group
            .startAt(nextGivenMinuteDate(null, 0)) // next hour
            .build();
    /**
     *
     * @param timestamp 1563355024000L
     */
    private Trigger specificDateTrigger(long timestamp){
        LocalDateTime localDate = LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), TimeZone.getDefault().toZoneId());
        Date date = Date.from( localDate.atZone( ZoneId.systemDefault()).toInstant());
        Trigger trigger = newTrigger()
                .withIdentity("specificDateTrigger:"+LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS"))) // because group is not specified, "trigger8" will be in the default group
                .startAt(date)
                .build();
        return trigger;
    }
}

/**
 *   "total_count": 792,
 *   "incomplete_results": false,
 *   "items": [
 *     {
 *       "id": 10267810,
 *       "node_id": "MDEwOlJlcG9zaXRvcnkxMDI2NzgxMA==",
 *       "name": "minimal-mistakes",
 *       "full_name": "mmistakes/minimal-mistakes",
 *       "private": false,
 *       "owner": {
 *         "login": "mmistakes",
 *         "id": 1376749,
 *         "node_id": "MDQ6VXNlcjEzNzY3NDk=",
 *         "avatar_url": "https://avatars3.githubusercontent.com/u/1376749?v=4",
 *         "gravatar_id": "",
 *         "url": "https://api.github.com/users/mmistakes",
 *         "html_url": "https://github.com/mmistakes",
 *         "followers_url": "https://api.github.com/users/mmistakes/followers",
 *         "following_url": "https://api.github.com/users/mmistakes/following{/other_user}",
 *         "gists_url": "https://api.github.com/users/mmistakes/gists{/gist_id}",
 *         "starred_url": "https://api.github.com/users/mmistakes/starred{/owner}{/repo}",
 *         "subscriptions_url": "https://api.github.com/users/mmistakes/subscriptions",
 *         "organizations_url": "https://api.github.com/users/mmistakes/orgs",
 *         "repos_url": "https://api.github.com/users/mmistakes/repos",
 *         "events_url": "https://api.github.com/users/mmistakes/events{/privacy}",
 *         "received_events_url": "https://api.github.com/users/mmistakes/received_events",
 *         "type": "User",
 *         "site_admin": false
 *       },
 *       "html_url": "https://github.com/mmistakes/minimal-mistakes",
 *       "description": ":triangular_ruler: A flexible two-column Jekyll theme perfect for building personal sites, blogs, and portfolios.",
 *       "fork": false,
 *       "url": "https://api.github.com/repos/mmistakes/minimal-mistakes",
 *       "forks_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/forks",
 *       "keys_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/keys{/key_id}",
 *       "collaborators_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/collaborators{/collaborator}",
 *       "teams_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/teams",
 *       "hooks_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/hooks",
 *       "issue_events_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/issues/events{/number}",
 *       "events_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/events",
 *       "assignees_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/assignees{/user}",
 *       "branches_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/branches{/branch}",
 *       "tags_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/tags",
 *       "blobs_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/git/blobs{/sha}",
 *       "git_tags_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/git/tags{/sha}",
 *       "git_refs_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/git/refs{/sha}",
 *       "trees_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/git/trees{/sha}",
 *       "statuses_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/statuses/{sha}",
 *       "languages_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/languages",
 *       "stargazers_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/stargazers",
 *       "contributors_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/contributors",
 *       "subscribers_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/subscribers",
 *       "subscription_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/subscription",
 *       "commits_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/commits{/sha}",
 *       "git_commits_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/git/commits{/sha}",
 *       "comments_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/comments{/number}",
 *       "issue_comment_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/issues/comments{/number}",
 *       "contents_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/contents/{+path}",
 * 100  6645  100  6645    0     0   7457      0 --:--:-- --:--:-- --:--:--  7457api.github.com/repos/mmistakes/minimal-mistakes/compare/{base}...{head}",
 *       "merges_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/merges",
 *       "archive_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/{archive_format}{/ref}",
 *       "downloads_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/downloads",
 *       "issues_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/issues{/number}",
 *       "pulls_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/pulls{/number}",
 *       "milestones_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/milestones{/number}",
 *       "notifications_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/notifications{?since,all,participating}",
 *       "labels_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/labels{/name}",
 *       "releases_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/releases{/id}",
 *       "deployments_url": "https://api.github.com/repos/mmistakes/minimal-mistakes/deployments",
 *       "created_at": "2013-05-24T14:13:30Z",
 *       "updated_at": "2019-07-17T03:10:50Z",
 *       "pushed_at": "2019-07-15T21:19:12Z",
 *       "git_url": "git://github.com/mmistakes/minimal-mistakes.git",
 *       "ssh_url": "git@github.com:mmistakes/minimal-mistakes.git",
 *       "clone_url": "https://github.com/mmistakes/minimal-mistakes.git",
 *       "svn_url": "https://github.com/mmistakes/minimal-mistakes",
 *       "homepage": "https://mmistakes.github.io/minimal-mistakes/",
 *       "size": 42937,
 *       "stargazers_count": 5426,
 *       "watchers_count": 5426,
 *       "language": "CSS",
 *       "has_issues": true,
 *       "has_projects": true,
 *       "has_downloads": true,
 *       "has_wiki": false,
 *       "has_pages": true,
 *       "forks_count": 9179,
 *       "mirror_url": null,
 *       "archived": false,
 *       "disabled": false,
 *       "open_issues_count": 16,
 *       "license": {
 *         "key": "mit",
 *         "name": "MIT License",
 *         "spdx_id": "MIT",
 *         "url": "https://api.github.com/licenses/mit",
 *         "node_id": "MDc6TGljZW5zZTEz"
 *       },
 *       "topics": [
 *         "algolia",
 *         "algolia-loadPage",
 *         "github-pages",
 *         "jekyll",
 *         "jekyll-theme",
 *         "lunr",
 *         "ruby-gem",
 *         "loadPage",
 *         "theme"
 *       ],
 *       "forks": 9179,
 *       "open_issues": 16,
 *       "watchers": 5426,
 *       "default_branch": "master",
 *       "permissions": {
 *         "admin": false,
 *         "push": false,
 *         "pull": true
 *       },
 *       "score": 4.4404793
 *     }
 *   ]
 * }
 */