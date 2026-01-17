// Yaam Wai - Super Mario Friendship Adventure JavaScript

// Mario Jump Sound Effect (using Web Audio API)
function playMarioJump() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Mario Coin Collection Sound
function playCoinSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initMarioAnimations();
    initFormHandling();
    initInteractions();
});

// Mario Jump Animation
function initMarioAnimations() {
    // Add bounce animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (e.target.textContent.includes('GOOOO')) {
                playMarioJump();
            }
            
            // Create jump effect
            const jump = document.createElement('div');
            jump.style.cssText = `
                position: absolute;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                pointer-events: none;
                font-size: 20px;
                font-weight: 900;
                animation: marioJump 0.6s ease-out;
            `;
            jump.textContent = '⭐';
            document.body.appendChild(jump);
            
            setTimeout(() => jump.remove(), 600);
        });
    });
}

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
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) {
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
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
                playMarioJump();
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
    });
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
            submitBtn.textContent = '⏳ LOADING... ⏳';
            
            // Play coin sound
            playCoinSound();
            
            // Simulate form submission
            setTimeout(() => {
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.textContent = '🎮 FIRE AWAY 🎮';
                
                // Show success message
                showNotification('🎉 LEVEL COMPLETE! We got your message! 🎉', 'success');
                
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
        errorMessage = '⚠️ This power-up is needed!';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = '⚠️ Invalid castle address!';
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
    errorElement.style.color = '#FF0000';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '4px';
    errorElement.style.fontWeight = 'bold';
    
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
    const bgColor = type === 'success' ? '#00A651' : '#0051BA';
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: bgColor,
        color: 'white',
        padding: '20px',
        borderRadius: '4px',
        border: '3px solid #000',
        boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), 6px 6px 0 rgba(0,0,0,0.5)',
        zIndex: '10000',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 300ms ease',
        fontSize: '14px',
        lineHeight: '1.5',
        fontWeight: '700'
    });
    
    // Style notification content
    const content = notification.querySelector('.notification__content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
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
        lineHeight: '1',
        fontWeight: 'bold'
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

// Interactive button effects
function initInteractions() {
    // Coin collection animation on button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            playCoinSound();
            
            // Create floating coin effect
            for (let i = 0; i < 3; i++) {
                const coin = document.createElement('div');
                coin.style.cssText = `
                    position: fixed;
                    left: ${e.clientX + (Math.random() * 40 - 20)}px;
                    top: ${e.clientY}px;
                    pointer-events: none;
                    font-size: 24px;
                    animation: coinFall 1s ease-out;
                    z-index: 9999;
                `;
                coin.textContent = '💰';
                document.body.appendChild(coin);
                
                setTimeout(() => coin.remove(), 1000);
            }
        }
    });
    
    // Add fun easter eggs
    let clickCount = 0;
    const logo = document.querySelector('.nav__logo');
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                showNotification('🎮 SECRET LEVEL UNLOCKED! You\'re a Mario Legend! 🎮', 'success');
                document.body.style.filter = 'hue-rotate(90deg)';
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 2000);
                clickCount = 0;
            }
        });
    }
}

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes marioJump {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        50% {
            opacity: 1;
            transform: translateY(-50px) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
        }
    }
    
    @keyframes coinFall {
        0% {
            opacity: 1;
            transform: translateY(0) rotateZ(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(60px) rotateZ(360deg) scale(0.5);
        }
    }
    
    @keyframes powerUpPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .btn {
        animation: powerUpPulse 2s ease-in-out infinite;
    }
    
    .btn:hover {
        animation: none;
    }
`;
document.head.appendChild(style);

// Console easter egg
console.log(`
🍄 WELCOME TO THE YAAM WAI FRIENDSHIP KINGDOM! 🍄

   ╔═══════════════════════════════════════╗
   ║  LEVEL 1: MAKE A FRIEND               ║
   ║  LEVEL 2: HELP ANOTHER FRIEND         ║
   ║  LEVEL 3: BUILD YOUR SQUAD            ║
   ║  BOSS LEVEL: SAVE THE WORLD           ║
   ║                                       ║
   ║  STATUS: LEGENDARY ADVENTURE          ║
   ║  DIFFICULTY: MAXIMUM FUN              ║
   ╚═══════════════════════════════════════╝

"It's dangerous to go alone..." - But you don't have to!
Join Yaam Wai and find your forever squad.

Made with ❤️ and 🍄 by legends who believe in friendship!
`);
