@echo off
REM === Batch script to map network drive ===

SET DRIVE_LETTER=Z:
SET NETWORK_PATH=\\server\sharedfolder

echo Mapping drive %DRIVE_LETTER% to %NETWORK_PATH%...

net use %DRIVE_LETTER% /delete /y
net use %DRIVE_LETTER% %NETWORK_PATH% /persistent:yes

if %ERRORLEVEL% EQU 0 (
    echo Drive mapped successfully!
) else (
    echo Failed to map drive. Please check the network path and your credentials.
)

pause
