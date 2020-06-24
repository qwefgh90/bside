export enum NodeStateAction {
  NodesChanged, NameModified, ContentModified, Created, Deleted, Moved, Uploaded
}

export interface GithubNode {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
  extra?: {state: Array<NodeStateAction>};
}

export class GithubTreeNode {
  get path(): string {
    return this._path;
  }
  private pathBackingField: string;
  protected set _path(v: string) {
    this.pathBackingField = v;
  }
  protected get _path(): string {
    return this.pathBackingField;
  }

  get mode(): string {
    return this._mode;
  }
  private modeBackingField: string;
  protected set _mode(v: string) {
    this.modeBackingField = v;
  }
  protected get _mode(): string {
    return this.modeBackingField;
  }

  get type(): string {
    return this._type;
  }
  private typeBackingField: string;
  protected set _type(v: string) {
    this.typeBackingField = v;
  }
  protected get _type(): string {
    return this.typeBackingField;
  }

  get sha(): string {
    return this._sha;
  }
  private shaBackingField: string;
  protected set _sha(v: string) {
    this.shaBackingField = v;
  }
  protected get _sha(): string {
    return this.shaBackingField;
  }

  get size(): number {
    return this._size;
  }
  private sizeBackingField: number;
  protected set _size(v: number) {
    this.sizeBackingField = v;
  }
  protected get _size(): number {
    return this.sizeBackingField;
  }

  get url(): string {
    return this._url;
  }
  private urlBackingField: string;
  protected set _url(v: string) {
    this.urlBackingField = v;
  }
  protected get _url(): string {
    return this.urlBackingField;
  }

  //custom field
  children: GithubTreeNode[];
  removedChildren: GithubTreeNode[];
  state: Array<NodeStateAction> = [];
  readonly isRoot: boolean;
  private parentNode: GithubTreeNode;

  get name(): string {
    return this._name;
  }
  private nameBackingField: string;
  protected set _name(v: string) {
    this.nameBackingField = v;
  }
  protected get _name(): string {
    return this.nameBackingField;
  }

  get syncedNode(): GithubNode {
    return this._syncedNode;
  }
  private syncedNodeBackingField: GithubNode;
  protected set _syncedNode(v: GithubNode) {
    this.syncedNodeBackingField = v;
  }
  protected get _syncedNode(): GithubNode {
    return this.syncedNodeBackingField;
  }

  constructor(isRoot: boolean = false) {
    this.isRoot = isRoot;
  }

  find(path: string): GithubTreeNode{
    if(this.isRoot){
      let partial = path.split('/');
      return this._find(partial);
    }
  }

  private _find(partialPath: Array<string>): GithubTreeNode | undefined{
    if(partialPath.length == 0)
      return undefined;
    else if(partialPath.length == 1){
      let firstPathComponent = partialPath[0];
      return this.children.find((child) => child.name == firstPathComponent);
    }else{
      let firstPathComponent = partialPath[0];
      let foundChild = this.children.find((child) => child.name == firstPathComponent);
      partialPath.splice(0, 1);
      return foundChild ? foundChild._find(partialPath) : undefined;
    }
  }

  getParentNode() {
    return this.parentNode;
  }

  /**
   * it can be moved by itself, if it is a tree, it apply move() to children.
   * children are updated by AngularTreeComponent
   */
  move(newParent: GithubTreeNode, postAction?: (node: GithubTreeNode, parent: GithubTreeNode, prePath: string, newPath: string) => void) {
    if (!this.isMyDescendant(newParent)) {
      if (newParent != undefined && newParent.type.toLocaleLowerCase() == 'tree') {
        const prePath = this.path;
        this._path = newParent.isRoot ? this.name : `${newParent.path}/${this.name}`
        this.state.push(NodeStateAction.Moved)
        console.debug(`Change of path: from ${prePath} to ${this.path}`);
        this.changeAllParents(this.parentNode);
        if (newParent != this.parentNode) {
          this.parentNode = newParent;
          this.changeAllParents(this.parentNode);
        }
        if (postAction)
          postAction(this, newParent, prePath, this.path);
        if (this.type == 'tree') {
          this.children.forEach((child) => {
            child.move(this, postAction);
          });
        }
      }
    } else
      console.log(`${this.path} can not move to ${newParent.path}.`);
  }

  /**
   * it can be removed by itself, if it is a tree, it apply remove() to children.
   */
  remove(postAction?: (node: GithubTreeNode) => void) {
    let arr = this.parentNode.children;
    let found = arr.findIndex((e) => {
      return (e.name == this.name) ||
        ((this.name == undefined) && (e.name == undefined))
    });
    if (found != -1) {
      this.state.push(NodeStateAction.Deleted);
      let removedOne = this.parentNode.children.splice(found, 1);
      this.parentNode.removedChildren = this.parentNode.removedChildren.concat(removedOne);
      this.changeAllParents(this.parentNode);
      if (postAction)
        postAction(this);
      if (this.type == 'tree') {
        Object.assign([], this.children).forEach((child) => {
          child.remove(postAction);
        })
      }
    }
  }

  /**
   * it can be renamed by itself, if it is a tree, it apply rename() to children.
   */
  rename(name: string, postAction?: (node: GithubTreeNode, parent: GithubTreeNode, prePath: string, newPath: string) => void) {
    if (name.length != 0) {
      let prePath = this.path;
      this._name = name;
      if (!this.parentNode.isRoot)
        this._path = `${this.parentNode.path}/${this.name}`;
      else
        this._path = this.name;
      this.state.push(NodeStateAction.NameModified);
      this.changeAllParents(this.parentNode);
      if (postAction)
        postAction(this, this.parentNode, prePath, this.path);
      if (this.type == 'tree') {
        this.children.forEach((child) => {
          child.rename(child.name, postAction);
        })
      }
    }
  }

  private reduceInnerLoop<A>(postAction: (acc: A, node: GithubTreeNode, tree: GithubTreeNode) => A, acc: A, root: GithubTreeNode, removeIncluded: boolean) {
    // const root = this.isRoot ? this : undefined;
    let nextAcc = postAction(acc, this, root);
    if (this.type == 'tree') {
      this.children.concat(removeIncluded ? this.removedChildren : []).forEach((child) => {
        nextAcc = child.reduceInnerLoop(postAction, nextAcc, root, removeIncluded);
      })
    }
    return nextAcc;
  }

  /**
   * reduce tree with DFS
   * @param postAction 
   * @param initValue 
   */
  reduce<A>(postAction: (acc: A, node: GithubTreeNode, tree: GithubTreeNode) => A, initValue: A, removeIncluded: boolean = false) {
    const subRoot = this;
    return this.reduceInnerLoop(postAction, initValue, subRoot, removeIncluded);
  }

  /**
   * return all blob nodes 
   */
  getBlobNodes(removeIncluded = false){
    if (this.type == 'tree') {
      let arr = this.reduce<Array<GithubTreeNode>>((acc, node, tree) => {
        if (!node.isRoot && (node.type == 'blob')) {
          acc.push(node);
        }
        return acc;
      }, [], removeIncluded);
      return arr;
    }else
      return [];
  }

  getAllNodes(removeIncluded = false){
    if (this.type == 'tree') {
      let arr = this.reduce<Array<GithubTreeNode>>((acc, node, tree) => {
        acc.push(node);
        return acc;
      }, [], removeIncluded);
      return arr;
    }else
      return [];
  }

  clearStates(){
    this.state.splice(0, this.state.length);
  }

  getUnchangedHighestTree(): GithubTreeNode{
    let highestTree = undefined;
    let unchanged = (this.state.findIndex((v) => NodeStateAction.NodesChanged == v) == -1);
    if(unchanged){
      highestTree = this;
      let parentNode = highestTree.parentNode;
      while((parentNode != undefined) 
          && parentNode.state
            .findIndex((v) => NodeStateAction.NodesChanged == v) == -1){
        highestTree = parentNode;
        parentNode = highestTree.parentNode;
      }
      return highestTree.type == 'blob' ? undefined : highestTree;
    }else{
      return undefined;
    }
  }

  setContentModifiedFlag(flag: boolean = true) {
    if(flag){
      if(
        this.state.length == 0 ||
        ((this.state.length > 0) && (this.state[this.state.length-1] != NodeStateAction.ContentModified))){
          this.state.push(NodeStateAction.ContentModified);
      }
      this.changeAllParents(this.parentNode);
    }else if(!flag){
      let statesExcludingContentModified = this.state.filter((v) => {
        return v != NodeStateAction.ContentModified
      });
      this.state.splice(0, this.state.length);
      statesExcludingContentModified.forEach((v) => this.state.push(v));
    }
  }

  setSynced(sha: string, type: string, mode: string) {
    this.state.splice(0, this.state.length);
    this._sha = sha;
    this._type = type;
    this._mode = mode;
  }

  setUploadedToLocal(){
    this.state.push(NodeStateAction.Uploaded);
    this.changeAllParents(this.parentNode);
  }

  setSize(size: number){
    this._size = size;
  }

  getNameFromPath(path?: string) {
    path = path == undefined ? this.path : path;
    return path.match(new RegExp('[^/]*$'))[0];
  }

  static getNameFromPath(path?: string) {
    return path.match(new RegExp('[^/]*$'))[0];
  }

  private changeAllParents(parent: GithubTreeNode){
    let p = parent;
    while(p != undefined){
      p.state.push(NodeStateAction.NodesChanged);
      p = p.parentNode;
    }
  }

  isMyDescendant(node: GithubTreeNode) {
    let shortPathArr = this.isRoot ? [] : this.path.split('/');
    let longPathArr = node.isRoot ? [] : node.path.split('/');
    const firstLength = shortPathArr.length;
    const secondLength = longPathArr.length;
    const shortestEqualLength = Math.min(shortPathArr.length, longPathArr.length);
    longPathArr.splice(shortPathArr.length, longPathArr.length);
    let trimmedLongArr = longPathArr;
    let isEqualPath = true;
    for (let i = 0; i < shortestEqualLength; i++) {
      if (shortPathArr[i] != trimmedLongArr[i]) {
        isEqualPath = false;
        break;
      }
    }
    return (firstLength <= secondLength) && isEqualPath;
  }


  toGithubNode(): GithubNode{
    let node: GithubNode = {
      mode: this.mode,
      path: this.path,
      sha: this.sha,
      type: this.type,
      size: this.size,
      url: this.url,
      extra: {state: [...this.state]}
    };
    return node;
  }

  static readonly githubTreeNodeFactory = new class {
    createNewNode(parentNode: GithubTreeNode, type: string) {
      let node = new GithubTreeNode();
      node.parentNode = parentNode;
      node._type = type;
      if (node._type == 'tree') {
        node.children = [];
        node.removedChildren = [];
      }
      node.state.push(NodeStateAction.Created);
      parentNode.children.push(node);
      parentNode.state.push(NodeStateAction.NodesChanged);
      return node;
    }

    createRootNode(sha: string) {
      let node = new GithubTreeNode(true);
      node._type = 'tree';
      node._sha = sha;
      node._path = '';
      node.children = [];
      node.removedChildren = [];
      return node;
    }

    of(v: GithubNode) {
      let real = new GithubTreeNode();
      real._mode = v.mode;
      real._path = v.path;
      real._sha = v.sha;
      real._size = v.size;
      real._type = v.type;
      real._url = v.url;
      real._syncedNode = v;
      real._name = real.getNameFromPath();
      if(v.extra != undefined && v.extra.state != undefined)
        v.extra.state.forEach((v) => {
          real.state.push(v);
        })
      if (real._type == 'tree') {
        real.children = [];
        real.removedChildren = [];
      }

      return real;
    }
  }
}
