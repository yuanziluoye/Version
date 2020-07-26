# Version

[A plugin for Typecho Blog Platform(一款Typecho博客平台的插件)](https://github.com/innc11/Version)

对文章增加简单的修改记录功能(包括文章和独立页面)，点击保存或者发布时就会被记录下来，可以通过编辑界面右侧的选项卡进行切换(位于__选项__和__附件__的旁边)

## 使用说明

1. 下载本插件，放在插件目录中，确保文件夹名为 `Version`
2. 在插件管理面板启用插件

### 记录

插件会自动记录文章和独立页面修改，点击**保存草稿**和**发布文章**时都会被记录

### 回退

1. 在文章或者独立页面编辑页点击右侧选项卡进行切换到历史版本窗口
2. 点击某个时间点可以进行回滚和删除

## 注意事项

1. 只能记录插件安装之后的编辑历史
2. 插件禁用时默认是不会删除所有的编辑历史的，如果有需要，可以在配置界面进行配置
3. 回退文章内容时页面会刷新并覆盖掉编辑器内为保存的内容，如有修改请先保存再回退

## 图片

如果图片加载不出来请点击这里直接访问：https://res.innc11.cn/pictures/version/20200725211151.png

![overview](https://res.innc11.cn/pictures/version/20200725211151.png)

## 版本历史

- 1.0 (20-7-25)
  - 首次发布
- 1.1 (20-7-25)
  - 支持预览功能
  - 优化部分代码
  - 修复一个草稿相关的问题
- 1.2 (20-7-26)
  - 支持版本标签功能
  - 修改界面样式和说明文字

## 代码参考

1. [Typecho项目](https://github.com/typecho/typecho)
2. [Access访问记录插件](https://github.com/kokororin/typecho-plugin-Access)
2. [Link友链插件](http://www.imhan.com/archives/typecho-links)
3. [EditorMD编辑器插件](https://dt27.org/php/editormd-for-typecho)