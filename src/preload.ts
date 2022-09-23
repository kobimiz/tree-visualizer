import { Tree } from './tree'
import { TreeVisualizer } from './treeVisualizer'
import { TreeBuilder } from './treeBuilder'

let rectWidth  = 100;

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const ctx = canvas.getContext('2d')
    if (ctx === null) {
        console.error("canvas.getContext returns null");
        return;
    }

    ctx.font = "16px Arial";

    let tree11 = new Tree('11', []),
        tree12 = new Tree('12', []),
        tree13 = new Tree('13', []),
        tree14 = new Tree('14', []),
        tree15 = new Tree('15', []),
        tree19 = new Tree('19', []),
        tree18 = new Tree('18', []),
        tree17 = new Tree('17', []),
        tree16 = new Tree('16', [tree17,tree18,tree19]),
        tree7 = new Tree('7', []),
        tree10 = new Tree('10', []),
        tree5 = new Tree('5', []),
        tree6 = new Tree('6', [tree11, tree12]),
        tree8 = new Tree('8', [tree13]),
        tree9 = new Tree('9', [tree14, tree15, tree16]),
        tree3 = new Tree('3', [tree6, tree7]),
        tree4 = new Tree('4', [tree8, tree9, tree10]),
        tree1 = new Tree('1', [tree3]),
        tree2 = new Tree('2', [tree4, tree5]),
        tree0 = new Tree('0', [tree1, tree2]);
    

    const treeViz = new TreeVisualizer(ctx)
    const posTree = treeViz.calculatePositionTree(tree0, rectWidth);
    treeViz.drawTreeByPos(tree0, posTree, 100, rectWidth);
    (document.getElementById('preOrder') as HTMLInputElement).value = tree0.scanPreOrder(),
    (document.getElementById('postOrder') as HTMLInputElement).value = tree0.scanPostOrder(),


    document.getElementById('generateTree')?.addEventListener('click', () => {
        document.getElementsByTagName('input')
        let preOrder = (document.getElementById('preOrder') as HTMLInputElement).value,
            postOrder = (document.getElementById('postOrder') as HTMLInputElement).value;

        let fromScans = TreeBuilder.treeFromPrePostScan(preOrder, postOrder);
        
        if (fromScans == null) {
            let errorsElement = document.getElementById('error');
            if (!errorsElement)
                throw 'No errors span';
            errorsElement.textContent = 'Invalid scans';
            return;
        }

        ctx.clearRect(0, 0, 1600, 600);

        const treeViz = new TreeVisualizer(ctx)
        const posTree2 = treeViz.calculatePositionTree(fromScans, rectWidth);
        
        treeViz.drawTreeByPos(fromScans, posTree2, 100, rectWidth);

        let errorsElement = document.getElementById('error');
        if (!errorsElement)
            throw 'No errors span';
        errorsElement.textContent = '';
});
})