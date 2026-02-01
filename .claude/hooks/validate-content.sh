#!/bin/bash
# Hook: Validate economic content before writing
# Runs on PreToolUse for Write and Edit tools

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only validate content files
if [[ "$FILE_PATH" != *"/content/"* ]] && [[ "$FILE_PATH" != *".mdx"* ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Check for required frontmatter in MDX files
if [[ "$FILE_PATH" == *.mdx ]]; then
  if ! echo "$CONTENT" | grep -q "^---"; then
    echo "Warning: MDX files should have frontmatter (---)" >&2
  fi

  if ! echo "$CONTENT" | grep -q "title:"; then
    echo "Warning: Content should have a title in frontmatter" >&2
  fi

  if ! echo "$CONTENT" | grep -q "learning_objectives:"; then
    echo "Warning: Educational content should have learning_objectives" >&2
  fi
fi

# Check for proper LaTeX notation
if echo "$CONTENT" | grep -qE '\$[A-Za-z_]+\$'; then
  # Has inline math - good
  :
elif echo "$CONTENT" | grep -qiE 'equation|formula|derivative'; then
  echo "Warning: Mathematical content detected but no LaTeX notation found. Use \$...\$ for math." >&2
fi

# Check for Spanish content
if echo "$CONTENT" | grep -qiE 'the |and |or |this |that '; then
  if ! echo "$CONTENT" | grep -qiE 'el |la |los |las |y |o |este |esta '; then
    echo "Warning: Content appears to be in English. Platform content should be in Spanish." >&2
  fi
fi

# All checks passed
exit 0
