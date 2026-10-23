# MDX 写作组件指南

网站继续支持普通 Markdown。需要页签、折叠、步骤、卡片等排版时，可以改用 MDX；正文和文章头部的字段保持一致。

```bash
npm run new:post -- "我的文章" --slug my-article --category tech --mdx
```

新文章默认是草稿。写好后把 `draft: true` 改为 `draft: false`，提交并推送即可发布。组件示例在 `content/templates/writing.mdx`，模板本身不会发布。

## 基本规则

- 下列组件已全局提供，无需添加 import。
- 组件里写 Markdown 时，在开始和结束标签与正文之间各留一个空行。
- MDX 注释使用 `{/* 注释 */}`；普通 Markdown 的 HTML 注释不适用于 MDX。
- 文本中的字面量 `<`、`>` 或 `{` 应放在代码标记内，或进行转义。
- 支持普通 Markdown 中的数学公式、Mermaid、表格、脚注、代码高亮与复制。
- 中英文界面只切换组件按钮等界面文案，你写的正文、卡片标题和页签名称保持原文。
- 关于与经历页面也支持 `.mdx`。同一个页面只保留一种格式，例如 `about.md` 与 `about.mdx` 二选一。
- MDX 可导入并执行构建时的代码，应只发布自己编写或已经检查过的文件。

## 组件列表

| 组件 | 属性与用途 |
| --- | --- |
| `Tabs`、`Tab` | `Tabs` 可选 `label`、`defaultIndex`、`syncKey`；`Tab` 必填 `label`。支持左右箭头、Home、End 键和嵌套页签。相同 `syncKey` 的页签按名称同步，并记住选择。关闭脚本时显示全部内容。 |
| `Collapse` | 必填 `title`；可选 `open`。原生可折叠区域，支持键盘操作。 |
| `Spoiler` | 可选 `label`。需要读者主动展开的隐藏内容。 |
| `Callout` | 可选 `type` 为 `note`、`tip`、`warning` 或 `caution`，可选 `title`。 |
| `Steps`、`Step` | 有序步骤，`Step` 必填 `title`。 |
| `Timeline`、`TimelineItem` | 时间线条目必填 `date`、`title`；可选 ISO 日期 `datetime`。 |
| `Card` | 必填 `title`；可选 `href`、`description`、`image`、`alt`、Tabler `icon`。正文可以包含 Markdown。 |
| `CardGrid` | 卡片容器，可选 `columns` 为 1、2、3；手机上自动变为单列。 |
| `LinkCard` | 必填 `href`、`title`；可选 `description`、`image`、`alt`。预览信息由作者填写，不抓取外站网页。 |
| `GithubCard` | 必填 `repo="用户/仓库"`，也支持完整 GitHub 仓库链接；可选自己的 `description`。进入可见区域后读取真实公开的说明、语言、Stars、Forks 与开源许可证；失败时保留链接并提供重试。 |
| `Button` | 必填 `href`；可选 `variant="primary"` 或 `"subtle"`、Tabler `icon`。这是链接按钮。 |
| `Badge` | 简短的内联标签。 |
| `Quote` | 引用文字；可选 `author`、`source`、`href`。 |
| `ImageGallery` | 必填 `images` 数组；每张图片必填 `src`、`alt`，可选 `caption`、`width`、`height`；可选 `columns`。点击放大，支持左右箭头和 Escape。 |
| `Video` | 必填 `src`、`title`；可选 `poster`、`caption`。本地 MP4/WebM/Ogg 使用原生播放器；YouTube/Bilibili 点击后才载入。 |
| `QRCode` | 必填 `value`；可选 `caption`、`size`（128 到 320）。二维码在本地浏览器生成，原始文字始终可见。 |
| `ManualTOC` | 必填 `items={[{id:'标题锚点',label:'标题'}]}`；可选 `title`。用于手动补充目录。 |
| `Icon` | Tabler 图标，必填 `name`，可选 `size`。例如 `name="brand-github"`。 |

提供兼容名称：`TabItem`、`Aside`、`CardList`、`ImageGroup`、`LinkPreview`、`WebVideo`。这些名称使用本站的属性接口，不能直接把其他主题的所有调用代码原样复制过来。

## 页签示例

```mdx
<Tabs label="安装方法">
<Tab label="npm">

使用 npm 安装依赖。

</Tab>
<Tab label="pnpm">

使用 pnpm 安装依赖。

</Tab>
</Tabs>
```

## 视频与外部服务

```mdx
<Video src="/videos/demo.mp4" title="项目演示" caption="视频说明" />
```

将视频放入 `public/videos/`。外部视频可以直接填写完整的 YouTube 或 Bilibili 视频页面地址；第三方播放器无法加载时，读者仍能使用原站观看链接。

GitHub 卡片直接读取 GitHub 的公开 API，不需要密钥；可能受未认证访问频率或网络限制。卡片提供错误提示和重试，仓库链接始终可以访问。外部链接卡片不自动请求目标网页。Waline 仍须填写自己的服务地址。

## 预览

运行 `npm run dev` 可以看到草稿，正式构建不包含草稿与未来文章。复制完整模板到文章目录后，应先修改 `slug`，再预览；正式站不发布模板或测试内容。
