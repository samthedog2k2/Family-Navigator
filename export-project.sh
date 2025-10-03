#!/bin/bash

# SP Autonomous Project Exporter
# This script generates a single markdown file containing the entire project structure and code.
# It is designed to be fed into other LLMs for review and analysis.

# --- Configuration ---
OUTPUT_FILE="project_export.md"
EXCLUDE_DIRS=("./node_modules" "./.next" "./.git" "./.claude" "./sp-autonomous-cruise-scraper")
EXCLUDE_FILES=("*.log" "*.lock" "package-lock.json" "project_export.md" "sp_diagnostic_report_*.txt" "yarn.lock" "pnpm-lock.yaml" "*.DS_Store")

# --- Start Script ---
echo "🚀 SP Autonomous Project Exporter Initialized..."
echo "------------------------------------------------"
echo "Output will be saved to: $OUTPUT_FILE"

# Overwrite the output file if it exists
> "$OUTPUT_FILE"

# --- 1. Generate ASCII Tree ---
echo "🌳 Generating project directory tree..."
echo "# Project Structure" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
tree -a -I "$(IFS='|'; echo "${EXCLUDE_DIRS[*]}")" >> "$OUTPUT_FILE"
echo "\`\`\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "✅ Tree generation complete."

# --- 2. Concatenate All Files ---
echo "📚 Exporting all project files..."
echo "# Project Files" >> "$OUTPUT_FILE"

# Build find command with exclusions
FIND_CMD="find . -type f"
for dir in "${EXCLUDE_DIRS[@]}"; do
    FIND_CMD+=" -not -path \"$dir/*\""
done
for file in "${EXCLUDE_FILES[@]}"; do
    FIND_CMD+=" -not -name \"$file\""
done

# Execute find and process files
eval "$FIND_CMD" | while read -r file; do
    echo "   -> Exporting $file"
    
    # Get the file extension for syntax highlighting
    extension="${file##*.}"
    if [ "$extension" = "js" ] || [ "$extension" = "jsx" ]; then
        lang="javascript"
    elif [ "$extension" = "ts" ] || [ "$extension" = "tsx" ]; then
        lang="typescript"
    elif [ "$extension" = "json" ]; then
        lang="json"
    elif [ "$extension" = "css" ]; then
        lang="css"
    elif [ "$extension" = "sh" ]; then
        lang="shell"
    elif [ "$extension" = "md" ]; then
        lang="markdown"
    elif [ "$extension" = "yaml" ] || [ "$extension" = "yml" ]; then
        lang="yaml"
    else
        lang=""
    fi

    # Append file path and content to the markdown file
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "## \`$file\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`$lang" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
done

echo "------------------------------------------------"
echo "🎉 Export Complete! Your project is now in '$OUTPUT_FILE'."
echo "You can now copy the contents of this file to share with other AI models."
