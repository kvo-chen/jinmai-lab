#!/bin/bash

# 津门老字号AI共创坊 - 更新部署脚本
# 用于修复运行时错误并重新部署

echo "🚀 开始更新津门老字号AI共创坊..."

# 1. 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist deploy

# 2. 重新构建项目
echo "📦 重新构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    
    # 3. 准备部署文件
    echo "📁 准备部署文件..."
    mkdir -p deploy
    cp -r dist/* deploy/
    
    # 4. 添加CNAME文件
    echo "🌐 配置域名..."
    echo "jinmai-lab.tech" > deploy/CNAME
    
    # 5. 创建部署说明
    echo "📝 创建部署说明..."
    cat > deploy/DEPLOYMENT_INFO.txt << 'EOF'
津门老字号AI共创坊 - 部署信息
=====================================

构建时间: $(date)
版本: 修复运行时错误版
功能: 完整UI组件库 + 错误修复

文件说明:
- index.html: 主页面
- assets/: 静态资源文件夹
- CNAME: 自定义域名配置

部署步骤:
1. 上传所有文件到Web服务器
2. 确保域名 jinmai-lab.tech 指向服务器
3. 访问 https://jinmai-lab.tech 查看平台

技术支持:
- 基于 React 18 + TypeScript + Vite
- 使用 Tailwind CSS 样式框架
- 包含完整的UI组件库

问题修复:
- 修复了运行时函数错误
- 更新了构建配置
- 优化了资源加载
EOF
    
    echo "🎉 部署文件准备完成！"
    echo "📁 文件位置: ./deploy/"
    echo ""
    echo "下一步操作:"
    echo "1. 将 deploy/ 文件夹的所有内容上传到您的服务器"
    echo "2. 确保域名 jinmai-lab.tech 正确指向服务器"
    echo "3. 清除浏览器缓存后访问 https://jinmai-lab.tech"
    echo ""
    echo "✨ 平台特色:"
    echo "- 完整的UI组件库 (输入框、徽章、模态框、移动端组件)"
    echo "- 红金配色津门老字号主题设计"
    echo "- 完全响应式，支持移动端"
    echo "- TypeScript类型安全"
    echo "- 性能优化的代码分割"
    
    # 6. 显示文件列表
    echo ""
    echo "📋 部署文件列表:"
    ls -la deploy/
    
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi