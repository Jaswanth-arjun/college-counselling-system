#!/usr/bin/env pwsh
Set-Location "D:\college-counselling-system"
Write-Host "Current directory: $(Get-Location)"
Write-Host "Staging changes..."
& git add .
Write-Host "Changes staged. Creating commit..."
& git commit -m "Update counselling system with multiple features

- Remove student personal notes section from counselling form
- Fix extra_activities field to display as string (not array)
- Add support for multiple class assignments per counsellor
- Update admin panel for managing multiple assignments
- Improve counsellor dashboard with assignment details
- Enhance student semester update UI
- Add field mapping for JSONB columns (attendance_data, backlogs_data)  
- Remove unused React hooks (useFieldArray, Plus, Trash2, MessageSquare)
- Add migration script for assignments column
- Update database schema documentation"

Write-Host "Commit created. Pushing to GitHub..."
& git push origin main
Write-Host "Push complete!"
