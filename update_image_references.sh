#!/bin/bash

# Script to update all image references in HTML files to use optimized images
echo "🔄 Updating image references to use optimized images..."

# List of HTML files to update
html_files=(
    "index.html"
    "about.html"
    "contact.html"
    "speedsense.html"
    "rental-leasing.html"
    "governments.html"
    "logistics.html"
    "privacy-policy.html"
    "terms-of-service.html"
    "cookie-policy.html"
    "accessibility-statement.html"
    "src/components/header.html"
    "src/components/footer.html"
)

# Update each HTML file
for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Updating $file..."
        
        # Update PNG references to WebP
        sed -i '' 's|src="src/images/\([^"]*\.png\)"|src="src/images/optimized/\1.webp"|g' "$file"
        
        # Update JPG references to optimized JPG
        sed -i '' 's|src="src/images/\([^"]*\.jpg\)"|src="src/images/optimized/\1"|g' "$file"
        
        # Update favicon references
        sed -i '' 's|href="src/images/ivms-logo\.png"|href="src/images/optimized/ivms-logo.webp"|g' "$file"
        
        echo "✅ Updated $file"
    else
        echo "⚠️  File $file not found, skipping..."
    fi
done

echo -e "\n🎉 Image reference update complete!"
echo "📁 All images now reference the optimized versions in src/images/optimized/"
echo "🌐 Your website will now load much faster with the optimized images!" 