# 技术栈

- 语言: `Typescript`
- 框架：`React Native` _(new architecture)_
- 状态管理：`zustand`
- 请求管理：`alova` _（同 web，方便直接从 web 移植请求方法）_
- 路由：`react-navigation`

# 安装

**需要按官网搭建安卓等运行环境**
安装依赖

`pnpm install`

android 运行：

`pnpm run android`

ios 暂未进行适配

# 调试

通过 android 安装好 app 后（每次对`/android`文件进行修改或安装新的依赖后需要重新安装 app），

`pnpm run start`即可进行调试

## 真机 usb 连接/模拟器

start 命令后即可进行调试

## 真机无线

如果手机和电脑在同一局域网，可以通过局域网 ip 进行调试

1. 打开 app 的 dev menu,选择`Change Bundle Location`
2. 输入`电脑IP:8081`即可调试

# 代办事项

1. 语音消息播放 `doing`
2. 视频消息播放 `doing`
3. 文件下载 `doing`
4. 清除本地缓存
5. 发送语音消息
6. 发送视频消息
7. 发送文件
8. 输入框@功能
9. 消息内容高亮@
10. 解析链接
11. 支持选择、发送表情
12. 主题切换
