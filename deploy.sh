#!/bin/bash

# Deploy Karate Academy to GitHub Pages

echo "🚀 Deploying Karate Academy to GitHub Pages..."

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo "📦 Creating GitHub repository..."
    gh repo create karate-academy --public --description "Interactive Karate Teaching Website"
    
    echo "🔗 Pushing to GitHub..."
    git remote add origin https://github.com/cyberwolfarmy121-art/karate-academy.git 2>/dev/null || true
    git branch -M main
    git push -u origin main
    
    echo "✅ Repository created and pushed!"
    echo ""
    echo "📋 Next steps to enable GitHub Pages:"
    echo "1. Go to https://github.com/cyberwolfarmy121-art/karate-academy"
    echo "2. Click Settings → Pages"
    echo "3. Under 'Source', select 'main' branch"
    echo "4. Click Save"
    echo "5. Your site will be live at: https://cyberwolfarmy121-art.github.io/karate-academy/"
else
    echo "⚠️ GitHub CLI (gh) not found."
    echo ""
    echo "📋 Manual steps to publish:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: karate-academy"
    echo "3. Description: Interactive Karate Teaching Website"
    echo "4. Make it Public"
    echo "5. Click 'Create repository'"
    echo "6. Run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/cyberwolfarmy121-art/karate-academy.git"
    echo "   git push -u origin main"
    echo ""
    echo "7. Go to https://github.com/cyberwolfarmy121-art/karate-academy/settings/pages"
    echo "8. Under 'Source', select 'main' branch and click Save"
    echo "9. Your site will be live at: https://cyberwolfarmy121-art.github.io/karate-academy/"
fi
