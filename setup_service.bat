call nssm.exe install mis_psp_scada "%cd%\run_server.bat"
rem call nssm.exe edit mis_psp_scada
call nssm.exe set mis_psp_scada AppStdout "%cd%\logs\mis_psp_scada.log"
call nssm.exe set mis_psp_scada AppStderr "%cd%\logs\mis_psp_scada.log"
call sc start mis_psp_scada