#!/bin/bash

echo "� Scanning for Git repos and tracked .env files..."
echo

# Find all .git directories (skip hidden/system dirs like .cache)
find . -type d -name ".git" -prune | while read gitdir; do
    repo=$(dirname "$gitdir")
    echo "�� Checking repo: $repo"
    cd "$repo" || continue

    # List tracked .env files (if any)
    envfiles=$(git ls-files | grep '\.env$')
    if [ -n "$envfiles" ]; then
        echo "⚠️  Found tracked .env files:"
        echo "$envfiles" | sed 's/^/   - /'
    else
        echo "✅ No tracked .env files found"
    fi

    echo
    cd - >/dev/null || exit
done

echo "✅ Done scanning all repos."

