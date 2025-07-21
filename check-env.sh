#!/bin/bash

echo "í´ Scanning for Git repos and tracked .env files..."
echo

# Find all .git directories (skip hidden/system dirs like .cache)
find . -type d -name ".git" -prune | while read gitdir; do
    repo=$(dirname "$gitdir")
    echo "ï¿½ï¿½ Checking repo: $repo"
    cd "$repo" || continue

    # List tracked .env files (if any)
    envfiles=$(git ls-files | grep '\.env$')
    if [ -n "$envfiles" ]; then
        echo "âš ï¸  Found tracked .env files:"
        echo "$envfiles" | sed 's/^/   - /'
    else
        echo "âœ… No tracked .env files found"
    fi

    echo
    cd - >/dev/null || exit
done

echo "âœ… Done scanning all repos."

