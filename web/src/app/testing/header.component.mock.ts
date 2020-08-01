import { NavigationStart } from '@angular/router';

export let mockUser = {
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

export let navigationStartWithRedirectUrl: NavigationStart = {url: "/redirect"} as unknown as NavigationStart;
export let mockRouter = {get events(){return undefined}, navigate: () => {}};
