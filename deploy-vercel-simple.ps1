# Vercel部署脚本（简化版）

Write-Host "准备部署到Vercel..." -ForegroundColor Green

# 检查Vercel CLI
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "安装Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 部署到Vercel
Write-Host "开始部署..." -ForegroundColor Green
vercel deploy --prod --yes

Write-Host "部署完成！" -ForegroundColor Green