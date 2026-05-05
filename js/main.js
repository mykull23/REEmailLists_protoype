// ============================================
// MAIN APPLICATION - FULLY DEBUGGED
// ============================================

(function() {
    'use strict';
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        initMobileMenu();
        initCountUp();
        initSearch();
        initPricingToggle();
        initTestimonialsSlider();
        initModal();
        initFormSubmit();
        initSmoothScroll();
        setCurrentYear();
        initNavActive();
        initGetStartedButtons();
    }
    
    // Mobile Menu
    function initMobileMenu() {
        const menuBtn = document.getElementById('menuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                const isExpanded = navMenu.classList.contains('active');
                menuBtn.setAttribute('aria-expanded', isExpanded);
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                    navMenu.classList.remove('active');
                    menuBtn.classList.remove('active');
                }
            });
        }
    }
    
    // Count Up Animation
    function initCountUp() {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    if (isNaN(target)) return;
                    
                    let current = 0;
                    const increment = target / 60;
                    const duration = 2000;
                    const stepTime = duration / 60;
                    
                    const updateCounter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString();
                            clearInterval(updateCounter);
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString();
                        }
                    }, stepTime);
                    
                    obs.unobserve(counter);
                }
            });
        }, { threshold: 0.3 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Search Functionality - FIXED
    function initSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('mainSearch');
        
        if (!searchBtn || !searchInput) return;
        
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query && query.length > 0) {
                showNotification(`🔍 Searching for "${query}"...`, 'info');
                // Store search query and redirect to resources page
                sessionStorage.setItem('searchQuery', query);
                window.location.href = 'resources.html';
            } else {
                showNotification('✨ Enter a city or state to get started!', 'warning');
                searchInput.style.border = '2px solid #fbbf24';
                setTimeout(() => {
                    searchInput.style.border = 'none';
                }, 1500);
            }
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Pricing Toggle - FIXED
    function initPricingToggle() {
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const oneTimeCard = document.querySelector('.pricing-card[data-plan-type="one-time"]');
        const monthlyCard = document.querySelector('.pricing-card[data-plan-type="monthly"]');
        
        if (!toggleBtns.length || !oneTimeCard || !monthlyCard) return;
        
        const showPlan = (plan) => {
            if (plan === 'one-time') {
                oneTimeCard.style.display = 'block';
                monthlyCard.style.display = 'block';
                monthlyCard.style.order = '2';
            } else {
                oneTimeCard.style.display = 'block';
                monthlyCard.style.display = 'block';
                monthlyCard.style.order = '1';
            }
        };
        
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const plan = btn.getAttribute('data-plan');
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showPlan(plan);
            });
        });
        
        // Ensure both visible initially
        showPlan('one-time');
    }
    
    // Testimonials Slider - FIXED
    function initTestimonialsSlider() {
        const track = document.getElementById('testimonialTrack');
        const testimonials = document.querySelectorAll('.testimonial');
        const dotsContainer = document.getElementById('sliderDots');
        
        if (!track || !testimonials.length || !dotsContainer) return;
        
        let currentIndex = 0;
        let autoSlideInterval;
        let isMobile = window.innerWidth <= 768;
        
        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        function goToSlide(index) {
            if (isMobile) {
                currentIndex = Math.min(Math.max(0, index), testimonials.length - 1);
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }
        }
        
        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        function nextSlide() {
            if (isMobile) {
                currentIndex = (currentIndex + 1) % testimonials.length;
                goToSlide(currentIndex);
            }
        }
        
        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            if (isMobile && testimonials.length > 1) {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }
        }
        
        function handleResize() {
            isMobile = window.innerWidth <= 768;
            if (isMobile) {
                track.style.transition = 'transform 0.5s ease';
                goToSlide(currentIndex);
                startAutoSlide();
            } else {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
                track.style.transform = 'none';
                track.style.transition = 'none';
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize();
    }
    
    // Modal Functionality - FIXED
    function initModal() {
        const modal = document.getElementById('sampleModal');
        const openModalBtns = document.querySelectorAll('#openModalBtn, .btn-get-started, #navFreeSampleBtn');
        const closeBtn = document.querySelector('.modal-close');
        
        if (!modal) return;
        
        const openModal = (e) => {
            if (e) e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };
        
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };
        
        openModalBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', openModal);
        });
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
        });
    }
    
    // Form Submit - FIXED
    function initFormSubmit() {
        const form = document.getElementById('sampleForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const targetLocation = document.getElementById('targetLocation')?.value.trim();
            
            if (!fullName || !email || !targetLocation) {
                showNotification('❌ Please fill in all required fields', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('❌ Please enter a valid email address', 'error');
                return;
            }
            
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('🎉 Awesome! Check your email for 250 free leads!', 'success');
            form.reset();
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            const modal = document.getElementById('sampleModal');
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Get Started Buttons
    function initGetStartedButtons() {
        const getStartedBtns = document.querySelectorAll('.btn-get-started, .btn-primary');
        getStartedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = document.getElementById('sampleModal');
                if (modal && btn.classList.contains('btn-get-started')) {
                    e.preventDefault();
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
    
    // Smooth Scroll
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu
                    const navMenu = document.getElementById('navMenu');
                    const menuBtn = document.getElementById('menuBtn');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        menuBtn?.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // Current Year
    function setCurrentYear() {
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    
    // Active Nav Link
    function initNavActive() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1);
                if (href === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Toast Notifications
    window.showNotification = showNotification;
    
    function showNotification(message, type = 'info') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => toast.remove());
        
        setTimeout(() => {
            if (toast && toast.parentNode) toast.remove();
        }, 4000);
    }
})();