# deploy-to-azure.ps1

# Set project folder path
$projectPath = "D:\CS_general\Year3Sem2\FYP\FinalYearProject\food-ordering-backend"

# Set your Azure Web App details
$resourceGroup = "APFood"
$appServiceName = "appfood-back-server"

Write-Host "🚀 Starting deployment to Azure App Service: $appServiceName" -ForegroundColor Cyan

# Navigate to the backend folder
Set-Location $projectPath

# Install dependencies
Write-Host "📦 Installing dependencies..."
npm install

# Build the NestJS project
Write-Host "🛠️ Building project..."
npm run build

# Remove previous zip file if it exists
if (Test-Path "deploy.zip") {
    Write-Host "🧹 Removing existing deploy.zip..."
    Remove-Item "deploy.zip"
}

# Create zip archive of the entire project
Write-Host "📦 Creating deploy.zip..."
Compress-Archive -Path * -DestinationPath deploy.zip

# Deploy to Azure App Service using zip deploy
Write-Host "🚚 Deploying to Azure..."
az webapp deploy `
    --resource-group $resourceGroup `
    --name $appServiceName `
    --src-path "deploy.zip" `
    --type zip

Write-Host "✅ Deployment completed." -ForegroundColor Green
