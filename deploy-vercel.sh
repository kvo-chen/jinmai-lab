#!/bin/bash

echo "🚀 Jinmai Lab Vercel 部署脚本"
echo "============================="
echo ""

# 检查项目是否build成功
if [ -d "dist" ]; then
    echo "✅ 项目构建成功，dist目录存在"
else
    echo "❌ 项目未构建，请先运行 pnpm run build"
    exit 1
fi

# 检查Vercel CLI是否安装
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装Vercel CLI..."
    npm i -g vercel
fi

echo ""
echo "🎯 开始部署到Vercel..."
echo "项目配置："
echo "- 构建命令: pnpm build"
echo "- 输出目录: dist"
echo "- 框架: Vite + React"
echo ""

# 使用Vercel CLI直接部署
vercel --prod --build-command="pnpm build" --output-directory="dist" --yes

echo ""
echo "✨ 部署完成！"
echo "请查看上面的输出获取部署地址"