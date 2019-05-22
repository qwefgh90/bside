export enum NodeStateAction {
  NodesChanged, NameModified, ContentModified, Created, Deleted
}

export interface GithubNode {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
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
  readonly state: Array<NodeStateAction> = [];
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

  constructor(isRoot: boolean = false){
    this.isRoot = isRoot;
  }

  getParentNode(){
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
        console.debug(`Change of path: from ${prePath} to ${this.path}`);
        this.parentNode.state.push(NodeStateAction.NodesChanged);
        if (newParent != this.parentNode) {
          this.parentNode = newParent;
          newParent.state.push(NodeStateAction.NodesChanged);
        }
        if (postAction)
          postAction(this, newParent, prePath, this.path);
        if (this.type == 'tree') {
          this.children.forEach((child) => {
            child.move(this, postAction);
          });
        }
      }
    }else 
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
      this.parentNode.children.splice(found, 1);
      this.parentNode.state.push(NodeStateAction.NodesChanged);
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
      this.parentNode.state.push(NodeStateAction.NodesChanged);
      if (postAction)
        postAction(this, this.parentNode, prePath, this.path);
      if (this.type == 'tree') {
        Object.assign([], this.children).forEach((child) => {
          child.rename(child.name, postAction);
        })
      }
    }
  }

  setContentModifiedFlag() {
    this.state.push(NodeStateAction.ContentModified);
  }

  setSyncedFlag(sha: string) {
    this._sha = sha;
    // this.state.push(NodeStateAction.Synced);
  }

  private getNameFromPath(){
    return this.path.match(new RegExp('[^/]*$'))[0];
  }

  isMyDescendant(node: GithubTreeNode) {
    let shortPathArr = this.path.split('/');
    let longPathArr = node.path.split('/');
    longPathArr.splice(shortPathArr.length, longPathArr.length);
    let shortPathArrFromLong = longPathArr;
    let isEqualPath = true;
    for (let i = 0; i < shortPathArr.length; i++) {
      if (shortPathArrFromLong[i] != shortPathArr[i]) {
        isEqualPath = false;
        break;
      }
    }
    return (node.path.length >= this.path.length) && isEqualPath;
  }

  static readonly githubTreeNodeFactory = new class {
    createNewNode(parentNode: GithubTreeNode, type: string) {
      let node = new GithubTreeNode();
      node.parentNode = parentNode;
      node._type = type;
      if (node.type == 'tree')
        node.children = [];
      node.state.push(NodeStateAction.Created);
      parentNode.children.push(node);
      parentNode.state.push(NodeStateAction.NodesChanged);
      return node;
    }

    createRootNode(sha: string) {
      let node = new GithubTreeNode(true);
      node._type = 'tree';
      node._sha = sha;
      node.children = [];
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
      if(real._type == 'tree')
        real.children = [];

      return real;
    }
  }
}
