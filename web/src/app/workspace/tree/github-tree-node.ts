    /**
     *  "path": ".buildinfo",
         "mode": "100644",
        "type": "blob",
        "sha": "910ab6d5a9cb4de8551bec37eb60847f258d742c",
        "size": 230,
        "url": "https://api.github.com/repos/qwefgh90/sphinx/git/blobs/910ab6d5a9cb4de8551bec37eb60847f258d742c"
    */
export enum NodeStateAction {
  NodesChanged, NameModified, ContentModified, Created, Deleted
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
  name?: string = '';
  children?: GithubTreeNode[];
  isRoot: boolean = false;
  parentNode: GithubTreeNode;

  move(newParent: GithubTreeNode, postAction?: (node: GithubTreeNode, parent: GithubTreeNode, prePath: string, newPath: string) => void){
    if(newParent != undefined && newParent.type.toLocaleLowerCase() == 'tree'){
      const prePath = this.path;
      this.path = newParent.isRoot ? this.name : `${newParent.path}/${this.name}`
      console.debug(`Change of path: from ${prePath} to ${this.path}`);
      this.parentNode.state.push(NodeStateAction.NodesChanged);
      if(newParent != this.parentNode){
        this.parentNode = newParent;
        newParent.state.push(NodeStateAction.NodesChanged);
      }
      if(postAction)
        postAction(this, newParent, prePath, this.path);
      if(this.type == 'tree'){
        this.children.forEach((child) => {
          child.move(this, postAction);
        });
      }
    }
  }

  /**
   * it can be removed by itself
   */
  remove(postAction?: (node: GithubTreeNode) => void){
    let arr = this.parentNode.children;
    let found = arr.findIndex((e) => {
      return e.name == this.name;
    });
    if (found != -1) {
      this.state.push(NodeStateAction.Deleted);
      this.parentNode.children.splice(found, 1);
      this.parentNode.state.push(NodeStateAction.NodesChanged);
      if(postAction)
        postAction(this);
      if(this.type == 'tree'){
        Object.assign([], this.children).forEach((child) => {
            child.remove(postAction);
        })
      }
    }
  }

  rename(name: string, postAction?: (node: GithubTreeNode, parent: GithubTreeNode, prePath: string, newPath: string) => void){
    if(name.length != 0){
      let prePath = this.path;
      this.name = name;
      if(!this.parentNode.isRoot)
        this.path = `${this.parentNode.path}/${this.name}`;
      else
        this.path = this.name;
      this.state.push(NodeStateAction.NameModified);
      this.parentNode.state.push(NodeStateAction.NodesChanged);
      if(postAction)
        postAction(this, this.parentNode, prePath, this.path);
      if(this.type == 'tree'){
        Object.assign([], this.children).forEach((child) => {
            child.rename(child.name, postAction);
        })
      }
    }
  }

  setContentModifiedFlag(){
    this.state.push(NodeStateAction.ContentModified);
  }
  
  setSyncedFlag(sha: string){
    this.sha = sha;
    // this.state.push(NodeStateAction.Synced);
  }

  isMyDescendant(node: GithubTreeNode){
    let shortPathArr = this.path.split('/');
    let longPathArr = node.path.split('/');
    longPathArr.splice(shortPathArr.length, longPathArr.length);
    let shortPathArrFromLong = longPathArr;
    let right = true;
    for(let i=0; i<shortPathArr.length; i++){
      if(shortPathArrFromLong[i] != shortPathArr[i]){
        right = false;
        break;
      }
    }
    return (node.path.length >= this.path.length) && right;
  }

}

export function newNode(parentNode: GithubTreeNode, type: string){
  let node = new GithubTreeNode();
  node.parentNode = parentNode;
  node.type = type;
  if(node.type == 'tree')
    node.children = [];
  node.state.push(NodeStateAction.Created);
  parentNode.children.push(node);
  parentNode.state.push(NodeStateAction.NodesChanged);
  return node;
}

export function rootNode(sha: string){
  let node = new GithubTreeNode();
  node.path = '';
  node.name = '';
  node.type = 'tree';
  node.sha = sha;
  node.children = [];
  node.isRoot = true;
  return node;
}