SET TARGET_DIR=D:\SocialMedia
cd /d "%TARGET_DIR%"

IF NOT EXIST "uploadFiles" (
    mkdir "uploadFiles"
)