Component(async (load) => {
    if (!window.hljs) {
        await load("../libs/highlight/highlight.min.js");

        // 加载美化库
        // await load(`https://cdn.rawgit.com/beautify-web/js-beautify/v1.12.0/js/lib/beautify.js`, `https://cdn.rawgit.com/beautify-web/js-beautify/v1.12.0/js/lib/beautify-css.js`, `https://cdn.rawgit.com/beautify-web/js-beautify/v1.12.0/js/lib/beautify-html.js`);
    }

    await load("../libs/beautify/beautify", "../libs/beautify/beautify-css", "../libs/beautify/beautify-html");

    return {
        tag: "o-code",
        temp: true,
        props: {
            lang: "html"
        },
        data: {},
        ready() {
            // 获取templte的内容并设置
            let tempCode = this.$("template").html;

            switch (this.lang) {
                case "javascript":
                case "js":
                    tempCode = js_beautify(tempCode);
                    break;
                case "css":
                    tempCode = css_beautify(tempCode);
                    break;
                case "html":
                default:
                    tempCode = html_beautify(tempCode)
                    break;
            }

            // 转义特殊字符
            tempCode = tempCode.replace(/</g, "&lt;");
            tempCode = tempCode.replace(/>/g, "&gt;");

            this.$codeEle.html = tempCode;

            // 高亮区域的代码
            hljs.highlightBlock(this.$codeEle.ele);
        }
    };
});