// Register cache-busting service worker
(function() {
    'use strict';
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/cache-buster-sw.js')
                .then(function(registration) {
                    console.log('Cache buster service worker registered:', registration);
                    
                    // Force update the service worker
                    registration.update();
                    
                    // Clear all caches immediately
                    if ('caches' in window) {
                        caches.keys().then(function(cacheNames) {
                            return Promise.all(
                                cacheNames.map(function(cacheName) {
                                    console.log('Clearing cache:', cacheName);
                                    return caches.delete(cacheName);
                                })
                            );
                        });
                    }
                })
                .catch(function(error) {
                    console.log('Service worker registration failed:', error);
                });
        });
    }
    
    // Force reload all logo images with aggressive cache-busting
    function forceReloadAllLogos() {
        const logoImages = document.querySelectorAll('img[src*="logo"]');
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(7);
        
        logoImages.forEach(function(img) {
            // Remove any existing parameters
            let cleanSrc = img.src.split('?')[0];
            
            // Add multiple cache-busting parameters
            const separator = cleanSrc.includes('?') ? '&' : '?';
            img.src = cleanSrc + separator + 'v=20241201&t=' + timestamp + '&r=' + random + '&cb=1';
            
            // Force reload by creating new image
            const newImg = new Image();
            newImg.onload = function() {
                img.src = newImg.src;
            };
            newImg.src = img.src;
        });
    }
    
    // Run immediately
    forceReloadAllLogos();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceReloadAllLogos);
    } else {
        forceReloadAllLogos();
    }
    
    // Run multiple times with delays
    setTimeout(forceReloadAllLogos, 100);
    setTimeout(forceReloadAllLogos, 500);
    setTimeout(forceReloadAllLogos, 1000);
    setTimeout(forceReloadAllLogos, 2000);
})(); 