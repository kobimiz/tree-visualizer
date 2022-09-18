const { Tree } = require('./tree');

class TreeVisualizer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    drawNode(node, x, y, nodeWidth) {
        let sentences = this.splitStringToSentences(node.value, nodeWidth - 20); // padding
        let currY = y + 18;
        for (let i = 0; i < sentences.length; i++) {
            this.ctx.fillText(sentences[i], x + 5, currY);
            currY += 18;
        }
        this.ctx.rect(x, y, nodeWidth, currY - y)
        this.ctx.stroke();

        return [nodeWidth, currY - y];
    }

    drawTreeByPos(tree, posTree, rootY, nodeWidth) {
        if (!tree) return;

        let nodeDims = this.drawNode(tree, posTree.value, rootY, nodeWidth);

        tree.children.forEach((child, i) => {
            this.drawTreeByPos(child, posTree.children[i], rootY + 20 + nodeDims[1], nodeWidth);

            this.ctx.beginPath();
            this.ctx.moveTo(posTree.value + nodeWidth / 2, rootY + + nodeDims[1])
            this.ctx.lineTo(posTree.children[i].value + nodeWidth / 2, rootY + nodeDims[1] + 20);
            this.ctx.stroke();
        });
    }

    // TODO take care of node height
    calculatePositionTree(tree, nodeWidth) {
        let res = Tree.cloneTreeStructure(tree);
        const longestLevelIndex = tree.longestTreeLevel();

        let nodesByLevel = res.getNodesByLevel();
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

    splitStringToSentences(str, maxWidth) {
        let res = [];
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

module.exports = { TreeVisualizer };