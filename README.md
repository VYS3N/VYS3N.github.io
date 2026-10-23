# VYS3N personal website

基于 Astro 的个人主页与 Markdown / MDX 博客。中文界面在 `/`，英文界面在 `/en/`。切换界面语言时，文章正文保持原文。

访问地址：**https://vys3n.github.io/**

## 本地使用

需要 Node.js 24 或更新的受支持版本。

```bash
npm ci
npm run dev
```

终端会显示本地预览地址。开发服务器只监听本机。开发模式会展示草稿与未来日期文章，便于预览；正式构建会排除它们。

```bash
npm run check
npm run build
npm run preview
```

`npm run check` 检查类型和内容结构；`build` 抓取公开 GitHub 动态与配置的朋友 RSS，再生成 `dist/`。外部接口失败不会阻止网站构建，会显示真实的不可用或空状态。

## 第一次开启 GitHub Pages

1. 打开仓库 Settings → Pages。
2. 在 Build and deployment 中把 Source 设为 **GitHub Actions**。
3. 推送 `main`，或在 Actions → Deploy website to GitHub Pages → Run workflow 手动运行。

工作流自动安装依赖、检查类型、构建并部署。每天北京时间约 08:20 也会重建，以更新 GitHub 动态、朋友圈和定时文章；GitHub 计划任务可能延迟，不能作为精确到分钟的发布机制。

## 修改公开资料

主要配置：`src/data/site.json`。

- `name`、`title`：公开名称和站名，默认只使用 VYS3N。
- `description`、`tagline`：可填写 `{ "zh": "中文", "en": "English" }`。
- `avatar`：例如 `/images/avatar.jpg`；图片放入 `public/images/`。
- `github`、`email`、`scholar`、`cv`：联系方式与简历，不填就隐藏。简历可以放在 `public/cv.pdf`。
- `startDate`：站点运行起始日期，按北京时间计算。
- `walineServer`：Waline 服务地址，默认空字符串。
- `sponsorUrl`：可选的赞助页面或收款图片路径，不填就隐藏。
- `education`、`interests`、`publications`、`projects`、`tools`、`mirrors`：结构化资料，默认空数组。

个人介绍正文写入 `src/content/pages/about.md`；学术或专业经历正文写入 `src/content/pages/academic.md`。

结构化资料示例仅用于说明格式，请替换为真实内容：

```json
{
  "education": [{ "title": { "zh": "学校或单位", "en": "Institution" }, "detail": { "zh": "方向或职位", "en": "Program or role" }, "start": "2026.09", "end": "", "url": "https://example.com" }],
  "interests": [{ "zh": "一个关注方向", "en": "An area of interest" }],
  "publications": [{ "title": "成果标题", "authors": "作者", "venue": "发表渠道", "year": 2026, "url": "https://example.com", "code": "https://github.com/VYS3N" }],
  "projects": [{ "title": { "zh": "项目名称", "en": "Project name" }, "description": { "zh": "项目介绍", "en": "Project description" }, "url": "https://github.com/VYS3N", "tags": ["Python"], "image": "/images/project.jpg" }],
  "tools": [{ "name": "工具名", "description": { "zh": "用途", "en": "Purpose" }, "url": "https://example.com" }],
  "mirrors": [{ "name": "镜像站", "url": "https://example.com" }]
}
```

## 写一篇文章

```bash
npm run new:post -- "我的第一篇文章" --slug first-post --category tech
```

文件生成于 `src/content/posts/first-post.md`，默认为草稿，不会正式发布。支持的分类有 `tech`（技术）、`research`（学习与思考）、`daily`（日常）、`journal`（月记）。也可以复制 `content/templates/post.md` 到文章目录。

需要页签、折叠、步骤、卡片、图集或视频等组件时，增加 `--mdx`：

```bash
npm run new:post -- "我的组件文章" --slug my-components --category tech --mdx
```

组件已内置，无需 import。完整示例在 `content/templates/writing.mdx`；详细接口见 [MDX 写作组件指南](docs/writing-components.md)。MDX 文件只使用自己编写或检查过的源码。普通 `.md` 写作方式保持不变。

文章头部的字段：

```yaml
title: "文章标题"
description: "文章摘要"
date: "2026-10-23"
slug: "first-post"
category: tech
tags: ["Python", "笔记"]
lang: zh
draft: false
comments: true
```

- `draft: false` 且日期已到，才会进入正式网站、搜索索引、RSS 和统计。
- 纯日期字符串按北京时间零点解释；需要指定时刻时，用包含时区的 ISO 字符串，例如 `2026-10-23T18:00:00+08:00`。
- `slug` 使用小写英文字母、数字与连字符，保持稳定；`all` 和分类名是保留字。
- 可选 `updated`、`cover`、`coverAlt`、`coverCredit`、`collection`、`order`。
- 正文支持 Markdown、代码高亮和复制、表格、脚注、KaTeX 数学公式、Mermaid 图表、图片放大、文章目录与分享二维码。
- 图片放在 `public/images/`，Markdown 中用 `![图片说明](/images/example.jpg)` 引用。

完成后提交与推送：

```bash
git add src/data src/content public
git commit -m "Update website content"
git push origin main
```

## 合集、标签和归档

标签和按年归档由文章自动生成。合集可在 `src/data/collections.json` 定义：

```json
[{ "slug": "my-series", "title": { "zh": "我的系列", "en": "My series" }, "description": { "zh": "系列简介", "en": "A short description" } }]
```

相应文章添加 `collection: my-series` 和 `order: 1`。未预先定义的合集也会按文章中的合集标识生成。

## 友链和朋友圈

编辑 `src/data/friends.json`：

```json
[{ "name": "朋友的网站", "url": "https://example.com", "description": "网站简介", "avatar": "https://example.com/avatar.jpg", "rss": "https://example.com/rss.xml" }]
```

只有配置了有效 RSS 的朋友才会参与朋友圈聚合。RSS 由构建过程抓取，访客浏览器不需要跨域读取朋友的网站。只读取公开 HTTP/HTTPS 地址；抓取失败时保留清晰空状态，不生成假动态。

## 开放 Waline 评论与阅读量

前端接入已实现，实际评论、回复、邮件通知与计数需要独立运行的 Waline 服务。

1. 按 Waline 官方文档部署你自己的服务：https://waline.js.org/guide/get-started/
2. 在服务端设置自己的 `SITE_NAME`、`SITE_URL` 和 `SECURE_DOMAINS`。本地测试如需放行，请同时加入本地地址。
3. 在 `src/data/site.json` 的 `walineServer` 填写服务的 HTTPS 根地址，例如 `https://comments.example.com`，然后重新构建、推送。
4. 如需要邮件通知、评论审核、登录限制、验证码或上传图片，请按服务端实际需要配置。默认前端允许匿名昵称评论；邮箱与网站可选，图片上传和 GIF 搜索未启用。

空地址时不会加载 Waline 服务，页面如实显示“评论暂未开放”。加载服务失败时提供重试按钮。中英文文章页共用同一条评论路径，避免语言切换后讨论被拆开。邮件凭据、数据库密码及服务端密钥只配置在 Waline 服务端，不要写入本仓库。

## 页面和功能

- 首页、介绍、学术/专业经历、项目、联系方式与可选简历。
- 博客分类、每页 10 篇文章、标签、按年归档、合集及合集内顺序导航。
- 全文搜索，支持中文和英文；可用 Ctrl/Cmd + K 打开搜索。
- 文章目录定位、高亮、代码复制、公式、Mermaid、图片大图、阅读进度、前后文章、相关文章、链接与二维码分享。
- 浅色、深色、跟随系统三种主题；中英文界面；响应式导航和键盘操作。
- 真实 GitHub 贡献图、朋友 RSS 聚合、RSS 订阅、sitemap、robots、社交分享 metadata 与文章结构化数据。
- Waline 匿名评论、回复及阅读量接入。
- 站点说明、隐私、使用、版权和内容说明页面，以及 404 页面。

站点说明是基础文案，请在填写实际资料和开启外部服务后复核其描述是否仍与站点行为一致。

## 测试与原站备份

```bash
npm run test:site
```

测试会启动本地静态服务器，用已安装的 Chrome/Edge 或 Playwright Chromium 检查中英文、明暗主题、手机导航、内部链接和空状态。测试用的临时文章验证还覆盖搜索、目录、代码复制、二维码、分页、标签、合集、公式、图表及草稿过滤；临时文章不会提交到仓库。

旧版网站完整备份位于 `work/legacy-site/`，`work/` 被 `.gitignore` 排除。源码仓库中不携带旧版个人资料。构建产物 `dist/`、依赖、测试截图与本地临时文件也不会提交。

## 设计参照

信息架构和功能参照 https://axi404.top/ ，以独立源码实现。未复制参照站的个人资料、文章、图片、访客数据或服务配置。

参考主题公开于 https://github.com/Axi404/Axi-Theme 。此次通用写作组件的具体对照与边界见 [功能对照](docs/reference-review.md)。
