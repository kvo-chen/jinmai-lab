#!/bin/bash

# GitHub Pages 直接部署脚本
# 这个脚本将构建输出直接推送到 gh-pages 分支

echo "🚀 开始 GitHub Pages 直接部署..."
echo "=================================="

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "当前分支: $CURRENT_BRANCH"

# 构建项目
echo "📦 构建项目..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 检查构建输出
if [ ! -d "dist" ]; then
    echo "❌ 构建输出目录不存在"
    exit 1
fi

echo "✅ 构建成功"

# 创建临时分支用于部署
echo "🔄 创建部署分支..."
git checkout --orphan gh-pages-temp

# 清空当前分支内容（除了 dist 目录）
find . -maxdepth 1 ! -name 'dist' ! -name '.git' ! -name '.' -exec rm -rf {} +

# 将构建输出移动到根目录
mv dist/* .
rm -rf dist

# 添加必要的文件
echo "📄 添加必要文件..."
echo "/jinmai-lab" > CNAME
echo "*" > .nojekyll

# 添加所有文件到暂存区
git add .

# 提交更改
echo "💾 提交部署文件..."
git commit -m "Deploy to GitHub Pages - $(date)"

# 推送到 gh-pages 分支
echo "🚀 推送到 gh-pages 分支..."
git push origin gh-pages-temp:gh-pages --force

# 返回原分支
echo "🔙 返回原分支..."
git checkout $CURRENT_BRANCH

# 删除临时分支
git branch -D gh-pages-temp

echo "=================================="
echo "✅ GitHub Pages 部署完成！"
echo "🌐 访问地址: https://kvo-chen.github.io/jinmai-lab/"
echo ""
echo "⚠️  注意："
echo "- 首次部署可能需要几分钟生效"
echo "- 确保在仓库设置中启用了 GitHub Pages"
echo "- 选择 gh-pages 分支作为源"