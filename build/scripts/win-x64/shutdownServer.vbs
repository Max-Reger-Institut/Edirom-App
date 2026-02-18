option explicit
dim dir, objShell, objRegEx, strSearchString, strNewString, strPath, objFSO,objFile,strFolder,jreCall

Set objShell = CreateObject("Wscript.Shell")

strPath = Wscript.ScriptFullName

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.GetFile(strPath)

strFolder = objFSO.GetParentFolderName(objFile) 
strPath = "explorer.exe /e," & strFolder

Set objRegEx = CreateObject("VBScript.RegExp")

objRegEx.Global = True   
objRegEx.IgnoreCase = True
objRegEx.Pattern = "/[\/\\]+[^\/\\]*[\/\\]+[^\/\\]*$/"

strSearchString = strPath

dir = objRegEx.Replace(objShell.CurrentDirectory, "") + "\resources\app.asar.unpacked\jetty_base"
jreCall = "..\..\jre\bin\java.exe -jar -DSTOP.PORT=19226 -DSTOP.KEY=rwavolII7 ..\jetty\start.jar --stop"

'*Wscript.Echo jreCall

objShell.CurrentDirectory = dir
objShell.Run(jreCall), 0, false
