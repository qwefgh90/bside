import { GithubTreeToTree } from './github-tree-to-tree';
import { GithubTreeNode } from './github-tree-node';

describe('FlatToTree', () => {
  it('should create an instance', () => {
    expect(new GithubTreeToTree({sha: 'abcd', tree: []})).toBeTruthy();
  });
  it('getTree()', () =>{
    let arr: Array<GithubTreeNode> = [
      {
        path:'a',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'b',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'b/c',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'b/d',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'b/e',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'b/e/f',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'b/e/f/g',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      },
      {
        path:'h',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], rename: undefined, parentNode: undefined,  isRoot:false, move: undefined, remove: undefined, setContentModifiedFlag: undefined, setSyncedFlag: undefined
      }
    ]
    let transformer = new GithubTreeToTree({sha:'abcd', tree: arr});
    let result = transformer.getTree().children;
    expect(result.length).toBe(3);
    expect(result[0].children.length).toBe(0);
    expect(result[1].children.length).toBe(3);
    expect(result[1].children[0].children.length).toBe(0);
    expect(result[1].children[1].children.length).toBe(0);
    expect(result[1].children[2].children.length).toBe(1);
    expect(result[1].children[2].children[0].children.length).toBe(1);
    expect(result[1].children[2].children[0].children[0].children.length).toBe(0);
    expect(result[2].children.length).toBe(0);
  })
});
