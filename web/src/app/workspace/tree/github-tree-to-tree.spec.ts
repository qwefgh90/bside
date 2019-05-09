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
        url:''
      },
      {
        path:'b',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      },
      {
        path:'b/c',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      },
      {
        path:'b/d',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      },
      {
        path:'b/e',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      },
      {
        path:'b/e/f',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      },
      {
        path:'b/e/f/g',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      },
      {
        path:'h',
        mode:'',
        type:'',
        sha:'',
        size:0,
        url:''
      }
    ]
    let transformer = new GithubTreeToTree(arr);
    let result = transformer.getTree();
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
