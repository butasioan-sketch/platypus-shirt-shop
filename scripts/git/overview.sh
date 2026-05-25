#!/bin/bash

echo "=== GIT OVERVIEW ==="
echo "Branch: $(git branch --show-current)"
echo "Letzter Commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
echo ""
echo "Status:"
git status --short
echo ""
echo "Uncommitted files: $(git status --porcelain | wc -l)"
