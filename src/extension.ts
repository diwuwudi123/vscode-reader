// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from "./command";
import { treeViewProvider } from './explorer/treeDataProvider';
import {
	SearchOnline,
	openReadView
} from "./funcs"
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "noval-reader" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// vscode.window.createTreeView()
	context.subscriptions.push(treeViewProvider,
		treeViewProvider,
		vscode.commands.registerCommand(Commands.openReadView, openReadView),
		vscode.commands.registerCommand(Commands.searchOnline, () => {
			// vscode.commands.executeCommand('setContext', 'noval-reader.panel', 'online');
			SearchOnline()
		}),
		vscode.window.createTreeView("reader-menu", {
			treeDataProvider: treeViewProvider,
			showCollapseAll: true
		})
	);

	// vscode.window.registerTreeDataProvider('reader-menu', treeViewProvider);


}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log("deactivate")
}
