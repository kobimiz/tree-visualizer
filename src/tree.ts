import { Queue } from './queue';

class Tree {
    value: any;
    children: Array<Tree>;
    parent: Tree | null;

    constructor(value: any, children: Tree | Tree[]) {
        this.value = value;
        this.parent = null;

        if (!(children instanceof Array)) {
            this.children = [new Tree(children, [])];
            children.parent = this;
        }
        else {
            this.children = children;
            this.children.forEach(child => child.parent = this);
        }
    }

    getLevelsNodeCount() {
        let q = new Queue();
        q.enqueue({ node: this, depth: 0 });
        let currDepth = 0;
        let currLevelNodeCount = 0;
        let levelsNodeCount = [];
    
        while (!q.isEmpty()) {
            let {node, depth} = q.dequeue();
    
            if (depth > currDepth) {
                currDepth = depth;
                levelsNodeCount.push(currLevelNodeCount);
                currLevelNodeCount = 0;
            }
            currLevelNodeCount++;
    
            for (let i = 0; i < node.children.length; i++)
                q.enqueue({ node: node.children[i], depth: depth + 1 });            
        }
        levelsNodeCount.push(currLevelNodeCount);
    
        return levelsNodeCount;
    }
    
    // level with most nodes
    longestTreeLevel() {
        const nodeCount = this.getLevelsNodeCount();
        let maxIndex = 0;
        nodeCount.forEach((count, i) => {
            if (nodeCount[maxIndex] < count)
                maxIndex = i;
        });
        return maxIndex;
    }
    
    getNodesByLevel() {
        let q = new Queue();
        q.enqueue({ node: this, depth: 0 });
        let res : Tree[][] = [];
        
        while (!q.isEmpty()) {
            let { node, depth } = q.dequeue();
            
            if (res[depth] === undefined)
            res[depth] = [];
            
            res[depth].push(node);
            
            for (let i = 0; i < node.children.length; i++)
            q.enqueue({ node: node.children[i], depth: depth + 1 });            
        }
        
        return res;
    }

    static cloneTreeStructure(tree: Tree) {
        if (tree.children.length == 0) return new Tree(null, []);
    
        let children : Tree[] = tree.children.map(child => Tree.cloneTreeStructure(child))
    
        return new Tree(null, children);
    }

    scanPreOrder() {
        let res: string = this.value;
        this.children.forEach(child => {
            res += '\n' + child.scanPreOrder();
        });
    
        return res;
    }
    
    scanPostOrder() {
        let res: string = '';
        this.children.forEach(child => {
            res += child.scanPostOrder() + '\n';
        });
    
        res += this.value;
        return res;
    }
}

export { Tree }