#!/bin/bash

BRANCH=$(git branch --show-current)
COMMIT=$(git log -1 --pretty=format:%h)
CHANGES=$(git status --porcelain | wc -l | tr -d ' ')

echo "[$BRANCH] $COMMIT | Uncommitted: $CHANGES"
