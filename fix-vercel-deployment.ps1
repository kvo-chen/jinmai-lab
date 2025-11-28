# 修复Vercel部署脚本
Write-Host "🔧 修复Vercel部署问题..."

# 1. 清理旧的部署文件
Write-Host "清理旧文件..."
Remove-Item -Path "deploy-clean" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "deploy-clean" | Out-Null

# 2. 复制最新构建文件
Write-Host "复制最新构建文件..."
Copy-Item -Path "dist\*" -Destination "deploy-clean" -Recurse -Force

# 3. 创建最小化配置（避免警告）
Write-Host "创建清理配置..."
$minimalConfig = @'
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
'@

Set-Content -Path "deploy-clean\vercel.json" -Value $minimalConfig

# 4. 验证构建文件
Write-Host "验证构建文件..."
$indexHtml = Get-Content "deploy-clean\index.html" -Raw
if ($indexHtml -match "index-80870580.js") {
    Write-Host "✅ 检测到最新构建文件 index-80870580.js" -ForegroundColor Green
} else {
    Write-Host "❌ 未检测到最新构建文件，当前版本可能较旧" -ForegroundColor Red
}

# 5. 显示文件列表
Write-Host "`n部署文件列表："
Get-ChildItem "deploy-clean" | Select-Object Name, @{Name="大小(KB)";Expression={[math]::Round($_.Length/1KB,2)}}

# 6. 创建压缩包
Compress-Archive -Path "deploy-clean\*" -DestinationPath "deploy-clean.zip" -Force
Write-Host "`n✅ 压缩包创建完成: deploy-clean.zip" -ForegroundColor Green

# 7. 部署说明
Write-Host "`n📋 下一步操作："
Write-Host "1. 访问 https://vercel.com/dashboard"
Write-Host "2. 找到您的项目"
Write-Host "3. 点击 'Deploy' 或 'Import Project'"
Write-Host "4. 上传 deploy-clean.zip"
Write-Host "5. 等待部署完成"

Write-Host "`n🎯 部署成功后验证："
Write-Host "- 网站应该可以正常访问"
Write-Host "- 控制台不应再出现 TypeError"
Write-Host "- 应该加载 index-80870580.js 而不是旧的 index-10d2da63.js"