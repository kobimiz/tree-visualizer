import { Queue } from './queue';
import { Tree } from './tree'

class TreeBuilder {
    private static treeFromPrePostScanAux(prefix: number[], postfix: number[],
            startPre: number, endPre: number, reversePreMap : { [key: number]: number },
            reversePostMap : { [key: number]: number }) {
        if (endPre - startPre == 1)
            return new Tree(prefix[startPre], []);
        
        const root = prefix[startPre];
        let children: Tree[] = [];

        // TODO handle when no child
        let childIndex = startPre + 1
        while (childIndex < endPre) {
            let nextChildIndex = childIndex;
            let isNextChildFound = false;

            while (nextChildIndex < endPre) {
                nextChildIndex++;
                if (reversePostMap[prefix[nextChildIndex]] > reversePostMap[prefix[childIndex]]) {
                    // start of another child of root
                    children.push(TreeBuilder.treeFromPrePostScanAux(prefix, postfix, childIndex, nextChildIndex, reversePreMap, reversePostMap));
                    childIndex = nextChildIndex;
                    isNextChildFound = true;
                    break;
                }
            }

            if (!isNextChildFound) {
                children.push(TreeBuilder.treeFromPrePostScanAux(prefix, postfix, childIndex, nextChildIndex, reversePreMap, reversePostMap));
                break;
            }
        }

        return new Tree(root, children);
    }

    static treeFromPrePostScan(prefix: string, postFix: string) {
        let prefixNumber  = prefix.split(/\s+/g).map(str => parseInt(str)),
            postfixNumber = postFix.split(/\s+/g).map(str => parseInt(str));

        if (prefixNumber.length != postfixNumber.length)
            throw 'Invalid scans';
        
        if (prefixNumber.length == 0)
            return null;
        // TODO add more checks

        let reversePreMap : { [key: number]: number } = {};
        for (const key in prefixNumber)
            reversePreMap[prefixNumber[key]] = parseInt(key);

        let reversePostMap : { [key: number]: number } = {};
        for (const key in postfixNumber)
        reversePostMap[postfixNumber[key]] = parseInt(key);
    
        return this.treeFromPrePostScanAux(prefixNumber, postfixNumber, 0, prefixNumber.length, reversePreMap, reversePostMap);
    }

    static generateRandomTree(depth: number, maxChildren: number) {
        if (depth == 1)
            return new Tree(0, []);
        
        let rand = Math.floor(Math.random() * 3);
        let children: Tree[] = [];

        while (rand % 3 != 0 && children.length < maxChildren) {
            rand = Math.floor(Math.random() * 2);
            children.push(TreeBuilder.generateRandomTree(depth - 1, maxChildren));
        }

        return new Tree(0, children);
    }

    static indexTree(tree: Tree) {
        let q = new Queue();

        let index = 0;
        q.enqueue(tree);
        while (!q.isEmpty()) {
            let node: Tree = q.dequeue();
            node.value = index.toString();
            index++;

            for (let i = 0; i < node.children.length; i++)
                q.enqueue(node.children[i]);
        }
    }
}

export { TreeBuilder }

// let x = new Tree(1,[2]);

// console.log('treeBuilder.js', x)