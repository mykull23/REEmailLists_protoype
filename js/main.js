// ============================================
// REAL ESTATE EMAIL LISTS - MAIN JAVASCRIPT
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ============================================
    // DATA LISTS
    // ============================================
    
    const investorStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
        "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
        "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
        "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
        "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
        "Wisconsin", "Wyoming"
    ];
    
    const investorCities = [
        "Albuquerque NM", "Atlanta GA", "Baltimore MD", "Boston MA", "Chicago IL", 
        "Columbus OH", "Denver CO", "Fayetteville NC", "Honolulu HI", "Indianapolis IN", 
        "Knoxville TN", "Little Rock AR", "Madison WI", "Milwaukee WI", "Montgomery AL", 
        "New York NY", "Omaha NE", "Raleigh NC", "Rochester NY", "Seattle WA", 
        "Tacoma WA", "Toledo OH", "Amarillo TX", "Augusta GA", "Birmingham AL", 
        "Charlotte NC", "Cleveland OH", "Dallas Fort Worth TX", "Detroit MI", 
        "Fort Wayne IN", "Houston TX", "Jacksonville FL", "Laredo TX", "Louisville KY", 
        "Memphis TN", "Minneapolis MN", "Nashville TN", "Newark NJ", "Philadelphia PA", 
        "Reno NV", "Salt Lake City UT", "Shreveport LA", "Tallahassee FL", "Tucson AZ", 
        "Washington DC", "Anchorage AK", "Austin TX", "Boise ID", "Chesapeake VA", 
        "Colorado Springs CO", "Des Moines IA", "El Paso TX", "Grand Rapids MI", 
        "Huntsville AL", "Kansas City MO", "Las Vegas NV", "Lubbock TX", "Miami FL", 
        "Mobile AL", "New Orleans LA", "Oklahoma City OK", "Phoenix AZ", "Richmond VA", 
        "San Antonio TX", "Spokane WA", "Tampa FL", "Virginia Beach VA", "Wichita KS"
    ];
    
    const agentStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
        "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
        "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
        "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
        "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
        "Wisconsin", "Wyoming"
    ];
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Populate grid elements
    function populateGrid(elementId, items, prefix, icon = 'fa-users') {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        items.forEach(item => {
            const link = document.createElement('a');
            link.href = `#?list=${prefix}&location=${encodeURIComponent(item)}`;
            link.innerHTML = `<i class="fas ${icon}"></i> ${item}`;
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`Selected: ${prefix} - ${item}`);
                // Here you would redirect to the actual list page
                // window.location.href = `/lists/${prefix}/${encodeURIComponent(item)}`;
                showNotification(`Loading ${prefix} for ${item}...`, 'info');
            });
            container.appendChild(link);
        });
    }
    
    // Show notification (toast)
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification-toast');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification-toast';
            document.body.appendChild(notification);
            
            // Add styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                .notification-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #333;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    pointer-events: none;
                    font-size: 14px;
                    max-width: 300px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .notification-toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .notification-toast.success {
                    background: #28a745;
                }
                .notification-toast.error {
                    background: #dc3545;
                }
                .notification-toast.info {
                    background: #17a2b8;
                }
            `;
            document.head.appendChild(style);
        }
        
        notification.textContent = message;
        notification.className = `notification-toast ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Set current year in footer
    function setCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // Mobile menu toggle
    function initMobileMenu() {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.getElementById('navLinks');
        
        if (toggleBtn && navLinks) {
            toggleBtn.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
                this.setAttribute('aria-expanded', expanded);
                navLinks.classList.toggle('active');
                this.innerHTML = expanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });
        }
    }
    
    // Sticky CTA on mobile scroll
    function initStickyCta() {
        const stickyCta = document.getElementById('stickyCta');
        if (!stickyCta) return;
        
        let lastScrollY = window.scrollY;
        let isVisible = false;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            const scrollPercentage = currentScrollY / (document.documentElement.scrollHeight - window.innerHeight);
            
            // Show when scrolled past 50% on mobile
            if (window.innerWidth <= 768 && scrollPercentage > 0.5 && !isVisible) {
                stickyCta.classList.add('visible');
                isVisible = true;
            } else if ((window.innerWidth > 768 || scrollPercentage <= 0.5) && isVisible) {
                stickyCta.classList.remove('visible');
                isVisible = false;
            }
        });
        
        // Close sticky CTA
        const closeBtn = stickyCta.querySelector('.close-sticky');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                stickyCta.classList.remove('visible');
                isVisible = false;
            });
        }
        
        // CTA click - open modal
        const ctaContent = stickyCta.querySelector('.sticky-cta-content');
        if (ctaContent) {
            ctaContent.addEventListener('click', function(e) {
                if (!e.target.closest('.close-sticky')) {
                    openSampleModal();
                }
            });
        }
    }
    
    // Modal functionality
    const modal = document.getElementById('sampleModal');
    
    function openSampleModal() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }
    
    function closeSampleModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    function initModal() {
        if (!modal) return;
        
        // Open modal when clicking CTA buttons
        const openButtons = document.querySelectorAll('#openSampleModal, .get-quote, .nav-cta');
        openButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openSampleModal();
            });
        });
        
        // Close modal when clicking X
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSampleModal);
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSampleModal();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeSampleModal();
            }
        });
    }
    
    // Handle sample form submission
    function initSampleForm() {
        const form = document.getElementById('sampleForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                fullName: formData.get('full_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                targetLocation: formData.get('target_location'),
                targetType: formData.get('target_type')
            };
            
            // Basic validation
            if (!data.fullName || !data.email || !data.targetLocation) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Here you would send the data to your server
            console.log('Form submitted:', data);
            
            // Show success message
            showNotification('Thank you! Your 250 free leads will be sent shortly.', 'success');
            
            // Reset form and close modal
            form.reset();
            closeSampleModal();
            
            // In production, you would send AJAX request to your endpoint
            // fetch('/api/sample-leads', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.success) {
            //         showNotification('Success! Check your email.', 'success');
            //         form.reset();
            //         closeSampleModal();
            //     }
            // })
            // .catch(error => {
            //     showNotification('Something went wrong. Please try again.', 'error');
            // });
        });
    }
    
    // Handle search form
    function initSearchForm() {
        const searchForm = document.getElementById('searchForm');
        if (!searchForm) return;
        
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('cityState');
            const searchTerm = searchInput.value.trim();
            
            if (!searchTerm) {
                showNotification('Please enter a city and state to search.', 'error');
                return;
            }
            
            showNotification(`Searching for real estate leads in "${searchTerm}"...`, 'info');
            
            // Here you would redirect to search results or process the search
            // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            
            // For demo, just log
            console.log('Search:', searchTerm);
        });
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // Add loading state to buttons
    function initButtonLoading() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (this.classList.contains('loading')) return;
                
                // Don't add loading if it's a link or has no form
                if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                    const originalText = this.innerHTML;
                    this.classList.add('loading');
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.remove('loading');
                    }, 1500);
                }
            });
        });
        
        // Add loading styles
        const style = document.createElement('style');
        style.textContent = `
            .btn.loading {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Intersection Observer for fade-in animations
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections and cards
        document.querySelectorAll('section, .feature-card, .pricing-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Add animate-in class styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Price slider/dynamic update (optional)
    function initPriceCalculator() {
        // This would be more complex with actual sliders, but for now
        const priceAmounts = document.querySelectorAll('.price .amount');
        priceAmounts.forEach(price => {
            const min = parseFloat(price.getAttribute('data-min'));
            const max = parseFloat(price.getAttribute('data-max'));
            if (min && max) {
                const avg = ((min + max) / 2).toFixed(2);
                price.textContent = avg;
            }
        });
    }
    
    // Track user interactions (analytics)
    function initAnalytics() {
        // Track button clicks
        const trackEvents = ['click', 'submit'];
        const trackSelectors = ['.btn', 'form', 'a', '.state-grid a', '.city-grid a'];
        
        trackSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('click', function(e) {
                    const eventData = {
                        event: 'user_interaction',
                        element: this.tagName,
                        class: this.className,
                        text: this.textContent?.slice(0, 100),
                        url: window.location.href,
                        timestamp: new Date().toISOString()
                    };
                    
                    // In production, send to analytics
                    console.log('Analytics:', eventData);
                    
                    // If using Google Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'click', {
                            'event_category': 'engagement',
                            'event_label': this.textContent?.slice(0, 50)
                        });
                    }
                });
            });
        });
    }
    
    // Lazy load images (if any)
    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    // Populate all grids
    populateGrid('investorStateGrid', investorStates, 'investor-state', 'fa-chart-line');
    populateGrid('investorCityGrid', investorCities, 'investor-city', 'fa-building');
    populateGrid('agentStateGrid', agentStates, 'agent-state', 'fa-user-tie');
    
    // Initialize all components
    setCurrentYear();
    initMobileMenu();
    initStickyCta();
    initModal();
    initSampleForm();
    initSearchForm();
    initSmoothScroll();
    initButtonLoading();
    initAnimations();
    initPriceCalculator();
    initAnalytics();
    initLazyLoad();
    
    // Add CSS for animations if not present
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        /* Additional animations */
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .btn-primary {
            animation: none;
        }
        
        .btn-primary:hover {
            animation: pulse 0.3s ease;
        }
        
        /* Form validation styles */
        .form-group input:invalid:focus {
            border-color: var(--error);
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-light);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
        
        /* Selection styling */
        ::selection {
            background: var(--primary-color);
            color: white;
        }
        
        /* Focus visible for better accessibility */
        :focus-visible {
            outline: 3px solid var(--primary-color);
            outline-offset: 2px;
            border-radius: 4px;
        }
        
        /* Reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
    `;
    document.head.appendChild(additionalStyles);
    
    console.log('Real Estate Email Lists - Front-end initialized successfully');
});