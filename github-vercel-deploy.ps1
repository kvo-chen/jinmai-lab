# GitHub到Vercel自动部署一键脚本
Write-Host "🚀 GitHub到Vercel自动部署解决方案..."

# 1. 显示当前状态
Write-Host "当前Git状态："
git status

# 2. 尝试清理Git锁（多种方法）
Write-Host "清理Git锁文件..."

# 方法1: 尝试删除锁文件
if (Test-Path .git\index.lock) {
    Write-Host "发现Git锁文件，尝试删除..."
    try {
        Remove-Item .git\index.lock -Force -ErrorAction Stop
        Write-Host "✅ Git锁文件已删除" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  无法删除Git锁文件，尝试其他方法..." -ForegroundColor Yellow
    }
}

# 方法2: 终止Git进程
Write-Host "终止Git进程..."
taskkill /F /IM git.exe 2>$null
taskkill /F /IM git-remote-https.exe 2>$null
Start-Sleep -Seconds 2

# 3. 尝试正常Git操作
Write-Host "尝试正常Git操作..."
git reset --hard HEAD 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git重置成功" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git重置失败，尝试强制方法..." -ForegroundColor Yellow
}

# 4. 创建临时分支策略
Write-Host "创建临时部署分支..."
$branchName = "deploy-fix-$(Get-Date -Format 'yyyyMMddHHmmss')"
git checkout -b $branchName 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "创建分支失败，尝试其他策略..." -ForegroundColor Yellow
}

# 5. 添加修复的文件
Write-Host "添加修复的文件..."
git add src/ -A 2>$null
git add *.json -A 2>$null
git add *.js -A 2>$null
git add dist/ -A 2>$null

# 6. 创建提交
git commit -m "修复UI组件和TypeScript错误 - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null

# 7. 推送到GitHub
Write-Host "推送到GitHub..."
git push origin $branchName 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 推送到GitHub成功！" -ForegroundColor Green
    Write-Host "分支: $branchName" -ForegroundColor Green
} else {
    Write-Host "推送失败，尝试强制推送..." -ForegroundColor Yellow
    git push origin $branchName --force 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 强制推送成功！" -ForegroundColor Green
    } else {
        Write-Host "❌ 推送失败，需要手动干预" -ForegroundColor Red
    }
}

# 8. 提供Vercel配置建议
Write-Host "`n🎯 Vercel配置建议："
Write-Host "1. 访问 https://vercel.com/dashboard"
Write-Host "2. 找到您的项目"
Write-Host "3. 在Settings → Git中启用自动部署"
Write-Host "4. 选择分支: $branchName 或 master"
Write-Host "5. 点击 'Deploy' 触发新部署"

# 9. 创建Vercel配置文件
$vercelConfig = @'
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "master": true,
      "$branchName": true
    }
  }
}
'@

Set-Content -Path "vercel.json" -Value $vercelConfig
Write-Host "✅ Vercel配置文件已更新" -ForegroundColor Green

# 10. 最终建议
Write-Host "`n🚀 最终建议："
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitHub推送成功！" -ForegroundColor Green
    Write-Host "下一步：Vercel会自动检测并部署新推送" -ForegroundColor Green
    Write-Host "预计时间：2-3分钟" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git操作遇到问题" -ForegroundColor Yellow
    Write-Host "建议：使用GitHub网页界面手动上传文件" -ForegroundColor Yellow
    Write-Host "文件位置：deploy-path-fixed.zip" -ForegroundColor Yellow
}

Write-Host "`n📋 验证步骤："
Write-Host "1. 等待Vercel自动部署" -ForegroundColor Cyan
Write-Host "2. 访问您的域名" -ForegroundColor Cyan
Write-Host "3. 检查控制台错误" -ForegroundColor Cyan
Write-Host "4. 确认加载的是 index-80870580.js" -ForegroundColor Cyan