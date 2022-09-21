import { Tree } from './tree'
import { TreeVisualizer } from './treeVisualizer'
import { TreeBuilder } from './treeBuilder'

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
const tree0 = new Tree('0', [tree1, tree2, tree3]);

let rectWidth  = 150

function pre(tree: Tree) {
    let res: string = tree.value;
    tree.children.forEach(child => {
        res += ' ' + pre(child);
    });

    return res;
}

function post(tree: Tree) {
    let res: string = '';
    tree.children.forEach(child => {
        res += post(child) + ' ';
    });

    res += tree.value;
    return res;
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    if (ctx === null) {
        console.error("canvas.getContext returns null");
        return;
    }

    ctx.font = "16px Arial";
    
    // TODO vertical justification (vertican overflow?)
    // const treeViz = new TreeVisualizer(ctx)
    // const posTree = treeViz.calculatePositionTree(tree0, rectWidth);

    // treeViz.drawTreeByPos(tree0, posTree, 100, rectWidth);



    // let prefix = '0 1 4 5 2 6 3 7 8',
    //     postfix = '4 5 1 6 2 8 7 3 0';

    // console.log(pre(tree0));
    // console.log(post(tree0));
    // console.log(TreeBuilder.treeFromPrePostScan(prefix, postfix));


    // let tree = TreeBuilder.generateRandomTree(5, 8);
    let tree23 = new Tree('23', []),
        tree24 = new Tree('24', []),
        tree25 = new Tree('25', []),
        tree26 = new Tree('26', []),
        tree27 = new Tree('27', []),
        tree28 = new Tree('28', []),
        tree6 = new Tree('6', []),
        tree17 = new Tree('17', []),
        tree8 = new Tree('8', []),
        tree14 = new Tree('14', [tree23, tree24]),
        tree15 = new Tree('15', [tree25]),
        tree16 = new Tree('16', [tree26, tree27, tree28]),
        tree5 = new Tree('5', [tree14, tree6]),
        tree7 = new Tree('7', [tree15, tree16, tree17]),
        tree1 = new Tree('1', [tree5]),
        tree2 = new Tree('2', [tree7, tree8]),
        tree0 = new Tree('2', [tree1, tree2]);
    

    TreeBuilder.indexTree(tree0);
    let prefix = pre(tree0),
    postfix = post(tree0);

    let fromScans = TreeBuilder.treeFromPrePostScan(prefix, postfix)

    const treeViz = new TreeVisualizer(ctx)
    const posTree = treeViz.calculatePositionTree(tree0, rectWidth);
    console.log(posTree);
    
    treeViz.drawTreeByPos(tree0, posTree, 100, rectWidth);
})