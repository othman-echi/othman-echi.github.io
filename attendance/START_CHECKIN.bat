@echo off
title Class Register - check-in server
cd /d "%~dp0"

rem ===================================================================
rem  If the launcher cannot find Python, paste the full path to
rem  python.exe between the quotes on the next line. Get it by typing
rem  this in the Spyder console:    import sys; print(sys.executable)
rem ===================================================================
set "PYEXE="

set "PY="
echo.
echo   Folder: %~dp0

if not exist "CHECKIN_LOCAL.py" (
  echo   CHECKIN_LOCAL.py is NOT in this folder. Put it here and run again.
  goto end
)

if defined PYEXE if exist "%PYEXE%" set PY="%PYEXE%"

rem -- a real Python answers -V; the Microsoft Store placeholder does not
if not defined PY (
  py -3 -V >nul 2>nul
  if not errorlevel 1 set "PY=py -3"
)
if not defined PY (
  python -V >nul 2>nul
  if not errorlevel 1 set "PY=python"
)

rem -- usual install folders, including Anaconda and Spyder
if not defined PY for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%D\python.exe" set PY="%%D\python.exe"
if not defined PY if exist "%USERPROFILE%\anaconda3\python.exe" set PY="%USERPROFILE%\anaconda3\python.exe"
if not defined PY if exist "%USERPROFILE%\miniconda3\python.exe" set PY="%USERPROFILE%\miniconda3\python.exe"
if not defined PY if exist "%LOCALAPPDATA%\anaconda3\python.exe" set PY="%LOCALAPPDATA%\anaconda3\python.exe"
if not defined PY if exist "%ProgramData%\anaconda3\python.exe" set PY="%ProgramData%\anaconda3\python.exe"
if not defined PY for /d %%D in ("%LOCALAPPDATA%\spyder-*") do if exist "%%D\envs\spyder-runtime\python.exe" set PY="%%D\envs\spyder-runtime\python.exe"
if not defined PY for /d %%D in ("%LOCALAPPDATA%\spyder-*") do if exist "%%D\python.exe" set PY="%%D\python.exe"
if not defined PY for /d %%D in ("C:\Python3*") do if exist "%%D\python.exe" set PY="%%D\python.exe"
if not defined PY for /d %%D in ("C:\Program Files\Python3*") do if exist "%%D\python.exe" set PY="%%D\python.exe"

if not defined PY (
  echo.
  echo   No Python found automatically.
  echo.
  echo   In the Spyder console type:   import sys; print^(sys.executable^)
  echo   then paste that path into the PYEXE line near the top of this file.
  goto end
)

echo   Using: %PY%
echo.
%PY% CHECKIN_LOCAL.py
:end
echo.
pause
