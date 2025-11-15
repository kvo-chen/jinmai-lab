#!/bin/bash

echo "🚀 GitHub Pages 简易部署脚本"
echo "========================="
echo ""

# 检查是否有 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ 未找到 dist 目录，请先运行 npm run build"
    exit 1
fi

echo "📁 找到 dist 目录，开始部署..."

# 创建临时目录
echo "🔧 创建临时目录..."
mkdir -p temp-gh-pages

# 复制 dist 文件到临时目录
echo "📋 复制构建文件..."
cp -r dist/* temp-gh-pages/

# 创建 .nojekyll 文件（防止 GitHub 使用 Jekyll 处理）
echo "📝 创建 .nojekyll 文件..."
touch temp-gh-pages/.nojekyll

# 切换到 gh-pages 分支
echo "🔄 切换到 gh-pages 分支..."
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# 清空当前分支文件（保留 .git）
echo "🧹 清理分支文件..."
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} \; 2>/dev/null || true

# 复制临时目录文件到当前目录
echo "📤 复制文件到 gh-pages 分支..."
cp -r temp-gh-pages/* .
cp -r temp-gh-pages/.nojekyll .

# 添加文件到 Git
echo "➕ 添加文件到 Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "Deploy to GitHub Pages - $(date)"

# 推送分支
echo "📤 推送到 GitHub..."
git push origin gh-pages

# 切换回原分支
echo "🔙 切换回原分支..."
git checkout master

# 清理临时目录
echo "🧹 清理临时目录..."
rm -rf temp-gh-pages

echo "✅ 部署完成！"
echo "🌐 GitHub Pages 地址：https://kvo-chen.github.io/jinmai-lab/"
echo ""
echo "💡 提示：你需要在 GitHub 仓库设置中启用 GitHub Pages 功能"
echo "   设置路径：Settings > Pages > Source > Deploy from a branch > gh-pages"