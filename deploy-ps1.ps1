# 津门老字号AI共创坊 - 直接部署脚本 (PowerShell版本)
# 用于部署到 jinmai-lab.tech

Write-Host "🚀 开始部署津门老字号AI共创坊..." -ForegroundColor Green

# 构建项目
Write-Host "📦 构建项目..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 构建成功！" -ForegroundColor Green
    
    # 创建部署目录
    if (Test-Path "deploy") {
        Remove-Item -Path "deploy" -Recurse -Force
    }
    New-Item -ItemType Directory -Path "deploy" -Force | Out-Null
    
    # 复制构建文件到部署目录
    Write-Host "📁 准备部署文件..." -ForegroundColor Yellow
    Copy-Item -Path "dist\*" -Destination "deploy\" -Recurse -Force
    
    # 添加CNAME文件用于自定义域名
    Write-Host "🌐 配置域名..." -ForegroundColor Yellow
    "jinmai-lab.tech" | Out-File -FilePath "deploy\CNAME" -Encoding UTF8
    
    Write-Host "🎉 部署文件已准备完成！" -ForegroundColor Green
    Write-Host "📁 文件位于: ./deploy/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "下一步操作:" -ForegroundColor Magenta
    Write-Host "1. 将 deploy/ 文件夹的内容上传到您的服务器" -ForegroundColor White
    Write-Host "2. 确保域名 jinmai-lab.tech 指向正确的服务器" -ForegroundColor White
    Write-Host "3. 访问 https://jinmai-lab.tech 查看平台" -ForegroundColor White
    Write-Host ""
    Write-Host "✨ 平台特色:" -ForegroundColor Magenta
    Write-Host "- 完整的UI组件库 (输入框、徽章、模态框、移动端组件)" -ForegroundColor White
    Write-Host "- 红金配色津门老字号主题" -ForegroundColor White
    Write-Host "- 完全响应式设计" -ForegroundColor White
    Write-Host "- TypeScript类型安全" -ForegroundColor White
    Write-Host "- 性能优化的代码分割" -ForegroundColor White
    
} else {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}