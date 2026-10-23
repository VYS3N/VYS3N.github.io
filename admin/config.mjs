const string = (name, label, extra = {}) => ({ name, label, widget: 'string', ...extra });
const optional = (name, label, extra = {}) => string(name, label, { required: false, ...extra });
const localized = (name, label, required = false) => ({ name, label, widget: 'object', required, fields: [optional('zh', '中文'), optional('en', 'English')] });
const list = (name, label, fields) => ({ name, label, widget: 'list', required: false, fields });
const date = (name, label, extra = {}) => ({ name, label, widget: 'datetime', type: 'date', format: 'YYYY-MM-DD', ...extra });
const slug = { name: 'slug', label: '固定网址标识', widget: 'string', pattern: ['^(?!(all|tech|research|daily|journal)$)[a-z0-9][a-z0-9-]*$', '使用小写英文字母、数字和连字符；不能使用分类名称'], hint: '例如 first-post。发布后请保持不变。Markdown 和 MDX 文章也不能使用相同标识。' };
const articleFields = [
  string('title', '文章标题'),
  slug,
  optional('description', '摘要', { widget: 'text' }),
  date('date', '发布日期', { default: '{{now}}', hint: '按北京时间解释；未来日期的文章会等到日期到达后构建发布。' }),
  date('updated', '更新日期', { required: false }),
  { name: 'category', label: '分类', widget: 'select', default: 'tech', options: [{ label: '技术', value: 'tech' }, { label: '学习与思考', value: 'research' }, { label: '日常', value: 'daily' }, { label: '月记', value: 'journal' }] },
  { name: 'tags', label: '标签', widget: 'list', required: false },
  optional('collection', '所属合集', { pattern: ['^[a-z0-9][a-z0-9-]*$', '使用小写英文字母、数字和连字符'], hint: '填写合集的网址标识；不属于合集时留空。' }),
  { name: 'order', label: '合集内顺序', widget: 'number', value_type: 'int', required: false, min: 0 },
  { name: 'lang', label: '正文语言', widget: 'select', default: 'zh', options: [{ label: '中文', value: 'zh' }, { label: 'English', value: 'en' }] },
  { name: 'draft', label: '保留为草稿', widget: 'boolean', default: true, hint: '开启时不出现在公开网站。写作完成后关闭此项再保存，才会正式发布。' },
  { name: 'comments', label: '允许评论', widget: 'boolean', default: true },
  optional('cover', '封面图片', { widget: 'image' }),
  optional('coverAlt', '封面图片说明'),
  optional('coverCredit', '封面来源链接', { pattern: ['^https?://[^\\s]+$', '填写完整的 HTTP 或 HTTPS 地址'] }),
];
const article = (name, label, extension, body) => ({
  name, label, label_singular: '文章', folder: 'src/content/posts', extension, format: 'frontmatter',
  create: true, identifier_field: 'slug', slug: '{{slug}}', preview_path: 'blog/{{slug}}/',
  summary: '{{title}} · {{date}}', fields: [...articleFields, body],
});

export default {
  backend: { name: 'github', repo: 'VYS3N/VYS3N.github.io', branch: 'main', auth_methods: ['token'] },
  site_url: 'https://vys3n.github.io', display_url: 'https://vys3n.github.io', logo_url: '/favicon.svg',
  media_folder: 'public/images', public_folder: '/images',
  output: { omit_empty_optional_fields: true },
  collections: [
    article('posts', '文章 · Markdown', 'md', { name: 'body', label: '正文', widget: 'markdown' }),
    article('mdx', '文章 · MDX 源码', 'mdx', { name: 'body', label: 'MDX 源码', widget: 'text', hint: '保留 JSX 组件源码。此编辑器不渲染 MDX 交互组件；组件效果请在本地预览中检查。' }),
    {
      name: 'pages', label: '介绍页面', files: [
        { name: 'about', label: '关于我', file: 'src/content/pages/about.md', fields: [{ name: 'body', label: '个人介绍', widget: 'markdown', required: false }] },
        { name: 'academic', label: '经历介绍', file: 'src/content/pages/academic.md', fields: [{ name: 'body', label: '经历与成果介绍', widget: 'markdown', required: false }] },
      ],
    },
    {
      name: 'settings', label: '站点资料', files: [{
        name: 'site', label: '主页、联系方式与展示内容', file: 'src/data/site.json', format: 'json', fields: [
          string('name', '公开名称'), string('title', '网站名称'),
          optional('url', '网站根地址', { default: 'https://vys3n.github.io', hint: '更换域名时还需同步更新 GitHub Pages 和 giscus 的域名配置。' }),
          localized('description', '网站简介'), localized('tagline', '主页短句'), optional('location', '所在地'),
          optional('avatar', '主页头像', { widget: 'image' }),
          optional('github', 'GitHub 用户名', { default: 'VYS3N' }), optional('email', '公开联系邮箱'),
          optional('scholar', '学术主页链接'), optional('cv', '简历文件', { widget: 'file' }),
          date('startDate', '网站运行起始日期', { default: '2026-10-23' }),
          optional('sponsorUrl', '赞助链接或图片地址'),
          list('education', '教育与经历', [localized('title', '学校或单位', true), localized('detail', '经历说明'), string('start', '开始时间'), optional('end', '结束时间'), optional('url', '相关链接')]),
          { name: 'interests', label: '关注方向', widget: 'list', required: false, fields: [optional('zh', '中文'), optional('en', 'English')] },
          list('publications', '成果', [string('title', '标题'), optional('authors', '作者'), optional('venue', '发表或展示渠道'), optional('year', '年份'), optional('url', '成果链接'), optional('code', '代码链接')]),
          list('projects', '项目', [localized('title', '项目名称', true), localized('description', '项目介绍'), string('url', '项目链接'), { name: 'tags', label: '标签', widget: 'list', required: false }, optional('image', '展示图片', { widget: 'image' })]),
          list('tools', '常用工具', [string('name', '名称'), localized('description', '用途'), string('url', '链接')]),
          list('mirrors', '镜像站点', [string('name', '站名'), string('url', '地址')]),
          { name: 'giscus', label: '评论配置', widget: 'object', collapsed: true, fields: [
            { name: 'enabled', label: '启用评论', widget: 'boolean', default: true },
            string('repo', '评论仓库', { default: 'VYS3N/VYS3N.github.io' }),
            optional('repoId', '仓库 ID', { hint: '安装 giscus 后，从官方配置工具取得。' }),
            string('category', '讨论分类', { default: 'Announcements' }), optional('categoryId', '讨论分类 ID'),
          ] },
        ],
      }],
    },
    {
      name: 'friends', label: '友链', file: 'src/data/friends.json', format: 'json',
      fields: [string('name', '站名'), string('url', '网站地址'), optional('description', '简介'), optional('avatar', '头像地址'), optional('rss', 'RSS 地址')],
    },
    {
      name: 'series', label: '文章合集', file: 'src/data/collections.json', format: 'json',
      identifier_field: 'slug', fields: [slug, localized('title', '合集名称', true), localized('description', '合集简介')],
    },
  ],
};
