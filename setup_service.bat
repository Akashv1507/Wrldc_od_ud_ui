call nssm.exe install mis_od_ud_ui "%cd%\run_server.bat"
rem call nssm.exe edit mis_od_ud_ui
call nssm.exe set mis_od_ud_ui AppStdout "%cd%\logs\mis_od_ud_ui.log"
call nssm.exe set mis_od_ud_ui AppStderr "%cd%\logs\mis_od_ud_ui.log"
call sc start mis_od_ud_ui