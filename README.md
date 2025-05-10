# 营养食堂微信小程序

这是一个基于uniapp+vue2的微信小程序项目。

## 使用方法

1. 使用微信开发者工具打开项目
   - 直接导入根目录 `D:\ruanjianbei\yingyang`
   - 或者导入编译后的小程序目录 `D:\ruanjianbei\yingyang\unpackage\dist\dev\mp-weixin`

2. 开发模式
   - 项目已配置使用 `touristappid` 进行开发，不需要正式的AppID也可运行
   - 已解决添加到购物车时的认证问题

3. 生产环境
   - 如需发布正式版本，请在 `manifest.json` 和 `project.config.json` 中替换为您自己的AppID

## 功能特点

- 菜品分类展示
- 营养信息详情
- 购物车功能
- 个人中心

## 开发说明

本项目使用了自定义通知组件 `CartNotifier` 来解决在使用 `touristappid` 时无法显示 `uni.showToast` 的问题。 