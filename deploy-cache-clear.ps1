# 强制缓存清除部署脚本
Write-Host "强制缓存清除部署..."

# 创建新的部署目录
$deployDir = "deploy-cache-clear"
If (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir

# 复制构建文件
Copy-Item -Path "dist\*" -Destination $deployDir -Recurse -Force

# 创建带有缓存清除版本号的index.html
$htmlContent = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg?v=$(Get-Date -Format 'yyyyMMddHHmmss')" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>津门老字号AI共创坊</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <script type="module" crossorigin src="/assets/index-80870580.js?v=$(Get-Date -Format 'yyyyMMddHHmmss')"></script>
    <link rel="stylesheet" href="/assets/index-1869d570.css?v=$(Get-Date -Format 'yyyyMMddHHmmss')">
</head>
<body>
    <div id="root"></div>
</body>
</html>
"@

Set-Content -Path "$deployDir\index.html" -Value $htmlContent

# 创建vercel.json配置，强制清除缓存
$vercelConfig = @"
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "Expires",
          "value": "0"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
"@

Set-Content -Path "$deployDir\vercel.json" -Value $vercelConfig

# 创建部署说明
$readme = @"
# 强制缓存清除部署

这个部署包包含了：
1. 最新的UI组件修复
2. 强制缓存清除的HTTP头
3. 版本号参数防止浏览器缓存
4. 更新的构建文件

## 部署步骤

### 方法1: Vercel CLI直接部署
\`\`\`bash
cd deploy-cache-clear
vercel --prod
\`\`\`

### 方法2: 手动上传到Vercel
1. 访问 https://vercel.com/dashboard
2. 选择您的项目
3. 点击 "Deploy" 或上传新文件
4. 确保覆盖所有文件

### 方法3: GitHub强制推送
如果Git锁已解除，可以强制推送：
\`\`\`bash
git add .
git commit -m "强制缓存清除部署"
git push origin master --force
\`\`\`

## 验证部署成功
1. 访问 https://jinmai-lab.tech
2. 打开浏览器控制台
3. 检查是否还出现 "TypeError: n is not a function"
4. 确认加载的是 index-80870580.js 而不是 index-10d2da63.js
"@

Set-Content -Path "$deployDir\README.md" -Value $readme

Write-Host "强制缓存清除部署包已创建: $deployDir"
Write-Host "文件列表:"
Get-ChildItem -Path $deployDir | Select-Object Name, Length, LastWriteTime

# 创建压缩包便于上传
Compress-Archive -Path "$deployDir\*" -DestinationPath "$deployDir.zip" -Force
Write-Host "压缩包已创建: $deployDir.zip"

Write-Host "`n下一步:"
Write-Host "1. cd deploy-cache-clear"
Write-Host "2. vercel --prod"
Write-Host "或者手动上传到Vercel控制台"