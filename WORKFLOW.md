# RealTech Tools - 完整工作流文档

## 📋 项目概述

**项目名称:** RealTech Tools  
**生产域名:** https://tools.real-tech.online/  
**GitHub 仓库:** https://github.com/oldbone0x/realtech-tools  
**部署平台:** Cloudflare Pages (通过 GitHub Actions 部署)

---

## 🛠️ 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| **框架** | Next.js 15 | App Router |
| **语言** | TypeScript 5.8 | 类型安全 |
| **样式** | Tailwind CSS 3.4 | 原子化 CSS |
| **React** | 19.2 | UI 库 |
| **部署** | Cloudflare Pages | 静态托管 |
| **CI/CD** | GitHub Actions | 自动部署 |

---

## 📁 项目结构

```
realtech-tools-next/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── app/
│   ├── globals.css             # 全局样式 (Tailwind)
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── tools/
│       └── [slug]/
│           └── page.tsx        # 工具详情页 (动态路由)
├── components/
│   └── tools/
│       └── cron-visualizer.tsx # Cron 可视化工具组件
├── lib/
│   └── tools.ts                # 工具数据/工具函数
├── dist/                       # 构建输出目录 (自动部署)
├── public/                     # 静态资源
├── next.config.ts              # Next.js 配置
├── tailwind.config.ts          # Tailwind 配置
├── postcss.config.js           # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖管理
```

---

## ⚙️ 核心配置文件

### 1. `next.config.ts` - Next.js 配置

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // 静态导出
  distDir: 'dist',         // 输出到 dist 目录
  images: {
    unoptimized: true,     // Cloudflare 不需要图片优化
  },
};

export default nextConfig;
```

**关键点:**
- `output: 'export'` - 生成纯静态 HTML/CSS/JS
- `distDir: 'dist'` - 构建输出到 `dist/` 目录
- `images.unoptimized: true` - 禁用 Next.js 图片优化（Cloudflare 处理）

---

### 2. `.github/workflows/deploy.yml` - GitHub Actions 配置

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        run: npx wrangler pages deploy ./dist --project-name=realtech-tools
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**关键点:**
- 触发条件：推送到 `main` 分支
- 使用 `wrangler pages deploy`（不是 `wrangler deploy`）
- 需要 GitHub Secrets: `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`

---

### 3. `tailwind.config.ts` - Tailwind CSS 配置

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: { /* 自定义色板 */ },
        indigo: { /* 自定义色板 */ },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

### 4. `postcss.config.js` - PostCSS 配置

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## 🚀 部署流程

### 自动部署 (GitHub Actions)

```
1. 本地开发 → git commit → git push origin main
                    ↓
2. GitHub Actions 触发 (deploy.yml)
                    ↓
3. npm ci → npm run build → 生成 dist/
                    ↓
4. wrangler pages deploy ./dist
                    ↓
5. Cloudflare Pages 接收并部署
                    ↓
6. 自动更新到 tools.real-tech.online
```

### 手动部署 (本地测试)

```bash
# 1. 安装依赖
npm install

# 2. 本地开发预览
npm run dev

# 3. 构建
npm run build

# 4. 本地测试部署
npx wrangler pages deploy ./dist --project-name=realtech-tools
```

---

## 🔑 Cloudflare Pages 配置

### 1. 创建项目

1. 登录 Cloudflare Dashboard
2. 进入 Pages → Create a project
3. **不要连接 Git** (我们使用 GitHub Actions)
4. 或者连接 Git 但**不配置 Build settings**

### 2. 环境变量 (Secrets)

在 Cloudflare Pages 项目设置中添加：

| 变量名 | 说明 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

**获取 API Token:**
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Edit Cloudflare Workers
3. 复制 Token 到 GitHub Secrets

### 3. GitHub Secrets 配置

在 GitHub 仓库设置中添加：

1. 进入 https://github.com/oldbone0x/realtech-tools/settings/secrets/actions
2. 添加以下 secrets:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | 你的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Account ID |

### 4. 自定义域名

1. Pages 项目 → Custom domains
2. 添加域名：`tools.real-tech.online`
3. Cloudflare 自动配置 DNS

---

## 💻 本地开发流程

### 初始化

```bash
# 克隆仓库
git clone git@github.com:oldbone0x/realtech-tools.git
cd realtech-tools-next

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建测试

```bash
# 本地构建
npm run build

# 查看 dist/ 输出
ls -la dist/
```

### 提交代码

```bash
# 添加更改
git add .

# 提交
git commit -m "feat: 描述你的更改"

# 推送 (触发自动部署)
git push origin main
```

---

## ⚠️ 常见问题及解决方案

### 问题 1: 样式丢失

**症状:** 页面没有样式，CSS 文件 404

**原因:** 构建配置错误或 Tailwind content 路径不对

**解决:**
```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  distDir: 'dist',
};

// tailwind.config.ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

---

### 问题 2: GitHub Actions 部署失败 - wrangler 命令错误

**错误:** `wrangler deploy` 报错 `Missing entry-point`

**原因:** 使用了错误的命令（用于 Workers 而非 Pages）

**解决:** 使用 `wrangler pages deploy`
```yaml
- name: Deploy to Cloudflare Pages
  run: npx wrangler pages deploy ./dist --project-name=realtech-tools
```

---

### 问题 3: Tailwind CSS 未检测到类名

**警告:** `No utility classes were detected`

**原因:** `tailwind.config.ts` 的 `content` 路径不正确

**解决:** 确保 `content` 覆盖所有源文件：
```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

---

### 问题 4: 构建失败 - PostCSS 配置错误

**错误:** `Your custom PostCSS configuration must export a plugins key`

**解决:** 使用正确的 PostCSS 配置格式：
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### 问题 5: GitHub Actions 权限错误

**错误:** `Error: Resource not accessible by integration`

**解决:** 检查 workflow 的 permissions：
```yaml
permissions:
  contents: read
  deployments: write
```

---

### 问题 6: Cloudflare API 认证失败

**错误:** `Authentication error` 或 `Invalid API token`

**解决:**
1. 检查 GitHub Secrets 是否正确设置
2. 确保 API Token 有 Workers 编辑权限
3. 验证 Account ID 是否正确

---

## 📊 部署状态检查

### GitHub Actions

访问：https://github.com/oldbone0x/realtech-tools/actions

### Cloudflare Pages

访问：https://dash.cloudflare.com/?to=/:account/pages

### 生产环境

访问：https://tools.real-tech.online/

---

## 🔄 版本历史

| 日期 | 版本 | 技术栈 | 备注 |
|------|------|--------|------|
| 2026-03-05 | v1 | Vite + React | 初始版本 |
| 2026-03-06 | v2 | Next.js 15 | 迁移到 Next.js |
| 2026-03-10 | v3 | Next.js 15 + GitHub Actions | 纯 GitHub Actions 部署 |

---

## 📝 最佳实践

1. **始终使用 `wrangler pages deploy`** - 用于静态站点
2. **不要提交 `dist/` 到 Git** - 由 CI/CD 生成
3. **使用 `npm ci` 而非 `npm install`** - CI/CD 中确保一致性
4. **构建后验证 `dist/` 内容** - 确保 CSS/JS 文件存在
5. **推送前本地构建测试** - 避免部署失败
6. **保持 `.gitignore` 干净** - 排除 node_modules/, dist/, .wrangler/

---

## 🔗 相关链接

- **GitHub 仓库:** https://github.com/oldbone0x/realtech-tools
- **GitHub Actions 日志:** https://github.com/oldbone0x/realtech-tools/actions
- **Cloudflare Pages 文档:** https://developers.cloudflare.com/pages/
- **Next.js 静态导出:** https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/

---

*最后更新：2026-03-10*
