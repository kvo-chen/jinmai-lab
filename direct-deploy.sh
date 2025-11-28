#!/bin/bash

# 津门老字号AI共创坊 - 直接部署脚本
# 用于部署到 jinmai-lab.tech

echo "🚀 开始部署津门老字号AI共创坊..."

# 确保我们有最新的构建
echo "📦 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    
    # 创建部署目录
    mkdir -p deploy
    
    # 复制构建文件到部署目录
    echo "📁 准备部署文件..."
    cp -r dist/* deploy/
    
    # 添加CNAME文件用于自定义域名
    echo "jinmai-lab.tech" > deploy/CNAME
    
    # 创建简单的index.html用于重定向
    cat > deploy/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>津门老字号AI共创坊</title>
    <meta http-equiv="refresh" content="0; url=https://jinmai-lab.tech">
</head>
<body>
    <p>正在跳转到 <a href="https://jinmai-lab.tech">津门老字号AI共创坊</a>...</p>
</body>
</html>
EOF
    
    echo "🎉 部署文件已准备完成！"
    echo "📁 文件位于: ./deploy/"
    echo ""
    echo "下一步操作:"
    echo "1. 将 deploy/ 文件夹的内容上传到你的服务器"
    echo "2. 确保域名 jinmai-lab.tech 指向正确的服务器"
    echo "3. 访问 https://jinmai-lab.tech 查看平台"
    echo ""
    echo "✨ 平台特色:"
    echo "- 完整的UI组件库 (输入框、徽章、模态框、移动端组件)"
    echo "- 红金配色津门老字号主题"
    echo "- 完全响应式设计"
    echo "- TypeScript类型安全"
    echo "- 性能优化的代码分割"
    
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi