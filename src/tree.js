const { Queue } = require('./queue');

class Tree {
    constructor(value, children) {
        this.value = value;

        if (!(children instanceof Array)) {
            if (!this.children)
                this.children = [];
            else
                this.children = [children];
        }
        else
            this.children = children;
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
        const nodeCount = this.getLevelsNodeCount(this);
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
        let res = [];
        
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

    static cloneTreeStructure(tree) {
        if (!tree) return null;
    
        let children = tree.children.map(child => Tree.cloneTreeStructure(child))
    
        return new Tree(null, children);
    }
}

module.exports = { Tree };