# 津门老字号AI共创坊 - GitHub部署脚本
# 用于将最新构建推送到GitHub Pages

param(
    [string]$CommitMessage = "更新部署：修复TypeScript错误和运行时问题",
    [string]$Branch = "gh-pages",
    [switch]$Force = $false,
    [switch]$PushOnly = $false
)

Write-Host "🚀 津门老字号AI共创坊 - GitHub部署工具" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 1. 检查Git状态
Write-Host "📋 检查Git状态..." -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "⚠️  检测到未提交的更改:" -ForegroundColor Orange
        Write-Host $gitStatus -ForegroundColor Gray
        if (-not $Force) {
            Write-Host "使用 -Force 参数强制继续，或先提交/暂存更改" -ForegroundColor Yellow
            exit 1
        }
    }
} catch {
    Write-Host "❌ Git命令执行失败，请确保Git已安装且在当前目录" -ForegroundColor Red
    exit 1
}

# 2. 确保构建是最新的
if (-not $PushOnly) {
    Write-Host "🔨 确保构建是最新的..." -ForegroundColor Yellow
    Write-Host "执行 npm run build..." -ForegroundColor Gray
    
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 构建失败:" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ 构建成功" -ForegroundColor Green
}

# 3. 准备部署文件
Write-Host "📁 准备部署文件..." -ForegroundColor Yellow

# 创建临时部署目录
$tempDeployDir = "temp-github-deploy"
if (Test-Path $tempDeployDir) {
    Remove-Item -Path $tempDeployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDeployDir | Out-Null

# 复制构建文件
Copy-Item -Path "dist\*" -Destination $tempDeployDir -Recurse -Force

# 添加CNAME文件
"jinmai-lab.tech" | Out-File -FilePath "$tempDeployDir\CNAME" -Encoding UTF8

# 增强index.html（添加版本信息）
$indexPath = "$tempDeployDir\index.html"
if (Test-Path $indexPath) {
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
    $content = $content -replace '<meta name="viewport" content="[^"]*" />', "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />`n$versionInfo"
    
    # 使用相对路径
    $content = $content -replace 'https://[^/]*/assets/', './assets/'
    $content = $content -replace 'href="/vite.svg"', 'href=\"./vite.svg\"'
    
    $content | Out-File -FilePath $indexPath -Encoding UTF8
    Write-Host "✅ 增强index.html完成" -ForegroundColor Green
}

# 4. 切换到gh-pages分支
Write-Host "🌿 切换到gh-pages分支..." -ForegroundColor Yellow
try {
    # 检查分支是否存在
    $branches = git branch --list $Branch
    if ($branches) {
        git checkout $Branch
    } else {
        git checkout --orphan $Branch
    }
    
    if ($LASTEXITCODE -ne 0) {
        throw "分支切换失败"
    }
    Write-Host "✅ 切换到$Branch分支成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 分支切换失败: $_" -ForegroundColor Red
    exit 1
}

# 5. 清理旧文件（保留.git目录）
Write-Host "🧹 清理旧文件..." -ForegroundColor Yellow
try {
    # 获取所有文件（除了.git目录）
    $filesToRemove = Get-ChildItem -Path . -Exclude ".git" -Force
    foreach ($file in $filesToRemove) {
        if ($file.PSIsContainer) {
            Remove-Item -Path $file.FullName -Recurse -Force
        } else {
            Remove-Item -Path $file.FullName -Force
        }
    }
    Write-Host "✅ 清理完成" -ForegroundColor Green
} catch {
    Write-Host "⚠️  清理过程中出现警告，继续执行..." -ForegroundColor Orange
}

# 6. 复制新文件
Write-Host "📦 复制新文件..." -ForegroundColor Yellow
try {
    Get-ChildItem -Path $tempDeployDir | ForEach-Object {
        if ($_.PSIsContainer) {
            Copy-Item -Path $_.FullName -Destination . -Recurse -Force
        } else {
            Copy-Item -Path $_.FullName -Destination . -Force
        }
    }
    Write-Host "✅ 文件复制完成" -ForegroundColor Green
} catch {
    Write-Host "❌ 文件复制失败: $_" -ForegroundColor Red
    exit 1
}

# 7. 添加所有文件到Git
Write-Host "📋 添加文件到Git..." -ForegroundColor Yellow
try {
    git add .
    if ($LASTEXITCODE -ne 0) {
        throw "Git添加失败"
    }
    Write-Host "✅ 文件添加完成" -ForegroundColor Green
} catch {
    Write-Host "❌ Git添加失败: $_" -ForegroundColor Red
    exit 1
}

# 8. 提交更改
Write-Host "💾 提交更改..." -ForegroundColor Yellow
try {
    $commitOutput = git commit -m $CommitMessage 2>&1
    if ($LASTEXITCODE -ne 0) {
        # 如果没有更改需要提交，也视为成功
        if ($commitOutput -match "nothing to commit") {
            Write-Host "⚠️  没有需要提交的更改" -ForegroundColor Orange
        } else {
            throw "提交失败: $commitOutput"
        }
    } else {
        Write-Host "✅ 提交成功" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ 提交失败: $_" -ForegroundColor Red
    exit 1
}

# 9. 推送分支
Write-Host "🚀 推送到GitHub..." -ForegroundColor Yellow
try {
    git push origin $Branch
    if ($LASTEXITCODE -ne 0) {
        throw "推送失败"
    }
    Write-Host "✅ 推送成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送失败: $_" -ForegroundColor Red
    exit 1
}

# 10. 切换回原分支
Write-Host "🔄 切换回原分支..." -ForegroundColor Yellow
try {
    git checkout main  # 或者master，根据实际情况
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  切换回原分支失败，请手动切换" -ForegroundColor Orange
    } else {
        Write-Host "✅ 切换回原分支成功" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  切换回原分支失败，请手动切换" -ForegroundColor Orange
}

# 11. 清理临时文件
Write-Host "🧹 清理临时文件..." -ForegroundColor Yellow
if (Test-Path $tempDeployDir) {
    Remove-Item -Path $tempDeployDir -Recurse -Force
}

# 12. 输出结果
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 GitHub部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 部署总结:" -ForegroundColor Cyan
Write-Host "   分支: $Branch" -ForegroundColor White
Write-Host "   提交: $CommitMessage" -ForegroundColor White
Write-Host "   时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host ""
Write-Host "🌐 访问地址:" -ForegroundColor Cyan
Write-Host "   https://jinmai-lab.tech" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  GitHub Pages部署通常需要1-5分钟生效" -ForegroundColor Yellow
Write-Host "🔍 部署后可以使用check-deployment.ps1验证状态" -ForegroundColor Yellow
Write-Host ""
Write-Host "部署工具执行完成！🚀" -ForegroundColor Green