# 简介
dadamp(dada mini program)
是一套遵循微信原生语法规范(https://developers.weixin.qq.com/miniprogram)的多端适配方案

## 核心功能

1）一套微信原生代码产出其它原生小程序（微信/百度/支付宝..）
    适用场景
	1，将已有微信小程序快速产出百度/支付宝等原生小程序
	2，希望可以多端适配的新原生小程序项目

2）小程序端采用webview方案，实现一套H5可以在小程序端使用
    适用场景
    1，需要提高人效，一份代码可以同时适用于移动端/WEB端/各小程序端

## 特性

微信原生 语法风格
支持将已有原生小程序编译成百度/支付宝小程序
多平台支持（微信/百度/支付宝）
完善的小程序webview应用支持（移动端/WEB端/小程序）
脚手架支持

## 安装

首先, 安装`Yeoman`和`generator-dadamp`:

```bash
yarn global add yo generator-dadamp
```

## 创建新项目

```bash
yo dadamp
```

## 升级旧项目

```bash
cd YOUR_PROJECT_FOLDER
yo dadamp --upgrade
```
## 开发文档
https://github.com/NewDadaFE/dadamp/blob/master/app/templates/README.md