define(async (load, exports, modules, moduleData) => {
    let srcs = ["./markdown.css"];

    if (!window.marked) {
        srcs.push("./marked.min.js");
    }

    if (!window.hljs) {
        srcs.push("./highlight/highlight.min.js");
    }

    await load(...srcs);

    // 注册markdown标签
    $.register({
        tag: "xd-md",
        data: {
            mdData: "",
            src: ""
        },
        attrs: ["src"],
        watch: {
            async src(e, val) {
                if (val) {
                    // 手动请求元素
                    let readme = await fetch(val);

                    // 读取文本模式
                    readme = await readme.text();

                    // 直接塞入
                    this.mdData = readme;
                }
            },
            mdData(e, context) {
                // 查找是否有img，有的话切换源
                let tSrc = this.src;
                let rootDir = tSrc.match(/.+\//);
                if (rootDir) {
                    rootDir = rootDir[0];
                }
                context = context.replace(/<img.*?>/g, (imgEleStr) => {
                    let newstr = imgEleStr.replace(/src=['"](.+?)['"]/, (srcStr, matchStr) => {
                        if (/^.+:/.test(matchStr)) {
                            return srcStr;
                        } else {
                            return srcStr.replace(matchStr, rootDir + matchStr);
                        }
                    });

                    return newstr;
                });

                // 塞入转换的文本
                this.$mdShower.html = marked(context);

                // 高亮
                this.$mdShower.ele.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                });

                this.text = "";
            }
        },
        temp: `
        <link rel="stylesheet" href="${moduleData.DIR}/github-markdown.css">
        <link rel="stylesheet" href="${moduleData.DIR}/highlight/hljs-dark.css">
        <style>
        pre {
            background: #282a36 !important;
        }
        </style>
        <div xv-content style="display:none;"></div>
        <div xv-tar="mdShower" class="markdown-body"></div>
        `,
        inited() {
            let text = this.text;

            // 获取content的内容
            this.mdData = text.trim();
        }
    });
});