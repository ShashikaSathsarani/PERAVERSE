# Quick Start Script for EngEx Knowledge Base Database
# Run this script to set up everything automatically

Write-Host "🚀 EngEx Knowledge Base Database Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if .env exists
Write-Host "📋 Step 1: Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Creating .env template..." -ForegroundColor Yellow
    
    $envTemplate = @"
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Knowledge Base API Port
KB_API_PORT=8080

# OpenAI (if used)
OPENAI_API_KEY=your-openai-key-here
"@
    
    $envTemplate | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Created .env template" -ForegroundColor Green
    Write-Host "⚠️  Please update .env with your Supabase credentials!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your Supabase credentials:" -ForegroundColor Cyan
    Write-Host "1. Go to https://supabase.com" -ForegroundColor White
    Write-Host "2. Open your project" -ForegroundColor White
    Write-Host "3. Go to Settings > API" -ForegroundColor White
    Write-Host "4. Copy 'Project URL' and 'service_role' key" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to continue after updating .env"
}
else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

# Step 2: Check if in correct directory
Write-Host ""
Write-Host "📂 Step 2: Checking directory..." -ForegroundColor Yellow
$currentPath = Get-Location
if ($currentPath.Path -notlike "*chatbot-server*") {
    Write-Host "⚠️  Changing to chatbot-server directory..." -ForegroundColor Yellow
    Set-Location "src\pages\kiosk\chatbot-server"
}
Write-Host "✅ In correct directory" -ForegroundColor Green

# Step 3: Install dependencies
Write-Host ""
Write-Host "📦 Step 3: Installing dependencies..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    exit 1
}

# Step 4: Check Supabase connection
Write-Host ""
Write-Host "🔗 Step 4: Testing Supabase connection..." -ForegroundColor Yellow
Write-Host "⚠️  Make sure you've run database-schema.sql in Supabase!" -ForegroundColor Yellow
Write-Host ""
Write-Host "To run the schema:" -ForegroundColor Cyan
Write-Host "1. Open Supabase Dashboard" -ForegroundColor White
Write-Host "2. Go to SQL Editor" -ForegroundColor White
Write-Host "3. Copy contents of database-schema.sql" -ForegroundColor White
Write-Host "4. Paste and click 'Run'" -ForegroundColor White
Write-Host ""
$runSchema = Read-Host "Have you run the database schema? (y/n)"

if ($runSchema -ne "y") {
    Write-Host "❌ Please run the database schema first!" -ForegroundColor Red
    Write-Host "📄 File location: src\pages\kiosk\chatbot-server\database-schema.sql" -ForegroundColor Yellow
    exit 1
}

# Step 5: Start the server
Write-Host ""
Write-Host "🚀 Step 5: Starting Knowledge Base API..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✨ Starting server on port 8080..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Available endpoints:" -ForegroundColor Green
Write-Host "  - Health Check: http://localhost:8080/health" -ForegroundColor White
Write-Host "  - Search: http://localhost:8080/api/knowledge-base/search?q=map" -ForegroundColor White
Write-Host "  - Category: http://localhost:8080/api/knowledge-base/category/ENGEX" -ForegroundColor White
Write-Host "  - Query: http://localhost:8080/api/knowledge-base/query" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
node knowledge-base-api.js
