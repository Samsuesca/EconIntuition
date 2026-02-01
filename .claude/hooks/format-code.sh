#!/bin/bash
# Hook: Auto-format code after writing
# Runs on PostToolUse for Write and Edit tools

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Skip if no file path
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Format TypeScript/JavaScript files
if [[ "$FILE_PATH" == *.ts ]] || [[ "$FILE_PATH" == *.tsx ]] || [[ "$FILE_PATH" == *.js ]] || [[ "$FILE_PATH" == *.jsx ]]; then
  if command -v npx &> /dev/null; then
    # Try to format with prettier if available
    npx prettier --write "$FILE_PATH" 2>/dev/null || true
  fi
fi

# Format Python files (for any Python utilities)
if [[ "$FILE_PATH" == *.py ]]; then
  if command -v black &> /dev/null; then
    black "$FILE_PATH" 2>/dev/null || true
  fi
fi

exit 0
