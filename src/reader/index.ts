import axios from 'axios';
import * as cheerio from "cheerio"
import { Domain } from 'domain';
import { TreeNode, defaultTreeNode } from '../explorer/treeNode';
const DOMAIN = 'https://m.qidian.com';

class ReaderDrive {
    public search(title: string): Promise<TreeNode[]> {
        console.log("read drive search")
        // return new Promise(function (resolve) {
        //     resolve(Drive.search(title))
        // })
        return Reader.search(title)
    }
    public getChapter(treeNode: TreeNode): Promise<TreeNode[]> {
        var { bookIdMatch } = JSON.parse(treeNode.path)
        return Reader.getChapter(bookIdMatch)
    }
    public getContext(treeNode: TreeNode): Promise<string> {
        return Reader.getContext(treeNode)
    }
}

class QidianReader {
    public search(title: string): Promise<TreeNode[]> {
        console.log(" drive search")
        return new Promise(function (resolve) {
            axios.get(DOMAIN + "/search?kw=" + encodeURI(title)).then((res) => {
                const $ = cheerio.load(res.data)
                var result: TreeNode[] = []

                $(".book-li").each(function (i: number, elem: any) {
                    title = $(elem).find(".book-title").text()
                    var bookIdMatch = $(elem).find('.book-layout').attr().href.match('book/(\\d+).');
                    console.log(bookIdMatch)
                    if (bookIdMatch) {
                        result.push(
                            new TreeNode(
                                Object.assign({}, defaultTreeNode, {
                                    type: ".qidian",
                                    name: title,
                                    path: JSON.stringify({ bookIdMatch: bookIdMatch[1] }),
                                    isDirectory: true,
                                })

                            )
                        )
                    }
                })
                resolve(result)
            })

        })

    }
    public async getChapter(bookid: string): Promise<TreeNode[]> {
        var res = await axios.get(DOMAIN + "/book/" + bookid + "/catalog")
        var result: TreeNode[] = []
        var reg = /g_data.volumes = (.*?)\n/.exec(res.data);
        if (reg) {
            var data: any | null = eval(reg[1])
            data.forEach(function (e: any) {
                e.cs.forEach(function (cs: any) {
                    console.log(cs)
                    result.push(
                        new TreeNode({
                            type: "qidian",
                            name: cs.cN,
                            isDirectory: false,
                            path: JSON.stringify({ bookid: bookid, csid: cs.id }),
                            children: []
                        })
                    )
                })
            });
        }
        return result
    }
    public async getContext(treeNode: TreeNode): Promise<string> {
        var { bookid, csid } = JSON.parse(treeNode.path)
        var bookUrl = DOMAIN + "/book/" + bookid + "/" + csid
        var res = await axios.get(bookUrl)
        var $ = cheerio.load(res.data)
        var text = $('#chapterContent .read-section p').map(function (i, el) {
            return $(this).text()
        }).get().join("\r\n")
        return text
    }
}
export const Reader = new QidianReader();
export const readerDrive = new ReaderDrive()