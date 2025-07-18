#!/bin/bash

# Script to fix incorrect file extensions in image references
echo "🔧 Fixing image reference file extensions..."

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

# Fix each HTML file
for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Fixing $file..."
        
        # Fix PNG references (remove .png from .webp files)
        sed -i '' 's|src="src/images/optimized/\([^"]*\)\.png\.webp"|src="src/images/optimized/\1.webp"|g' "$file"
        
        # Fix favicon references
        sed -i '' 's|href="src/images/optimized/ivms-logo\.webp"|href="src/images/optimized/ivms-logo.webp"|g' "$file"
        
        echo "✅ Fixed $file"
    else
        echo "⚠️  File $file not found, skipping..."
    fi
done

echo -e "\n🎉 Image reference fixes complete!"
echo "📁 All image references now point to the correct optimized files!" 