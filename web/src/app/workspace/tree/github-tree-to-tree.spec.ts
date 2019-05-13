import { GithubTreeToTree } from './github-tree-to-tree';

describe('FlatToTree', () => {
  it('should create an instance', () => {
    expect(new GithubTreeToTree([])).toBeTruthy();
  });
  it('getTree()', () =>{
    let arr = [
      {
        path:'a',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'b',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'b/c',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'b/d',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'b/e',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'b/e/f',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'b/e/f/g',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      },
      {
        path:'h',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:'', state:[], setName: undefined, delete: undefined
      }
    ]
    let transformer = new GithubTreeToTree(arr);
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
