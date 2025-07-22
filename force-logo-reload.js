// Force reload all logo images to prevent caching issues
(function() {
    'use strict';
    
    // Function to force reload logo images
    function forceReloadLogos() {
        const logoImages = document.querySelectorAll('img[src*="logo"]');
        const timestamp = new Date().getTime();
        
        logoImages.forEach(function(img) {
            if (img.src.includes('logo-ivms-new.webp')) {
                // Remove any existing cache-busting parameters
                let cleanSrc = img.src.split('?')[0];
                // Add new timestamp
                img.src = cleanSrc + '?v=' + timestamp + '&t=' + timestamp;
                
                // Force reload by creating a new image object
                const newImg = new Image();
                newImg.onload = function() {
                    img.src = newImg.src;
                };
                newImg.src = img.src;
            }
        });
    }
    
    // Run immediately when script loads
    forceReloadLogos();
    
    // Also run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceReloadLogos);
    } else {
        forceReloadLogos();
    }
    
    // Run again after a short delay to catch any dynamically loaded images
    setTimeout(forceReloadLogos, 100);
    setTimeout(forceReloadLogos, 500);
    setTimeout(forceReloadLogos, 1000);
})(); 