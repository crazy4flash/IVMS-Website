# Image Optimization Guide for IVMS Website

## 🚀 Quick Start

### Using the Automated Script
```bash
./optimize_images.sh
```

### Manual Optimization Commands

#### 1. Convert PNG to WebP (Recommended for web)
```bash
npx sharp-cli -i "src/images/*.png" -o "src/images/optimized" -f webp -q 85 --optimize
```

#### 2. Optimize JPG images
```bash
npx sharp-cli -i "src/images/*.jpg" -o "src/images/optimized" -f jpeg -q 85 --optimize --progressive
```

#### 3. Resize images for specific use cases
```bash
# Hero images (max 1200px width)
npx sharp-cli -i "src/images/hero-*.png" -o "src/images/optimized" -f webp -q 85 --optimize resize 1200

# Thumbnail images (max 300px width)
npx sharp-cli -i "src/images/thumb-*.png" -o "src/images/optimized" -f webp -q 80 --optimize resize 300
```

## 📊 Optimization Results

Our optimization achieved **90-95% file size reduction**:

| Original File | Original Size | Optimized Size | Reduction |
|---------------|---------------|----------------|-----------|
| 35% reduction in fuel costs - 4.png | 904KB | 45KB | **95%** |
| ai-analytics-dashboard.png | 841KB | 46KB | **94.5%** |
| co2-emissions-reduction.png | 754KB | 50KB | **93.4%** |

## 🎯 Optimization Strategies

### 1. Format Selection
- **WebP**: Best for PNG images (superior compression)
- **Progressive JPEG**: Best for JPG images (better perceived loading)
- **Quality 85**: Optimal balance between quality and file size

### 2. Quality Settings
- **85%**: Perfect for web images (high quality, good compression)
- **80%**: Good for thumbnails and smaller images
- **90%**: Use for critical images where quality is paramount

### 3. Advanced Options

#### Lossless compression (for logos/icons)
```bash
npx sharp-cli -i "src/images/logo.png" -o "src/images/optimized" -f webp --lossless
```

#### Multiple sizes for responsive images
```bash
# Generate different sizes for responsive design
npx sharp-cli -i "src/images/hero.png" -o "src/images/optimized" -f webp -q 85 resize 1200
npx sharp-cli -i "src/images/hero.png" -o "src/images/optimized" -f webp -q 85 resize 800
npx sharp-cli -i "src/images/hero.png" -o "src/images/optimized" -f webp -q 85 resize 400
```

## 🌐 Web Implementation

### HTML Implementation
```html
<!-- Use optimized images in your HTML -->
<img src="src/images/optimized/ai-analytics-dashboard.webp" 
     alt="AI Analytics Dashboard"
     loading="lazy"
     width="800"
     height="600">
```

### Responsive Images
```html
<picture>
  <source srcset="src/images/optimized/hero.webp" type="image/webp">
  <source srcset="src/images/optimized/hero.jpg" type="image/jpeg">
  <img src="src/images/optimized/hero.jpg" alt="Hero Image">
</picture>
```

## 📈 Performance Benefits

1. **Faster Page Loads**: 90-95% smaller file sizes
2. **Better SEO**: Faster loading improves search rankings
3. **Reduced Bandwidth**: Lower hosting costs and better user experience
4. **Mobile Performance**: Smaller files load faster on mobile devices

## 🔧 Maintenance

### Regular Optimization Workflow
1. Add new images to `src/images/`
2. Run `./optimize_images.sh`
3. Update HTML to use optimized images
4. Test page load performance

### Batch Processing New Images
```bash
# Process only new images
npx sharp-cli -i "src/images/new-*.png" -o "src/images/optimized" -f webp -q 85 --optimize
```

## 🛠️ Troubleshooting

### Common Issues
1. **Sharp CLI not found**: Use `npx sharp-cli` instead of global installation
2. **Permission errors**: Run with appropriate permissions
3. **Large files**: Use `--limitInputPixels` for very large images

### Quality vs Size Trade-offs
- **High quality (90%)**: Use for hero images and critical content
- **Medium quality (85%)**: Default for most web images
- **Low quality (80%)**: Use for thumbnails and decorative images

## 📚 Additional Resources

- [Sharp CLI Documentation](https://sharp.pixelplumbing.com/)
- [WebP Format Guide](https://developers.google.com/speed/webp)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images) 