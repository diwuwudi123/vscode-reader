
import * as vscode from "vscode"
import { nodeManager } from "../explorer/NodeManager";
import { readerDrive } from "../reader"
import { treeViewProvider } from "../explorer/treeDataProvider";
import { TreeNode } from "../explorer/treeNode";
import { IWebviewOption } from "../types";
export const SearchOnline = async function () {
    var msg = await vscode.window.showInputBox({
        placeHolder: "小说名称",
        ignoreFocusOut: false,
    });
    if (msg) {
        vscode.window.showInformationMessage(msg)
        _SearchOnline(msg)
    }
}
async function _SearchOnline(msg: string) {
    const treeNode = await readerDrive.search(msg)
    treeViewProvider.fire();
    nodeManager.treeNode = treeNode
}
export const openReadView = async function (treeNode: TreeNode) {
    var text = await readerDrive.getContext(treeNode)
    view.showView(text, treeNode.name)
}
class View implements vscode.Disposable {
    protected panel: vscode.WebviewPanel | undefined;
    private listeners: vscode.Disposable[] = [];

    dispose() {
    }

    protected getWebviewOption(): IWebviewOption {
        return {
            "title": "",
            "viewColumn": vscode.ViewColumn.Active,
            "preserveFocus": false,
        }
    }

    showView(text: string, title: string) {
        var { viewColumn, preserveFocus } = this.getWebviewOption()
        this.panel = vscode.window.createWebviewPanel("reader-view", title, { viewColumn, preserveFocus }, {
            enableScripts: true,
            enableCommandUris: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
        })

        this.panel.webview.html = text
    }
}
export const view: View = new View();