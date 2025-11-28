# Direct Vercel deployment script
Write-Host "Deploying directly to Vercel..."

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (!$vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..."
    npm install -g vercel
}

# Navigate to deployment directory
$deployDir = "deploy-fresh"
if (!(Test-Path $deployDir)) {
    Write-Host "Deployment directory not found. Run deploy-fresh.ps1 first."
    exit 1
}

Set-Location $deployDir

Write-Host "Deploying to Vercel..."
Write-Host "This will create a new deployment with your latest build files."

# Deploy to Vercel
vercel --prod

Write-Host "Deployment completed!"
Write-Host "Check your Vercel dashboard for the deployment status."