    /**
     *  "path": ".buildinfo",
         "mode": "100644",
        "type": "blob",
        "sha": "910ab6d5a9cb4de8551bec37eb60847f258d742c",
        "size": 230,
        "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/910ab6d5a9cb4de8551bec37eb60847f258d742c"
    */
export enum NodeStateAction {
  Created, NameModified, Deleted
}

export class GithubTreeNode {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
  //custom field
  state: Array<NodeStateAction> = [];
  name?: string;
  children?: GithubTreeNode[];
  isRoot?: boolean
  parentNode?: GithubTreeNode;

  setName(name: string){
    if(name.length != 0 && name != this.name){
      this.state.push(NodeStateAction.NameModified);
      this.name = name;
      if(!this.isRoot)
        this.path = `${this.parentNode.path}/${this.name}`;
      else
        this.path = this.name;
    }
  }

  /**
   * it can be deleted by itself
   */
  delete(){
    let arr = this.parentNode.children;
    let found = arr.findIndex((v) => {
      return v.name == this.name;
    });
    if (found != -1) {
      this.parentNode.children.splice(found, 1);
      this.state.push(NodeStateAction.Deleted);
    }
  }
}

export function newNode(parentNode: GithubTreeNode, type: string){
  let node = new GithubTreeNode();
  node.parentNode = parentNode;
  node.type = type;
  if(node.type == 'tree')
    node.children = [];
  node.setName('name');
  node.state.push(NodeStateAction.Created);
  return node;
}

export function rootNode(){
  let node = new GithubTreeNode();
  node.path = '';
  node.name = '';
  node.type = 'tree';
  node.children = [];
  node.isRoot = true;
  return node;
}