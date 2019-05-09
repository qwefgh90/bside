import { GithubTreeNode } from './github-tree-node';

/**
 * Change flat model to hierachy model
 * Actually it just populates children field.
 */
export class GithubTreeToTree {
    private stack: Array<GithubTreeNode> = [];
    private rootChildren: Array<GithubTreeNode> = [];
    constructor(private beforeTree: Array<GithubTreeNode>){
        this.traverse();
    }

    private traverse(){
        this.beforeTree.forEach((v, i, arr) => {
            v.children = []; //assign empty array
            v.name = this.getName(v); //assign node name
            if(this.stack.length == 0){
                //inital extra operation 
                this.rootChildren.push(v);
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
                if(top == undefined)
                    this.rootChildren.push(v);
                else
                    top.children.push(v);

                //push stack
                this.stack.push(v);
            }
        });
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

    public getTree(): Array<GithubTreeNode>{
        return this.rootChildren;
    }
}

