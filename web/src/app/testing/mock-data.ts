import { Blob } from '../github/type/blob';
import { WorkspacePack } from '../workspace/workspace/workspace-pack';
import { BlobPack } from '../workspace/workspace/pack';
import { GithubTreeNode } from '../workspace/tree/github-tree-node';

export let simpleTree = {
  "sha": "xxxxxxf129c486558e37d797e54c9fd81c9c3407",
  "url": "https://api.github.com/repos/xxxxxx/xxxxxx/git/trees/xxxxxxf129c486558e37d797e54c9fd81c9c3407",
  "tree": [
    {
      path: 'a',
      mode: '',
      type: 'blob',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'b',
      mode: '',
      type: 'tree',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'b/c',
      mode: '',
      type: 'blob',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'b/d',
      mode: '',
      type: 'blob',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'b/e',
      mode: '',
      type: 'tree',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'b/e/f',
      mode: '',
      type: 'tree',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'b/e/f/g',
      mode: '',
      type: 'blob',
      sha: '',
      size: 0,
      url: ''
    },
    {
      path: 'h',
      mode: '',
      type: 'blob',
      sha: '',
      size: 0,
      url: ''
    }
  ]
};
export let tree = {
  "sha": "af24baf129c486558e37d797e54c9fd81c9c3407",
  "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/af24baf129c486558e37d797e54c9fd81c9c3407",
  "tree": [
    {
      "path": ".buildinfo",
      "mode": "100644",
      "type": "blob",
      "sha": "910ab6d5a9cb4de8551bec37eb60847f258d742c",
      "size": 230,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/910ab6d5a9cb4de8551bec37eb60847f258d742c",
      "extra": undefined
    },
    {
      "path": ".gitignore",
      "mode": "100644",
      "type": "blob",
      "sha": "0afe7c5b8833f794f4e4d71964864eeda31a0906",
      "size": 97,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/0afe7c5b8833f794f4e4d71964864eeda31a0906",
      "extra": undefined
    },
    {
      "path": ".nojekyll",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "extra": undefined
    },
    {
      "path": ".travis.yml",
      "mode": "100644",
      "type": "blob",
      "sha": "79d5d01e1bd3ac1e2e548b920c90859ee26cf5b6",
      "size": 337,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/79d5d01e1bd3ac1e2e548b920c90859ee26cf5b6",
      "extra": undefined
    },
    {
      "path": "README.md",
      "mode": "100644",
      "type": "blob",
      "sha": "d8fe5b0573ccab1832d40101372b31c1633af6d8",
      "size": 153,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/d8fe5b0573ccab1832d40101372b31c1633af6d8",
      "extra": undefined
    },
    {
      "path": "_downloads",
      "mode": "040000",
      "type": "tree",
      "sha": "08a42951647aef299e7c6587362b4e154ac55b57",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/08a42951647aef299e7c6587362b4e154ac55b57",
      "extra": undefined
    },
    {
      "path": "_downloads/376fff9bd23db6ea14d201f2479fb500",
      "mode": "040000",
      "type": "tree",
      "sha": "eb7e518eded9c95282497b82bb27ac4bf9cc6b24",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/eb7e518eded9c95282497b82bb27ac4bf9cc6b24",
      "extra": undefined
    },
    {
      "path": "_downloads/376fff9bd23db6ea14d201f2479fb500/HashMap.java",
      "mode": "100644",
      "type": "blob",
      "sha": "f2d1c1f7e0759b29753575395a340ce4f2001cb9",
      "size": 90987,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/f2d1c1f7e0759b29753575395a340ce4f2001cb9",
      "extra": undefined
    },
    {
      "path": "_downloads/3b9595f7ebd1ba74268e278ba32a6d2d",
      "mode": "040000",
      "type": "tree",
      "sha": "c1699e1fdb3ca93a03ff3cda873dac4760052ca4",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/c1699e1fdb3ca93a03ff3cda873dac4760052ca4",
      "extra": undefined
    },
    {
      "path": "_downloads/3b9595f7ebd1ba74268e278ba32a6d2d/PythonCExtension.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "043e1775df7055a05d025703ef2e6f61e56f309b",
      "size": 281438,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/043e1775df7055a05d025703ef2e6f61e56f309b",
      "extra": undefined
    },
    {
      "path": "_downloads/4a87751efe99b1b8e03b89acd744c96e",
      "mode": "040000",
      "type": "tree",
      "sha": "c1699e1fdb3ca93a03ff3cda873dac4760052ca4",
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/trees/c1699e1fdb3ca93a03ff3cda873dac4760052ca4",
      "extra": undefined
    },
    {
      "path": "_downloads/4a87751efe99b1b8e03b89acd744c96e/PythonCExtension.pdf",
      "mode": "100644",
      "type": "blob",
      "sha": "043e1775df7055a05d025703ef2e6f61e56f309b",
      "size": 281438,
      "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/043e1775df7055a05d025703ef2e6f61e56f309b",
      "extra": undefined
    }
  ]
};
export let branches = [
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
];
export let repositoryDetails = {
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
}
export let blob1 = {
  "sha": "3037bc2bdfba5b1c8885537245a62cd8b8049ce3",
  "node_id": "MDQ6QmxvYjgyMzkzNjIzOjMwMzdiYzJiZGZiYTViMWM4ODg1NTM3MjQ1YTYyY2Q4YjgwNDljZTM=",
  "size": 23,
  "url": "https://api.github.com/repos/qwefgh90/test/git/blobs/3037bc2bdfba5b1c8885537245a62cd8b8049ce3",
  "content": "6raB7J20IOq2geuztCDrs7bsnYzrsKU=\n",
  "encoding": "base64"
}

export let mockWorkspacePack: WorkspacePack = WorkspacePack.of(1,'mockrepo','commitsha1111', 'tresha1111', 'gh-pages', [BlobPack.of('blobsha1111', GithubTreeNode.githubTreeNodeFactory.of(tree.tree[0]), 'aGVsbG8gd29ybGQh')], tree.tree, ['.buildinfo'], '.buildinfo' , false);

export let commit1 = {
  "sha": "ceb341b21a418709d1819560c23fc7dea9e6155e",
  "node_id": "MDY6Q29tbWl0MjMwODc4OTAwOmNlYjM0MWIyMWE0MTg3MDlkMTgxOTU2MGMyM2ZjN2RlYTllNjE1NWU=",
  "commit": {
    "author": {
      "name": "Changwon Choe",
      "email": "qwefgh90@naver.com",
      "date": "2019-12-30T09:16:47Z"
    },
    "committer": {
      "name": "Changwon Choe",
      "email": "qwefgh90@naver.com",
      "date": "2019-12-30T09:16:47Z"
    },
    "message": "it's from http://localhost:4200/repos/qwefgh90/test333",
    "tree": {
      "sha": "94ae8aac77519e5139b1a07f0a6535c044bb68fb",
      "url": "https://api.github.com/repos/qwefgh90/test333/git/trees/94ae8aac77519e5139b1a07f0a6535c044bb68fb"
    },
    "url": "https://api.github.com/repos/qwefgh90/test333/git/commits/ceb341b21a418709d1819560c23fc7dea9e6155e",
    "comment_count": 0,
    "verification": {
      "verified": false,
      "reason": "unsigned",
      "signature": null,
      "payload": null
    }
  },
  "url": "https://api.github.com/repos/qwefgh90/test333/commits/ceb341b21a418709d1819560c23fc7dea9e6155e",
  "html_url": "https://github.com/qwefgh90/test333/commit/ceb341b21a418709d1819560c23fc7dea9e6155e",
  "comments_url": "https://api.github.com/repos/qwefgh90/test333/commits/ceb341b21a418709d1819560c23fc7dea9e6155e/comments",
  "author": {
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
  "committer": {
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
  "parents": [
    {
      "sha": "1f63cb03f64b653abecb0c6ce3e9c48521626de3",
      "url": "https://api.github.com/repos/qwefgh90/test333/commits/1f63cb03f64b653abecb0c6ce3e9c48521626de3",
      "html_url": "https://github.com/qwefgh90/test333/commit/1f63cb03f64b653abecb0c6ce3e9c48521626de3"
    }
  ],
  "stats": {
    "total": 1,
    "additions": 1,
    "deletions": 0
  },
  "files": []
};

export let tree2 = {
  "sha": "0d5dce70a485d69ca46b402e2c22475ffca64b8a",
  "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/0d5dce70a485d69ca46b402e2c22475ffca64b8a",
  "tree": [
    {
      "path": "a.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "abcd",
      "mode": "100644",
      "type": "blob",
      "sha": "5ab2f8a4323abafb10abb68657d9d39f1a775057",
      "size": 5,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/5ab2f8a4323abafb10abb68657d9d39f1a775057"
    },
    {
      "path": "b.md",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "c.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "markdown",
      "mode": "040000",
      "type": "tree",
      "sha": "b3bdef68efaf63c44f9e33406143ea5f511c823f",
      "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/b3bdef68efaf63c44f9e33406143ea5f511c823f"
    },
    {
      "path": "markdown/md1.md",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "markdown/post1.md",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "markdown/subpage",
      "mode": "040000",
      "type": "tree",
      "sha": "fb233230e7a9c56ff71ece521984c9717f98df30",
      "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/fb233230e7a9c56ff71ece521984c9717f98df30"
    },
    {
      "path": "markdown/subpage/author.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "markdown/subpage/head.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "markdown/subpage2",
      "mode": "040000",
      "type": "tree",
      "sha": "e6b2f5030e136ddc71ad0a5baee19f09ef5c1bc2",
      "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/e6b2f5030e136ddc71ad0a5baee19f09ef5c1bc2"
    },
    {
      "path": "markdown/subpage2/author2.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "markdown/subpage2/haed2.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "source",
      "mode": "040000",
      "type": "tree",
      "sha": "8aedff5a1e45216bd33f3b1fe0d7f4befacc0fa8",
      "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/8aedff5a1e45216bd33f3b1fe0d7f4befacc0fa8"
    },
    {
      "path": "source/a.java",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "source/b.java",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "source/meta",
      "mode": "040000",
      "type": "tree",
      "sha": "eb32af4c67ee48b2da9d807df5d70a63743debdc",
      "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/eb32af4c67ee48b2da9d807df5d70a63743debdc"
    },
    {
      "path": "source/meta/class.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "source/meta/con.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "source/meta/person",
      "mode": "040000",
      "type": "tree",
      "sha": "933f53ac045a0845fce5fab7f9d2cdcd0c602716",
      "url": "https://api.github.com/repos/qwefgh90/test2/git/trees/933f53ac045a0845fce5fab7f9d2cdcd0c602716"
    },
    {
      "path": "source/meta/person/age.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    },
    {
      "path": "source/meta/person/list.txt",
      "mode": "100644",
      "type": "blob",
      "sha": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
      "size": 0,
      "url": "https://api.github.com/repos/qwefgh90/test2/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391"
    }
  ],
  "truncated": false
}
;