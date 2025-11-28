# 津门老字号AI共创坊 - GitHub部署脚本（简化版）
# 用于将最新构建推送到GitHub Pages

echo "🚀 津门老字号AI共创坊 - GitHub部署工具"
echo "========================================"
echo ""

# 设置变量
$CommitMessage = "更新部署：修复TypeScript错误和运行时问题"
$Branch = "gh-pages"

# 1. 确保构建是最新的
echo "🔨 确保构建是最新的..."
echo "执行 npm run build..."

npm run build
if ($LASTEXITCODE -ne 0) {
    echo "❌ 构建失败"
    exit 1
}
echo "✅ 构建成功"
echo ""

# 2. 创建临时部署目录
$tempDeployDir = "temp-github-deploy"
echo "📁 准备部署文件..."

if (Test-Path $tempDeployDir) {
    Remove-Item -Path $tempDeployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDeployDir | Out-Null

# 复制构建文件
Copy-Item -Path "dist\*" -Destination $tempDeployDir -Recurse -Force

# 添加CNAME文件
"jinmai-lab.tech" | Out-File -FilePath "$tempDeployDir\CNAME" -Encoding UTF8

# 增强index.html
echo "🔧 增强index.html..."
$indexPath = "$tempDeployDir\index.html"
$content = Get-Content $indexPath -Raw

# 添加缓存清除和版本信息
$versionInfo = @"
    <!-- 缓存清除 -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="version" content="v2.0.3-GitHub-$(Get-Date -Format 'yyyyMMdd-HHmm')" />
    <meta name="build-time" content="$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" />
"@

# 替换或添加到head标签
$content = $content -replace '<meta name="viewport" content="width=device-width, initial-scale=1.0" />', "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />`n$versionInfo"

# 使用相对路径
$content = $content -replace 'https://[^/]*/assets/', './assets/'
$content = $content -replace 'href="/vite.svg"', 'href="./vite.svg"'

$content | Out-File -FilePath $indexPath -Encoding UTF8
echo "✅ 增强index.html完成"
echo ""

# 3. 切换到gh-pages分支
echo "🌿 切换到gh-pages分支..."
git checkout gh-pages
echo "✅ 切换到gh-pages分支成功"
echo ""

# 4. 清理旧文件（保留.git目录）
echo "🧹 清理旧文件..."
Get-ChildItem -Path . -Exclude ".git" -Force | Remove-Item -Recurse -Force
echo "✅ 清理完成"
echo ""

# 5. 复制新文件
echo "📦 复制新文件..."
Get-ChildItem -Path $tempDeployDir | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination . -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination . -Force
    }
}
echo "✅ 文件复制完成"
echo ""

# 6. 添加所有文件到Git并提交
echo "📋 添加文件到Git..."
git add .
echo "💾 提交更改..."
git commit -m $CommitMessage
echo "✅ 提交完成"
echo ""

# 7. 推送分支
echo "🚀 推送到GitHub..."
git push origin gh-pages
echo "✅ 推送成功"
echo ""

# 8. 切换回原分支
echo "🔄 切换回原分支..."
git checkout main
echo "✅ 切换回原分支成功"
echo ""

# 9. 清理临时文件
echo "🧹 清理临时文件..."
if (Test-Path $tempDeployDir) {
    Remove-Item -Path $tempDeployDir -Recurse -Force
}
echo "✅ 清理完成"
echo ""

echo "========================================"
echo "🎉 GitHub部署完成！"
echo "========================================"
echo ""
echo "📋 部署总结:"
echo "   分支: gh-pages"
echo "   提交: $CommitMessage"
echo "   时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
echo ""
echo "🌐 访问地址:"
echo "   https://jinmai-lab.tech"
echo ""
echo "⏱️  GitHub Pages部署通常需要1-5分钟生效"
echo "🔍 部署后可以使用check-deployment.ps1验证状态"
echo ""
echo "部署工具执行完成！🚀"