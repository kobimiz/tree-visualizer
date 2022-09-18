import { Tree } from './tree'
import { TreeVisualizer } from './treeVisualizer'

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

let rectWidth  = 150
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    if (ctx === null) {
        console.error("canvas.getContext returns null");
        return;
    }

    ctx.font = "16px Arial";
    
    // TODO vertical justification (vertican overflow?)
    const treeViz = new TreeVisualizer(ctx)
    const posTree = treeViz.calculatePositionTree(tree0, rectWidth);

    treeViz.drawTreeByPos(tree0, posTree, 100, rectWidth);
})