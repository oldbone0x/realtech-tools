# RealTech Tools - 完整工作流文档

## 📋 项目概述

**项目名称:** RealTech Tools  
**生产域名:** https://tools.real-tech.online/  
**GitHub 仓库:** https://github.com/oldbone0x/realtech-tools  
**部署平台:** Cloudflare Pages (原生 Git 集成)

---

## 🛠️ 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| **框架** | Next.js 15 | App Router |
| **语言** | TypeScript 5.8 | 类型安全 |
| **样式** | Tailwind CSS 3.4 | 原子化 CSS |
| **React** | 19.2 | UI 库 |
| **部署** | Cloudflare Pages | 静态托管 + Git 直连 |

---

## 📁 项目结构

```
realtech-tools-next/
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
├── dist/                       # 构建输出目录
├── public/                     # 静态资源
├── wrangler.toml               # Cloudflare 配置
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
- `images.unoptimized: true` - 禁用 Next.js 图片优化

---

### 2. `wrangler.toml` - Cloudflare 配置

```toml
name = "realtech-tools"
compatibility_date = "2026-03-10"
pages_build_output_dir = "./dist"

[observability]
enabled = true
```

**关键点:**
- `pages_build_output_dir` - 指定 Pages 构建输出目录
- `name` - Cloudflare 项目名称

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

### Cloudflare Pages 原生 Git 集成

```
1. 本地开发 → git commit → git push origin main
                    ↓
2. Cloudflare Pages 检测到推送 (自动触发)
                    ↓
3. Cloudflare 执行: npm install → npm run build
                    ↓
4. 自动部署 dist/ 目录
                    ↓
5. 自动更新到 tools.real-tech.online
```

**无需 GitHub Actions，Cloudflare 自动处理一切！**

---

## 🔑 Cloudflare Pages 配置

### 1. 创建项目

1. 登录 Cloudflare Dashboard
2. 进入 **Pages** → **Create a project**
3. 选择 **"Connect to Git"**
4. 选择仓库：`oldbone0x/realtech-tools`
5. 选择分支：`main`

### 2. 构建设置

| 配置项 | 值 |
|--------|-----|
| **Framework preset** | Next.js |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Deploy command** | **(留空)** |
| **Root directory** | (留空，使用仓库根目录) |
| **Production branch** | `main` |

### 3. 环境变量 (可选)

如果需要环境变量，在 Pages 项目设置中添加：
- Settings → Environment variables → Add variable

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

# 推送 (触发 Cloudflare 自动部署)
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

### 问题 2: Cloudflare Pages 构建失败

**错误:** `Error: Could not find a production build output directory`

**原因:** Build output directory 配置错误

**解决:** 确保设置为 `dist`（不是 `.next` 或其他）

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

### 问题 5: Cloudflare Pages 一直显示 "Building"

**原因:** 构建命令错误或依赖安装失败

**解决:**
1. 检查 `package.json` 中的 `build` 脚本
2. 在本地运行 `npm run build` 验证
3. 查看 Cloudflare Pages 的 Deploy logs 查看详细错误

---

### 问题 6: 自定义域名不工作

**症状:** 访问域名显示 Cloudflare 默认页面

**解决:**
1. 等待 DNS 传播（最多 24 小时）
2. 检查 Pages 项目 → Custom domains 是否已添加
3. 确保 DNS 记录指向 Cloudflare

---

## 📊 部署状态检查

### Cloudflare Pages Deployments

访问：https://dash.cloudflare.com/?to=/:account/pages/view/realtech-tools/deployments

### 生产环境

访问：https://tools.real-tech.online/

### GitHub 仓库

访问：https://github.com/oldbone0x/realtech-tools

---

## 🔄 版本历史

| 日期 | 版本 | 技术栈 | 部署方式 |
|------|------|--------|----------|
| 2026-03-05 | v1 | Vite + React | Cloudflare Workers |
| 2026-03-06 | v2 | Next.js 15 | GitHub Actions |
| 2026-03-10 | v3 | Next.js 15 | Cloudflare Pages 原生 Git |

---

## 📝 最佳实践

1. **不要提交 `dist/` 到 Git** - 由 Cloudflare 构建生成
2. **不要提交 `.wrangler/`** - 自动生成的配置
3. **构建前本地测试** - `npm run build` 验证
4. **保持 `.gitignore` 干净** - 排除 node_modules/, dist/
5. **使用语义化提交** - 便于追踪变更
6. **检查 Deploy logs** - 部署失败时查看详细错误

---

## 🔗 相关链接

- **GitHub 仓库:** https://github.com/oldbone0x/realtech-tools
- **Cloudflare Pages 文档:** https://developers.cloudflare.com/pages/
- **Next.js 静态导出:** https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- **Wrangler 配置:** https://developers.cloudflare.com/workers/wrangler/configuration/

---

*最后更新：2026-03-10*
