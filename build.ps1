Remove-Item src\dist\*

Compress-Archive -Path src\app\* -DestinationPath "src\dist\Web Developer Checklist.zip"
Compress-Archive -Path src\temp\edgeextension\* -DestinationPath "src\dist\Edge.zip"
Rename-Item -Path "src\dist\Edge.zip" -NewName "Web Developer Checklist.appx"