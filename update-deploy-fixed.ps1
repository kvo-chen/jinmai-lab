# 津门老字号AI共创坊 - 更新部署脚本 (PowerShell版本)
# 用于修复运行时错误并重新部署

Write-Host "🚀 开始更新津门老字号AI共创坊..." -ForegroundColor Green

# 1. 清理之前的构建
Write-Host "🧹 清理之前的构建..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Path "dist" -Recurse -Force }
if (Test-Path "deploy") { Remove-Item -Path "deploy" -Recurse -Force }

# 2. 重新构建项目
Write-Host "📦 重新构建项目..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 构建成功！" -ForegroundColor Green
    
    # 3. 准备部署文件
    Write-Host "📁 准备部署文件..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "deploy" -Force | Out-Null
    Copy-Item -Path "dist\*" -Destination "deploy\" -Recurse -Force
    
    # 4. 添加CNAME文件
    Write-Host "🌐 配置域名..." -ForegroundColor Yellow
    "jinmai-lab.tech" | Out-File -FilePath "deploy\CNAME" -Encoding UTF8
    
    # 5. 创建部署说明
    Write-Host "📝 创建部署说明..." -ForegroundColor Yellow
    $deployInfo = @"
津门老字号AI共创坊 - 部署信息
=====================================

构建时间: $(Get-Date)
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
"@
    $deployInfo | Out-File -FilePath "deploy\DEPLOYMENT_INFO.txt" -Encoding UTF8
    
    Write-Host "🎉 部署文件准备完成！" -ForegroundColor Green
    Write-Host "📁 文件位置: ./deploy/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "下一步操作:" -ForegroundColor Magenta
    Write-Host "1. 将 deploy/ 文件夹的所有内容上传到您的服务器" -ForegroundColor White
    Write-Host "2. 确保域名 jinmai-lab.tech 正确指向服务器" -ForegroundColor White
    Write-Host "3. 清除浏览器缓存后访问 https://jinmai-lab.tech" -ForegroundColor White
    
    # 6. 显示文件列表
    Write-Host ""
    Write-Host "📋 部署文件列表:" -ForegroundColor Magenta
    Get-ChildItem -Path "deploy" -File | ForEach-Object {
        Write-Host "  $($_.Name)" -ForegroundColor Gray
    }
    
} else {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}