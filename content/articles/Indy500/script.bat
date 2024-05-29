@echo off
setlocal enabledelayedexpansion

:: Define the variable name
set variablename=tr

:: Initialize the counter
set /a counter=1

:: Loop through all files in the current directory
for %%f in (*) do (
    :: Skip renaming for index.md and script.bat
    if /I not "%%f"=="index.md" if /I not "%%f"=="script.bat" (
        :: Get the file extension
        set "ext=%%~xf"
        :: Rename the file
        ren "%%f" "%variablename%!counter!%%~xf"
        :: Increment the counter
        set /a counter+=1
    )
)

endlocal
