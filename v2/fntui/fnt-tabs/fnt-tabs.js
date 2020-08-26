Component(async (load) => {
    await load("./fnt-tabs-item -p");

    return {
        tag: "fnt-tabs",
        temp: true,
        attrs: {
            // 是否锤子
            vertical: null,
            // 颜色
            color: null,
            // 是否反色模式
            inverted: null,
            // 线的颜色
            theme: null
        },
        watch: {
            vertical() {
                $.nextTick(() => {
                    this.refreshLine();
                });
            },
            theme(e, color) {
                if (color) {
                    if (color && !/^rgb/.test(color.trim()) && !/^#/.test(color.trim())) {
                        // 不是颜色开头的，设置变量色
                        color = `var(--fnt-${color})`;
                    }
                    this.$line.style.backgroundColor = color;
                } else {
                    this.$line.style.backgroundColor = "";
                }
            },
        },
        proto: {
            // 刷新UI的激活线
            refreshLine() {
                // await this.finish;

                let activeItem = this.$("fnt-tabs-item[active]");

                // 清空默认样式
                Object.assign(this.$line.style, {
                    width: "",
                    left: "",
                    height: "",
                    top: ""
                });

                if (!activeItem) {
                    // 初次设置
                    Object.assign(this.$line.style, {
                        width: 0 + "px",
                        height: 0 + "px"
                    });
                }

                // 设置非激活状态
                this._setUnActiveLine(activeItem);
            },
            // 设置激活line样式
            _setActiveLine(activeItem) {
                if (!(activeItem && this.includes(activeItem))) {
                    return;
                }
                if (this.vertical === null) {
                    Object.assign(this.$line.style, {
                        width: activeItem.width + "px",
                        left: activeItem.position.left + "px",
                    });
                } else {
                    Object.assign(this.$line.style, {
                        height: activeItem.height + "px",
                        top: activeItem.position.top + "px"
                    });
                }
            },
            // 设置line为非激活状态
            _setUnActiveLine(activeItem) {
                if (!(activeItem && this.includes(activeItem))) {
                    return;
                }
                if (this.vertical === null) {
                    Object.assign(this.$line.style, {
                        width: activeItem.width - 16 + "px",
                        left: activeItem.position.left + 8 + "px",
                    });
                } else {
                    Object.assign(this.$line.style, {
                        height: activeItem.height - 16 + "px",
                        top: activeItem.position.top + 8 + "px",
                    });
                }
            }
        },
        async ready() {
            this.on("click", "fnt-tabs-item", e => {
                if (e.target.is(`fnt-tabs-item[active]`)) {
                    // 如果已经是激活状态，就不用需要继续
                    return;
                }
                this.all(`fnt-tabs-item[active]`).forEach(e => e.attrs.active = null);
                e.target.attrs.active = "";
                this.refreshLine();
                $.nextTick(() => this._setActiveLine(e.target));
                this.emitHandler("changeTab", e.target);
            });

            setTimeout(() => {
                this.refreshLine();
            }, 300);

            // hover更新宽度
            this.on("mouseover", "fnt-tabs-item", e => {
                // 横向
                let activeItem = this.$("fnt-tabs-item[active]");

                // 判断是否跟激活状态相等，是的话就进行下划线修正
                if (e.target === activeItem) {
                    $.nextTick(() => this._setActiveLine(activeItem));
                }
            });

            this.on("mouseout", "fnt-tabs-item", e => {
                let activeItem = this.$("fnt-tabs-item[active]");

                if (e.target === activeItem) {
                    this._setUnActiveLine(activeItem);
                }
            });
        }
    };
});