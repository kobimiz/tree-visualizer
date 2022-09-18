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
}

class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    isEmpty() {
        return this.items.length == 0;
    }
}

/**
 *           0
 *     1   2     3
 *   4  5 6     7
 *                8
 */
const tree8 = new Tree('8', []);
const tree7 = new Tree('7', [tree8]);
const tree3 = new Tree('3', [tree7]);
const tree4 = new Tree('4', []);
const tree5 = new Tree('5', []);
const tree1 = new Tree('1', [tree4, tree5]);
const tree6 = new Tree('6', []);
const tree2 = new Tree('2', [tree6]);
const tree0 = new Tree('Hello world my name is', [tree1, tree2, tree3]);

function drawNode(ctx, node, x, y) {
    let sentences = splitStringToSentences(node.value, rectWidth - 20); // padding
    let currY = y + 18;
    for (let i = 0; i < sentences.length; i++) {
        ctx.fillText(sentences[i], x + 5, currY);
        currY += 18;
    }
    ctx.rect(x, y, rectWidth, currY - y)
    ctx.stroke();

    return [rectWidth, currY - y];
}

function drawTree(ctx, tree, rootX, rootY) {
    if (!tree) return;
    
    let nodeDims = drawNode(ctx, tree, rootX, rootY);
    drawTree(ctx, tree.children[0], rootX - nodeDims[0] / 2, rootY + 20 + nodeDims[1]); // left
    drawTree(ctx, tree.children[1], rootX + nodeDims[0] / 2, rootY + 20 + nodeDims[1]); // right
}

function drawTreeByPos(ctx, tree, posTree, rootY, nodeWidth) {
    if (!tree) return;
    
    let nodeDims = drawNode(ctx, tree, posTree.value, rootY);
    
    tree.children.forEach((child, i) => {
        drawTreeByPos(ctx, child, posTree.children[i], rootY + 20 + nodeDims[1], nodeWidth);

        ctx.beginPath();
        ctx.moveTo(posTree.value + nodeWidth / 2, rootY + + nodeDims[1])
        ctx.lineTo(posTree.children[i].value + nodeWidth / 2, rootY + nodeDims[1] + 20);
        ctx.stroke();
    });
}

function getLevelsNodeCount(tree) {
    let q = new Queue();
    q.enqueue({ node: tree, depth: 0 });
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
function longestTreeLevel(tree) {
    const nodeCount = getLevelsNodeCount(tree);
    let maxIndex = 0;
    nodeCount.forEach((count, i) => {
        if (nodeCount[maxIndex] < count)
            maxIndex = i;
    });
    return maxIndex;
}

function cloneTreeStructure(tree) {
    if (!tree) return null;

    let children = tree.children.map(child => cloneTreeStructure(child))

    return new Tree(null, children);
}

function actionOnLevel(tree, level, action) {
    let q = new Queue();
    q.enqueue({ node: tree, depth: 0 });

    let nodeIndex = 0;

    while (!q.isEmpty()) {
        let { node, depth } = q.dequeue();

        if (depth == level) {
            action(node, nodeIndex);
            nodeIndex++;
        } else if (depth > level)
            return;

        for (let i = 0; i < node.children.length; i++)
            q.enqueue({ node: node.children[i], depth: depth + 1 });            
    }
}

function getNodesByLevel(tree) {
    let q = new Queue();
    q.enqueue({ node: tree, depth: 0 });
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

// TODO take care of node height
function calculatePositionTree(tree, nodeWidth) {
    let res = cloneTreeStructure(tree);
    const longestLevelIndex = longestTreeLevel(tree);

    let nodesByLevel = getNodesByLevel(res);
    nodesByLevel[longestLevelIndex].forEach((node, i) => {
        node.value = i * (nodeWidth + 10); // TODO parameterize margin
    });

    for (let i = longestLevelIndex - 1; i >= 0; i--) {
        for (let j = 0; j < nodesByLevel[i].length; j++) {
            let sum = 0;
            nodesByLevel[i][j].children.forEach(node => {
                sum += node.value
            });
            nodesByLevel[i][j].value = sum / nodesByLevel[i][j].children.length;
        }
    }

    for (let i = longestLevelIndex; i < nodesByLevel.length; i++) {
        for (let j = 0; j < nodesByLevel[i].length; j++) {
            for (let k = 0; k < nodesByLevel[i][j].children.length; k++) {
                nodesByLevel[i][j].children[k].value = nodesByLevel[i][j].value + k * nodeWidth
            }
        }
    }


    return res;
}

function getTreeIndices(tree) {    
    let clone = cloneTreeStructure(tree);
    clone.value = 0;
    
    let q = new Queue();
    q.enqueue({ node: clone, depth: 0 });
    let currDepth = 0;
    let indexInCurrLevel = -1;

    while (!q.isEmpty()) {
        let {node, depth} = q.dequeue();

        indexInCurrLevel++;

        if (depth > currDepth) {
            currDepth = depth;
            indexInCurrLevel = 0;
        }

        node.value = indexInCurrLevel;

        for (let i = 0; i < node.children.length; i++)
            q.enqueue({ node: node.children[i], depth: depth + 1 });            
    }

    return clone;
}

function printTree(tree) {
    if (!tree) return;

    console.log(tree.value);
    tree.children.forEach(child => printTree(child));
}


function treeDepth(tree) {
    if (!tree) return 0;

    return 1 + Math.max(treeDepth(tree.children[0]), treeDepth(tree.children[1]));
}

function splitStringToSentences(str, maxWidth) {
    let res = [];
    let words = str.trim().split(/\s+/)
    if (words.length == 0)
        return res;

        
    let span = document.createElement('span')
    span.style.visibility = 'hidden'
    document.body.appendChild(span)
        
    let sentence =  words[0]
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

let rectWidth  = 150
let rectHeight = 50
let padding = 5

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.font = "16px Arial";
    
    // TODO vertical justification (vertican overflow?)
    // drawNode(ctx, tree0, 100, 100);
    // drawTree(ctx, tree0, 200, 100);

    const posTree = calculatePositionTree(tree0, rectWidth);
    

    console.log('posTree', posTree)

    drawTreeByPos(ctx, tree0, posTree, 100, rectWidth);


    // let wTree = calculateTreeWidthsByLevel(tree0, 0, 1, 10);
    // console.log(wTree);


    // console.log(getTextWidthWordArray('hello world my name is kobi and i like to')[0].width)
    // console.log(getTextWidthWordArray('a')[0].width)
    // console.log(getTextWidthWordArray('b')[0].width)
    // console.log(getTextWidthWordArray('w')[0].width)
    // console.log(getTextWidthWordArray('abw')[0].width)
    
    // console.log('helo das dsa   ds andl nasd an dasd as   sdalk sa    '.trim().split(/\s+/));

    // let sentence = 'Hello world my name is kobi and i like to do stuff and i also do other stuff such as things etc yeah'
    // let words = sentence.trim().split(/\s+/)

    // let words2 = ['hi', 'there', 'hi there']
    // let words3 = ['naruto', 'uzumaki', 'naruto uzumaki']
    // let words4 = ['son', 'goku', 'son goku']

    // let words2Lengths = getWordLengths(words2)
    // let lineBreakIndices2 = getLinebreakIndices(words2Lengths,49)
    // console.log(words2Lengths);
    // console.log(lineBreakIndices2);
    // let words3Lengths = getWordsLengths(words3)
    // let words4Lengths = getWordsLengths(words4)

    // console.log(getWordsLengths(words));

    // ctx.beginPath();
    // ctx.moveTo(250, 125);
    // ctx.lineTo(125, 45 );
    // ctx.stroke();
})