# Database Schema Visualizer

🗄️ **Paste SQL DDL → Get instant ERD diagram → Export to PNG/SVG/DBML**

A zero-configuration, free, browser-based tool to visualize database schemas from SQL DDL statements.

![Database Schema Visualizer](./screenshot.png)

## ✨ Features

- **Zero Configuration** - No database connection required, just paste your SQL
- **Instant Visualization** - Real-time ERD diagram generation using Mermaid.js
- **Multiple Export Formats** - Export to SVG, PNG, or DBML
- **Foreign Key Detection** - Automatically detects and visualizes table relationships
- **Runs in Browser** - No server-side processing, your SQL never leaves your browser
- **Free & Open Source** - Built with Next.js and deployed on Cloudflare Pages

## 🚀 Quick Start

### Using the Live Demo

Visit [https://db-schema-visualizer.real-tech.online](https://db-schema-visualizer.real-tech.online) (to be deployed)

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
# Output: ./dist
```

## 📖 Usage

1. **Paste SQL DDL** - Copy your CREATE TABLE statements into the input area
2. **Click "Generate ERD"** - The tool will parse your SQL and generate a diagram
3. **Export** - Download as SVG or DBML for use in documentation

### Example SQL

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Visualization:** Mermaid.js
- **Deployment:** Cloudflare Pages

## 🎯 Roadmap

- [ ] Export to PNG format
- [ ] Support for more SQL dialects (PostgreSQL, MySQL, SQLite)
- [ ] Import from existing database
- [ ] Custom styling options
- [ ] Share diagram via URL

## 📄 License

MIT License - feel free to use in your projects!

---

Built by [RealTech Tools](https://github.com/oldbone0x/realtech-tools)
