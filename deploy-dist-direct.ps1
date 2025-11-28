# 直接部署dist文件夹到Vercel
$env:VERCEL_ORG_ID="team_fhSojsHQ1OJ7TzxqryDTcqNQ"
$env:VERCEL_PROJECT_ID="prj_jPZcdMIT6RGc1xHdtfabKpFPLe8E"

Write-Host "正在部署到Vercel..." -ForegroundColor Green

# 进入dist目录并部署
cd dist
npx vercel deploy --prod --yes --token=$env:VERCEL_TOKEN

Write-Host "部署完成！" -ForegroundColor Green