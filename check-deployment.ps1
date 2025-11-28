# 津门老字号AI共创坊 - 部署状态检查工具
# 用于验证部署是否成功

param(
    [string]$Url = "https://jinmai-lab.tech",
    [switch]$Detailed = $false,
    [int]$Timeout = 30
)

Write-Host "🔍 津门老字号AI共创坊 - 部署状态检查" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "检查URL: $Url" -ForegroundColor Cyan
Write-Host "检查时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host ""

# 1. 基本连接检查
Write-Host "1️⃣ 基本连接检查..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec $Timeout -UseBasicParsing
    $statusCode = $response.StatusCode
    $content = $response.Content
    
    if ($statusCode -eq 200) {
        Write-Host "   ✅ 网站可访问 (HTTP $statusCode)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  网站返回异常状态码: $statusCode" -ForegroundColor Orange
    }
} catch {
    Write-Host "   ❌ 网站无法访问: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. 版本信息检查
Write-Host "2️⃣ 版本信息检查..." -ForegroundColor Yellow
$versionPattern = '<meta name="version" content="([^"]+)"'
$buildTimePattern = '<meta name="build-time" content="([^"]+)"'

if ($content -match $versionPattern) {
    $version = $matches[1]
    Write-Host "   ✅ 找到版本信息: $version" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  未找到版本信息" -ForegroundColor Orange
}

if ($content -match $buildTimePattern) {
    $buildTime = $matches[1]
    Write-Host "   ✅ 找到构建时间: $buildTime" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  未找到构建时间" -ForegroundColor Orange
}

# 3. 关键文件检查
Write-Host "3️⃣ 关键文件检查..." -ForegroundColor Yellow

$jsPattern = '<script[^>]*src="([^"]*index-[^"]*\.js)"'
$cssPattern = '<link[^>]*href="([^"]*index-[^"]*\.css)"'

if ($content -match $jsPattern) {
    $jsFile = $matches[1]
    Write-Host "   ✅ 找到主JS文件: $jsFile" -ForegroundColor Green
    
    # 检查JS文件是否可访问
    try {
        $jsUrl = if ($jsFile.StartsWith('http')) { $jsFile } else { "$Url/$jsFile" }
        $jsResponse = Invoke-WebRequest -Uri $jsUrl -Method HEAD -TimeoutSec 10 -UseBasicParsing
        Write-Host "   ✅ JS文件可访问 (HTTP $($jsResponse.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ JS文件无法访问: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠️  未找到主JS文件" -ForegroundColor Orange
}

if ($content -match $cssPattern) {
    $cssFile = $matches[1]
    Write-Host "   ✅ 找到主CSS文件: $cssFile" -ForegroundColor Green
    
    # 检查CSS文件是否可访问
    try {
        $cssUrl = if ($cssFile.StartsWith('http')) { $cssFile } else { "$Url/$cssFile" }
        $cssResponse = Invoke-WebRequest -Uri $cssUrl -Method HEAD -TimeoutSec 10 -UseBasicParsing
        Write-Host "   ✅ CSS文件可访问 (HTTP $($cssResponse.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ CSS文件无法访问: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠️  未找到主CSS文件" -ForegroundColor Orange
}

# 4. 错误检查
Write-Host "4️⃣ 运行时错误检查..." -ForegroundColor Yellow
$errorPatterns = @(
    'TypeError',
    'ReferenceError',
    'SyntaxError',
    'Uncaught',
    'console\.error',
    'Failed to load resource'
)

$errorsFound = 0
foreach ($pattern in $errorPatterns) {
    if ($content -match $pattern) {
        $errorsFound++
        if ($Detailed) {
            Write-Host "   ⚠️  发现潜在错误模式: $pattern" -ForegroundColor Orange
        }
    }
}

if ($errorsFound -eq 0) {
    Write-Host "   ✅ 未发现明显的运行时错误模式" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  发现 $errorsFound 个潜在错误模式" -ForegroundColor Orange
}

# 5. 内容完整性检查
Write-Host "5️⃣ 内容完整性检查..." -ForegroundColor Yellow

$requiredElements = @(
    @{ Pattern = '<title[^>]*>.*津门老字号AI共创坊.*</title>'; Name = "页面标题" },
    @{ Pattern = '<div[^>]*id="root"'; Name = "React根节点" },
    @{ Pattern = '<meta[^>]*name="description"'; Name = "描述meta标签" },
    @{ Pattern = '<meta[^>]*name="keywords"'; Name = "关键词meta标签" }
)

$missingElements = @()
foreach ($element in $requiredElements) {
    if ($content -match $element.Pattern) {
        Write-Host "   ✅ 找到 $($element.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 缺少 $($element.Name)" -ForegroundColor Red
        $missingElements += $element.Name
    }
}

# 6. 性能检查
Write-Host "6️⃣ 性能检查..." -ForegroundColor Yellow

$contentSize = $content.Length
$sizeKB = [math]::Round($contentSize / 1024, 2)

if ($contentSize -gt 0) {
    Write-Host "   ✅ 页面内容大小: $sizeKB KB" -ForegroundColor Green
} else {
    Write-Host "   ❌ 页面内容为空" -ForegroundColor Red
}

# 7. 响应时间检查
Write-Host "7️⃣ 响应时间检查..." -ForegroundColor Yellow

# 重新测量响应时间
$startTime = Get-Date
try {
    $measureResponse = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec $Timeout -UseBasicParsing
    $endTime = Get-Date
    $responseTime = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "   ✅ 响应时间: $([math]::Round($responseTime, 0)) ms" -ForegroundColor Green
    
    if ($responseTime -gt 5000) {
        Write-Host "   ⚠️  响应时间较长，可能影响用户体验" -ForegroundColor Orange
    }
} catch {
    Write-Host "   ❌ 无法测量响应时间" -ForegroundColor Red
}

# 8. 总结
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "📊 部署状态总结" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$overallStatus = "良好"
$statusColor = "Green"

if ($missingElements.Count -gt 0) {
    $overallStatus = "有问题"
    $statusColor = "Red"
} elseif ($errorsFound -gt 0) {
    $overallStatus = "需要关注"
    $statusColor = "Orange"
}

Write-Host "整体状态: " -NoNewline
Write-Host $overallStatus -ForegroundColor $statusColor

if ($version) {
    Write-Host "版本: $version" -ForegroundColor Cyan
}

if ($buildTime) {
    Write-Host "构建时间: $buildTime" -ForegroundColor Cyan
}

Write-Host "页面大小: $sizeKB KB" -ForegroundColor Cyan
Write-Host "响应时间: $([math]::Round($responseTime, 0)) ms" -ForegroundColor Cyan

if ($missingElements.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ 需要修复的问题:" -ForegroundColor Red
    foreach ($element in $missingElements) {
        Write-Host "   - $element" -ForegroundColor Red
    }
}

if ($Detailed -and $errorsFound -gt 0) {
    Write-Host ""
    Write-Host "⚠️  发现的潜在错误模式:" -ForegroundColor Orange
    Write-Host "建议检查浏览器控制台获取详细错误信息" -ForegroundColor Orange
}

Write-Host ""
Write-Host "建议操作:" -ForegroundColor Magenta
if ($overallStatus -eq "良好") {
    Write-Host "✅ 部署状态良好，可以正常使用" -ForegroundColor Green
} else {
    Write-Host "🔧 建议根据上述问题进行修复" -ForegroundColor Yellow
    Write-Host "💡 可以尝试清除缓存或重新部署" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "检查完成! 🎯" -ForegroundColor Green

# 可选：生成详细报告
if ($Detailed) {
    $reportPath = "deployment-check-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    $reportContent = @"
津门老字号AI共创坊 - 部署检查报告
================================================
检查URL: $Url
检查时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
版本: $version
构建时间: $buildTime
页面大小: $sizeKB KB
响应时间: $([math]::Round($responseTime, 0)) ms
整体状态: $overallStatus

详细结果:
- 网站可访问: $(if ($statusCode -eq 200) { '✅' } else { '❌' })
- 版本信息: $(if ($version) { "✅ $version" } else { '❌ 未找到' })
- 构建时间: $(if ($buildTime) { "✅ $buildTime" } else { '❌ 未找到' })
- JS文件: $(if ($jsFile) { "✅ $jsFile" } else { '❌ 未找到' })
- CSS文件: $(if ($cssFile) { "✅ $cssFile" } else { '❌ 未找到' })
- 潜在错误: $errorsFound 个
- 缺失元素: $($missingElements.Count) 个

建议:
$(if ($overallStatus -eq "良好") { "部署状态良好，可以正常使用" } else { "建议根据发现的问题进行修复" })
"@
    
    $reportContent | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host ""
    Write-Host "📄 详细报告已保存到: $reportPath" -ForegroundColor Cyan
}