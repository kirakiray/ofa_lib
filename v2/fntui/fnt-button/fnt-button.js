Component({
    tag: "fnt-button",
    temp: true,
    attrs: ["theme", "disabled", "type", "iconOnly"],
    data: {
        disabled: null,
        // 默认null为按钮     circle 圆形模式    text 文本模式     outlined 颠倒模式
        type: null,
        theme: null,
        // 是否深色模式（深色模式字体为白色，背景叠加色更深一点）
        deepmode: 0,
        // 没有边距的模式
        iconOnly: null
    },
    watch: {
        theme() {
            this.refreshUI();
        },
        type() {
            this.refreshUI();
        }
    },
    proto: {
        refreshUI() {
            let color = this.theme;

            if (color && !/^rgb/.test(color.trim()) && !/^#/.test(color.trim())) {
                // 不是颜色开头的，设置变量色
                color = `var(--fnt-${color})`;
            }

            let colorStyleEle = this.$colorStyle;
            colorStyleEle.html = "";

            // 获取rgb
            let colorStr = this.$shadow.$('.btn').css.backgroundColor.replace(/rgba?\((.+)\)/, "$1")

            // 是不是深色
            let isDeep = 0;

            if (color) {
                if (this.type == null || this.type == undefined || this.type == "circle") {
                    // 默认样式
                    colorStyleEle.html = `
                    .btn{
                        background-color:${color};
                        border-color:${color};
                    }
                    `;

                    colorStr.split(",").forEach((e, i) => {
                        if (i <= 2 && parseInt(e) < (255 / 2)) {
                            // 有深色的，就进入深色模式
                            isDeep = 1;
                        }
                    });
                } else if (this.type == "text") {
                    colorStyleEle.html = `
                    .btn{
                        background-color:transparent;
                        border-color:transparent;
                        color:${color};
                    }
                    `;
                } else if (this.type === "outlined") {
                    colorStyleEle.html = `
                    .btn{
                        background-color:transparent;
                        border-color:${color};
                        color:${color};
                    }
                    .btn:hover .bg{
                        background-color:${color};
                        opacity:.05;
                    }
                    .btn:active .bg{
                        background-color:${color};
                        opacity:.1;
                    }
                    `;
                }

                this.deepmode = isDeep;
            } else {
                if (this.type === "outlined") {
                    colorStyleEle.html = `
                    .btn{
                        color:white;
                    }
                    .btn:hover .bg{
                        background-color:#fff;
                        opacity:.1;
                    }
                    .btn:active .bg{
                        background-color:#fff;
                        opacity:.2;
                    }
                    `;
                }

                this.deepmode = 0;
            }
        },
        clickBtn(e) {
            if (this.disabled != undefined && this.disabled != null) {
                e.bubble = false;
            }
        }
    }
});