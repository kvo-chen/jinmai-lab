# GitHub Pages一键部署脚本
Write-Host "🚀 GitHub Pages一键部署..."

# 1. 检查git状态
Write-Host "检查Git状态..."
git status

# 2. 创建gh-pages分支（如果不存在）
Write-Host "创建gh-pages分支..."
git checkout gh-pages 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "创建新的gh-pages分支..."
    git checkout --orphan gh-pages
}

# 3. 清理当前分支（保留部署文件）
Write-Host "清理分支，准备部署文件..."
Remove-Item -Path "*" -Exclude "deploy-path-fixed","deploy-path-fixed.zip","node_modules",".git" -Recurse -Force -ErrorAction SilentlyContinue

# 4. 复制部署文件到根目录
Write-Host "复制部署文件..."
Copy-Item -Path "deploy-path-fixed\*" -Destination "." -Recurse -Force

# 5. 创建.gitignore文件（防止上传node_modules等）
@'
node_modules/
dist/
.env
.venv/
*.log
.DS_Store
'@ | Out-File -FilePath ".gitignore" -Encoding UTF8

# 6. 添加并提交文件
Write-Host "添加文件到Git..."
git add .
git status

# 7. 提交更改
$commitMessage = "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

# 8. 推送到GitHub
Write-Host "推送到GitHub..."
git push origin gh-pages --force

Write-Host "✅ GitHub Pages部署完成！" -ForegroundColor Green
Write-Host "`n🌐 网站地址："
Write-Host "https://kvo-chen.github.io/jinmai-lab/"

Write-Host "`n📋 验证步骤："
Write-Host "1. 访问上面的网址"
Write-Host "2. 检查是否加载正常"
Write-Host "3. 确认控制台无错误"
Write-Host "4. 测试UI组件功能"

Write-Host "`n⚠️  注意："
Write-Host "- 首次部署可能需要几分钟生效"
Write-Host "- 如果失败，请检查GitHub Pages设置"
Write-Host "- Settings → Pages → Source: gh-pages branch"