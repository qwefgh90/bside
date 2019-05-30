import { Blob } from './blob';

export class Content {
    type: string //: "file",
    encoding: string //: "base64",
    size: number //: 5362,
    name: string //: "README.md",
    path: string //: "README.md",
    content: string //: "encoded content ...",
    sha: string //: "3d21ec53a331a6f037a91c368710b99387d012c1",
    url: string //: "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
    git_url: string //: "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
    html_url: string //: "https://github.com/octokit/octokit.rb/blob/master/README.md",
    download_url: string //: "https://raw.githubusercontent.com/octokit/octokit.rb/master/README.md",
    _links: {
      git: string
      self: string
      html: string
    }
    blob: Blob
}
