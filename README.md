# vscode-plugin-fr-schema

## 安装

插件商店搜索 `FormRender` 或访问 [vscode 网上商店](https://marketplace.visualstudio.com/items?itemName=F-loat.vscode-plugin-fr-schema) 进行安装

## 使用

1. 打开任意 `.json` 文件，右上角出现进入编辑模式的 icon，表明已安装成功。点击此按钮可进入可视化编辑

   ![editor-button](https://img.alicdn.com/tfs/TB1RfZGjAcx_u4jSZFlXXXnUFXa-1919-1284.png)

2. 在表单设计器里完成编辑点击 “保存”。全流程如下

   ![overview](https://img.alicdn.com/tfs/TB1b53cmGNj0u4jSZFyXXXgMVXa-2740-1748.gif)

## 更多说明

- 唤起表单设计器的两种方式：

  1. 点击右上角的 icon (推荐)
  2. 右键 `.json` 文件，选择 `可视化编辑表单配置` 或 `open with formRender schema editor`（英文编辑器）

- 将 React PropTypes 解析为 schema 文件。右键任意 `.jsx` 文件，选择 `解析组件为表单配置`，具体配置方式可查看 [proptypes-to-json-schema](https://github.com/form-render/proptypes-to-json-schema) 文档

   ![proptypes](https://img.alicdn.com/tfs/TB1Mt4Cicieb18jSZFvXXaI3FXa-2736-1744.png)

- 将 schema 文件解析为 ts 类型定义。右键任意 `.json` 文件，选择 `解析表单配置为接口`

   ![interface](https://img.alicdn.com/tfs/TB1nI.NWrY1gK0jSZTEXXXDQVXa-2736-1744.png)

## 参与插件开发

- 克隆项目

```sh
git clone https://github.com/F-loat/vscode-plugin-fr-schema.git
```

- 安装依赖

```sh
npm install
```

- 调试插件

使用 VSCode 打开项目，执行 `npm run dev`，然后按下 F5 开始调试
