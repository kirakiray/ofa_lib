# o-md

基于ofajs开发的，支持 markdown 展示的组件；

当前库采用MIT开源协议。

## 如何使用

ofajs加载完成后，使用`load`函数添加 `o-md` 库；

```html
<script src="ofa.js"></script>
<script>
    // 加载o-md库
    // load("https://kirakiray.github.io/ofa_lib/v2/o-md -p");
    load("@libs/o-md -p");
</script>
```

接下来，就可以直接在html内使用了；

```html
<body>
    <o-md>
        <template>
        # 我是大标题

        我是内容
        </template>
    </o-md>
</body>
```

可以用src方式打开 `.md` 文件；

```html
<o-md src="README.md">
    正在请求数据中；
</o-md>
```

主体数据在实例化对象的 `mdData` 属性内；


```javascript
$('o-md').mdData  // => 得到标签的markdown原始文本

$('o-md').mdData = `# title ...`; // => 直接设置 markdown 的内部文本
```

## 依赖的第三方库

[markedjs](https://github.com/markedjs/marked)

[hljs-dark](https://github.com/dracula/highlightjs)

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)