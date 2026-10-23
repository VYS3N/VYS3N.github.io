# VYS3N 的 Waline 部署步骤

选定方案：Vercel 运行 Waline，Neon 保存评论、回复和阅读量。前端代码已接入；`src/data/site.json` 的 `walineServer` 仍为空，需完成下面的服务部署后再填写。

本指南核对于 2026-10-23，依据 [Waline 官方 Vercel 部署文档](https://waline.js.org/guide/deploy/vercel.html) 和 [服务端环境变量文档](https://waline.js.org/reference/server/env.html)。

## 1. 创建独立的 Waline 项目

打开 [Waline 官方一键部署入口](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample)，用自己的 GitHub 账号登录 Vercel，创建名为 `vys3n-waline` 的项目。

此入口会从官方模板建立新的服务仓库。网站继续通过原来的 GitHub Pages 工作流发布。

首次部署若出现数据库尚未连接的错误，继续完成数据库配置，再重新部署。

## 2. 创建并连接 Neon

1. 在 Vercel 项目中进入 **Storage → Create Database**，从 Marketplace 选择 **Neon**。
2. 按页面提示创建或连接自己的 Neon 账号。创建新数据库时核对所选套餐和额度；页面实际显示的价格及条款为准。
3. 选择 **Connect → Connect Project**，确保数据库连接到 `vys3n-waline` 项目，并用于 Production 环境。
4. 通过 **Open in Neon** 进入 Neon，打开 **SQL Editor**。
5. 在新建的空数据库执行 [官方 waline.pgsql](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql)。这会创建 `wl_comment`、`wl_counter`、`wl_users` 等表和对应序列。只在这次新建的空数据库初始化一次。

数据库连接信息由平台注入。密码、连接串和令牌留在平台的环境变量中。

## 3. 填写站点信息并重新部署

在 Vercel 项目的 **Settings → Environment Variables** 设置：

| 名称 | 值 |
| --- | --- |
| `SITE_NAME` | `VYS3N` |
| `SITE_URL` | `https://vys3n.github.io` |
| `SECURE_DOMAINS` | `vys3n.github.io,实际的Waline服务域名` |

例如实际服务域名为 `vys3n-waline-example.vercel.app`，最后一行填写 `vys3n.github.io,vys3n-waline-example.vercel.app`。使用页面实际分配的域名；安全域名中不带协议、路径或结尾斜杠。

匿名评论使用服务的默认登录策略，不设置 `LOGIN=force`。前端已经要求昵称，邮箱和个人网站可选，并提供回复功能。

进入 **Deployments**，对最新部署执行 **Redeploy**，让数据库与环境变量生效。部署为 **Ready** 后，通过 **Visit** 取得公开的 HTTPS 服务根地址。

## 4. 注册管理员并接上网站

立即在自己的服务地址后加 `/ui/register` 注册管理员。Waline 官方说明首个注册的账户会成为管理员；密码由你自行设置和保管。

将公开的 HTTPS 服务根地址提供给网站维护流程即可，不需要提供管理密码或数据库凭据。

接入时会检查公开评论接口、跨域访问和计数接口，再把地址写入 `src/data/site.json` 的 `walineServer`，构建并发布网站。未确认服务可用前不填写假地址。

中英文页面共用评论路径。每篇文章的 `comments: true` 控制是否显示评论；阅读量在文章页显示。目前还没有正式文章，服务接通后可先在“关于”或“友链”页检查评论框。

## 5. 维护入口

评论管理位于服务的 `/ui`。服务升级和重部署在独立的 Waline 项目中处理；日常文章仍在本网站仓库中以 Markdown / MDX 提交。

评论、回复和阅读量不依赖邮件通知；以后如需邮件通知，可以单独在 Waline 服务端设置 SMTP。网站的隐私说明应与最终启用的外部服务保持一致。
