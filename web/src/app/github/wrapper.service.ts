import { Injectable } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import Github from 'github-api';

@Injectable({
  providedIn: 'root'
})
export class WrapperService {

  constructor(private oauth: OAuthService) { }

  /**
   * [
  {
    "id": 52673414,
    "node_id": "MDEwOlJlcG9zaXRvcnk1MjY3MzQxNA==",
    "name": "env",
    "full_name": "qwefgh90/env",
    "private": false,
    "owner": {
      "login": "qwefgh90",
      "id": 7572251,
      "node_id": "MDQ6VXNlcjc1NzIyNTE=",
      "avatar_url": "https://avatars2.githubusercontent.com/u/7572251?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/qwefgh90",
      "html_url": "https://github.com/qwefgh90",
      "followers_url": "https://api.github.com/users/qwefgh90/followers",
      "following_url": "https://api.github.com/users/qwefgh90/following{/other_user}",
      "gists_url": "https://api.github.com/users/qwefgh90/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/qwefgh90/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/qwefgh90/subscriptions",
      "organizations_url": "https://api.github.com/users/qwefgh90/orgs",
      "repos_url": "https://api.github.com/users/qwefgh90/repos",
      "events_url": "https://api.github.com/users/qwefgh90/events{/privacy}",
      "received_events_url": "https://api.github.com/users/qwefgh90/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/qwefgh90/env",
    "description": "ubuntu & centos & windows server command",
    "fork": false,
    "url": "https://api.github.com/repos/qwefgh90/env",
    "forks_url": "https://api.github.com/repos/qwefgh90/env/forks",
    "keys_url": "https://api.github.com/repos/qwefgh90/env/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/qwefgh90/env/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/qwefgh90/env/teams",
    "hooks_url": "https://api.github.com/repos/qwefgh90/env/hooks",
    "issue_events_url": "https://api.github.com/repos/qwefgh90/env/issues/events{/number}",
    "events_url": "https://api.github.com/repos/qwefgh90/env/events",
    "assignees_url": "https://api.github.com/repos/qwefgh90/env/assignees{/user}",
    "branches_url": "https://api.github.com/repos/qwefgh90/env/branches{/branch}",
    "tags_url": "https://api.github.com/repos/qwefgh90/env/tags",
    "blobs_url": "https://api.github.com/repos/qwefgh90/env/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/qwefgh90/env/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/qwefgh90/env/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/qwefgh90/env/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/qwefgh90/env/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/qwefgh90/env/languages",
    "stargazers_url": "https://api.github.com/repos/qwefgh90/env/stargazers",
    "contributors_url": "https://api.github.com/repos/qwefgh90/env/contributors",
    "subscribers_url": "https://api.github.com/repos/qwefgh90/env/subscribers",
    "subscription_url": "https://api.github.com/repos/qwefgh90/env/subscription",
    "commits_url": "https://api.github.com/repos/qwefgh90/env/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/qwefgh90/env/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/qwefgh90/env/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/qwefgh90/env/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/qwefgh90/env/contents/{+path}",
    "compare_url": "https://api.github.com/repos/qwefgh90/env/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/qwefgh90/env/merges",
    "archive_url": "https://api.github.com/repos/qwefgh90/env/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/qwefgh90/env/downloads",
    "issues_url": "https://api.github.com/repos/qwefgh90/env/issues{/number}",
    "pulls_url": "https://api.github.com/repos/qwefgh90/env/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/qwefgh90/env/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/qwefgh90/env/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/qwefgh90/env/labels{/name}",
    "releases_url": "https://api.github.com/repos/qwefgh90/env/releases{/id}",
    "deployments_url": "https://api.github.com/repos/qwefgh90/env/deployments",
    "created_at": "2016-02-27T15:31:28Z",
    "updated_at": "2019-05-07T02:22:34Z",
    "pushed_at": "2019-05-07T02:22:33Z",
    "git_url": "git://github.com/qwefgh90/env.git",
    "ssh_url": "git@github.com:qwefgh90/env.git",
    "clone_url": "https://github.com/qwefgh90/env.git",
    "svn_url": "https://github.com/qwefgh90/env",
    "homepage": "",
    "size": 4650,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "Shell",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    }
  },
   */
  repositories(login: string) {
    if (this.hasToken()) {
      const gh = new Github({
        token: this.token()
      });
      const user = gh.getUser(login);
      let promise: Promise<any> = user.listRepos();
      return promise;
    }else{
      return Promise.reject();
    }
  }

  private hasToken(){
    return this.oauth.isLogin;
  }

  private token(): string{
    return this.oauth.accessToken;
  }
}
