# 津门老字号AI共创坊 - Vercel部署脚本
# 通过Vercel CLI直接部署最新构建

Write-Host "正在准备Vercel部署..." -ForegroundColor Green

# 检查是否已安装Vercel CLI
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "正在安装Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 构建项目
Write-Host "正在构建项目..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败，退出代码: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

Write-Host "构建成功！准备部署到Vercel..." -ForegroundColor Green

# 使用Vercel CLI部署
Write-Host "开始Vercel部署..." -ForegroundColor Green
vercel deploy --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "部署成功！" -ForegroundColor Green
    Write-Host "请检查Vercel仪表板确认部署状态" -ForegroundColor Cyan
} else {
    Write-Host "部署失败，退出代码: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "请检查Vercel日志了解详细信息" -ForegroundColor Red
}

Write-Host "部署脚本执行完成" -ForegroundColor Green