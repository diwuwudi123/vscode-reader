import * as vscode from 'vscode';
import { TreeNode } from "./treeNode";
import { readerDrive } from '../reader';
class NodeManager implements vscode.Disposable {
    public treeNode: TreeNode[] = [];
    public dispose(): void {
        this.treeNode = [];
    }
    public getChildren(): TreeNode[] {
        return this.treeNode;
    }
    public getChapter(element: TreeNode): Promise<TreeNode[]> {
        return readerDrive.getChapter(element)
    }
}
export const nodeManager: NodeManager = new NodeManager();