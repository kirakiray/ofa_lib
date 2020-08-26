Component({
    tag: "fnt-input",
    temp: true,
    attrs: {
        // 类型
        type: "text",
        // 最大长度
        maxlength: null,
        // 占位
        placeholder: null,
        // 下面的颜色
        theme: null,
        // 是否可清除
        clearable: null,
        // 无效
        disabled: null,
        // 最小最大值
        min: null,
        max: null,
        // 是否反色
        inverted: null,

    },
    data: {
        value: ""
    },
    watch: {
        theme(e, color) {
            if (color) {
                if (color && !/^rgb/.test(color.trim()) && !/^#/.test(color.trim())) {
                    // 不是颜色开头的，设置变量色
                    color = `var(--fnt-${color})`;
                }
                this.$innerLine.style.backgroundColor = color;
            } else {
                this.$innerLine.style.backgroundColor = "";
            }
        },
        type(e, type) {
            if (type == "range") {
                console.error("can use type range");
                this.type = "";
            }
        }
    },
    ready() {
        if (this.attrs.value) {
            // 设置一次value上的值
            this.value = this.attrs.value
        }
    }
});