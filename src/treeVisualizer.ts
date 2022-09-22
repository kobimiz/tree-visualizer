import { Tree } from './tree'

class TreeVisualizer {
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    drawNode(node: Tree, x: number, y: number, nodeWidth: number) {
        let sentences = this.splitStringToSentences(node.value, nodeWidth - 20); // padding
        let currY = y + 18;
        for (let i = 0; i < sentences.length; i++) {
            this.ctx.fillText(sentences[i], x + 5, currY);
            currY += 18;
        }
        this.ctx.beginPath();
        this.ctx.rect(x, y, nodeWidth, currY - y)
        this.ctx.stroke();

        return [nodeWidth, currY - y];
    }

    drawTreeByPos(tree: Tree, posTree: Tree, rootY: number, nodeWidth: number) {
        if (!tree) return;

        let nodeDims = this.drawNode(tree, posTree.value, rootY, nodeWidth);

        tree.children.forEach((child, i) => {
            this.drawTreeByPos(child, posTree.children[i], rootY + 20 + nodeDims[1], nodeWidth);

            this.ctx.strokeStyle = 'red';
            this.ctx.beginPath();
            this.ctx.moveTo(posTree.value + nodeWidth / 2, rootY + nodeDims[1])
            this.ctx.lineTo(posTree.children[i].value + nodeWidth / 2, rootY + nodeDims[1] + 20);
            this.ctx.stroke();
            this.ctx.strokeStyle = 'black';
        });
    }

    // TODO take care of node height
    calculatePositionTreeCramped(tree: Tree, nodeWidth: number) {
        let res = Tree.cloneTreeStructure(tree);
        const longestLevelIndex = tree.longestTreeLevel();

        let nodesByLevel = res.getNodesByLevel();
        nodesByLevel[longestLevelIndex].forEach((node, i) => {
            node.value = i * (nodeWidth + 10); // TODO parameterize margin
        });

        for (let i = longestLevelIndex - 1; i >= 0; i--) {
            for (let j = 0; j < nodesByLevel[i].length; j++) {
                if (nodesByLevel[i][j].children.length === 0) {
                    if (j === 0)
                        nodesByLevel[i][j].value = 0;
                    else
                        nodesByLevel[i][j].value = nodesByLevel[i][j-1].value + nodeWidth  + 10; // TODO parameterize margin
                } else {
                    let sum = 0;
                    nodesByLevel[i][j].children.forEach(node => {
                        sum += node.value
                    });
                    nodesByLevel[i][j].value = sum / nodesByLevel[i][j].children.length;
                }

                // this is an edge case i ran into where not having children can cause
                // a node to be before (or in the middle of) its previous sibling
                if (j > 0 && nodesByLevel[i][j].value < nodesByLevel[i][j-1].value + nodeWidth + 10) {
                    // TODO parameterize margin
                    nodesByLevel[i][j].value = nodesByLevel[i][j-1].value + nodeWidth + 10;
                }
            }
        }

        for (let i = longestLevelIndex; i < nodesByLevel.length; i++) {
            for (let j = 0; j < nodesByLevel[i].length; j++) {
                for (let k = 0; k < nodesByLevel[i][j].children.length; k++) {
                    nodesByLevel[i][j].children[k].value = nodesByLevel[i][j].value + k * (nodeWidth + 10); // TODO parameterize margin
                }
            }
        }
        return res;
    }

    calculatePositionTree(tree: Tree, nodeWidth: number) {
        if (tree.children.length == 0)
            return new Tree(0, []);

        let res = Tree.cloneTreeStructure(tree);
        let nodesByLevel = res.getNodesByLevel();

        for (let level = 0; level < nodesByLevel.length; level++) {
            for (let i = 0; i < nodesByLevel[level].length; i++) {
                nodesByLevel[level][i].value = (nodeWidth + 10) * i; // TODO parameterize margin
            }            
        }

        // TODO remove
        let limit = 5;
        while (true && limit-- > 0) {
            let rangeTree = this.calculateRangeTree(res, nodeWidth);
            let rangeTreeNodesByLevel = rangeTree.getNodesByLevel();
            
            let isChanged = false;
            for (let level = 0; level < nodesByLevel.length; level++) {
                for (let i = 1; i < nodesByLevel[level].length; i++) {
                    // TODO parameterize margin
                    if (rangeTreeNodesByLevel[level][i].value.min < rangeTreeNodesByLevel[level][i-1].value.max + 10) {
                        // TODO parameterize margin
                        
                        nodesByLevel[level][i].value = rangeTreeNodesByLevel[level][i-1].value.max + 10;
                        rangeTreeNodesByLevel[level][i].value.max = nodesByLevel[level][i].value + nodeWidth;
                        isChanged = true;
                    }
                }            
            }
            if (!isChanged)
                break;

        }

        // make sure children are not before their parents
        // (then, align parents)
        for (let level = 1; level < nodesByLevel.length; level++) {
            for (let i = 0; i < nodesByLevel[level].length; i++) {
                let thisNode = nodesByLevel[level][i]
                let parent = thisNode.parent;
                // TODO parameterize margin
                if (thisNode.value + nodeWidth < parent?.value) {
                    let moveRightBy = parent?.value - thisNode.value;
                    parent?.children.forEach(child => child.value += moveRightBy);
                }
            }
        }

        // align parents
        for (let level = nodesByLevel.length-2; level > 0; level--) {
            for (let i = 0; i < nodesByLevel[level].length; i++) {
                let thisNode = nodesByLevel[level][i]
                if (thisNode.children.length == 0)
                    continue;

                let sum = 0;
                thisNode.children.forEach(child => sum += child.value);
                let temp = thisNode.value;
                thisNode.value = sum / thisNode.children.length;

                // move right siblings right (if there are any and the collide)
                let siblings : Tree[] = thisNode.parent?.children as Tree[];
                let thisNodeIndex = siblings.indexOf(thisNode);
                // TODO parameterize margin
                
                if (thisNode.value < siblings[thisNodeIndex + 1]?.value)
                    continue;

                for (let j = thisNodeIndex + 1; j < siblings.length; j++) {
                    siblings[j].value += thisNode.value - temp;
                }
            }
        }

        // align root
        let sum = 0;
        res.children.forEach(child => sum += child.value);
        res.value = sum / res.children.length;

        return res;
    }

    private calculateRangeTree(tree: Tree, nodeWidth: number) {
        if (tree.children.length == 0)
            return new Tree({ min: tree.value, max: tree.value + nodeWidth }, []);
        
        let ranges: Tree[] = tree.children.map((child, i) => this.calculateRangeTree(child, nodeWidth));
            
        let min = tree.value,
            max = tree.value + nodeWidth;

        ranges.forEach(range => {
            min = Math.min(range.value.min, min);
            max = Math.max(range.value.max, max);
        });

        return new Tree({ min, max }, ranges);
    }

    private calculateMaxWidthTree(tree: Tree) {
        if (tree.children.length == 0)
            return new Tree(1, []);
        
        let maxWidths: Tree[] = tree.children.map(child => this.calculateMaxWidthTree(child));
            
        let max = tree.children.length;
        maxWidths.forEach(maxWidth => max = Math.max(max, maxWidth.value));

        return new Tree(max, maxWidths);
    }

    splitStringToSentences(str: string, maxWidth: number) {
        let res : string[] = [];
        let words = str.trim().split(/\s+/)
        if (words.length == 0)
            return res;


        let span = document.createElement('span')
        span.style.visibility = 'hidden'
        document.body.appendChild(span)

        let sentence = words[0]
        span.textContent = sentence;
        if (span.getBoundingClientRect().width > maxWidth)
            res.push(sentence);

        let lastAppended = false;
        for (let i = 1; i < words.length; i++) {
            let nextSentece = sentence + ' ' + words[i]
            span.textContent = nextSentece;
            if (span.getBoundingClientRect().width > maxWidth) {
                res.push(sentence);
                sentence = words[i];

                if (i == words.length - 1)
                    lastAppended = true;
            } else
                sentence = nextSentece;

        }
        if (!lastAppended)
            res.push(sentence);

        document.body.removeChild(span);
        return res;
    }
}

export { TreeVisualizer }