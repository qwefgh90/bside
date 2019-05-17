import { GithubTreeNode, rootNode } from './github-tree-node';

/**
 * Change flat model to hierachy model
 * Actually it just populates children field.
 */
export class GithubTreeToTree {
    private stack: Array<GithubTreeNode> = [];
    // private rootChildren: Array<GithubTreeNode> = [];
    private root: GithubTreeNode;

    constructor(private beforeTree: {sha: string, tree: Array<any>}){
        this.root = rootNode(beforeTree.sha);
        this.traverse();
    }

    private traverse(){
        this.beforeTree.tree.forEach((v, i, arr) => {
            v = this.copy(v); //interface to class
            v.children = []; //assign empty array
            v.name = this.getName(v); //assign node name
            if(this.stack.length == 0){
                //inital extra operation 
                this.root.children.push(v);
                v.parentNode = this.root;
                //push stack
                this.stack.push(v);
            }else{
                let top = this.stack[this.stack.length-1]
                let levelOfTop = this.getLevel(top);
                const current = v;
                const levelOfCurrent = this.getLevel(v);
                //pop until meeting a parent by assigning top variable
                while(levelOfTop >= levelOfCurrent){
                    this.stack.pop();
                    if(this.stack.length == 0){
                        top = undefined;
                        levelOfTop = -1;
                    }else{
                        top = this.stack[this.stack.length-1];
                        levelOfTop = this.getLevel(top);
                    }
                }
                //extra operation
                if(top == undefined){
                    this.root.children.push(v);
                    v.parentNode = this.root;
                }else{
                    top.children.push(v);
                    v.parentNode = top;
                }

                //push stack
                this.stack.push(v);
            }
        });
    }

    private copy(v: GithubTreeNode){
        let real = new GithubTreeNode();
        real.mode = v.mode;
        real.path = v.path;
        real.sha = v.sha;
        real.size = v.size;
        real.type = v.type;
        real.url = v.url;
        return real;
    }

    private getName(node: GithubTreeNode){
        return node.path.match(new RegExp('[^/]*$'))[0];
    }

    private getLevel(node: GithubTreeNode){
        let slashArray = node.path.match(new RegExp('/','g'));
        let count = 0;
        if(slashArray != undefined){
            count = slashArray.length;
        }
        return count;
    }

    public getTree(): GithubTreeNode{
        return this.root;
    }
}

