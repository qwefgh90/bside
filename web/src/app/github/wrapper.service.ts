import { Injectable } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import Github from 'github-api';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Blob } from './type/blob';
import { ngContentDef } from '@angular/core/src/view';
import { Content } from './type/content';
/**
 * A returned data should be stored in each component;
 */
@Injectable({
  providedIn: 'root'
})
export class WrapperService {
  constructor(private oauth: OAuthService, private http: HttpClient) {   }
  /**
   * blobCache contains blobs which associated with urls. blob is a kind of immutable things.
   */
  private blobCache = new Map<string, Blob>();


  
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
  async repositories(login: string): Promise<Array<any>> {
    if (this.hasToken()) {
      const gh = new Github({
        token: this.token()
      });
      let currentUser = await this.user();
      let promise: Promise<any>;
      if(currentUser.login != login){
        const user = gh.getUser(login);
        promise = user.listRepos().then(r => r.data);
      }else{
        promise = this.repositoriesOfCurrentUserWithHttp()
      }
      return promise.then(result => result);
    } else {
      return Promise.reject();
    }
  }

  private repositoriesOfCurrentUserWithHttp() {
    const url = `https://api.github.com/user/repos?per_page=100`;
    let reposResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` } })
    return reposResponse.toPromise();
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
      return this.repository(login, repositoryName);
    } else {
      return Promise.reject();
    }
  }

  repository(login: string, repositoryName: string){
    const url = `https://api.github.com/repos/${login}/${repositoryName}`;
    let reposResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` }});
    return reposResponse.toPromise().then(v => v == undefined ? Promise.reject() : Promise.resolve(v));
  }

  
  /**
   * curl -H "Authorization: token xxxx" https://api.github.com/repos/TaylanTatli/Moon/forks -X POST -i
   * HTTP/1.1 202 Accepted
Date: Tue, 23 Jul 2019 09:00:02 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 16379
Server: GitHub.com
Status: 202 Accepted
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4994
X-RateLimit-Reset: 1563875676
X-OAuth-Scopes: public_repo
X-Accepted-OAuth-Scopes:
X-OAuth-Client-Id: 356859337d4e59d2fca2
X-GitHub-Media-Type: github.v3; format=json
Access-Control-Expose-Headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type
Access-Control-Allow-Origin: *
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
X-Frame-Options: deny
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: origin-when-cross-origin, strict-origin-when-cross-origin
Content-Security-Policy: default-src 'none'
X-GitHub-Request-Id: FF72:4269:4C6E40:5BD85F:5D36CC91

{
  "id": 198392654,
  "node_id": "MDEwOlJlcG9zaXRvcnkxOTgzOTI2NTQ=",
  "name": "Moon",
  "full_name": "qwefgh90/Moon",
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
  "html_url": "https://github.com/qwefgh90/Moon",
  "description": "Moon is a minimal, one column jekyll theme.",
  "fork": true,
  "url": "https://api.github.com/repos/qwefgh90/Moon",
  "forks_url": "https://api.github.com/repos/qwefgh90/Moon/forks",
  "keys_url": "https://api.github.com/repos/qwefgh90/Moon/keys{/key_id}",
  "collaborators_url": "https://api.github.com/repos/qwefgh90/Moon/collaborators{/collaborator}",
  "teams_url": "https://api.github.com/repos/qwefgh90/Moon/teams",
  "hooks_url": "https://api.github.com/repos/qwefgh90/Moon/hooks",
  "issue_events_url": "https://api.github.com/repos/qwefgh90/Moon/issues/events{/number}",
  "events_url": "https://api.github.com/repos/qwefgh90/Moon/events",
  "assignees_url": "https://api.github.com/repos/qwefgh90/Moon/assignees{/user}",
  "branches_url": "https://api.github.com/repos/qwefgh90/Moon/branches{/branch}",
  "tags_url": "https://api.github.com/repos/qwefgh90/Moon/tags",
  "blobs_url": "https://api.github.com/repos/qwefgh90/Moon/git/blobs{/sha}",
  "git_tags_url": "https://api.github.com/repos/qwefgh90/Moon/git/tags{/sha}",
  "git_refs_url": "https://api.github.com/repos/qwefgh90/Moon/git/refs{/sha}",
  "trees_url": "https://api.github.com/repos/qwefgh90/Moon/git/trees{/sha}",
  "statuses_url": "https://api.github.com/repos/qwefgh90/Moon/statuses/{sha}",
  "languages_url": "https://api.github.com/repos/qwefgh90/Moon/languages",
  "stargazers_url": "https://api.github.com/repos/qwefgh90/Moon/stargazers",
  "contributors_url": "https://api.github.com/repos/qwefgh90/Moon/contributors",
  "subscribers_url": "https://api.github.com/repos/qwefgh90/Moon/subscribers",
  "subscription_url": "https://api.github.com/repos/qwefgh90/Moon/subscription",
  "commits_url": "https://api.github.com/repos/qwefgh90/Moon/commits{/sha}",
  "git_commits_url": "https://api.github.com/repos/qwefgh90/Moon/git/commits{/sha}",
  "comments_url": "https://api.github.com/repos/qwefgh90/Moon/comments{/number}",
  "issue_comment_url": "https://api.github.com/repos/qwefgh90/Moon/issues/comments{/number}",
  "contents_url": "https://api.github.com/repos/qwefgh90/Moon/contents/{+path}",
  "compare_url": "https://api.github.com/repos/qwefgh90/Moon/compare/{base}...{head}",
  "merges_url": "https://api.github.com/repos/qwefgh90/Moon/merges",
  "archive_url": "https://api.github.com/repos/qwefgh90/Moon/{archive_format}{/ref}",
  "downloads_url": "https://api.github.com/repos/qwefgh90/Moon/downloads",
  "issues_url": "https://api.github.com/repos/qwefgh90/Moon/issues{/number}",
  "pulls_url": "https://api.github.com/repos/qwefgh90/Moon/pulls{/number}",
  "milestones_url": "https://api.github.com/repos/qwefgh90/Moon/milestones{/number}",
  "notifications_url": "https://api.github.com/repos/qwefgh90/Moon/notifications{?since,all,participating}",
  "labels_url": "https://api.github.com/repos/qwefgh90/Moon/labels{/name}",
  "releases_url": "https://api.github.com/repos/qwefgh90/Moon/releases{/id}",
  "deployments_url": "https://api.github.com/repos/qwefgh90/Moon/deployments",
  "created_at": "2019-07-23T09:00:01Z",
  "updated_at": "2019-07-22T19:47:16Z",
  "pushed_at": "2019-07-21T23:20:28Z",
  "git_url": "git://github.com/qwefgh90/Moon.git",
  "ssh_url": "git@github.com:qwefgh90/Moon.git",
  "clone_url": "https://github.com/qwefgh90/Moon.git",
  "svn_url": "https://github.com/qwefgh90/Moon",
  "homepage": "https://taylantatli.github.io/Moon/",
  "size": 6974,
  "stargazers_count": 0,
  "watchers_count": 0,
  "language": null,
  "has_issues": false,
  "has_projects": true,
  "has_downloads": true,
  "has_wiki": true,
  "has_pages": false,
  "forks_count": 0,
  "mirror_url": null,
  "archived": false,
  "disabled": false,
  "open_issues_count": 0,
  "license": {
    "key": "mit",
    "name": "MIT License",
    "spdx_id": "MIT",
    "url": "https://api.github.com/licenses/mit",
    "node_id": "MDc6TGljZW5zZTEz"
  },
  "forks": 0,
  "open_issues": 0,
  "watchers": 0,
  "default_branch": "master",
  "permissions": {
    "admin": true,
    "push": true,
    "pull": true
  },
  "parent": {
    "id": 56186554,
    "node_id": "MDEwOlJlcG9zaXRvcnk1NjE4NjU1NA==",
    "name": "Moon",
    "full_name": "TaylanTatli/Moon",
    "private": false,
    "owner": {
      "login": "TaylanTatli",
      "id": 754514,
      "node_id": "MDQ6VXNlcjc1NDUxNA==",
      "avatar_url": "https://avatars1.githubusercontent.com/u/754514?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/TaylanTatli",
      "html_url": "https://github.com/TaylanTatli",
      "followers_url": "https://api.github.com/users/TaylanTatli/followers",
      "following_url": "https://api.github.com/users/TaylanTatli/following{/other_user}",
      "gists_url": "https://api.github.com/users/TaylanTatli/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/TaylanTatli/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/TaylanTatli/subscriptions",
      "organizations_url": "https://api.github.com/users/TaylanTatli/orgs",
      "repos_url": "https://api.github.com/users/TaylanTatli/repos",
      "events_url": "https://api.github.com/users/TaylanTatli/events{/privacy}",
      "received_events_url": "https://api.github.com/users/TaylanTatli/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/TaylanTatli/Moon",
    "description": "Moon is a minimal, one column jekyll theme.",
    "fork": false,
    "url": "https://api.github.com/repos/TaylanTatli/Moon",
    "forks_url": "https://api.github.com/repos/TaylanTatli/Moon/forks",
    "keys_url": "https://api.github.com/repos/TaylanTatli/Moon/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/TaylanTatli/Moon/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/TaylanTatli/Moon/teams",
    "hooks_url": "https://api.github.com/repos/TaylanTatli/Moon/hooks",
    "issue_events_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/events{/number}",
    "events_url": "https://api.github.com/repos/TaylanTatli/Moon/events",
    "assignees_url": "https://api.github.com/repos/TaylanTatli/Moon/assignees{/user}",
    "branches_url": "https://api.github.com/repos/TaylanTatli/Moon/branches{/branch}",
    "tags_url": "https://api.github.com/repos/TaylanTatli/Moon/tags",
    "blobs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/TaylanTatli/Moon/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/TaylanTatli/Moon/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/TaylanTatli/Moon/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/TaylanTatli/Moon/languages",
    "stargazers_url": "https://api.github.com/repos/TaylanTatli/Moon/stargazers",
    "contributors_url": "https://api.github.com/repos/TaylanTatli/Moon/contributors",
    "subscribers_url": "https://api.github.com/repos/TaylanTatli/Moon/subscribers",
    "subscription_url": "https://api.github.com/repos/TaylanTatli/Moon/subscription",
    "commits_url": "https://api.github.com/repos/TaylanTatli/Moon/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/TaylanTatli/Moon/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/TaylanTatli/Moon/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/TaylanTatli/Moon/contents/{+path}",
    "compare_url": "https://api.github.com/repos/TaylanTatli/Moon/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/TaylanTatli/Moon/merges",
    "archive_url": "https://api.github.com/repos/TaylanTatli/Moon/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/TaylanTatli/Moon/downloads",
    "issues_url": "https://api.github.com/repos/TaylanTatli/Moon/issues{/number}",
    "pulls_url": "https://api.github.com/repos/TaylanTatli/Moon/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/TaylanTatli/Moon/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/TaylanTatli/Moon/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/TaylanTatli/Moon/labels{/name}",
    "releases_url": "https://api.github.com/repos/TaylanTatli/Moon/releases{/id}",
    "deployments_url": "https://api.github.com/repos/TaylanTatli/Moon/deployments",
    "created_at": "2016-04-13T21:13:26Z",
    "updated_at": "2019-07-22T19:47:16Z",
    "pushed_at": "2019-07-21T23:20:28Z",
    "git_url": "git://github.com/TaylanTatli/Moon.git",
    "ssh_url": "git@github.com:TaylanTatli/Moon.git",
    "clone_url": "https://github.com/TaylanTatli/Moon.git",
    "svn_url": "https://github.com/TaylanTatli/Moon",
    "homepage": "https://taylantatli.github.io/Moon/",
    "size": 6974,
    "stargazers_count": 1743,
    "watchers_count": 1743,
    "language": "HTML",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": true,
    "forks_count": 1690,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 71,
    "license": {
      "key": "mit",
      "name": "MIT License",
      "spdx_id": "MIT",
      "url": "https://api.github.com/licenses/mit",
      "node_id": "MDc6TGljZW5zZTEz"
    },
    "forks": 1690,
    "open_issues": 71,
    "watchers": 1743,
    "default_branch": "master"
  },
  "source": {
    "id": 56186554,
    "node_id": "MDEwOlJlcG9zaXRvcnk1NjE4NjU1NA==",
    "name": "Moon",
    "full_name": "TaylanTatli/Moon",
    "private": false,
    "owner": {
      "login": "TaylanTatli",
      "id": 754514,
      "node_id": "MDQ6VXNlcjc1NDUxNA==",
      "avatar_url": "https://avatars1.githubusercontent.com/u/754514?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/TaylanTatli",
      "html_url": "https://github.com/TaylanTatli",
      "followers_url": "https://api.github.com/users/TaylanTatli/followers",
      "following_url": "https://api.github.com/users/TaylanTatli/following{/other_user}",
      "gists_url": "https://api.github.com/users/TaylanTatli/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/TaylanTatli/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/TaylanTatli/subscriptions",
      "organizations_url": "https://api.github.com/users/TaylanTatli/orgs",
      "repos_url": "https://api.github.com/users/TaylanTatli/repos",
      "events_url": "https://api.github.com/users/TaylanTatli/events{/privacy}",
      "received_events_url": "https://api.github.com/users/TaylanTatli/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/TaylanTatli/Moon",
    "description": "Moon is a minimal, one column jekyll theme.",
    "fork": false,
    "url": "https://api.github.com/repos/TaylanTatli/Moon",
    "forks_url": "https://api.github.com/repos/TaylanTatli/Moon/forks",
    "keys_url": "https://api.github.com/repos/TaylanTatli/Moon/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/TaylanTatli/Moon/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/TaylanTatli/Moon/teams",
    "hooks_url": "https://api.github.com/repos/TaylanTatli/Moon/hooks",
    "issue_events_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/events{/number}",
    "events_url": "https://api.github.com/repos/TaylanTatli/Moon/events",
    "assignees_url": "https://api.github.com/repos/TaylanTatli/Moon/assignees{/user}",
    "branches_url": "https://api.github.com/repos/TaylanTatli/Moon/branches{/branch}",
    "tags_url": "https://api.github.com/repos/TaylanTatli/Moon/tags",
    "blobs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/TaylanTatli/Moon/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/TaylanTatli/Moon/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/TaylanTatli/Moon/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/TaylanTatli/Moon/languages",
    "stargazers_url": "https://api.github.com/repos/TaylanTatli/Moon/stargazers",
    "contributors_url": "https://api.github.com/repos/TaylanTatli/Moon/contributors",
    "subscribers_url": "https://api.github.com/repos/TaylanTatli/Moon/subscribers",
    "subscription_url": "https://api.github.com/repos/TaylanTatli/Moon/subscription",
    "commits_url": "https://api.github.com/repos/TaylanTatli/Moon/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/TaylanTatli/Moon/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/TaylanTatli/Moon/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/TaylanTatli/Moon/contents/{+path}",
    "compare_url": "https://api.github.com/repos/TaylanTatli/Moon/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/TaylanTatli/Moon/merges",
    "archive_url": "https://api.github.com/repos/TaylanTatli/Moon/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/TaylanTatli/Moon/downloads",
    "issues_url": "https://api.github.com/repos/TaylanTatli/Moon/issues{/number}",
    "pulls_url": "https://api.github.com/repos/TaylanTatli/Moon/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/TaylanTatli/Moon/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/TaylanTatli/Moon/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/TaylanTatli/Moon/labels{/name}",
    "releases_url": "https://api.github.com/repos/TaylanTatli/Moon/releases{/id}",
    "deployments_url": "https://api.github.com/repos/TaylanTatli/Moon/deployments",
    "created_at": "2016-04-13T21:13:26Z",
    "updated_at": "2019-07-22T19:47:16Z",
100 16379  100 16379    0     0   8318      0  0:00:01  0:00:01 --:--:--  8318"2019-07-21T23:20:28Z",
    "git_url": "git://github.com/TaylanTatli/Moon.git",
    "ssh_url": "git@github.com:TaylanTatli/Moon.git",
    "clone_url": "https://github.com/TaylanTatli/Moon.git",
    "svn_url": "https://github.com/TaylanTatli/Moon",
    "homepage": "https://taylantatli.github.io/Moon/",
    "size": 6974,
    "stargazers_count": 1743,
    "watchers_count": 1743,
    "language": "HTML",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": true,
    "forks_count": 1690,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 71,
    "license": {
      "key": "mit",
      "name": "MIT License",
      "spdx_id": "MIT",
      "url": "https://api.github.com/licenses/mit",
      "node_id": "MDc6TGljZW5zZTEz"
    },
    "forks": 1690,
    "open_issues": 71,
    "watchers": 1743,
    "default_branch": "master"
  },
  "network_count": 1690,
  "subscribers_count": 0
}

   */
  fork(owner: string, repositoryName: string) {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/forks`;
    let reposResponse = this.http.post<any>(url, null, { headers: { Authorization: `token ${this.token()}` } })
    return reposResponse.toPromise();
  }

  forkList(owner: string, repositoryName: string) {
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/forks?sort=newest`;
    let reposResponse = this.http.get<any[]>(url, { headers: { Authorization: `token ${this.token()}` } })
    return reposResponse.toPromise();
  }

  /**
   *  This is a test api.
      curl \
      -H "Authorization: Token " \
      -H "Content-Type:application/json" \
      -H "Accept: application/vnd.github.mister-fantastic-preview+json" \
      -X POST  \
      https://api.github.com/repos/qwefgh90/asdf/pages/builds -i
      
      {
        "status": "queued",
        "url": "https://api.github.com/repositories/198784207/pages/builds/latest"
      }

   */
  buildPage(owner: string, repositoryName: string){
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pages/builds`;
    let reposResponse = this.http.post<any>(url, null, { headers: { Authorization: `token ${this.token()}`, Accept: 'application/vnd.github.mister-fantastic-preview+json' } })
    return reposResponse.toPromise();
  }

  /**
   * 
    [
      {
        "url": "https://api.github.com/repos/qwefgh90/online-cv/pages/builds/138740078",
        "status": "built",
        "error": {
          "message": null
        },
        "pusher": {
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
        "commit": "b91225665c76da2964bf48521f6ea70e6db884b6",
        "duration": 13869,
        "created_at": "2019-07-26T07:09:15Z",
        "updated_at": "2019-07-26T07:09:28Z"
      }
    ]

   * @param owner 
   * @param repositoryName 
   */
  buildStatus(owner: string, repositoryName: string): Promise<any[]>{
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pages/builds`;
    let reposResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}`, Accept: 'application/vnd.github.mister-fantastic-preview+json' } })
    return reposResponse.toPromise();
  }

  createPageBranch(owner: string, repositoryName: string, branch: string){
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pages`;
    let data = {source: {branch: branch}}
    let reposResponse = this.http.post<any>(url, data, { headers: { Authorization: `token ${this.token()}`, Accept: 'application/vnd.github.switcheroo-preview+json' } })
    return reposResponse.toPromise();
  }

  updatePageBranch(owner: string, repositoryName: string, branch: string){
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pages`;
    let data = {source: branch};
    let reposResponse = this.http.put<any>(url, data, { headers: { Authorization: `token ${this.token()}`, Accept: 'application/vnd.github.mister-fantastic-preview+json' } })
    return reposResponse.toPromise();
  }
  /**
   * {
        "url": "https://api.github.com/repos/github/developer.github.com/pages",
        "status": "built",
        "cname": "developer.github.com",
        "custom_404": false,
        "html_url": "https://developer.github.com",
        "source": {
          "branch": "master",
          "directory": "/"
        }
      }
   * @param owner 
   * @param repositoryName 
   */
  async getPageBranch(owner: string, repositoryName: string){
    const url = `https://api.github.com/repos/${owner}/${repositoryName}/pages`;
    let reposResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}`, Accept: 'application/vnd.github.mister-fantastic-preview+json' } })
    return reposResponse.toPromise();
  }
  /**
   * curl \
    -H "Authorization: Token " \
    -H "Content-Type:application/json" \
    -H "Accept: application/json" \
    -X PATCH \
    --data '{ "name": "Moon2" }' \
    https://api.github.com/repos/qwefgh90/Moon
    HTTP/1.1 200 OK
    Date: Wed, 24 Jul 2019 06:05:18 GMT
    Content-Type: application/json; charset=utf-8
    Content-Length: 16514
    Server: GitHub.com
    Status: 200 OK
    X-RateLimit-Limit: 5000
    X-RateLimit-Remaining: 4961
    X-RateLimit-Reset: 1563951918
    Cache-Control: private, max-age=60, s-maxage=60
    Vary: Accept, Authorization, Cookie, X-GitHub-OTP
    ETag: "58ce3d59329c06400b079b60be80969b"
    X-OAuth-Scopes: public_repo
    X-Accepted-OAuth-Scopes:
    X-OAuth-Client-Id: 356859337d4e59d2fca2
    X-GitHub-Media-Type: github.v3
    Access-Control-Expose-Headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type
    Access-Control-Allow-Origin: *
    Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
    X-Frame-Options: deny
    X-Content-Type-Options: nosniff
    X-XSS-Protection: 1; mode=block
    Referrer-Policy: origin-when-cross-origin, strict-origin-when-cross-origin
    Content-Security-Policy: default-src 'none'
    Vary: Accept-Encoding
    X-GitHub-Request-Id: C781:84D2:238CEA:2A816A:5D37F51E

    {
      "id": 198392654,
      "node_id": "MDEwOlJlcG9zaXRvcnkxOTgzOTI2NTQ=",
      "name": "Moon3",
      "full_name": "qwefgh90/Moon3",
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
      "html_url": "https://github.com/qwefgh90/Moon3",
      "description": "Moon is a minimal, one column jekyll theme.",
      "fork": true,
      "url": "https://api.github.com/repos/qwefgh90/Moon3",
      "forks_url": "https://api.github.com/repos/qwefgh90/Moon3/forks",
      "keys_url": "https://api.github.com/repos/qwefgh90/Moon3/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/qwefgh90/Moon3/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/qwefgh90/Moon3/teams",
      "hooks_url": "https://api.github.com/repos/qwefgh90/Moon3/hooks",
      "issue_events_url": "https://api.github.com/repos/qwefgh90/Moon3/issues/events{/number}",
      "events_url": "https://api.github.com/repos/qwefgh90/Moon3/events",
      "assignees_url": "https://api.github.com/repos/qwefgh90/Moon3/assignees{/user}",
      "branches_url": "https://api.github.com/repos/qwefgh90/Moon3/branches{/branch}",
      "tags_url": "https://api.github.com/repos/qwefgh90/Moon3/tags",
      "blobs_url": "https://api.github.com/repos/qwefgh90/Moon3/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/qwefgh90/Moon3/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/qwefgh90/Moon3/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/qwefgh90/Moon3/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/qwefgh90/Moon3/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/qwefgh90/Moon3/languages",
      "stargazers_url": "https://api.github.com/repos/qwefgh90/Moon3/stargazers",
      "contributors_url": "https://api.github.com/repos/qwefgh90/Moon3/contributors",
      "subscribers_url": "https://api.github.com/repos/qwefgh90/Moon3/subscribers",
      "subscription_url": "https://api.github.com/repos/qwefgh90/Moon3/subscription",
      "commits_url": "https://api.github.com/repos/qwefgh90/Moon3/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/qwefgh90/Moon3/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/qwefgh90/Moon3/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/qwefgh90/Moon3/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/qwefgh90/Moon3/contents/{+path}",
      "compare_url": "https://api.github.com/repos/qwefgh90/Moon3/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/qwefgh90/Moon3/merges",
      "archive_url": "https://api.github.com/repos/qwefgh90/Moon3/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/qwefgh90/Moon3/downloads",
      "issues_url": "https://api.github.com/repos/qwefgh90/Moon3/issues{/number}",
      "pulls_url": "https://api.github.com/repos/qwefgh90/Moon3/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/qwefgh90/Moon3/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/qwefgh90/Moon3/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/qwefgh90/Moon3/labels{/name}",
      "releases_url": "https://api.github.com/repos/qwefgh90/Moon3/releases{/id}",
      "deployments_url": "https://api.github.com/repos/qwefgh90/Moon3/deployments",
      "created_at": "2019-07-23T09:00:01Z",
      "updated_at": "2019-07-24T06:02:32Z",
      "pushed_at": "2019-07-21T23:20:28Z",
      "git_url": "git://github.com/qwefgh90/Moon3.git",
      "ssh_url": "git@github.com:qwefgh90/Moon3.git",
      "clone_url": "https://github.com/qwefgh90/Moon3.git",
      "svn_url": "https://github.com/qwefgh90/Moon3",
      "homepage": "https://taylantatli.github.io/Moon/",
      "size": 6974,
      "stargazers_count": 0,
      "watchers_count": 0,
      "language": "HTML",
      "has_issues": false,
      "has_projects": true,
      "has_downloads": true,
      "has_wiki": true,
      "has_pages": true,
      "forks_count": 0,
      "mirror_url": null,
      "archived": false,
      "disabled": false,
      "open_issues_count": 0,
      "license": {
        "key": "mit",
        "name": "MIT License",
        "spdx_id": "MIT",
        "url": "https://api.github.com/licenses/mit",
        "node_id": "MDc6TGljZW5zZTEz"
      },
      "forks": 0,
      "open_issues": 0,
      "watchers": 0,
      "default_branch": "master",
      "permissions": {
        "admin": true,
        "push": true,
        "pull": true
      },
      "allow_squash_merge": true,
      "allow_merge_commit": true,
      "allow_rebase_merge": true,
      "parent": {
        "id": 56186554,
        "node_id": "MDEwOlJlcG9zaXRvcnk1NjE4NjU1NA==",
        "name": "Moon",
        "full_name": "TaylanTatli/Moon",
        "private": false,
        "owner": {
          "login": "TaylanTatli",
          "id": 754514,
          "node_id": "MDQ6VXNlcjc1NDUxNA==",
          "avatar_url": "https://avatars1.githubusercontent.com/u/754514?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/TaylanTatli",
          "html_url": "https://github.com/TaylanTatli",
          "followers_url": "https://api.github.com/users/TaylanTatli/followers",
          "following_url": "https://api.github.com/users/TaylanTatli/following{/other_user}",
          "gists_url": "https://api.github.com/users/TaylanTatli/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/TaylanTatli/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/TaylanTatli/subscriptions",
          "organizations_url": "https://api.github.com/users/TaylanTatli/orgs",
          "repos_url": "https://api.github.com/users/TaylanTatli/repos",
          "events_url": "https://api.github.com/users/TaylanTatli/events{/privacy}",
          "received_events_url": "https://api.github.com/users/TaylanTatli/received_events",
          "type": "User",
          "site_admin": false
        },
        "html_url": "https://github.com/TaylanTatli/Moon",
        "description": "Moon is a minimal, one column jekyll theme.",
        "fork": false,
        "url": "https://api.github.com/repos/TaylanTatli/Moon",
        "forks_url": "https://api.github.com/repos/TaylanTatli/Moon/forks",
        "keys_url": "https://api.github.com/repos/TaylanTatli/Moon/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/TaylanTatli/Moon/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/TaylanTatli/Moon/teams",
        "hooks_url": "https://api.github.com/repos/TaylanTatli/Moon/hooks",
        "issue_events_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/events{/number}",
        "events_url": "https://api.github.com/repos/TaylanTatli/Moon/events",
        "assignees_url": "https://api.github.com/repos/TaylanTatli/Moon/assignees{/user}",
        "branches_url": "https://api.github.com/repos/TaylanTatli/Moon/branches{/branch}",
        "tags_url": "https://api.github.com/repos/TaylanTatli/Moon/tags",
        "blobs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/TaylanTatli/Moon/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/TaylanTatli/Moon/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/TaylanTatli/Moon/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/TaylanTatli/Moon/languages",
        "stargazers_url": "https://api.github.com/repos/TaylanTatli/Moon/stargazers",
        "contributors_url": "https://api.github.com/repos/TaylanTatli/Moon/contributors",
        "subscribers_url": "https://api.github.com/repos/TaylanTatli/Moon/subscribers",
        "subscription_url": "https://api.github.com/repos/TaylanTatli/Moon/subscription",
        "commits_url": "https://api.github.com/repos/TaylanTatli/Moon/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/TaylanTatli/Moon/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/TaylanTatli/Moon/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/TaylanTatli/Moon/contents/{+path}",
        "compare_url": "https://api.github.com/repos/TaylanTatli/Moon/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/TaylanTatli/Moon/merges",
        "archive_url": "https://api.github.com/repos/TaylanTatli/Moon/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/TaylanTatli/Moon/downloads",
        "issues_url": "https://api.github.com/repos/TaylanTatli/Moon/issues{/number}",
        "pulls_url": "https://api.github.com/repos/TaylanTatli/Moon/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/TaylanTatli/Moon/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/TaylanTatli/Moon/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/TaylanTatli/Moon/labels{/name}",
        "releases_url": "https://api.github.com/repos/TaylanTatli/Moon/releases{/id}",
        "deployments_url": "https://api.github.com/repos/TaylanTatli/Moon/deployments",
        "created_at": "2016-04-13T21:13:26Z",
        "updated_at": "2019-07-24T05:39:05Z",
        "pushed_at": "2019-07-21T23:20:28Z",
        "git_url": "git://github.com/TaylanTatli/Moon.git",
        "ssh_url": "git@github.com:TaylanTatli/Moon.git",
        "clone_url": "https://github.com/TaylanTatli/Moon.git",
        "svn_url": "https://github.com/TaylanTatli/Moon",
        "homepage": "https://taylantatli.github.io/Moon/",
        "size": 6974,
        "stargazers_count": 1745,
        "watchers_count": 1745,
        "language": "HTML",
        "has_issues": true,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": true,
        "forks_count": 1691,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 71,
        "license": {
          "key": "mit",
          "name": "MIT License",
          "spdx_id": "MIT",
          "url": "https://api.github.com/licenses/mit",
          "node_id": "MDc6TGljZW5zZTEz"
        },
        "forks": 1691,
        "open_issues": 71,
        "watchers": 1745,
        "default_branch": "master"
      },
      "source": {
        "id": 56186554,
        "node_id": "MDEwOlJlcG9zaXRvcnk1NjE4NjU1NA==",
        "name": "Moon",
        "full_name": "TaylanTatli/Moon",
        "private": false,
        "owner": {
          "login": "TaylanTatli",
          "id": 754514,
          "node_id": "MDQ6VXNlcjc1NDUxNA==",
          "avatar_url": "https://avatars1.githubusercontent.com/u/754514?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/TaylanTatli",
          "html_url": "https://github.com/TaylanTatli",
          "followers_url": "https://api.github.com/users/TaylanTatli/followers",
          "following_url": "https://api.github.com/users/TaylanTatli/following{/other_user}",
          "gists_url": "https://api.github.com/users/TaylanTatli/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/TaylanTatli/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/TaylanTatli/subscriptions",
          "organizations_url": "https://api.github.com/users/TaylanTatli/orgs",
          "repos_url": "https://api.github.com/users/TaylanTatli/repos",
          "events_url": "https://api.github.com/users/TaylanTatli/events{/privacy}",
          "received_events_url": "https://api.github.com/users/TaylanTatli/received_events",
          "type": "User",
          "site_admin": false
        },
        "html_url": "https://github.com/TaylanTatli/Moon",
        "description": "Moon is a minimal, one column jekyll theme.",
        "fork": false,
        "url": "https://api.github.com/repos/TaylanTatli/Moon",
        "forks_url": "https://api.github.com/repos/TaylanTatli/Moon/forks",
        "keys_url": "https://api.github.com/repos/TaylanTatli/Moon/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/TaylanTatli/Moon/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/TaylanTatli/Moon/teams",
        "hooks_url": "https://api.github.com/repos/TaylanTatli/Moon/hooks",
        "issue_events_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/events{/number}",
        "events_url": "https://api.github.com/repos/TaylanTatli/Moon/events",
        "assignees_url": "https://api.github.com/repos/TaylanTatli/Moon/assignees{/user}",
        "branches_url": "https://api.github.com/repos/TaylanTatli/Moon/branches{/branch}",
        "tags_url": "https://api.github.com/repos/TaylanTatli/Moon/tags",
        "blobs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/TaylanTatli/Moon/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/TaylanTatli/Moon/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/TaylanTatli/Moon/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/TaylanTatli/Moon/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/TaylanTatli/Moon/languages",
        "stargazers_url": "https://api.github.com/repos/TaylanTatli/Moon/stargazers",
        "contributors_url": "https://api.github.com/repos/TaylanTatli/Moon/contributors",
        "subscribers_url": "https://api.github.com/repos/TaylanTatli/Moon/subscribers",
        "subscription_url": "https://api.github.com/repos/TaylanTatli/Moon/subscription",
        "commits_url": "https://api.github.com/repos/TaylanTatli/Moon/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/TaylanTatli/Moon/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/TaylanTatli/Moon/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/TaylanTatli/Moon/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/TaylanTatli/Moon/contents/{+path}",
        "compare_url": "https://api.github.com/repos/TaylanTatli/Moon/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/TaylanTatli/Moon/merges",
        "archive_url": "https://api.github.com/repos/TaylanTatli/Moon/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/TaylanTatli/Moon/downloads",
        "issues_url": "https://api.github.com/repos/TaylanTatli/Moon/issues{/number}",
        "pulls_url": "https://api.github.com/repos/TaylanTatli/Moon/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/TaylanTatli/Moon/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/TaylanTatli/Moon/notifications{?since,all,participating}",
    100 16533  100 16514  100    19  17605     20 --:--:-- --:--:-- --:--:-- 17625ame}",
        "releases_url": "https://api.github.com/repos/TaylanTatli/Moon/releases{/id}",
        "deployments_url": "https://api.github.com/repos/TaylanTatli/Moon/deployments",
        "created_at": "2016-04-13T21:13:26Z",
        "updated_at": "2019-07-24T05:39:05Z",
        "pushed_at": "2019-07-21T23:20:28Z",
        "git_url": "git://github.com/TaylanTatli/Moon.git",
        "ssh_url": "git@github.com:TaylanTatli/Moon.git",
        "clone_url": "https://github.com/TaylanTatli/Moon.git",
        "svn_url": "https://github.com/TaylanTatli/Moon",
        "homepage": "https://taylantatli.github.io/Moon/",
        "size": 6974,
        "stargazers_count": 1745,
        "watchers_count": 1745,
        "language": "HTML",
        "has_issues": true,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": true,
        "forks_count": 1691,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 71,
        "license": {
          "key": "mit",
          "name": "MIT License",
          "spdx_id": "MIT",
          "url": "https://api.github.com/licenses/mit",
          "node_id": "MDc6TGljZW5zZTEz"
        },
        "forks": 1691,
        "open_issues": 71,
        "watchers": 1745,
        "default_branch": "master"
      },
      "network_count": 1691,
      "subscribers_count": 0
    }

   * @param owner 
   * @param oldName 
   * @param newName 
   */
  rename(owner: string, oldName: string, newName: string){
    const url = `https://api.github.com/repos/${owner}/${oldName}`;
    let data = {name: newName};
    let reposResponse = this.http.patch<any>(url, data, { headers: { Authorization: `token ${this.token()}` } })
    return reposResponse.toPromise();
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
      let promise: Promise<any> = this.getBlob(login, repositoryName, sha)
      // let promise: Promise<any> = this.treeRecursive(login, repositoryName, sha);//repo.getRepo(login, repositoryName).getTree(sha);
      return promise.then(result => {
        return result
      })
    } else {
      return Promise.reject();
    }
  }

  /**
   * curl -H "Authorization: token oauthtoken" https://api.github.com/repos/qwefgh90/test/git/blobs -X POST -d '{"content": "SGVsbG8=", "encoding": "base64"}'
    {
    "sha": "5ab2f8a4323abafb10abb68657d9d39f1a775057",
    "url": "https://api.github.com/repos/qwefgh90/test/git/blobs/5ab2f8a4323abafb10abb68657d9d39f1a775057"
    }
   */
  createBlob(login: string, repositoryName: string, contentAsBase64: string){
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/blobs`;
    const data = {"content": contentAsBase64, "encoding": "base64"};
    let treeResponse = this.http.post<{sha: string, url: string}>(url, data, { headers: { Authorization: `token ${this.token()}` } })
    return treeResponse.toPromise();
  }
  
  getBlob(login: string, repositoryName: string, sha: string){
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/blobs/${sha}`;
    if (this.blobCache.has(url))
      return Promise.resolve(this.blobCache.get(url));
    else {
      let treeResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` } })
      return treeResponse.toPromise().then((b: Blob) => {
        this.blobCache.set(url, b);
        return b;
      }, reason => {
        return Promise.reject(reason);
      });
    }
  }

  /**
   * 
   * curl -i -H "Authorization: token oauthtoken" 
      -d '{ "base_tree": "90c0ea2ac21d52e9164f8b57a68768cd6d9290b8", "tree" : [ { "path": "src/hello3.java", "mode": "100644", "type": "blob", "sha": "5ab2f8a4323abafb10abb68657d9d39f1a775057" } ] }' 
      https://api.github.com/repos/qwefgh90/test/git/trees
      {
        "sha": "312260ddb183ab19a719856ecb6719098a304a6c",
        "url": "https://api.github.com/repos/qwefgh90/test/git/trees/312260ddb183ab19a719856ecb6719098a304a6c",
        "tree": [
          {
            "path": "newfolder",
            "mode": "040000",
            "type": "tree",
            "sha": "1b05319144c206e70279a21c4a4e656d1c28b297",
            "url": "https://api.github.com/repos/qwefgh90/test/git/trees/1b05319144c206e70279a21c4a4e656d1c28b297"
          },
          {
            "path": "src",
            "mode": "040000",
            "type": "tree",
            "sha": "37321d9eb287bf0b92e390cdaf2d8e1b83a28904",
            "url": "https://api.github.com/repos/qwefgh90/test/git/trees/37321d9eb287bf0b92e390cdaf2d8e1b83a28904"
          }
        ],
        "truncated": false
      }
   */

  createTree(login: string, repositoryName: string, arr: Array<{path: string, mode: string, type: string, sha: string}>){
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/trees`;
    const data = {"tree": arr.map(b => {return {path: b.path, mode: b.mode, type: b.type, sha: b.sha}})};
    let treeResponse = this.http.post<{sha: string, url: string, tree: Array<any>}>(url, data, { headers: { Authorization: `token ${this.token()}` } })
    return treeResponse.toPromise();
  }

  /**
   * curl -i -H "Authorization: token oauthtoken" 
    -d '{"message": "commit with Github API", "tree":"6438db5869959ae5c4a5a748d84ab2b48d9628da", "parents": ["90c0ea2ac21d52e9164f8b57a68768cd6d9290b8"] }' 
    https://api.github.com/repos/qwefgh90/test/git/commits

    {
    "sha": "716013e99784592167c4fc153fa74b2a96f08401",
    "node_id": "MDY6Q29tbWl0ODIzOTM2MjM6NzE2MDEzZTk5Nzg0NTkyMTY3YzRmYzE1M2ZhNzRiMmE5NmYwODQwMQ==",
    "url": "https://api.github.com/repos/qwefgh90/test/git/commits/716013e99784592167c4fc153fa74b2a96f08401",
    "html_url": "qwefgh90/test@716013e",
    "author": {
    "name": "Changwon Choe",
    "email": "qwefgh90@naver.com",
    "date": "2019-05-19T16:08:19Z"
    },
    "committer": {
    "name": "Changwon Choe",
    "email": "qwefgh90@naver.com",
    "date": "2019-05-19T16:08:19Z"
    },
    "tree": {
    "sha": "6438db5869959ae5c4a5a748d84ab2b48d9628da",
    "url": "https://api.github.com/repos/qwefgh90/test/git/trees/6438db5869959ae5c4a5a748d84ab2b48d9628da"
    },
    "message": "commit with Github API",
    "parents": [
    {
    "sha": "90c0ea2ac21d52e9164f8b57a68768cd6d9290b8",
    "url": "https://api.github.com/repos/qwefgh90/test/git/commits/90c0ea2ac21d52e9164f8b57a68768cd6d9290b8",
    "html_url": "https://github.com/qwefgh90/test/commit/90c0ea2ac21d52e9164f8b57a68768cd6d9290b8"
    }
    ],
    "verification": {
    "verified": false,
    "reason": "unsigned",
    "signature": null,
    "payload": null
    }
    }
   */
  createCommit(login: string, repositoryName: string, commitMsg: string, treeSha: string, parentCommitSha: string){
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/commits`;
    const data = {"message": commitMsg, "tree":treeSha, "parents": [parentCommitSha] }
    let treeResponse = this.http.post<any>(url, data, { headers: { Authorization: `token ${this.token()}` } })
    return treeResponse.toPromise();
  }

  /**
   * 
    curl -i -H "Authorization: token oauthtoken" -X PATCH 
    -d '{"sha":"716013e99784592167c4fc153fa74b2a96f08401" }' 
    https://api.github.com/repos/qwefgh90/test/git/refs/heads/master

    {
    "ref": "refs/heads/master",
    "node_id": "MDM6UmVmODIzOTM2MjM6bWFzdGVy",
    "url": "https://api.github.com/repos/qwefgh90/test/git/refs/heads/master",
    "object": {
      "sha": "716013e99784592167c4fc153fa74b2a96f08401",
      "type": "commit",
      "url": "https://api.github.com/repos/qwefgh90/test/git/commits/716013e99784592167c4fc153fa74b2a96f08401"
    }
    }
   */
  updateBranch(login: string, repositoryName: string, branch: string, commitSha: string){
    const url = `https://api.github.com/repos/${login}/${repositoryName}/git/refs/heads/${branch}`;
    const data = {"sha": commitSha }
    let treeResponse = this.http.post<{
      ref: string
      ,node_id: string
      ,url: string
      ,object: {
        sha: string
        ,type: string
        ,url: string
      }
    }>(url, data, { headers: { Authorization: `token ${this.token()}` } })
    return treeResponse.toPromise();
  }

  /**
   * {
  "type": "file",
  "encoding": "base64",
  "size": 5362,
  "name": "README.md",
  "path": "README.md",
  "content": "encoded content ...",
  "sha": "3d21ec53a331a6f037a91c368710b99387d012c1",
  "url": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
  "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
  "html_url": "https://github.com/octokit/octokit.rb/blob/master/README.md",
  "download_url": "https://raw.githubusercontent.com/octokit/octokit.rb/master/README.md",
  "_links": {
    "git": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
    "self": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
    "html": "https://github.com/octokit/octokit.rb/blob/master/README.md"
  }
}



[
  {
    "type": "file",
    "size": 625,
    "name": "octokit.rb",
    "path": "lib/octokit.rb",
    "sha": "fff6fe3a23bf1c8ea0692b4a883af99bee26fd3b",
    "url": "https://api.github.com/repos/octokit/octokit.rb/contents/lib/octokit.rb",
    "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/fff6fe3a23bf1c8ea0692b4a883af99bee26fd3b",
    "html_url": "https://github.com/octokit/octokit.rb/blob/master/lib/octokit.rb",
    "download_url": "https://raw.githubusercontent.com/octokit/octokit.rb/master/lib/octokit.rb",
    "_links": {
      "self": "https://api.github.com/repos/octokit/octokit.rb/contents/lib/octokit.rb",
      "git": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/fff6fe3a23bf1c8ea0692b4a883af99bee26fd3b",
      "html": "https://github.com/octokit/octokit.rb/blob/master/lib/octokit.rb"
    }
  },
  {
    "type": "dir",
    "size": 0,
    "name": "octokit",
    "path": "lib/octokit",
    "sha": "a84d88e7554fc1fa21bcbc4efae3c782a70d2b9d",
    "url": "https://api.github.com/repos/octokit/octokit.rb/contents/lib/octokit",
    "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/trees/a84d88e7554fc1fa21bcbc4efae3c782a70d2b9d",
    "html_url": "https://github.com/octokit/octokit.rb/tree/master/lib/octokit",
    "download_url": null,
    "_links": {
      "self": "https://api.github.com/repos/octokit/octokit.rb/contents/lib/octokit",
      "git": "https://api.github.com/repos/octokit/octokit.rb/git/trees/a84d88e7554fc1fa21bcbc4efae3c782a70d2b9d",
      "html": "https://github.com/octokit/octokit.rb/tree/master/lib/octokit"
    }
  }
]
   */
  async getContents(login: string, repositoryName: string, commitSha: string, path: string): Promise<Content> {
    if (this.hasToken()) {
      const github = new Github({
        token: this.token()
      });
      let content = (await github.getRepo(login, repositoryName).getContents(commitSha, path, false));
      if (content.data != undefined) {
        let c: Promise<Content> = this.getBlob(login, repositoryName, content.data.sha).then(b => {
          content.data.content = b.content; // assign correct blob
          content.data.blob = b;
          return content.data;
        });
        return c;
      } else {
        return Promise.reject();
      }
    } else {
      return Promise.reject();
    }
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
  async branches(login: string, repositoryName: string): Promise<any[]> {
    if (this.hasToken()) {
      // const repo = new Github({
      //   token: this.token()
      // });
      let repo = await this.repositoryDetails(login, repositoryName);
      return this.get((repo.branches_url as string).replace("{/branch}", "") + '?per_page=100');
      // let promise: Promise<any> = repo.getRepo(login, repositoryName).listBranches();
      // return promise.then(result => result.data);
    } else {
      return Promise.reject();
    }
  }

  /**
   * [
      {
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
        "site_admin": false,
        "permissions": {
          "pull": true,
          "push": true,
          "admin": false
        }
      }
    ]
   * @param login 
   * @param repositoryName 
   */
  // async isCollaborator(login: string, repositoryName: string, checkUser: string): Promise<boolean> {
  //   if (this.hasToken()) {
  //     let repo = await this.repositoryDetails(login, repositoryName);
  //     return this.getResponse((repo.collaborators_url as string)
  //       .replace("{/collaborator}", `/${checkUser}`))
  //       .then(res => {
  //         return res.ok;
  //       });
  //   } else {
  //     return Promise.reject();
  //   }
  // }
  /**
   * [
      {
        "id": 1,
        "url": "https://api.github.com/applications/grants/1",
        "app": {
          "url": "http://my-github-app.com",
          "name": "my github app",
          "client_id": "abcde12345fghij67890"
        },
        "created_at": "2011-09-06T17:26:27Z",
        "updated_at": "2011-09-06T20:39:23Z",
        "scopes": [
          "public_repo"
        ]
      }
    ]
   */
  async rateLimit(){
    if (this.hasToken()) {
      const url = `https://api.github.com/rate_limit`;
      return this.getResponse(url);
    } else {
      return Promise.reject();
    }
  }

  async scope(): Promise<string> {
    if (this.hasToken()) {
      return this.rateLimit().then(v =>{
        return v.headers.get('X-OAuth-Scopes');
      });
    } else {
      return Promise.reject();
    }
  }

  private async get(url: string){
    let reposResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` } })
    return reposResponse.toPromise();
  }

  public async getResponse(url: string): Promise<HttpResponse<any>>{
    let reposResponse = this.http.get<any>(url, { headers: { Authorization: `token ${this.token()}` }, observe: 'response'})
    return reposResponse.toPromise();
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
