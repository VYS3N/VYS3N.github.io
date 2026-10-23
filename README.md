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

`npm run check` 检查类型和内容结构；`build` 抓取配置的朋友 RSS，再生成 `dist/`。外部接口失败不会阻止网站构建，会显示真实的空状态。

## 第一次开启 GitHub Pages

1. 打开仓库 Settings → Pages。
2. 在 Build and deployment 中把 Source 设为 **GitHub Actions**。
3. 推送 `main`，或在 Actions → Deploy website to GitHub Pages → Run workflow 手动运行。

工作流自动安装依赖、检查类型、构建并部署。每天北京时间约 08:20 也会重建，以更新朋友圈和定时文章；GitHub 计划任务可能延迟，不能作为精确到分钟的发布机制。

## 修改公开资料

主要配置：`src/data/site.json`。

- `name`、`title`：公开名称和站名，默认只使用 VYS3N。
- `description`、`tagline`：可填写 `{ "zh": "中文", "en": "English" }`。
- `avatar`：例如 `/images/avatar.jpg`；图片放入 `public/images/`。
- `github`、`email`、`scholar`、`cv`：联系方式与简历，不填就隐藏。简历可以放在 `public/cv.pdf`。
- `startDate`：站点运行起始日期，按北京时间计算。
- `giscus`：GitHub 评论仓库、仓库 ID 与讨论分类 ID，配置方法见下文。
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

## 网站内的站主后台

访问 https://vys3n.github.io/admin/ ，点击“使用访问令牌登录”。使用只授权 `VYS3N/VYS3N.github.io` 的 GitHub fine-grained personal access token，仓库权限选择 **Contents: Read and write**；Metadata 的只读权限会自动添加。本项目直接保存到 `main`，不使用 PR 审核流程。

后台提供文章编辑与预览、Markdown / MDX 管理、图片上传、介绍页面、主页资料、友链、合集和评论配置。保存会提交到仓库，再由 GitHub Actions 构建发布。新文章默认保留为草稿；关闭此项并保存，且发布日期已到，文章才会显示在公开网站。公开仓库中的草稿源码仍然公开。

令牌只在自己的后台页面输入，不写入源码。令牌创建步骤和退出方法见 [站主后台使用指南](docs/admin-guide.md)。MDX 使用源码编辑，预览不执行 JSX 组件；完整效果仍使用 `npm run dev` 查看。

## 开放 giscus 评论

评论由 giscus + GitHub Discussions 提供，访客使用 GitHub 登录后留言和回复。站主通过 GitHub 仓库权限管理讨论与评论。网站后台登录与评论登录是两个独立入口。

1. 仓库 Settings → General → Features 开启 **Discussions**。
2. 安装 [giscus GitHub App](https://github.com/apps/giscus)，只授权 `VYS3N.github.io`。
3. 在 [giscus 配置工具](https://giscus.app/zh-CN) 选择本站仓库及 **Announcements** 分类，将真实的 `repoId`、`categoryId` 填入 `src/data/site.json` 的 `giscus` 对象。
4. 提交并推送后，检查文章页或友链页的评论框。首次有人留言时，giscus 才会创建对应讨论。

缺少配置时显示“评论暂未开放”。加载失败时可以重试或使用 GitHub 讨论链接。中英文文章共用一个稳定的评论路径。`giscus.json` 限制正式站来源；更换域名时同步更新。giscus 不提供 Waline 的匿名昵称留言或阅读量统计，本站不显示虚构计数。完整说明见 [评论配置与管理](docs/giscus-setup.md)。

## 页面和功能

- 首页、介绍、学术/专业经历、项目、联系方式与可选简历。
- 博客分类、每页 10 篇文章、标签、按年归档、合集及合集内顺序导航。
- 全文搜索，支持中文和英文；可用 Ctrl/Cmd + K 打开搜索。
- 文章目录定位、高亮、代码复制、公式、Mermaid、图片大图、阅读进度、前后文章、相关文章、链接与二维码分享。
- 浅色、深色、跟随系统三种主题；中英文界面；响应式导航和键盘操作。
- 朋友 RSS 聚合、RSS 订阅、sitemap、robots、社交分享 metadata 与文章结构化数据。
- giscus 登录评论、回复、表情回应，以及 GitHub Discussions 评论管理。
- 站主可视化后台，管理 Markdown / MDX、图片、资料、友链和合集。
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
