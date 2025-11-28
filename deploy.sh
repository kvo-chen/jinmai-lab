#!/bin/bash

echo "🚀 开始部署津门老字号AI共创坊到 jinmai-lab.tech..."

# 构建项目
echo "📦 正在构建项目..."
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    
    # 部署到 Vercel
    echo "🌐 正在部署到 Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 部署成功！平台已更新到 https://jinmai-lab.tech"
        echo "📱 请访问 https://jinmai-lab.tech 查看更新后的平台"
    else
        echo "❌ Vercel 部署失败，请检查配置"
        exit 1
    fi
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi