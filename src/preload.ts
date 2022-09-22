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

    let tree23 = new Tree('23', []),
        tree24 = new Tree('24', []),
        tree25 = new Tree('25', []),
        tree26 = new Tree('26', []),
        tree27 = new Tree('27', []),
        tree31 = new Tree('31', []),
        tree30 = new Tree('30', []),
        tree29 = new Tree('29', []),
        tree28 = new Tree('28', [tree29,tree30,tree31]),
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