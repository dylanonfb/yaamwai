// Yaam Wai Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initCounters();
    initFormHandling();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetId.includes('.html') )
                window.location.href = targetId;
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effect
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Trigger fade-in animations
        triggerFadeInAnimations();
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat__number');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        
        const firstCounter = counters[0];
        if (!firstCounter) return;
        
        const rect = firstCounter.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView) {
            hasAnimated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count')) || 0;
                const duration = 2000; // 2 seconds
                const start = Date.now();
                const startValue = 0;
                
                function updateCounter() {
                    const now = Date.now();
                    const progress = Math.min((now - start) / duration, 1);
                    const easeProgress = easeOutExpo(progress);
                    const current = Math.floor(startValue + (target - startValue) * easeProgress);
                    
                    // Format number with + if it's over 100
                    if (target >= 100) {
                        counter.textContent = current + '+';
                    } else {
                        counter.textContent = current;
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (target >= 100) {
                            counter.textContent = target + '+';
                        } else {
                            counter.textContent = target;
                        }
                    }
                }
                
                requestAnimationFrame(updateCounter);
            });
        }
    }
    
    // Easing function for smooth animation
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    // Check on scroll and initial load
    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on initial load
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thanks for reaching out! We\'ll get back to you faster than you can say "Yaam Wai"! 🎉', 'success');
                
                // Reset form
                contactForm.reset();
            }, 2000);
        });
        
        // Form validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Show error if validation fails
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorElement);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--color-success)' : 'var(--color-info)',
        color: 'white',
        padding: 'var(--space-16)',
        borderRadius: 'var(--radius-base)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '10000',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform var(--duration-normal) var(--ease-standard)',
        fontSize: 'var(--font-size-base)',
        lineHeight: '1.5'
    });
    
    // Style notification content
    const content = notification.querySelector('.notification__content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-12)'
    });
    
    // Style close button
    const closeBtn = notification.querySelector('.notification__close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => closeNotification(notification));
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Fade-in animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.about__card, .focus__card, .resource__card, .involvement__card, .testimonial__card');
    
    // Add fade-in class to elements
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Trigger initial animation check
    triggerFadeInAnimations();
}

function triggerFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
    
    fadeElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const inView = rect.top < window.innerHeight - 100 && rect.bottom > 100;
        
        if (inView) {
            element.classList.add('visible');
        }
    });
}

// Button interactions
document.addEventListener('click', function(e) {
    // Handle all button clicks with witty responses
    if (e.target.matches('.btn--secondary') || e.target.matches('.btn--outline')) {
        const buttonText = e.target.textContent.trim();
        let message = '';
        
        switch (buttonText) {
            case 'Explore Careers':
                message = 'Career hub coming soon! Meanwhile, have you considered professional coffee taster? ☕';
                break;
            case 'Access Library':
                message = 'Knowledge bank loading... Fun fact: We have more resources than excuses! 📚';
                break;
            case 'Get Support':
                message = 'Support network activated! Remember, asking for help is a superpower! 🦸‍♀️';
                break;
            case 'View Events':
                message = 'Event calendar coming up! Spoiler alert: They\'re all awesome! 🎉';
                break;
            case 'Count Me In!':
                message = 'Awesome! Welcome to the coolest group that actually does cool things! 🎊';
                break;
            case 'I Want to Help':
                message = 'You\'re already helping by being awesome! Let\'s chat about making it official! 💪';
                break;
            case 'Tell Me More':
                message = 'Every donation helps us help others. It\'s like karma, but with receipts! 💝';
                break;
            case 'I\'m Convinced!':
                message = 'That was easy! Spread the word like it\'s good news (because it is)! 📢';
                break;
            default:
                return;
        }
        
        if (message) {
            e.preventDefault();
            showNotification(message, 'info');
        }
    }
});

// Easter eggs and fun interactions
let clickCount = 0;
document.querySelector('.nav__logo').addEventListener('click', function() {
    clickCount++;
    if (clickCount === 5) {
        showNotification('🎉 You found the secret! You\'re officially part of the inner circle now!', 'success');
        clickCount = 0;
    }
});

// Konami code easter egg
let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showNotification('🎮 Konami code activated! You\'re now a Yaam Wai legend!', 'success');
            konamiIndex = 0;
            
            // Add some fun visual effect
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    } else {
        konamiIndex = 0;
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .field-error {
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
let ticking = false;

function throttledScrollHandler() {
    if (!ticking) {
        requestAnimationFrame(function() {
            // Your scroll handling code here
            ticking = false;
        });
        ticking = true;
    }
}

// Add some loading states for better UX
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Fade in the hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        hero.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content functionality
    if (e.key === 'Tab' && !document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.className = 'skip-link sr-only';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.position = 'absolute';
        skipLink.style.top = '0';
        skipLink.style.left = '0';
        skipLink.style.zIndex = '9999';
        
        skipLink.addEventListener('focus', function() {
            this.style.position = 'static';
            this.classList.remove('sr-only');
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.position = 'absolute';
            this.classList.add('sr-only');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
});

// Console easter egg for developers
console.log(`
🎉 Welcome to Yaam Wai's website!
    
    ██╗   ██╗ █████╗  █████╗ ███╗   ███╗    ██╗    ██╗ █████╗ ██╗
    ╚██╗ ██╔╝██╔══██╗██╔══██╗████╗ ████║    ██║    ██║██╔══██╗██║
     ╚████╔╝ ███████║███████║██╔████╔██║    ██║ █╗ ██║███████║██║
      ╚██╔╝  ██╔══██║██╔══██║██║╚██╔╝██║    ██║███╗██║██╔══██║██║
       ██║   ██║  ██║██║  ██║██║ ╚═╝ ██║    ╚███╔███╔╝██║  ██║██║
       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝

Made with ❤️ and probably too much coffee
Want to join our dev team? Contact us at contact@yaamwai.in
`);

console.log('🔍 Developer tip: Try clicking the logo 5 times or use the Konami code!');