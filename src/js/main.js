console.log("main.js loaded");
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.classList.remove('active');
        }
    });
});

// Header injection and navigation logic
function loadHeader() {
  console.log("loadHeader called");
  fetch('src/components/header.html')
    .then(response => {
      console.log("header.html fetch response", response);
      return response.text();
    })
    .then(data => {
      document.getElementById('site-header').innerHTML = data;
      console.log("header injected");
      initHeaderNav();
    })
    .catch(err => {
      console.error("Failed to load header.html", err);
    });
}

function initHeaderNav() {
  // Mobile menu open/close
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });
  }
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }
  // Dropdown logic for mobile
  document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const menu = this.parentElement.querySelector('.dropdown-menu');
      if (menu) menu.classList.toggle('show');
    });
  });
  // Close mobile menu when clicking a link
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('site-header')) {
    loadHeader();
  }
});