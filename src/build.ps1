Remove-Item dist\*.zip

$manifest = Get-Content -Path app\manifest.json

[System.Reflection.Assembly]::LoadWithPartialName("System.Web.Extensions")
$ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$obj = $ser.DeserializeObject($manifest)

$version = $obj.version

# We zip in powershell instead of in Gulp due to issues with gulp-zip not maintaining a BOM
Compress-Archive -Path app\* -DestinationPath "dist\Web Developer Checklist $version.zip"