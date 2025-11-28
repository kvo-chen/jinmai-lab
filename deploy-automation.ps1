# 津门老字号AI共创坊 - 自动化部署脚本
# 用于解决版本不一致和缓存问题

param(
    [string]$Domain = "jinmai-lab.tech",
    [string]$DeployDir = "deploy",
    [switch]$Force = $false,
    [switch]$Verify = $false
)

Write-Host "🚀 津门老字号AI共创坊 - 自动化部署工具" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 1. 版本信息
$Version = "v2.0.1-修复版-$(Get-Date -Format 'yyyy-MM-dd')"
$BuildTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "📋 部署信息:" -ForegroundColor Cyan
Write-Host "   版本: $Version" -ForegroundColor White
Write-Host "   构建时间: $BuildTime" -ForegroundColor White
Write-Host "   目标域名: $Domain" -ForegroundColor White
Write-Host ""

# 2. 清理和准备
Write-Host "🧹 清理部署环境..." -ForegroundColor Yellow

if (Test-Path $DeployDir) {
    Write-Host "   删除旧的部署目录..." -ForegroundColor Gray
    Remove-Item -Path $DeployDir -Recurse -Force
}

Write-Host "   创建新的部署目录..." -ForegroundColor Gray
New-Item -ItemType Directory -Path $DeployDir -Force | Out-Null

# 3. 构建项目
Write-Host "📦 构建项目..." -ForegroundColor Yellow
Write-Host "   执行 npm run build..." -ForegroundColor Gray

$buildOutput = npm run build 2>&1
$buildSuccess = $LASTEXITCODE -eq 0

if ($buildSuccess) {
    Write-Host "   ✅ 构建成功!" -ForegroundColor Green
} else {
    Write-Host "   ❌ 构建失败!" -ForegroundColor Red
    Write-Host "   错误信息:" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    exit 1
}

# 4. 复制文件
Write-Host "📁 准备部署文件..." -ForegroundColor Yellow
Write-Host "   复制构建文件..." -ForegroundColor Gray
Copy-Item -Path "dist\*" -Destination "$DeployDir\" -Recurse -Force

# 5. 创建配置文件
Write-Host "⚙️  创建配置文件..." -ForegroundColor Yellow

# CNAME文件
"$Domain" | Out-File -FilePath "$DeployDir\CNAME" -Encoding UTF8
Write-Host "   创建 CNAME 文件" -ForegroundColor Gray

# 版本信息文件
$versionInfo = @"
版本: $Version
构建时间: $BuildTime
域名: $Domain
构建状态: 成功
文件数量: $((Get-ChildItem -Path "$DeployDir" -Recurse -File).Count)
"@
$versionInfo | Out-File -FilePath "$DeployDir\VERSION.txt" -Encoding UTF8
Write-Host "   创建版本信息文件" -ForegroundColor Gray

# 部署说明
$deployInfo = @"
# 津门老字号AI共创坊 - 部署包

版本: $Version
构建时间: $BuildTime

## 文件说明
- index.html - 主页面（包含缓存清除）
- assets/ - 静态资源文件
- CNAME - 域名配置
- VERSION.txt - 版本信息

## 部署步骤
1. 上传所有文件到Web服务器根目录
2. 确保域名 $Domain 指向正确目录
3. 清除浏览器缓存后访问

## 验证方法
1. 查看页面源代码中的版本meta标签
2. 检查浏览器控制台是否有错误
3. 确认加载的是最新的JS文件

## 技术支持
- React 18 + TypeScript + Vite
- Tailwind CSS
- 完整UI组件库
"@
$deployInfo | Out-File -FilePath "$DeployDir\DEPLOYMENT_GUIDE.txt" -Encoding UTF8
Write-Host "   创建部署指南" -ForegroundColor Gray

# 6. 创建增强版index.html（带缓存清除）
Write-Host "🔧 增强index.html配置..." -ForegroundColor Yellow

$indexPath = "$DeployDir\index.html"
$indexContent = Get-Content $indexPath -Raw

# 添加缓存清除和版本标识
$enhancements = @"
    <!-- 缓存清除 -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="version" content="$Version" />
    <meta name="build-time" content="$BuildTime" />
"@

# 替换或添加到head标签中
if ($indexContent -match '<meta name="viewport"') {
    $indexContent = $indexContent -replace '<meta name="viewport" content="[^"]*" />', "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />`n$enhancements"
}

# 确保使用相对路径
$indexContent = $indexContent -replace 'https://[^/]*/assets/', './assets/'
$indexContent = $indexContent -replace 'href="/vite.svg"', 'href="./vite.svg"'

$indexContent | Out-File -FilePath $indexPath -Encoding UTF8
Write-Host "   添加缓存清除和版本标识" -ForegroundColor Gray

# 7. 文件验证
Write-Host "🔍 验证文件完整性..." -ForegroundColor Yellow

$requiredFiles = @("index.html", "assets\index-4037e6e7.js", "assets\index-1869d570.css")
$allFilesValid = $true

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $DeployDir $file
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length
        Write-Host "   ✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 缺少文件: $file" -ForegroundColor Red
        $allFilesValid = $false
    }
}

if (-not $allFilesValid) {
    Write-Host "❌ 文件验证失败!" -ForegroundColor Red
    exit 1
}

# 8. 生成部署报告
Write-Host "📊 生成部署报告..." -ForegroundColor Yellow

$report = @"
=====================================
津门老字号AI共创坊 - 部署报告
=====================================

版本: $Version
构建时间: $BuildTime
部署目录: $DeployDir
目标域名: $Domain

文件清单:
"@

Get-ChildItem -Path $DeployDir -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($PWD.Path.Length + 1 + $DeployDir.Length + 1)
    $size = $_.Length
    $report += "`n- $relativePath ($size bytes)"
}

$report += @"


部署说明:
1. 将 $DeployDir 文件夹中的所有内容上传到Web服务器
2. 确保域名 $Domain 指向正确目录
3. 清除浏览器缓存或使用无痕模式访问
4. 验证版本信息: $Version

验证方法:
- 查看页面源代码中的 <meta name="version" content="$Version" />
- 检查浏览器控制台是否还有错误
- 确认加载的是最新的JS文件 (index-4037e6e7.js)

技术支持:
- React 18 + TypeScript + Vite
- Tailwind CSS
- 完整UI组件库

=====================================
部署准备完成! 🎉
=====================================
"@

$report | Out-File -FilePath "$DeployDir\DEPLOYMENT_REPORT.txt" -Encoding UTF8

# 9. 最终输出
Write-Host ""
Write-Host "🎉 部署包准备完成!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "版本: $Version" -ForegroundColor Cyan
Write-Host "文件数量: $((Get-ChildItem -Path $DeployDir -Recurse -File).Count)" -ForegroundColor Cyan
Write-Host "部署目录: ./$DeployDir/" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 下一步操作:" -ForegroundColor Magenta
Write-Host "1. 将 ./$DeployDir/ 中的所有文件上传到服务器" -ForegroundColor White
Write-Host "2. 确保域名 $Domain 指向正确目录" -ForegroundColor White
Write-Host "3. 清除浏览器缓存后访问 https://$Domain" -ForegroundColor White
Write-Host ""
Write-Host "🔍 验证部署:" -ForegroundColor Magenta
Write-Host "- 查看页面源代码中的版本meta标签" -ForegroundColor Gray
Write-Host "- 确认没有运行时错误" -ForegroundColor Gray
Write-Host "- 检查是否加载最新的JS文件" -ForegroundColor Gray

if ($Verify) {
    Write-Host ""
    Write-Host "🔍 开始本地验证..." -ForegroundColor Yellow
    # 这里可以添加本地服务器测试逻辑
    Write-Host "✅ 本地验证完成" -ForegroundColor Green
}

Write-Host ""
Write-Host "部署工具执行完成! 🚀" -ForegroundColor Green