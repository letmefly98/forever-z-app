# forever-z-app
使用 vite、vue-ts、electron 等技术，搭个自用的可视化脚本桌面应用

## 如何使用

### 桌面应用开发

```shell
# 安装依赖
pnpm i

# 启动桌面应用
pnpm run dev
# 仅启动网页
pnpm run dev:web

# 打包桌面应用
pnpm run build
```

### 自定义脚本

```shell
# 注册到全局
cd src/scripts && npm link

# 使用脚本
forZ check
```

## 注意事项

### electron 下载问题

若 `pnpm i` 时报 `node_modules/electron postinstall$ node install.js` 相关的错误，请运行以下命令：

```shell
pnpm config set electron_mirror "https://registry.npmmirror.com/-/binary/electron/"
pnpm config set electron_builder_binaries_mirror "https://mirrors.huaweicloud.com/electron-builder-binaries/"
```

## todo list

- [ ] 桌面端版本与更新问题
- [ ] 桌面端打包
- [ ] 桌面端与网页端互通
  - [x] IPC 通讯
  - [ ] stdout 问题
  - [x] 多窗口问题
  - [ ] 设计API
- [x] 脚本全局调用
- [ ] 脚本实现
  - [x] 番号名称规范化
  - [x] 番号名称规范检查
  - [x] 番号查找
  - [x] 番号链接提取
  - [x] 番号删除并缓存进已下载
  - [x] 影片合并
  - [ ] 删除空文件夹
  - [ ] 删除指定格式的所有文件
- [x] 文档与组件演示
- [x] 主题切换功能
- [x] 桌面端的初始化
- [x] 网页端的初始化
- [x] `tsconfig.json` 的配置
- [x] `eslint` 的配置
- [x] `pnpm workspace` 的初始化
- [x] `pnpm create vite website --template vue`
