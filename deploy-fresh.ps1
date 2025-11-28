# Fresh deployment script to bypass Git lock issues
Write-Host "Creating fresh deployment package..."

# Create a temporary directory for deployment
$deployDir = "deploy-fresh"
If (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir

# Copy essential files for deployment
Copy-Item -Path "dist\*" -Destination $deployDir -Recurse -Force
Copy-Item -Path "package.json" -Destination $deployDir -Force
Copy-Item -Path "vercel.json" -Destination $deployDir -Force
Copy-Item -Path "CNAME" -Destination $deployDir -Force -ErrorAction SilentlyContinue

# Create a simple index.html if it doesn't exist
If (!(Test-Path "$deployDir\index.html")) {
    Write-Host "Creating index.html..."
    $htmlContent = @"
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>津门老字号AI共创坊</title>
    <script type="module" crossorigin src="/assets/index-80870580.js"></script>
    <link rel="stylesheet" href="/assets/index-1869d570.css">
</head>
<body>
    <div id="root"></div>
</body>
</html>
"@
    Set-Content -Path "$deployDir\index.html" -Value $htmlContent
}

Write-Host "Fresh deployment package created in $deployDir"
Write-Host "Files in deployment package:"
Get-ChildItem -Path $deployDir -Recurse | Select-Object Name, Length, LastWriteTime

# Instructions for manual deployment
Write-Host "`nTo deploy manually:"
Write-Host "1. Go to GitHub repository: https://github.com/your-username/your-repo"
Write-Host "2. Click on 'Settings' tab"
Write-Host "3. Go to 'Pages' section"
Write-Host "4. Drag and drop files from $deployDir to upload"
Write-Host "5. Wait for deployment to complete"

# Alternative: Create a zip file for easy upload
Compress-Archive -Path "$deployDir\*" -DestinationPath "$deployDir.zip" -Force
Write-Host "`nZip file created: $deployDir.zip"