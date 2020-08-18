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

### 加载成功后的数据变动 `loaded`

默认情况下，o-md初始化完成后，会自动给元素设定 `loaded` 属性值为 `1`；

当 `o-md` 上存在 `src` 的值时，`loaded` 属性会被移处，直到 `src` 内的资源被载入成功后，才会再次设置回 `loaded` 属性；

```html
<body>
    <o-md src="xxxx.md" id="targetMD"></o-md>
</body>
<script>
console.log($("#targetMD").attrs.loaded);   // => null

// 一段时间后，xxxx.md 载入成功，loaded会变成1
setTimeout(()=>{
    console.log($("#targetMD").attrs.loaded);   // => "1"
},1000);
</script>
```

因此，可以监听 `loaded` 属性变动，来断定 `src` 设定的资源是否载入成功。

```javascript
$("o-md").watch("loaded",(e,loaded)=>{
    if(loaded === null){
        // 加载资源中
    }else if(loaded){
        // 资源加载成功
    }
});
```

因为`loaded`变动会反应在元素属性上，所以可以通过css选择器对未加载成功的 `md`资源，进行过渡处理；

```html
<style>
    o-md{
        width:320px;
        height:480px;
        opacity:0;
        transition:opacity ease .3s;
    }

    o-md[loaded="1"]{
        opacity:1;
    }
</style>

<body>
    <o-md src="xxxx.js"></o-md>
</body>
```

## 依赖的第三方库

[markedjs](https://github.com/markedjs/marked)

[hljs-dark](https://github.com/dracula/highlightjs)

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)