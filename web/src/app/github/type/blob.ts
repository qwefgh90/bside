/**
 * {
  "content": "Q29udGVudCBvZiB0aGUgYmxvYg==\n",
  "encoding": "base64",
  "url": "https://api.github.com/repos/octocat/example/git/blobs/3a0f86fb8db8eea7ccbb9a95f325ddbedfb25e15",
  "sha": "3a0f86fb8db8eea7ccbb9a95f325ddbedfb25e15",
  "size": 19
}
 */
export class Blob {
    content: string = ''
    encoding: string
    url: string
    sha: string
    size: number
}
