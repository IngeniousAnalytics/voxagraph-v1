document.addEventListener('DOMContentLoaded', function() {
    // Initialize any interactive elements on the home and pricing pages
    console.log('Website is ready!');

    // Example function to handle a button click
    function handleButtonClick(event) {
        alert('Button clicked: ' + event.target.innerText);
    }

    // Add event listeners to buttons on the home page
    const homeButtons = document.querySelectorAll('.home-button');
    homeButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    // Add event listeners to buttons on the pricing page
    const pricingButtons = document.querySelectorAll('.pricing-button');
    pricingButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("../components/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        });

    fetch("../components/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });
});

/**
 * Voxagraph Main JavaScript
 * Handles dynamic loading of header and footer components
 */

(function() {
    'use strict';

    /**
     * Load external HTML file into a container
     * @param {string} elementId - The ID of the container element
     * @param {string} filePath - The path to the HTML file
     */
    function loadComponent(elementId, filePath) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID "${elementId}" not found`);
            return;
        }

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                
                // If loading header, initialize mobile navigation
                if (elementId === 'header') {
                    initializeMobileNav();
                }
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                element.innerHTML = `<p>Error loading component. Please refresh the page.</p>`;
            });
    }

    /**
     * Initialize mobile navigation toggle
     */
    function initializeMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (!navToggle || !mainNav) return;

        navToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
            this.classList.toggle('active');
            
            // Toggle body class for overlay
            document.body.classList.toggle('nav-open', isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('open') && 
                !mainNav.contains(e.target) && 
                !navToggle.contains(e.target)) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        // Close menu when clicking on nav links (mobile)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 960) {
                    mainNav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }

    /**
     * Add scroll effect to header
     */
    function initializeScrollEffect() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initializeSmoothScroll() {
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.hash) {
                const targetId = e.target.hash.slice(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, e.target.hash);
                }
            }
        });
    }

    /**
     * Initialize lazy loading for images
     */
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            images.forEach(function(img) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Initialize all components when DOM is ready
     */
    function init() {
        // Load header and footer
        loadComponent('header', '../components/header.html');
        loadComponent('footer', '../components/footer.html');

        // Initialize other features after a short delay to ensure components are loaded
        setTimeout(function() {
            initializeScrollEffect();
            initializeSmoothScroll();
            initializeLazyLoading();
        }, 100);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
