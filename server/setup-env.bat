@echo off
echo Setting up DayCommit Server Environment...
echo.

REM Check if .env already exists
if exist .env (
    echo .env file already exists!
    echo If you want to recreate it, delete the existing .env file first.
    pause
    exit /b
)

echo Creating .env file...
(
    echo PORT=5000
    echo MONGODB_URI=mongodb://localhost:27017/daycommit
) > .env

echo.
echo .env file created successfully!
echo.
echo Default configuration:
echo   PORT=5000
echo   MONGODB_URI=mongodb://localhost:27017/daycommit
echo.
echo If you're using MongoDB Atlas, edit the .env file and update MONGODB_URI
echo Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daycommit
echo.
pause
