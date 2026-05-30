@ECHO OFF
SETLOCAL

SET WRAPPER_DIR=%~dp0.mvn\wrapper
SET DIST_DIR=%USERPROFILE%\.m2\wrapper\dists
SET MAVEN_VERSION=3.9.9
SET MAVEN_BASE=apache-maven-%MAVEN_VERSION%
SET MAVEN_ZIP=%DIST_DIR%\%MAVEN_BASE%-bin.zip
SET MAVEN_HOME=%DIST_DIR%\%MAVEN_BASE%

IF NOT EXIST "%MAVEN_HOME%\bin\mvn.cmd" (
  IF NOT EXIST "%DIST_DIR%" mkdir "%DIST_DIR%"
  ECHO Downloading Maven %MAVEN_VERSION%...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri 'https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/%MAVEN_BASE%-bin.zip' -OutFile '%MAVEN_ZIP%'" || GOTO :error
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%DIST_DIR%' -Force" || GOTO :error
)

CALL "%MAVEN_HOME%\bin\mvn.cmd" %*
EXIT /B %ERRORLEVEL%

:error
ECHO Failed to provision Maven Wrapper.
EXIT /B 1
