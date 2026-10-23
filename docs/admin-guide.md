# VYS3N 站主后台使用指南

后台地址：https://vys3n.github.io/admin/ 。网站页脚也有“站主管理”入口。后台使用 Sveltia CMS，直接编辑 `VYS3N/VYS3N.github.io` 的 `main` 分支。拥有该仓库写权限的账号和有效令牌才能保存内容。

## 创建只授权本站的令牌

1. 使用 VYS3N 登录 GitHub，打开头像 → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token。也可打开 https://github.com/settings/personal-access-tokens/new 。
2. Token name 填 `VYS3N site admin`；Expiration 选择适合自己的有效期；Resource owner 选择 VYS3N。
3. Repository access 选择 **Only select repositories**，只勾选 **VYS3N.github.io**。
4. Repository permissions 中给 **Contents → Read and write**。Metadata 的 Read-only 会自动添加。本站直接保存到 main，无需授予 Pull requests、Actions、Workflows 或账号级权限。
5. 点击 Generate token，复制生成的令牌。只在自己的后台点击“使用访问令牌登录”后输入；不要发到聊天、评论、文章、源码或截图中。

后台把令牌保存在当前浏览器的本地存储，并用它请求 GitHub。只在可信设备登录。可从头像菜单退出，也可在设置的数据管理中清除登录数据。令牌到期后重新创建；需要撤销时，在 GitHub 的 Fine-grained tokens 页面撤销令牌。

评论区的 GitHub 登录与后台令牌登录相互独立。giscus App 管理讨论；后台令牌管理文章与图片。打开后台地址只会显示登录页，不会赋予访客编辑权。未来获得仓库写权限的其他账号，也能使用自己的有效令牌编辑。

## 发布文章

1. 选择“文章 · Markdown”，点击新建。
2. 填标题、固定网址标识、发布日期和正文。标识使用小写英文字母、数字和连字符，例如 `first-post`，发布后保持不变。Markdown 和 MDX 不可重复使用相同标识。
3. 编辑器提供格式工具和内容预览。图片可以上传到图片库并插入正文，也可作为封面，文件保存在仓库 `public/images/`。
4. 新文章默认开启“保留为草稿”。保存会写入仓库；草稿不进入公开站点、搜索和 RSS。**仓库公开，因此已保存草稿的源文件也公开；不要用于私人内容。**
5. 准备公开时关闭“保留为草稿”，确认发布日期已到，再保存。保存提交到 main，GitHub Actions 随后构建更新网站。

保存成功且 Pages 部署完成，公开网站才会更新。构建失败时前一版站点继续可用，打开仓库 Actions 查看错误。若本地也在写作，开始前先 `git pull --ff-only`，避免与后台提交冲突。

未来日期在下一次日期已到的构建中发布；工作流每天北京时间约 08:20 重建，GitHub 计划任务可能延迟。后台日期按天填写；需要精确时刻时，在本地 frontmatter 使用带时区的 ISO 日期。

## MDX、资料与图片

“文章 · MDX 源码”保留 JSX 文本，不转换成富文本。后台不渲染所有 MDX 组件；完整效果仍使用 `npm run dev` 预览。普通 Markdown 可以使用可视化编辑。

“介绍页面”管理关于与经历正文；“站点资料”管理头像、中英文简介、联系方式、教育经历、项目和评论配置；“友链”与“文章合集”分别管理列表。头像已配置为 `/images/avatar.webp`，需要更换时在头像字段选择新图片再保存。

上传文件会进入公开仓库。后台上传可能保留原文件元数据，发布前请检查需要公开的内容。

后台界面默认跟随浏览器语言，可在头像 → Settings 中切换；网站中英文按钮控制前台界面，两者设置独立。后台文章字段和分类标签使用中文，正文保持你写作的语言。

## 常见问题

- 登录失败：检查令牌有效期、账号、授权仓库及 Contents 读写权限。
- 保存失败：检查网络和权限；若 main 后续开启强制 PR 保护，当前直接保存流程会被 GitHub 拒绝，需要调整流程。
- 保存后没有变化：检查草稿开关、发布日期和 Actions 部署结果。Settings → Pages 的 Source 应选 **GitHub Actions**。
- 取消修改：返回并按提示放弃尚未保存的改动；已保存内容需再次编辑或通过 Git 历史恢复。

官方参考：[Sveltia CMS GitHub 后端](https://sveltiacms.app/en/docs/backends/github)、[GitHub 令牌管理](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)。
