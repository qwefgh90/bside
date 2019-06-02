import { GithubTreeToTree } from './github-tree-to-tree';
import { GithubTreeNode, GithubNode, NodeStateAction } from './github-tree-node';
import { simpleTree, tree } from 'src/app/testing/mock-data';

describe('GithubTreeToTree', () => {
  it('should create an instance', () => {
    expect(new GithubTreeToTree({sha: 'abcd', tree: []})).toBeTruthy();
  });
  
  it('getTree()', () =>{
    let transformer = new GithubTreeToTree(simpleTree);
    let result = transformer.getTree().children;
    expect(result.length).toBe(3);
    expect(result[0].children).toBeUndefined();
    expect(result[1].children.length).toBe(3);
    expect(result[1].children[0].children).toBeUndefined();
    expect(result[1].children[1].children).toBeUndefined();
    expect(result[1].children[2].children.length).toBe(1);
    expect(result[1].children[2].children[0].children.length).toBe(1);
    expect(result[1].children[2].children[0].children[0].children).toBeUndefined();
    expect(result[2].children).toBeUndefined();
  })

  it('getTree() to real nodes', () =>{
    let transformer = new GithubTreeToTree(tree);
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    expect(result[0].children).toBeUndefined();
    expect(result[1].children).toBeUndefined();
    expect(result[2].children).toBeUndefined();
    expect(result[3].children).toBeUndefined();
    expect(result[4].children).toBeUndefined();
    expect(result[5].children.length).toBe(3);
    expect(result[5].children[0].children.length).toBe(1);
    expect(result[5].children[1].children.length).toBe(1);
    expect(result[5].children[2].children.length).toBe(1);
  })

  it('move() of blob node', () =>{
    let transformer = new GithubTreeToTree(tree);
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const _downloads = result[5];
    const lenBefore = _downloads.children.length;
    result[0].move(_downloads);
    expect(result[0].state.find((v) => v == NodeStateAction.Moved)).toBeDefined();
    expect(result[0].getParentNode().state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
    expect(_downloads.state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
    expect(result[0].getParentNode()).toBe(_downloads);
    //children are updated by AngularTreeComponent
  })

  it('move() of tree node', () =>{
    let transformer = new GithubTreeToTree(tree);
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const _downloads = result[5];
    let n1 = _downloads.children[1];
    let n2 = _downloads.children[1].children[0];
    let nameBefore1 = _downloads.children[1].name;
    let nameBefore2 = _downloads.children[1].children[0].name;

    _downloads.children[1].move(_downloads.children[0]);
    expect(_downloads.children[1].state.find((v) => v == NodeStateAction.Moved)).toBeDefined();
    expect(_downloads.children[1].children[0].state.find((v) => v == NodeStateAction.Moved)).toBeDefined();
    expect(_downloads.children[1].state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
    expect(_downloads.children[1].getParentNode().state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
    expect(_downloads.children[0].state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();

    expect(n1.path).toBe(_downloads.children[0].path + "/" + nameBefore1)
    expect(n2.path).toBe(n1.path + "/" + nameBefore2)
    //children is updated by AngularTreeComponent
  })

  it('move() to child node', () =>{
    let transformer = new GithubTreeToTree(tree);
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const _downloads = result[5];
    let parent = _downloads.getParentNode();

    _downloads.move(_downloads.children[0]);
    expect(_downloads.children[0].state.find((v) => v == NodeStateAction.NodesChanged)).not.toBeDefined();

    expect(parent).toBe(_downloads.getParentNode());
  })

  it('isMyDescendant() of root', () =>{
    let transformer = new GithubTreeToTree(tree);
    let root = transformer.getTree();
    let result = root.children;
    expect(root.isMyDescendant(root)).toBeTruthy();
    expect(root.isMyDescendant(root.children[0])).toBeTruthy();
    expect(root.isMyDescendant(root.children[5].children[0])).toBeTruthy();
    expect(root.isMyDescendant(root.children[5])).toBeTruthy();
    expect(root.children[0].isMyDescendant(root)).toBeFalsy();
  })

  it('isMyDescendant()', () =>{
    let transformer = new GithubTreeToTree(tree);
    let root = transformer.getTree();
    let result = root.children;
    expect(root.children[5].children[0].isMyDescendant(root.children[5].children[0])).toBeTruthy();
    expect(root.children[5].children[0].isMyDescendant(root.children[5])).toBeFalsy();
    expect(result.length).toBe(6);
    const parentTree = result[5];
    expect(parentTree.isMyDescendant(parentTree.children[0])).toBeTruthy();
    expect(result[0].isMyDescendant(result[1])).toBeFalsy();
    expect(parentTree.isMyDescendant(parentTree.children[1])).toBeTruthy();
    expect(parentTree.children[0]
      .isMyDescendant(parentTree.children[1])).toBeFalsy();
    expect(parentTree.children[0].children[0]
      .isMyDescendant(parentTree.children[1])).toBeFalsy();
    expect(parentTree.children[0].children[0]
      .isMyDescendant(parentTree.children[1].children[0])).toBeFalsy();
  })

  it('remove()', () =>{
    let transformer = new GithubTreeToTree(tree);
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const _downloads = result[5];
    
    const countOfChildren = _downloads.children[0].children.length;
    _downloads.children[0].children[0].remove();
    expect(countOfChildren - 1).toBe(_downloads.children[0].children.length);
    expect(_downloads.children[0].state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();

    const countOfChildren2 = _downloads.children.length;
    _downloads.children[1].remove();
    expect(countOfChildren2 - 1).toBe(_downloads.children.length);
    expect(_downloads.state.find((v) => v == NodeStateAction.NodesChanged)).toBeDefined();
  })

  it('rename()', () =>{
    let transformer = new GithubTreeToTree(tree);
    let result = transformer.getTree().children;
    const _downloads = result[5];
    expect(result.length).toBe(6);
    
    result[0].rename("apple");
    expect(result[0].state.find((v) => v == NodeStateAction.NameModified)).toBeDefined();
  
    expect(result[0].path).toBe("apple");
    expect(result[0].name).toBe("apple");

    const newDirectoryName = "simple";
    _downloads.rename(newDirectoryName);
    expect(_downloads.state.find((v) => v == NodeStateAction.NameModified)).toBeDefined();
  
    expect(_downloads.children[0].path.startsWith(newDirectoryName)).toBeTruthy();
    expect(_downloads.children[0].state.find(v => v == NodeStateAction.NameModified)).toBeDefined();
    expect(_downloads.children[0].children[0].path.startsWith(newDirectoryName)).toBeTruthy();
    expect(_downloads.children[1].path.startsWith(newDirectoryName)).toBeTruthy();
    expect(_downloads.children[1].state.find(v => v == NodeStateAction.NameModified)).toBeDefined();
    expect(_downloads.children[1].children[0].path.startsWith(newDirectoryName)).toBeTruthy();
    expect(_downloads.children[2].path.startsWith(newDirectoryName)).toBeTruthy();
    expect(_downloads.children[2].state.find(v => v == NodeStateAction.NameModified)).toBeDefined();
    expect(_downloads.children[2].children[0].path.startsWith(newDirectoryName)).toBeTruthy();
  })

  it('reduce() after rename()', () =>{
    let transformer = new GithubTreeToTree(tree);
    let root = transformer.getTree();
    let children = transformer.getTree().children;
    const _downloads = children[5];
    children[0].rename("apple");
    const newDirectoryName = "simple";
    _downloads.rename(newDirectoryName);

    let acc = root.reduce<Array<GithubNode>>((acc, node, tree) => {
      if(node.state.length > 0){
        acc.push(node);
      }
      return acc;
    }, [], true);

    expect(acc.length).toBe(9);
    expect(root.state.includes(NodeStateAction.NodesChanged)).toBeTruthy();
  })

  it('reduce() after remove()', () =>{
    let transformer = new GithubTreeToTree(tree);
    let root = transformer.getTree();
    let result = transformer.getTree().children;
    expect(result.length).toBe(6);
    const _downloads = result[5];
    _downloads.children[0].children[0].remove();
    _downloads.children[1].remove();


    let acc = root.reduce<Array<GithubNode>>((acc, node, tree) => {
      if(node.state.length > 0){
        acc.push(node);
      }
      return acc;
    }, [], true);

    expect(acc.length).toBe(6);
    expect(root.state.includes(NodeStateAction.NodesChanged)).toBeTruthy();
  })
  //does not allow parent move to the child tree
});
