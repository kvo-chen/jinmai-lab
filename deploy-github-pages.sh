#!/bin/bash

echo "🚀 开始 GitHub Pages 部署..."
echo "=========================="

# 检查是否安装了必要的工具
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

# 备份原始文件
echo "📁 备份原始文件..."
cp package.json package.json.backup
cp src/App.tsx src/App.tsx.backup
cp src/main.tsx src/main.tsx.backup
cp index.html index.html.backup

# 应用 GitHub Pages 配置
echo "⚙️ 应用 GitHub Pages 配置..."
cp package-github-pages.json package.json
cp src/App-github-pages.tsx src/App.tsx
cp src/main-github-pages.tsx src/main.tsx
cp index-github-pages.html index.html

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 检查构建结果
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ 构建成功！"
    echo "📊 构建文件大小："
    du -sh dist/
    
    # 显示版本信息
    if [ -f "dist/version.txt" ]; then
        echo "📄 版本信息："
        cat dist/version.txt
    fi
    
    echo ""
    echo "🎯 下一步操作："
    echo "1. 确保 GitHub 仓库已启用 GitHub Pages"
    echo "2. 在仓库设置中选择 GitHub Actions 作为部署源"
    echo "3. 推送代码到 master 分支"
    echo ""
    echo "🔗 预期部署地址："
    echo "https://kvo-chen.github.io/jinmai-lab/"
    echo ""
    echo "⚠️ 注意："
    echo "- 首次部署可能需要几分钟"
    echo "- GitHub Actions 会自动部署"
    echo "- 可以在 Actions 标签页查看部署进度"
    
else
    echo "❌ 构建失败！"
    echo "🔄 恢复原始文件..."
    mv package.json.backup package.json
    mv src/App.tsx.backup src/App.tsx
    mv src/main.tsx.backup src/main.tsx
    mv index.html.backup index.html
    exit 1
fi

# 恢复原始文件（可选，如果需要在本地继续开发）
echo ""
echo "🔄 是否恢复原始文件？(y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    mv package.json.backup package.json
    mv src/App.tsx.backup src/App.tsx
    mv src/main.tsx.backup src/main.tsx
    mv index.html.backup index.html
    echo "✅ 已恢复原始文件"
else
    echo "💡 保留了 GitHub Pages 配置"
fi

echo ""
echo "🎉 GitHub Pages 部署准备完成！"
echo "请推送代码到 GitHub 仓库以触发自动部署。"