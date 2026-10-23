# VYS3N 评论配置与管理

本站采用 giscus + GitHub Discussions。访客使用 GitHub 账号登录后留言、回复和回应；站主用 VYS3N 账号管理仓库讨论。无需另建数据库或部署 Vercel 服务。

## 首次启用

1. 使用 VYS3N 登录 GitHub，打开仓库 Settings → General → Features，勾选 Discussions。若提示初始化，完成后确认仓库顶部出现 Discussions 标签。
2. 打开 https://github.com/apps/giscus ，点击 Install。选择 Only select repositories，只勾选 `VYS3N.github.io`，然后安装。
3. 打开 https://giscus.app/zh-CN ，仓库填 `VYS3N/VYS3N.github.io`，选择 Announcements 分类。记录生成代码里的 `data-repo-id` 与 `data-category-id`；这是公开配置 ID，不是密钥。
4. 在后台“站点资料 → 评论配置”或 `src/data/site.json` 的 `giscus` 对象中，填写真实 `repoId`、`categoryId`，其余为 `enabled: true`、`repo: VYS3N/VYS3N.github.io`、`category: Announcements`。
5. 保存并发布后，打开友链页评论区检查。首次留言前尚无对应讨论是正常状态。

中文与英文页面使用同一条标准路径作为讨论标识，切换界面语言会继续同一场讨论。文章 `slug` 发布后应保持不变。

## 权限与站主管理

评论区的 GitHub 登录只用于 giscus，不授予网站内容编辑权。普通访客可以按 GitHub 规则管理自己的留言。站主管理他人留言时，点击“在 GitHub 查看讨论”，用 VYS3N 登录，打开对应讨论并使用评论旁的菜单执行删除等操作。权限由 GitHub 实际仓库角色决定。

giscus 不提供 Waline 的匿名昵称留言及阅读量统计。本站保留评论、回复与回应，不显示没有数据来源的阅读量。

## 域名与失败处理

根目录 `giscus.json` 允许的正式来源是 `https://vys3n.github.io`。更换域名时同步修改该文件和站点地址。本地模拟测试不验证真实 GitHub 登录或删除权限；需要在正式域名用自己的账号完成最终操作确认。

评论框打不开时，尝试重试或直接访问 GitHub Discussions，再检查仓库是否公开、Discussions 是否开启、giscus App 是否获准访问该仓库、两个 ID 是否对应当前仓库和分类。不要把后台访问令牌粘贴到评论框。

官方参考：[giscus](https://giscus.app/zh-CN)、[高级配置](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)、[GitHub 讨论管理](https://docs.github.com/en/discussions/managing-discussions-for-your-community/moderating-discussions)。
