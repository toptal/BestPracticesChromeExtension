Remove-Item src\dist\*

Compress-Archive -Path src\app\* -DestinationPath "src\dist\Web Developer Checklist.zip"