Remove-Item src\dist\*.zip

# We zip in powershell instead of in Gulp due to issues with gulp-zip not maintaining a BOM
Compress-Archive -Path src\app\* -DestinationPath "src\dist\Web Developer Checklist.zip"