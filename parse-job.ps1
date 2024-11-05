$parseUrl = "http://localhost:1337/parse/functions/updatePaymentStatus"
$appId = "Renting"
$masterKey = "9ee3136b956a31a25075a4d0d220552081b386f22b4a04a620fe1090b15004eb"

function Invoke-ParseJob {
    $headers = @{
        "X-Parse-Application-Id" = $appId
        "X-Parse-Master-Key" = $masterKey
        "Content-Type" = "application/json"
    }

    
    try {
        $response = Invoke-RestMethod -Uri $parseUrl -Method Post -Headers $headers 
        Write-Host "Job triggered successfully at $(Get-Date)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Error triggering job: $_" -ForegroundColor Red
    }
}

# Run every 5 seconds until stopped
while ($true) {
    Invoke-ParseJob
    Start-Sleep -Seconds 5
}