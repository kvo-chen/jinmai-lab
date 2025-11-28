# 修复资源路径问题的部署脚本
Write-Host "🔧 修复资源加载路径问题..."

# 1. 创建修复后的部署目录
$deployDir = "deploy-path-fixed"
If (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# 2. 复制构建文件
Copy-Item -Path "dist\*" -Destination $deployDir -Recurse -Force

# 3. 修复index.html中的路径问题
Write-Host "修复HTML文件路径..."
$indexPath = "$deployDir\index.html"
$htmlContent = Get-Content $indexPath -Raw

# 将相对路径改为绝对路径
$fixedContent = $htmlContent -replace '\./assets/', '/assets/'

# 确保正确引用最新的JS文件
if ($fixedContent -match 'index-80870580\.js') {
    Write-Host "✅ 检测到正确的JS文件引用" -ForegroundColor Green
} else {
    Write-Host "⚠️  警告：未检测到最新的JS文件引用" -ForegroundColor Yellow
}

Set-Content -Path $indexPath -Value $fixedContent -NoNewline

# 4. 创建简化的Vercel配置（避免警告）
$vercelConfig = @'
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

Set-Content -Path "$deployDir\vercel.json" -Value $vercelConfig

# 5. 验证文件结构
Write-Host "`n📁 部署文件结构："
Get-ChildItem $deployDir | Select-Object Name, @{Name="大小(KB)";Expression={[math]::Round($_.Length/1KB,2)}}

# 6. 验证assets文件夹
Write-Host "`n📦 Assets文件夹内容："
if (Test-Path "$deployDir\assets") {
    Get-ChildItem "$deployDir\assets" | Select-Object Name, @{Name="大小(KB)";Expression={[math]::Round($_.Length/1KB,2)}}
} else {
    Write-Host "❌ Assets文件夹不存在！" -ForegroundColor Red
}

# 7. 创建压缩包
Compress-Archive -Path "$deployDir\*" -DestinationPath "$deployDir.zip" -Force
Write-Host "`n✅ 路径修复完成！压缩包: $deployDir.zip" -ForegroundColor Green

# 8. 提供部署说明
Write-Host "`n🚀 部署步骤："
Write-Host "1. 访问 https://vercel.com/dashboard"
Write-Host "2. 点击 'New Project'"
Write-Host "3. 上传 $deployDir.zip"
Write-Host "4. 设置 Framework: Vite"
Write-Host "5. 点击 'Deploy'"

Write-Host "`n🎯 成功验证："
Write-Host "- 网站可以正常访问"
Write-Host "- 控制台没有资源加载错误"
Write-Host "- 加载的是 /assets/index-80870580.js"
Write-Host "- 没有 TypeError: n is not a function"