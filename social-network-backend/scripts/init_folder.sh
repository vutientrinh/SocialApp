TARGET_DIR="/opt/SocialNetwork"

if [ ! -d "$TARGET_DIR" ]; then 
    mkdir -p "$TARGET_DIR"
fi

cd "$TARGET_DIR" || { echo "Failed to change directory to $TARGET_DIR"; exit 1; }

if [ ! -d "uploadFiles" ]; then 
    mkdir "uploadFiles"
fi
