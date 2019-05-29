# generator-multi-miniprogram

> Vue + Vuex + Vue Router + Vue Impression + Webpack 3

[English Version](./README_EN.md)

## 安装

首先, 安装`Yeoman`和`generator-multi-miniprogram`:

```bash
yarn global add yo generator-multi-miniprogram
```

然后创建新项目:

```bash
yo multi-miniprogram
```

或者升级旧项目:

```bash
cd YOUR_PROJECT_FOLDER
yo multi-miniprogram --upgrade
```

- 遵守[style-guide][style-guide]规范
- 使用[Vuex#Module][vuex-module]拆分 store
- 使用[Ramda#assocPath][ramda-assocpath]更新嵌套数据
- 使用[CSS Modules][css-modules]创建模块化样式

## License

MIT

[style-guide]: https://github.com/NewDadaFE/style-guide
[vuex-module]: https://vuex.vuejs.org/zh/guide/modules.html
[ramda-assocpath]: https://ramdajs.com/docs/#assocPath
[css-modules]: https://github.com/css-modules/css-modules
