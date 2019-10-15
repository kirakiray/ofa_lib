((glo) => {
    // 存储仓库
    let xdTextData = new Map();

    // 添加注册函数
    const regText = (opts) => {
        let defaults = {
            target: "default",
            data: {},
            // 在监听中的数据
            inWatchs: new Set()
        };

        Object.assign(defaults, opts);

        // 判断有没有旧的
        let oldHostData = xdTextData.get(defaults.target);

        if (oldHostData) {
            // 清除旧的监听，转移到新对象上
            oldHostData.inWatchs.forEach(e => {
                oldHostData.data.unwatch(e.key, e.bindFun);
                defaults.data.watch(e.key, e.bindFun, true);
            });
        }

        xdTextData.set(defaults.target, defaults);
    }

    // 设置默认数据
    regText({
        data: $.xdata({})
    });

    // 设置全局控制对象
    glo.xdtext = {
        set: regText,
        // 获取目标数据
        get(targetName) {
            let tar = xdTextData.get(targetName)
            return tar && tar.data;
        },
        // 删除监听目标数据
        remove(targetName) { }
    };

    // 设置watch函数
    const setWatchFun = (_this) => {
        if (!_this._isAttached) {
            return;
        }

        // 寄存对象
        let hostData = xdTextData.get(_this.target);

        // 数据监听
        let bindFun;
        hostData.data.watch(_this.key, bindFun = e => {
            let { val } = e;
            if (val === undefined) {
                val = "";
            }
            _this.html = val;
        }, true);

        // 记录监听数据，方便后面的解除绑定
        let oldWatchObj = _this._oldWatchObj = {
            key: _this.key,
            bindFun
        };

        // 加入到兼容数组中
        hostData.inWatchs.add(oldWatchObj);
    }

    // 清除绑定
    const unsetWatchFun = (_this) => {
        let watchObj = _this._oldWatchObj;
        if (watchObj) {
            // 清除数据监听
            let hostData = xdTextData.get(_this.target);
            hostData.data.unwatch(watchObj.key, watchObj.bindFun);

            // 清除临时寄存数据
            hostData.inWatchs.delete(watchObj);
        }
    }

    Component({
        tag: "xd-text",
        data: {
            key: "",
            target: "default",
            // 是否已经添加进页面
            _isAttached: false
        },
        watch: {
            key(e, key) {
                setWatchFun(this);
            }
        },
        attached() {
            this._isAttached = true;

            // 设置监听函数
            setWatchFun(this);
        },
        detached() {
            this._isAttached = false;

            unsetWatchFun(this);
        }
    });
})(window);