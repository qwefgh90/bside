import { Injectable } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import Github from 'github-api';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Blob } from './type/blob';
/**
 * A returned data should be stored in each component;
 */
@Injectable({
  providedIn: 'root'
})
export class WrapperService {
  constructor(private oauth: OAuthService, private http: HttpClient) { }

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
  repositories(login: string): Promise<Array<any>> {
    if (this.hasToken()) {
      const gh = new Github({
        token: this.token()
      });
      const user = gh.getUser(login);
      let promise: Promise<any> = user.listRepos();
      return promise.then(result => result.data);
    } else {
      return Promise.reject();
    }
  }

  /**
   * 
   * @param login {
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "node_id": "MDQ6VXNlcjE=",
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "gravatar_id": "",
    "url": "https://api.github.com/users/octocat",
    "html_url": "https://github.com/octocat",
    "followers_url": "https://api.github.com/users/octocat/followers",
    "following_url": "https://api.github.com/users/octocat/following{/other_user}",
    "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
    "organizations_url": "https://api.github.com/users/octocat/orgs",
    "repos_url": "https://api.github.com/users/octocat/repos",
    "events_url": "https://api.github.com/users/octocat/events{/privacy}",
    "received_events_url": "https://api.github.com/users/octocat/received_events",
    "type": "User",
    "site_admin": false
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World",
  "description": "This your first repo!",
  "fork": false,
  "url": "https://api.github.com/repos/octocat/Hello-World",
  "archive_url": "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
  "assignees_url": "http://api.github.com/repos/octocat/Hello-World/assignees{/user}",
  "blobs_url": "http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
  "branches_url": "http://api.github.com/repos/octocat/Hello-World/branches{/branch}",
  "collaborators_url": "http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
  "comments_url": "http://api.github.com/repos/octocat/Hello-World/comments{/number}",
  "commits_url": "http://api.github.com/repos/octocat/Hello-World/commits{/sha}",
  "compare_url": "http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
  "contents_url": "http://api.github.com/repos/octocat/Hello-World/contents/{+path}",
  "contributors_url": "http://api.github.com/repos/octocat/Hello-World/contributors",
  "deployments_url": "http://api.github.com/repos/octocat/Hello-World/deployments",
  "downloads_url": "http://api.github.com/repos/octocat/Hello-World/downloads",
  "events_url": "http://api.github.com/repos/octocat/Hello-World/events",
  "forks_url": "http://api.github.com/repos/octocat/Hello-World/forks",
  "git_commits_url": "http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
  "git_refs_url": "http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
  "git_tags_url": "http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
  "git_url": "git:github.com/octocat/Hello-World.git",
  "issue_comment_url": "http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
  "issue_events_url": "http://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
  "issues_url": "http://api.github.com/repos/octocat/Hello-World/issues{/number}",
  "keys_url": "http://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
  "labels_url": "http://api.github.com/repos/octocat/Hello-World/labels{/name}",
  "languages_url": "http://api.github.com/repos/octocat/Hello-World/languages",
  "merges_url": "http://api.github.com/repos/octocat/Hello-World/merges",
  "milestones_url": "http://api.github.com/repos/octocat/Hello-World/milestones{/number}",
  "notifications_url": "http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
  "pulls_url": "http://api.github.com/repos/octocat/Hello-World/pulls{/number}",
  "releases_url": "http://api.github.com/repos/octocat/Hello-World/releases{/id}",
  "ssh_url": "git@github.com:octocat/Hello-World.git",
  "stargazers_url": "http://api.github.com/repos/octocat/Hello-World/stargazers",
  "statuses_url": "http://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
  "subscribers_url": "http://api.github.com/repos/octocat/Hello-World/subscribers",
  "subscription_url": "http://api.github.com/repos/octocat/Hello-World/subscription",
  "tags_url": "http://api.github.com/repos/octocat/Hello-World/tags",
  "teams_url": "http://api.github.com/repos/octocat/Hello-World/teams",
  "trees_url": "http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
  "clone_url": "https://github.com/octocat/Hello-World.git",
  "mirror_url": "git:git.example.com/octocat/Hello-World",
  "hooks_url": "http://api.github.com/repos/octocat/Hello-World/hooks",
  "svn_url": "https://svn.github.com/octocat/Hello-World",
  "homepage": "https://github.com",
  "language": null,
  "forks_count": 9,
  "stargazers_count": 80,
  "watchers_count": 80,
  "size": 108,
  "default_branch": "master",
  "open_issues_count": 0,
  "topics": [
    "octocat",
    "atom",
    "electron",
    "api"
  ],
  "has_issues": true,
  "has_projects": true,
  "has_wiki": true,
  "has_pages": false,
  "has_downloads": true,
  "archived": false,
  "disabled": false,
  "pushed_at": "2011-01-26T19:06:43Z",
  "created_at": "2011-01-26T19:01:12Z",
  "updated_at": "2011-01-26T19:14:43Z",
  "permissions": {
    "admin": false,
    "push": false,
    "pull": true
  },
  "allow_rebase_merge": true,
  "allow_squash_merge": true,
  "allow_merge_commit": true,
  "subscribers_count": 42,
  "network_count": 0,
  "license": {
    "key": "mit",
    "name": "MIT License",
    "spdx_id": "MIT",
    "url": "https://api.github.com/licenses/mit",
    "node_id": "MDc6TGljZW5zZW1pdA=="
  },
  "organization": {
    "login": "octocat",
    "id": 1,
    "node_id": "MDQ6VXNlcjE=",
    "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    "gravatar_id": "",
    "url": "https://api.github.com/users/octocat",
    "html_url": "https://github.com/octocat",
    "followers_url": "https://api.github.com/users/octocat/followers",
    "following_url": "https://api.github.com/users/octocat/following{/other_user}",
    "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
    "organizations_url": "https://api.github.com/users/octocat/orgs",
    "repos_url": "https://api.github.com/users/octocat/repos",
    "events_url": "https://api.github.com/users/octocat/events{/privacy}",
    "received_events_url": "https://api.github.com/users/octocat/received_events",
    "type": "Organization",
    "site_admin": false
  },
  "parent": {
    "id": 1296269,
    "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
    "name": "Hello-World",
    "full_name": "octocat/Hello-World",
    "owner": {
      "login": "octocat",
      "id": 1,
      "node_id": "MDQ6VXNlcjE=",
      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
      "gravatar_id": "",
      "url": "https://api.github.com/users/octocat",
      "html_url": "https://github.com/octocat",
      "followers_url": "https://api.github.com/users/octocat/followers",
      "following_url": "https://api.github.com/users/octocat/following{/other_user}",
      "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
      "organizations_url": "https://api.github.com/users/octocat/orgs",
      "repos_url": "https://api.github.com/users/octocat/repos",
      "events_url": "https://api.github.com/users/octocat/events{/privacy}",
      "received_events_url": "https://api.github.com/users/octocat/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/octocat/Hello-World",
    "description": "This your first repo!",
    "fork": false,
    "url": "https://api.github.com/repos/octocat/Hello-World",
    "archive_url": "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
    "assignees_url": "http://api.github.com/repos/octocat/Hello-World/assignees{/user}",
    "blobs_url": "http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
    "branches_url": "http://api.github.com/repos/octocat/Hello-World/branches{/branch}",
    "collaborators_url": "http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
    "comments_url": "http://api.github.com/repos/octocat/Hello-World/comments{/number}",
    "commits_url": "http://api.github.com/repos/octocat/Hello-World/commits{/sha}",
    "compare_url": "http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
    "contents_url": "http://api.github.com/repos/octocat/Hello-World/contents/{+path}",
    "contributors_url": "http://api.github.com/repos/octocat/Hello-World/contributors",
    "deployments_url": "http://api.github.com/repos/octocat/Hello-World/deployments",
    "downloads_url": "http://api.github.com/repos/octocat/Hello-World/downloads",
    "events_url": "http://api.github.com/repos/octocat/Hello-World/events",
    "forks_url": "http://api.github.com/repos/octocat/Hello-World/forks",
    "git_commits_url": "http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
    "git_refs_url": "http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
    "git_tags_url": "http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
    "git_url": "git:github.com/octocat/Hello-World.git",
    "issue_comment_url": "http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
    "issue_events_url": "http://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
    "issues_url": "http://api.github.com/repos/octocat/Hello-World/issues{/number}",
    "keys_url": "http://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
    "labels_url": "http://api.github.com/repos/octocat/Hello-World/labels{/name}",
    "languages_url": "http://api.github.com/repos/octocat/Hello-World/languages",
    "merges_url": "http://api.github.com/repos/octocat/Hello-World/merges",
    "milestones_url": "http://api.github.com/repos/octocat/Hello-World/milestones{/number}",
    "notifications_url": "http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
    "pulls_url": "http://api.github.com/repos/octocat/Hello-World/pulls{/number}",
    "releases_url": "http://api.github.com/repos/octocat/Hello-World/releases{/id}",
    "ssh_url": "git@github.com:octocat/Hello-World.git",
    "stargazers_url": "http://api.github.com/repos/octocat/Hello-World/stargazers",
    "statuses_url": "http://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
    "subscribers_url": "http://api.github.com/repos/octocat/Hello-World/subscribers",
    "subscription_url": "http://api.github.com/repos/octocat/Hello-World/subscription",
    "tags_url": "http://api.github.com/repos/octocat/Hello-World/tags",
    "teams_url": "http://api.github.com/repos/octocat/Hello-World/teams",
    "trees_url": "http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
    "clone_url": "https://github.com/octocat/Hello-World.git",
    "mirror_url": "git:git.example.com/octocat/Hello-World",
    "hooks_url": "http://api.github.com/repos/octocat/Hello-World/hooks",
    "svn_url": "https://svn.github.com/octocat/Hello-World",
    "homepage": "https://github.com",
    "language": null,
    "forks_count": 9,
    "stargazers_count": 80,
    "watchers_count": 80,
    "size": 108,
    "default_branch": "master",
    "open_issues_count": 0,
    "topics": [
      "octocat",
      "atom",
      "electron",
      "api"
    ],
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true,
    "has_pages": false,
    "has_downloads": true,
    "archived": false,
    "disabled": false,
    "pushed_at": "2011-01-26T19:06:43Z",
    "created_at": "2011-01-26T19:01:12Z",
    "updated_at": "2011-01-26T19:14:43Z",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    },
    "allow_rebase_merge": true,
    "allow_squash_merge": true,
    "allow_merge_commit": true,
    "subscribers_count": 42,
    "network_count": 0
  },
  "source": {
    "id": 1296269,
    "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
    "name": "Hello-World",
    "full_name": "octocat/Hello-World",
    "owner": {
      "login": "octocat",
      "id": 1,
      "node_id": "MDQ6VXNlcjE=",
      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
      "gravatar_id": "",
      "url": "https://api.github.com/users/octocat",
      "html_url": "https://github.com/octocat",
      "followers_url": "https://api.github.com/users/octocat/followers",
      "following_url": "https://api.github.com/users/octocat/following{/other_user}",
      "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
      "organizations_url": "https://api.github.com/users/octocat/orgs",
      "repos_url": "https://api.github.com/users/octocat/repos",
      "events_url": "https://api.github.com/users/octocat/events{/privacy}",
      "received_events_url": "https://api.github.com/users/octocat/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/octocat/Hello-World",
    "description": "This your first repo!",
    "fork": false,
    "url": "https://api.github.com/repos/octocat/Hello-World",
    "archive_url": "http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
    "assignees_url": "http://api.github.com/repos/octocat/Hello-World/assignees{/user}",
    "blobs_url": "http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
    "branches_url": "http://api.github.com/repos/octocat/Hello-World/branches{/branch}",
    "collaborators_url": "http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
    "comments_url": "http://api.github.com/repos/octocat/Hello-World/comments{/number}",
    "commits_url": "http://api.github.com/repos/octocat/Hello-World/commits{/sha}",
    "compare_url": "http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
    "contents_url": "http://api.github.com/repos/octocat/Hello-World/contents/{+path}",
    "contributors_url": "http://api.github.com/repos/octocat/Hello-World/contributors",
    "deployments_url": "http://api.github.com/repos/octocat/Hello-World/deployments",
    "downloads_url": "http://api.github.com/repos/octocat/Hello-World/downloads",
    "events_url": "http://api.github.com/repos/octocat/Hello-World/events",
    "forks_url": "http://api.github.com/repos/octocat/Hello-World/forks",
    "git_commits_url": "http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
    "git_refs_url": "http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
    "git_tags_url": "http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
    "git_url": "git:github.com/octocat/Hello-World.git",
    "issue_comment_url": "http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
    "issue_events_url": "http://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
    "issues_url": "http://api.github.com/repos/octocat/Hello-World/issues{/number}",
    "keys_url": "http://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
    "labels_url": "http://api.github.com/repos/octocat/Hello-World/labels{/name}",
    "languages_url": "http://api.github.com/repos/octocat/Hello-World/languages",
    "merges_url": "http://api.github.com/repos/octocat/Hello-World/merges",
    "milestones_url": "http://api.github.com/repos/octocat/Hello-World/milestones{/number}",
    "notifications_url": "http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
    "pulls_url": "http://api.github.com/repos/octocat/Hello-World/pulls{/number}",
    "releases_url": "http://api.github.com/repos/octocat/Hello-World/releases{/id}",
    "ssh_url": "git@github.com:octocat/Hello-World.git",
    "stargazers_url": "http://api.github.com/repos/octocat/Hello-World/stargazers",
    "statuses_url": "http://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
    "subscribers_url": "http://api.github.com/repos/octocat/Hello-World/subscribers",
    "subscription_url": "http://api.github.com/repos/octocat/Hello-World/subscription",
    "tags_url": "http://api.github.com/repos/octocat/Hello-World/tags",
    "teams_url": "http://api.github.com/repos/octocat/Hello-World/teams",
    "trees_url": "http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
    "clone_url": "https://github.com/octocat/Hello-World.git",
    "mirror_url": "git:git.example.com/octocat/Hello-World",
    "hooks_url": "http://api.github.com/repos/octocat/Hello-World/hooks",
    "svn_url": "https://svn.github.com/octocat/Hello-World",
    "homepage": "https://github.com",
    "language": null,
    "forks_count": 9,
    "stargazers_count": 80,
    "watchers_count": 80,
    "size": 108,
    "default_branch": "master",
    "open_issues_count": 0,
    "topics": [
      "octocat",
      "atom",
      "electron",
      "api"
    ],
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true,
    "has_pages": false,
    "has_downloads": true,
    "archived": false,
    "disabled": false,
    "pushed_at": "2011-01-26T19:06:43Z",
    "created_at": "2011-01-26T19:01:12Z",
    "updated_at": "2011-01-26T19:14:43Z",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    },
    "allow_rebase_merge": true,
    "allow_squash_merge": true,
    "allow_merge_commit": true,
    "subscribers_count": 42,
    "network_count": 0
  }
}*/
  repositoryDetails(login: string, repositoryName: string): Promise<any> {
    if (this.hasToken()) {
      const repo = new Github({
        token: this.token()
      });
      let promise: Promise<any> = repo.getRepo(login, repositoryName).getDetails();
      return promise.then(result => result.data);
    } else {
      return Promise.reject();
    }
  }

  /**
   * {
  "sha": "af24baf129c486558e37d797e54c9fd81c9c3407",
  "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/af24baf129c486558e37d797e54c9fd81c9c3407",
  "tree": [
    {
      "path": ".buildinfo",
      "mode": "100644",
      "type": "blob",
      "sha": "910ab6d5a9cb4de8551bec37eb60847f258d742c",
      "size": 230,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/910ab6d5a9cb4de8551bec37eb60847f258d742c"
    },
    {
      "path": ".gitignore",
      "mode": "100644",
      "type": "blob",
      "sha": "0afe7c5b8833f794f4e4d71964864eeda31a0906",
      "size": 97,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/0afe7c5b8833f794f4e4d71964864eeda31a0906"
    },
    {
      "path": ".nojekyll",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": ".travis.yml",
      "mode": "100644",
      "type": "blob",
      "sha": "79d5d01e1bd3ac1e2e548b920c90859ee26cf5b6",
      "size": 337,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/79d5d01e1bd3ac1e2e548b920c90859ee26cf5b6"
    },
    {
      "path": "README.md",
      "mode": "100644",
      "type": "blob",
      "sha": "d8fe5b0573ccab1832d40101372b31c1633af6d8",
      "size": 153,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/d8fe5b0573ccab1832d40101372b31c1633af6d8"
    },
    {
      "path": "_downloads",
      "mode": "040000",
      "type": "tree",
      "sha": "08a42951647aef299e7c6587362b4e154ac55b57",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/08a42951647aef299e7c6587362b4e154ac55b57"
    },
    {
      "path": "_downloads/376fff9bd23db6ea14d201f2479fb500",
      "mode": "040000",
      "type": "tree",
      "sha": "eb7e518eded9c95282497b82bb27ac4bf9cc6b24",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/eb7e518eded9c95282497b82bb27ac4bf9cc6b24"
    },
    {
      "path": "_downloads/376fff9bd23db6ea14d201f2479fb500/HashMap.java",
      "mode": "100644",
      "type": "blob",
      "sha": "f2d1c1f7e0759b29753575395a340ce4f2001cb9",
      "size": 90987,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2d1c1f7e0759b29753575395a340ce4f2001cb9"
    },
    {
      "path": "_downloads/3b9595f7ebd1ba74268e278ba32a6d2d",
      "mode": "040000",
      "type": "tree",
      "sha": "c1699e1fdb3ca93a03ff3cda873dac4760052ca4",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/c1699e1fdb3ca93a03ff3cda873dac4760052ca4"
    },
    {
      "path": "_downloads/3b9595f7ebd1ba74268e278ba32a6d2d/PythonCExtension.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "043e1775df7055a05d025703ef2e6f61e56f309b",
      "size": 281438,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/043e1775df7055a05d025703ef2e6f61e56f309b"
    },
    {
      "path": "_downloads/4a87751efe99b1b8e03b89acd744c96e",
      "mode": "040000",
      "type": "tree",
      "sha": "c1699e1fdb3ca93a03ff3cda873dac4760052ca4",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/c1699e1fdb3ca93a03ff3cda873dac4760052ca4"
    },
    {
      "path": "_downloads/4a87751efe99b1b8e03b89acd744c96e/PythonCExtension.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "043e1775df7055a05d025703ef2e6f61e56f309b",
      "size": 281438,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/043e1775df7055a05d025703ef2e6f61e56f309b"
    },
    {
      "path": "_downloads/5a68946e4061b31b566527c296903ae8",
      "mode": "040000",
      "type": "tree",
      "sha": "750ae599a276488a8049e1b1c6b58a8dc740ec6b",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/750ae599a276488a8049e1b1c6b58a8dc740ec6b"
    },
    {
      "path": "_downloads/5a68946e4061b31b566527c296903ae8/PythonWebCrawler.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "1e6b9f2854a97460ba1d6d22637fce20040ace9e",
      "size": 668713,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/1e6b9f2854a97460ba1d6d22637fce20040ace9e"
    },
    {
      "path": "_downloads/637c7e107529ea218171ad116561d3ee",
      "mode": "040000",
      "type": "tree",
      "sha": "b3fb57f4d4ac71d5e290f4cbe08a2ef63802ae4d",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/b3fb57f4d4ac71d5e290f4cbe08a2ef63802ae4d"
    },
    {
      "path": "_downloads/637c7e107529ea218171ad116561d3ee/b+.ppt",
      "mode": "100644",
      "type": "blob",
      "sha": "f2f2c490a28ee5bd30ef81619c987bfdc6d9b2af",
      "size": 1143808,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2f2c490a28ee5bd30ef81619c987bfdc6d9b2af"
    },
    {
      "path": "_downloads/85bbc05840f6872acd67c93511df2496",
      "mode": "040000",
      "type": "tree",
      "sha": "9125a11a02d8b21972531f3fbebd0a8c3e2355cd",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/9125a11a02d8b21972531f3fbebd0a8c3e2355cd"
    },
    {
      "path": "_downloads/85bbc05840f6872acd67c93511df2496/btree.ppt",
      "mode": "100644",
      "type": "blob",
      "sha": "a377647f542f723b040454ab85c11a6d01d58171",
      "size": 3026944,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/a377647f542f723b040454ab85c11a6d01d58171"
    },
    {
      "path": "_downloads/8825ddd6db8aa8b0c53eb4aa45651d56",
      "mode": "040000",
      "type": "tree",
      "sha": "33e83ace532620f2bd70c9bd9f247b9ac444dd54",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/33e83ace532620f2bd70c9bd9f247b9ac444dd54"
    },
    {
      "path": "_downloads/8825ddd6db8aa8b0c53eb4aa45651d56/정규화참고.pptx",
      "mode": "100644",
      "type": "blob",
      "sha": "f8ca99434fe17ce35dbb19f40434c141bf98185b",
      "size": 2948499,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f8ca99434fe17ce35dbb19f40434c141bf98185b"
    },
    {
      "path": "_downloads/HashMap.java",
      "mode": "100644",
      "type": "blob",
      "sha": "f2d1c1f7e0759b29753575395a340ce4f2001cb9",
      "size": 90987,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2d1c1f7e0759b29753575395a340ce4f2001cb9"
    },
    {
      "path": "_downloads/PythonCExtension.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "043e1775df7055a05d025703ef2e6f61e56f309b",
      "size": 281438,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/043e1775df7055a05d025703ef2e6f61e56f309b"
    },
    {
      "path": "_downloads/PythonWebCrawler.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "1e6b9f2854a97460ba1d6d22637fce20040ace9e",
      "size": 668713,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/1e6b9f2854a97460ba1d6d22637fce20040ace9e"
    },
    {
      "path": "_downloads/b+.ppt",
      "mode": "100644",
      "type": "blob",
      "sha": "f2f2c490a28ee5bd30ef81619c987bfdc6d9b2af",
      "size": 1143808,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2f2c490a28ee5bd30ef81619c987bfdc6d9b2af"
    },
    {
      "path": "_downloads/b6c78c844144c4ecb8435a097cd06fe8",
      "mode": "040000",
      "type": "tree",
      "sha": "33e83ace532620f2bd70c9bd9f247b9ac444dd54",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/33e83ace532620f2bd70c9bd9f247b9ac444dd54"
    },
    {
      "path": "_downloads/b6c78c844144c4ecb8435a097cd06fe8/정규화참고.pptx",
      "mode": "100644",
      "type": "blob",
      "sha": "f8ca99434fe17ce35dbb19f40434c141bf98185b",
      "size": 2948499,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f8ca99434fe17ce35dbb19f40434c141bf98185b"
    },
    {
      "path": "_downloads/ba2925f9dfaf320a90c3aeacbf640ac0",
      "mode": "040000",
      "type": "tree",
      "sha": "9125a11a02d8b21972531f3fbebd0a8c3e2355cd",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/9125a11a02d8b21972531f3fbebd0a8c3e2355cd"
    },
    {
      "path": "_downloads/ba2925f9dfaf320a90c3aeacbf640ac0/btree.ppt",
      "mode": "100644",
      "type": "blob",
      "sha": "a377647f542f723b040454ab85c11a6d01d58171",
      "size": 3026944,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/a377647f542f723b040454ab85c11a6d01d58171"
    },
    {
      "path": "_downloads/btree.ppt",
      "mode": "100644",
      "type": "blob",
      "sha": "a377647f542f723b040454ab85c11a6d01d58171",
      "size": 3026944,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/a377647f542f723b040454ab85c11a6d01d58171"
    },
    {
      "path": "_downloads/c1387b5df4bc00af4a857c3318cb01b0",
      "mode": "040000",
      "type": "tree",
      "sha": "b3fb57f4d4ac71d5e290f4cbe08a2ef63802ae4d",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/b3fb57f4d4ac71d5e290f4cbe08a2ef63802ae4d"
    },
    {
      "path": "_downloads/c1387b5df4bc00af4a857c3318cb01b0/b+.ppt",
      "mode": "100644",
      "type": "blob",
      "sha": "f2f2c490a28ee5bd30ef81619c987bfdc6d9b2af",
      "size": 1143808,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2f2c490a28ee5bd30ef81619c987bfdc6d9b2af"
    },
    {
      "path": "_downloads/ca7075c2a6bc77c735b4459e70769700",
      "mode": "040000",
      "type": "tree",
      "sha": "eb7e518eded9c95282497b82bb27ac4bf9cc6b24",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/eb7e518eded9c95282497b82bb27ac4bf9cc6b24"
    },
    {
      "path": "_downloads/ca7075c2a6bc77c735b4459e70769700/HashMap.java",
      "mode": "100644",
      "type": "blob",
      "sha": "f2d1c1f7e0759b29753575395a340ce4f2001cb9",
      "size": 90987,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2d1c1f7e0759b29753575395a340ce4f2001cb9"
    },
    {
      "path": "_downloads/f73413959063f0008d59694c7814108b",
      "mode": "040000",
      "type": "tree",
      "sha": "750ae599a276488a8049e1b1c6b58a8dc740ec6b",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/750ae599a276488a8049e1b1c6b58a8dc740ec6b"
    },
    {
      "path": "_downloads/f73413959063f0008d59694c7814108b/PythonWebCrawler.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "1e6b9f2854a97460ba1d6d22637fce20040ace9e",
      "size": 668713,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/1e6b9f2854a97460ba1d6d22637fce20040ace9e"
    },
    {
      "path": "_downloads/정규화참고.pptx",
      "mode": "100644",
      "type": "blob",
      "sha": "f8ca99434fe17ce35dbb19f40434c141bf98185b",
      "size": 2948499,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f8ca99434fe17ce35dbb19f40434c141bf98185b"
    },
    {
      "path": "_images",
      "mode": "040000",
      "type": "tree",
      "sha": "b8bcaac16dc2b17fc6c73bbb8dc4676bcf50f36d",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/b8bcaac16dc2b17fc6c73bbb8dc4676bcf50f36d"
    },
    {
      "path": "_images/B-TREE.gif",
      "mode": "100644",
      "type": "blob",
      "sha": "353f849824991c8bc35bbcda7dcdb81743cb8216",
      "size": 10343,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/353f849824991c8bc35bbcda7dcdb81743cb8216"
    },
    {
      "path": "_images/B-TREE2.JPG",
      "mode": "100644",
      "type": "blob",
      "sha": "ca66b801991789320683313195ec730358b4fcc3",
      "size": 58229,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/ca66b801991789320683313195ec730358b4fcc3"
    },
    {
      "path": "_images/SQL_FLOW.JPG",
      "mode": "100644",
      "type": "blob",
      "sha": "4e27ac6d183069c15c43d622290b85b31707cdaf",
      "size": 86919,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/4e27ac6d183069c15c43d622290b85b31707cdaf"
    },
    {
      "path": "_images/aes.jpg",
      "mode": "100644",
      "type": "blob",
      "sha": "75be8506750a45dcfb6a06e743b9a10b56e00415",
      "size": 171853,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/75be8506750a45dcfb6a06e743b9a10b56e00415"
    },
    {
      "path": "_images/ah.jpg",
      "mode": "100644",
      "type": "blob",
      "sha": "d48856ad3b60a30e04df97b1eaf34a3e77487285",
      "size": 16214,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/d48856ad3b60a30e04df97b1eaf34a3e77487285"
    },
   */
  // https://api.github.com/repos/qwefgh90/sphinx/git/trees/af24baf?recursive=1
  tree(login: string, repositoryName: string, sha: string): Promise<any> {
    if (this.hasToken()) {
      const repo = new Github({
        token: this.token()
      });
      let promise: Promise<any> = this.treeRecursive(login, repositoryName, sha);//repo.getRepo(login, repositoryName).getTree(sha);
      return promise.then(result => result);
    } else {
      return Promise.reject();
    }
  }

  private treeRecursive(login: string, repositoryName: string, sha: string) {
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/trees/${sha}?recursive=1`;
    let treeResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` } })
    return treeResponse.toPromise();
  }

  /**
   * 
   * @param login 
   * @param repositoryName 
   * @param sha 
   */
  blob(login: string, repositoryName: string, sha: string): Promise<Blob> {
    if (this.hasToken()) {
      const repo = new Github({
        token: this.token()
      });
      let promise: Promise<any> = this.getBlob(login, repositoryName, sha);
      // let promise: Promise<any> = this.treeRecursive(login, repositoryName, sha);//repo.getRepo(login, repositoryName).getTree(sha);
      return promise.then(result => {
        return result
      })
    } else {
      return Promise.reject();
    }
  }

  
  getBlob(login: string, repositoryName: string, sha: string){
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/blobs/${sha}`;
    let treeResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` } })
    return treeResponse.toPromise();
  }

  /**
   * [
      {
        "name": "master",
        "commit": {
          "sha": "c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
          "url": "https://api.github.com/repos/octocat/Hello-World/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc"
        },
        "protected": true,
        "protection": {
          "enabled": true,
          "required_status_checks": {
            "enforcement_level": "non_admins",
            "contexts": [
              "ci-test",
              "linter"
            ]
          }
        },
        "protection_url": "https://api.github.com/repos/octocat/hello-world/branches/master/protection"
      }
    ]
   */
  branches(login: string, repositoryName: string): Promise<any> {
    if (this.hasToken()) {
      const repo = new Github({
        token: this.token()
      });
      let promise: Promise<any> = repo.getRepo(login, repositoryName).listBranches();
      return promise.then(result => result.data);
    } else {
      return Promise.reject();
    }
  }

  /**
   * {
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
  "site_admin": false,
  "name": "Changwon Choe",
  "company": null,
  "blog": "http://qwefgh90.github.io",
  "location": "Daejeon",
  "email": null,
  "hireable": true,
  "bio": "Java / Scala / Typescript / Web Application Programmer",
  "public_repos": 79,
  "public_gists": 72,
  "followers": 26,
  "following": 14,
  "created_at": "2014-05-13T17:37:30Z",
  "updated_at": "2019-05-03T16:32:28Z"
}
   */
  user(login?: string): Promise<any> {
    if (this.hasToken()) {
      const gh = new Github({
        token: this.token()
      });
      const user = gh.getUser(login);
      return (user.getProfile() as Promise<any>).then(result => result.data);
    } else {
      return Promise.reject();
    }
  }

  private hasToken() {
    return this.oauth.isLogin;
  }

  private token(): string {
    return this.oauth.accessToken;
  }
}
