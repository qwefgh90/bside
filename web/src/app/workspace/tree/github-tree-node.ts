    /**
     *  "path": ".buildinfo",
         "mode": "100644",
        "type": "blob",
        "sha": "910ab6d5a9cb4de8551bec37eb60847f258d742c",
        "size": 230,
        "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/910ab6d5a9cb4de8551bec37eb60847f258d742c"
    */
export interface GithubTreeNode {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
  //custom field
  name?: string;
  children?: any[];
  selected?: boolean;
}

