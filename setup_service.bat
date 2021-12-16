call nssm.exe install soFarHighest "%cd%\run_server.bat"
rem call nssm.exe edit soFarHighest
call nssm.exe set soFarHighest AppStdout "%cd%\logs\soFarHighest.log"
call nssm.exe set soFarHighest AppStderr "%cd%\logs\soFarHighest.log"
call sc start soFarHighest