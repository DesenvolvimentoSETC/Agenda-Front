#!/bin/bash

echo "🚀 Building Angular app for nginx..."

# Build the application
npm run build:nginx

# Move files from browser subdirectory to dist root
if [ -d "dist/browser" ]; then
    echo "📁 Moving files from browser subdirectory to dist root..."
    cp -r dist/browser/* dist/
    rm -rf dist/browser
    echo "✅ Files moved successfully!"
fi

echo "🎉 Build completed! Files are ready in ./dist/"
echo "📋 Configure your nginx to serve files from: $(pwd)/dist/"
