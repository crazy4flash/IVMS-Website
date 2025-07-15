#!/bin/bash

# IVMS Website Image Optimization Script
# This script optimizes all images for web performance using Sharp CLI

echo "🚀 Starting image optimization for IVMS Website..."

# Create optimized directory if it doesn't exist
mkdir -p src/images/optimized

# Function to calculate file size reduction
calculate_reduction() {
    local original_size=$1
    local optimized_size=$2
    local reduction=$(echo "scale=1; (($original_size - $optimized_size) / $original_size) * 100" | bc -l)
    echo "$reduction"
}

# Optimize PNG images to WebP (better compression)
echo "📸 Converting PNG images to WebP format..."
npx sharp-cli -i "src/images/*.png" -o "src/images/optimized" -f webp -q 85 --optimize

# Optimize JPG images (progressive encoding for better perceived performance)
echo "🖼️  Optimizing JPG images..."
npx sharp-cli -i "src/images/*.jpg" -o "src/images/optimized" -f jpeg -q 85 --optimize --progressive

# Create a summary report
echo -e "\n📊 Optimization Summary:"
echo "=========================="

# Count files
original_png_count=$(ls src/images/*.png 2>/dev/null | wc -l)
original_jpg_count=$(ls src/images/*.jpg 2>/dev/null | wc -l)
optimized_webp_count=$(ls src/images/optimized/*.webp 2>/dev/null | wc -l)
optimized_jpg_count=$(ls src/images/optimized/*.jpg 2>/dev/null | wc -l)

echo "Files processed:"
echo "- Original PNG files: $original_png_count"
echo "- Original JPG files: $original_jpg_count"
echo "- Optimized WebP files: $optimized_webp_count"
echo "- Optimized JPG files: $optimized_jpg_count"

# Calculate total size reduction
original_total=$(du -sk src/images/*.png src/images/*.jpg 2>/dev/null | awk '{sum += $1} END {print sum}')
optimized_total=$(du -sk src/images/optimized/*.webp src/images/optimized/*.jpg 2>/dev/null | awk '{sum += $1} END {print sum}')

if [ ! -z "$original_total" ] && [ ! -z "$optimized_total" ]; then
    reduction=$(calculate_reduction $original_total $optimized_total)
    echo -e "\n💾 Size reduction:"
    echo "- Original total: ${original_total}KB"
    echo "- Optimized total: ${optimized_total}KB"
    echo "- Reduction: ${reduction}%"
fi

echo -e "\n✅ Image optimization complete!"
echo "📁 Optimized images saved to: src/images/optimized/"
echo "🌐 Use these optimized images in your HTML for better web performance" 