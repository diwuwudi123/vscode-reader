import { ViewColumn } from 'vscode';

export interface IReader {
    type: string;
    name: string;
    isDirectory: boolean;
    path: string;
    children: IReader[];
}
export interface IWebviewOption {
    title: string;
    viewColumn: ViewColumn;
    preserveFocus?: boolean;
}