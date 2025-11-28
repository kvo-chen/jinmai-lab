# 检查Vercel部署状态脚本
Write-Host "🔍 检查Vercel部署状态..."

# 1. 显示Git状态
Write-Host "当前Git状态："
git branch --show-current
git log --oneline -5

# 2. 检查GitHub远程状态
Write-Host "`nGitHub远程分支："
git ls-remote --heads origin

# 3. 显示Vercel配置文件
Write-Host "`nVercel配置："
if (Test-Path "vercel.json") {
    Get-Content "vercel.json" | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "⚠️  vercel.json 不存在" -ForegroundColor Yellow
}

# 4. 检查最新构建文件
Write-Host "`n最新构建文件："
if (Test-Path "dist\assets\index-80870580.js") {
    Write-Host "✅ 最新JS构建文件存在" -ForegroundColor Green
    $fileInfo = Get-Item "dist\assets\index-80870580.js"
    Write-Host "大小: $([math]::Round($fileInfo.Length/1KB,2)) KB"
    Write-Host "修改时间: $($fileInfo.LastWriteTime)"
} else {
    Write-Host "❌ 最新JS构建文件不存在" -ForegroundColor Red
}

# 5. 检查index.html
Write-Host "`nIndex.html文件检查："
if (Test-Path "dist\index.html") {
    $htmlContent = Get-Content "dist\index.html" -Raw
    if ($htmlContent -match "index-80870580.js") {
        Write-Host "✅ Index.html引用了正确的JS文件" -ForegroundColor Green
    } else {
        Write-Host "❌ Index.html未引用正确的JS文件" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Index.html不存在" -ForegroundColor Red
}

# 6. 提供下一步建议
Write-Host "`n🎯 下一步建议："
Write-Host "1. 访问 https://vercel.com/dashboard"
Write-Host "2. 找到您的 jinmai-lab 项目"
Write-Host "3. 检查最新的部署记录"
Write-Host "4. 确认部署状态是否为 'Ready'"
Write-Host "5. 访问网站测试功能"

Write-Host "`n🔗 重要链接："
Write-Host "Vercel控制台: https://vercel.com/dashboard"
Write-Host "GitHub仓库: https://github.com/kvo-chen/jinmai-lab"
Write-Host "预期网站: https://jinmai-lab.tech"

Write-Host "`n⚠️  如果部署失败："
Write-Host "1. 检查Vercel构建日志"
Write-Host "2. 确认分支设置正确"
Write-Host "3. 检查是否有构建错误"
Write-Host "4. 必要时手动触发重新部署"

Write-Host "`n✅ 成功标准："
Write-Host "- Vercel显示绿色✅状态"
Write-Host "- 网站可以正常访问"
Write-Host "- 控制台无TypeError错误"
Write-Host "- 所有UI组件工作正常"