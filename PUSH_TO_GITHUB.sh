#!/bin/bash
# After creating the GitHub repo, run this script

GITHUB_USER="saadahmadofficial1"
REPO_NAME="remotion-cloud-renderer"

echo "📤 Pushing to GitHub..."
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
git branch -M main
git push -u origin main

echo "✅ Done! Your repo is at:"
echo "https://github.com/$GITHUB_USER/$REPO_NAME"
