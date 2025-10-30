@echo off

echo 🚀 Building Angular app for nginx...

REM Build the application
call npm run build:nginx

REM Move files from browser subdirectory to dist root
if exist "dist\browser" (
    echo 📁 Moving files from browser subdirectory to dist root...
    xcopy "dist\browser\*" "dist\" /E /Y
    rmdir "dist\browser" /S /Q
    echo ✅ Files moved successfully!
)

echo 🎉 Build completed! Files are ready in .\dist\
echo 📋 Configure your nginx to serve files from: %CD%\dist\
