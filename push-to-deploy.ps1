# 清理并推送触发Vercel部署

Write-Host "清理node_modules并准备Git提交..." -ForegroundColor Green

# 清理node_modules更改（避免提交依赖包更改）
git checkout -- node_modules/

# 添加关键文件
git add vercel.json src/ package.json dist/ -f

# 提交更改
git commit -m "Update UI components and fix deployment configuration" -m "- Enhanced UI components (Input, Badge, Modal, Mobile)" -m "- Fixed TypeScript compilation errors" -m "- Updated Vercel configuration for proper deployment"

# 推送到主分支触发Vercel部署
Write-Host "正在推送到主分支以触发Vercel部署..." -ForegroundColor Green
git push origin master

Write-Host "推送完成！Vercel应该会自动开始部署。" -ForegroundColor Green