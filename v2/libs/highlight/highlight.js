define(async (load) => {
    try {
        // 优先加载线上资源ƒ
        await load(`${location.protocol}//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js`, `${location.protocol}//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/default.min.css`);
    } catch (e) {
        // 加载自带资源
        await load("./highlight.min.js", "./default.min.css");
    }
});