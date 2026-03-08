#!/bin/bash

# A script to safely rename the app name and package name in a standard Android project.
# FIXED VERSION: Uses 'applicationId' as the source of truth to prevent sub-package detection errors.
# SAFETY UPDATE: Excludes build/release directories and handles filenames with spaces correctly.
#
# USAGE:
# 1. Place this script in the root directory of your Android project.
# 2. Make it executable: chmod +x rename_android_project_fixed.sh
# 3. Run it: ./rename_android_project_fixed.sh "My New App Name" "com.new.package.name"

# --- Configuration ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# --- Argument Validation ---
if [ "$#" -ne 2 ]; then
    echo -e "${RED}Error: Invalid number of arguments.${NC}"
    echo "Usage: $0 \"New App Name\" \"new.package.name\""
    exit 1
fi

NEW_APP_NAME="$1"
NEW_PACKAGE_NAME="$2"

# --- Pre-run Checks ---
if { [ ! -f "settings.gradle" ] && [ ! -f "settings.gradle.kts" ]; } || [ ! -d "app" ]; then
    echo -e "${RED}Error: This script must be run from the root directory of your Android project.${NC}"
    exit 1
fi

echo -e "${GREEN}Starting Android project rename process (Fixed Version)...${NC}"
echo "-------------------------------------------"

# --- 1. Find Old Configuration ---
echo -e "${YELLOW}Step 1: Detecting current project configuration...${NC}"

# Detect Application ID (The Source of Truth)
OLD_APPLICATION_ID=$(grep 'applicationId' app/build.gradle* | sed -e 's/.*"\(.*\)"/\1/' -e "s/.*'\(.*\)'/\1/" | tr -d '[:space:]')

if [ -z "$OLD_APPLICATION_ID" ]; then
    echo -e "${RED}Error: Could not automatically detect the old applicationId in build.gradle.${NC}"
    exit 1
fi

# We use the Application ID as the Package Name to ensure we capture the root, not a sub-package.
OLD_PACKAGE_NAME="$OLD_APPLICATION_ID"

STRINGS_XML_PATH="app/src/main/res/values/strings.xml"
OLD_APP_NAME=$(sed -n 's/.*<string name="app_name"[^>]*>\([^<]*\)<\/string>.*/\1/p' "$STRINGS_XML_PATH")

# Create underscore versions for XML/Kotlin replacements
OLD_PACKAGE_UNDERSCORE=$(echo "$OLD_PACKAGE_NAME" | tr '.' '_')
NEW_PACKAGE_UNDERSCORE=$(echo "$NEW_PACKAGE_NAME" | tr '.' '_')

echo "  Old App Name:       '$OLD_APP_NAME'"
echo "  New App Name:       '$NEW_APP_NAME'"
echo "  Old Package ID:     '$OLD_PACKAGE_NAME'"
echo "  New Package ID:     '$NEW_PACKAGE_NAME'"
echo "-------------------------------------------"

# --- 2. Update Project Name in settings.gradle[.kts] ---
echo -e "${YELLOW}Step 2: Updating rootProject.name in Gradle settings...${NC}"
NEW_PROJECT_NAME=$(echo "$NEW_APP_NAME" | tr -d '[:space:]')
SETTINGS_FILE=""
if [ -f "settings.gradle.kts" ]; then
    SETTINGS_FILE="settings.gradle.kts"
elif [ -f "settings.gradle" ]; then
    SETTINGS_FILE="settings.gradle"
fi

if [ -n "$SETTINGS_FILE" ]; then
    sed -i "s|rootProject.name\s*=\s*['\"].*['\"]|rootProject.name = \"$NEW_PROJECT_NAME\"|" "$SETTINGS_FILE"
    echo -e "${GREEN}  ✔ Project name updated in $SETTINGS_FILE.${NC}"
else
    echo -e "${YELLOW}  - Skipping: No settings.gradle[.kts] file found.${NC}"
fi

# --- 3. Rename Package Directories ---
echo -e "${YELLOW}Step 3: Renaming package directories...${NC}"

if [ "$OLD_PACKAGE_NAME" == "$NEW_PACKAGE_NAME" ]; then
    echo -e "${YELLOW}  - Skipping directory rename as package names are identical.${NC}"
else
    # Convert package names to paths (e.g., com.example -> com/example)
    OLD_PATH=$(echo "$OLD_PACKAGE_NAME" | tr '.' '/')
    NEW_PATH=$(echo "$NEW_PACKAGE_NAME" | tr '.' '/')

    # Find where this path exists in src (usually src/main/java or src/main/kotlin)
    # We search specifically for the folder ending in the old package structure
    FOUND_DIRS=$(find app/src -type d -path "*/$OLD_PATH")

    if [ -z "$FOUND_DIRS" ]; then
        echo -e "${RED}Warning: Could not find directory structure '$OLD_PATH'.${NC}"
        echo -e "${RED}The folder structure might not match the applicationId. Manual check required.${NC}"
    else
        for OLD_DIR in $FOUND_DIRS; do
            # Determine the parent directory (e.g., app/src/main/kotlin)
            BASE_DIR="${OLD_DIR%/$OLD_PATH}"
            TARGET_DIR="$BASE_DIR/$NEW_PATH"

            echo "  - Detected source root: $BASE_DIR"
            echo "  - Moving: $OLD_DIR -> $TARGET_DIR"

            # Create new directory structure
            mkdir -p "$TARGET_DIR"

            # Move contents
            # We use cp -a and rm to be safer across different filesystems/environments than mv
            cp -a "$OLD_DIR/." "$TARGET_DIR/"
            rm -rf "$OLD_DIR"
            
            # Clean up empty parent directories of the old path
            # e.g., if we moved com/old/app, we try to remove com/old and com if empty
            PARENT_OF_OLD=$(dirname "$OLD_DIR")
            rmdir -p "$PARENT_OF_OLD" 2>/dev/null || true
        done
        echo -e "${GREEN}  ✔ Directories moved successfully.${NC}"
    fi
fi

# --- 4. Rename XML files with embedded package names ---
echo -e "${YELLOW}Step 4: Renaming XML files with embedded package names...${NC}"
# Use underscore version for filenames (common in Android resources)
XML_FILES_TO_RENAME=$(find ./app/src/main/res -type f -name "*${OLD_PACKAGE_UNDERSCORE}*.xml")

if [ -n "$XML_FILES_TO_RENAME" ]; then
    for old_xml_path in $XML_FILES_TO_RENAME; do
        new_xml_path=$(echo "$old_xml_path" | sed "s/$OLD_PACKAGE_UNDERSCORE/$NEW_PACKAGE_UNDERSCORE/g")
        if [ "$old_xml_path" != "$new_xml_path" ]; then
            echo "  - Renaming $(basename "$old_xml_path")"
            mv "$old_xml_path" "$new_xml_path"
        fi
    done
fi

# --- 5. Update File Contents ---
echo -e "${YELLOW}Step 5: Updating file contents (Imports, Gradle files, Manifest)...${NC}"
echo -e "${YELLOW}        (This scans .kt, .java, .xml, .gradle files, excluding build/ dirs)${NC}"

# Find all relevant files while explicitly EXCLUDING build, git, and idea directories.
# We uses -print0 and while read to correctly handle filenames with spaces or strange characters.
find . -type f \( -name "*.gradle" -o -name "*.gradle.kts" -o -name "*.xml" -o -name "*.java" -o -name "*.kt" \) \
    -not -path "*/build/*" \
    -not -path "*/.gradle/*" \
    -not -path "*/.git/*" \
    -not -path "*/.idea/*" \
    -not -name "*rename_android_project*" \
    -print0 | while IFS= read -r -d '' file; do

    # Check if file contains the old package name before attempting sed (optimization)
    # We suppress grep output.
    if grep -q "$OLD_PACKAGE_NAME" "$file"; then
        sed -i "s/$OLD_PACKAGE_NAME/$NEW_PACKAGE_NAME/g" "$file"
    fi
    
    # Check for underscore version (for resources)
    if grep -q "$OLD_PACKAGE_UNDERSCORE" "$file"; then
        sed -i "s/$OLD_PACKAGE_UNDERSCORE/$NEW_PACKAGE_UNDERSCORE/g" "$file"
    fi
done

echo -e "${GREEN}  ✔ File contents updated.${NC}"

# --- 6. Rename App Name ---
if [ -n "$OLD_APP_NAME" ] && [ "$OLD_APP_NAME" != "$NEW_APP_NAME" ]; then
    echo -e "${YELLOW}Step 6: Renaming application name...${NC}"
    sed -i "s|<string name=\"app_name\"[^>]*>.*</string>|<string name=\"app_name\">$NEW_APP_NAME</string>|g" "$STRINGS_XML_PATH"
else
    echo -e "${YELLOW}Step 6: Skipping app name rename.${NC}"
fi

# --- 7. Clean Build Directories ---
echo -e "${YELLOW}Step 7: Cleaning build directories...${NC}"
rm -rf ./build ./app/build ./.gradle
echo -e "${GREEN}  ✔ Build directories cleaned.${NC}"

echo "-------------------------------------------"
echo -e "${GREEN}✔✔✔ Project rename COMPLETE! ✔✔✔${NC}"
echo "1. Open Android Studio."
echo "2. File -> Sync Project with Gradle Files."
echo "3. Build -> Clean Project / Rebuild Project."

exit 0