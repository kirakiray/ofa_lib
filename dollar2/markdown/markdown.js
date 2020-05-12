Component(async (load, moduleData) => {
    let srcs = [];

    if (!window.marked) {
        srcs.push("./marked.min.js");
    }

    if (!window.hljs) {
        srcs.push("./highlight/highlight.min.js");
    }

    if (srcs.length) {
        await load(...srcs);
    }

    // 注册markdown标签
    return {
        tag: "xd-md",
        data: {
            mdData: "",
            src: ""
        },
        css: true,
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
        <div xv-tar="mdShower" class="markdown-body"></div>
        `,
        ready() {
            if (this.$("template")) {
                // 获取content的内容
                let html = this.$("template").html;

                let htmlArr = html.split(/\n/g);

                // 查找第一行有内容的
                let line_one, line_id = 0;
                while (true) {
                    line_one = htmlArr[line_id];
                    if (line_one.trim()) {
                        break;
                    }
                    line_id++;
                }

                // 数一数前面有多少个空格
                let space_match = line_one.match(/^\s+/);
                if (space_match) {
                    let space_str = space_match[0];

                    // 每一行前面都去除相同长度的空格
                    let reg = new RegExp(`^${space_str}`);
                    htmlArr = htmlArr.map(str => {
                        return str.replace(reg, "");
                    });

                    html = htmlArr.join("\n");
                }

                this.mdData = html;
            }
        }
    };
});