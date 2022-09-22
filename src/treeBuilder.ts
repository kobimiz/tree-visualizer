import { Queue } from './queue';
import { Tree } from './tree'

class TreeBuilder {
    private static treeFromPrePostScanAux(preOrder: string[], postOrder: string[],
            startPre: number, endPre: number, reversePreMap : { [key: string]: string },
            reversePostMap : { [key: string]: string }) {
        if (endPre - startPre == 1)
            return new Tree(preOrder[startPre], []);
        
        const root = preOrder[startPre];
        let children: Tree[] = [];

        // TODO handle when no child
        let childIndex = startPre + 1
        while (childIndex < endPre) {
            let nextChildIndex = childIndex;
            let isNextChildFound = false;

            while (nextChildIndex < endPre) {
                nextChildIndex++;
                if (reversePostMap[preOrder[nextChildIndex]] > reversePostMap[preOrder[childIndex]]) {
                    // start of another child of root
                    children.push(TreeBuilder.treeFromPrePostScanAux(preOrder, postOrder, childIndex, nextChildIndex, reversePreMap, reversePostMap));
                    childIndex = nextChildIndex;
                    isNextChildFound = true;
                    break;
                }
            }

            if (!isNextChildFound) {
                children.push(TreeBuilder.treeFromPrePostScanAux(preOrder, postOrder, childIndex, nextChildIndex, reversePreMap, reversePostMap));
                break;
            }
        }

        return new Tree(root, children);
    }

    static treeFromPrePostScan(preOrder: string, postOrder: string) {
        if (preOrder.length == 0)
            return null;

        let prefixNumber  = preOrder.split(/\n/g),
            postfixNumber = postOrder.split(/\n/g);

        if (prefixNumber.length != postfixNumber.length)
            throw 'Invalid scans';
        
        if (prefixNumber.length == 0)
            return null;
        // TODO add more checks
            
        let reversePreMap : { [key: string]: string } = {};
        for (const key in prefixNumber)
            reversePreMap[prefixNumber[key]] = key;

        let reversePostMap : { [key: string]: string } = {};
        for (const key in postfixNumber)
        reversePostMap[postfixNumber[key]] = key;
    
        let res = this.treeFromPrePostScanAux(prefixNumber, postfixNumber, 0, prefixNumber.length, reversePreMap, reversePostMap);

        console.log('real: ', preOrder);
        console.log('generated:', res.scanPreOrder());
        
        console.log('real: ', postOrder);
        console.log('generated:', res.scanPostOrder());
        
        
        
        if (res.scanPreOrder() != preOrder || res.scanPostOrder() != postOrder)
            return null;

        return res;
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