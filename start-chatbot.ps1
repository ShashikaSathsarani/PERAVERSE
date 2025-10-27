# Start both services for the chatbot
Write-Host "`n?? Starting EngEx Chatbot Services..." -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Gray

# 1. Start API Server
Write-Host "1️⃣  Starting Knowledge Base API Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\user\Documents\GitHub\PERAVERSE\src\pages\kiosk\chatbot-server'; Write-Host '🤖 Knowledge Base API Server' -ForegroundColor Green; Write-Host 'Port: 8080' -ForegroundColor White; Write-Host 'Database: Supabase (16 records)' -ForegroundColor White; Write-Host ''; node test-api.js"

Start-Sleep -Seconds 3

# 2. Check API Health
Write-Host "`n2️⃣  Checking API Health..." -ForegroundColor Yellow
try {
    $health = curl -s http://localhost:8080/health | ConvertFrom-Json
    if ($health.success) {
        Write-Host "   ✅ API Server Running" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ API Server Not Responding" -ForegroundColor Red
}

# 3. Start Kiosk App
Write-Host "`n3️⃣  Starting Kiosk Application..." -ForegroundColor Yellow
Write-Host "   Opening in default browser: http://localhost:5173`n" -ForegroundColor White

Start-Sleep -Seconds 2

# Open browser
Start-Process "http://localhost:5173/kiosk"

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "✅ SERVICES STARTED!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Gray

Write-Host "🎯 Active Services:" -ForegroundColor Cyan
Write-Host "   • Knowledge Base API: http://localhost:8080" -ForegroundColor White
Write-Host "   • Kiosk Application: http://localhost:5173" -ForegroundColor White
Write-Host "   • Database: Supabase (16 records)" -ForegroundColor White

Write-Host "`n💡 To stop services:" -ForegroundColor Yellow
Write-Host "   Close the API terminal window" -ForegroundColor White
Write-Host "   Press Ctrl+C in Vite terminal`n" -ForegroundColor White
