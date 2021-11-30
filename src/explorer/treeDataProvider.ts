import * as vscode from "vscode";
import { TreeNode } from "./treeNode";
import { nodeManager } from "./NodeManager";
import { readerDrive } from "../reader";

class TreeViewProvider implements vscode.TreeDataProvider<TreeNode>, vscode.Disposable {
    private onDidChangeTreeDataEvent: vscode.EventEmitter<TreeNode | undefined | null> = new vscode.EventEmitter<TreeNode | undefined | null>();
    public readonly onDidChangeTreeData: vscode.Event<any> = this.onDidChangeTreeDataEvent.event;


    public dispose() {
        this.fire();
    }

    fire(): void {
        this.onDidChangeTreeDataEvent.fire(null);
    }
    public getTreeItem(element: TreeNode): vscode.TreeItem {
        return {
            label: element.name,
            iconPath: "",
            tooltip: element.name,
            collapsibleState: element.isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            command: !element.isDirectory ? element.previewCommand : undefined
        };
    }
    public async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        if (element) {
            console.log(element)
            return readerDrive.getChapter(element)
        }
        return nodeManager.getChildren();
    }
}
export const treeViewProvider: TreeViewProvider = new TreeViewProvider()