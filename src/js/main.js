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

    // Form submission handling
    initializeFormHandlers();
});

// Form submission handling
function initializeFormHandlers() {
    // Handle contact forms (both index.html and contact.html)
    const contactForms = document.querySelectorAll('form[action="/submit-contact"]');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactForm);
    });

    // Handle government form
    const governmentForms = document.querySelectorAll('form[action="/submit-government"]');
    governmentForms.forEach(form => {
        form.addEventListener('submit', handleGovernmentForm);
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    
    // Send form data
    fetch('/submit-contact', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('success', data.message);
            form.reset();
        } else {
            showMessage('error', data.message || 'An error occurred. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('error', 'An error occurred. Please try again.');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function handleGovernmentForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    
    // Send form data
    fetch('/submit-government', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('success', data.message);
            form.reset();
        } else {
            showMessage('error', data.message || 'An error occurred. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('error', 'An error occurred. Please try again.');
    })
    .finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type === 'success' ? 'success' : 'error'}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 6px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' 
            ? 'background-color: #d1fae5; color: #065f46; border: 1px solid #10b981;' 
            : 'background-color: #fee2e2; color: #991b1b; border: 1px solid #ef4444;'
        }
    `;
    
    // Insert message after the form
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

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