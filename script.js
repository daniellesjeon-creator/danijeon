// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Navbar background on scroll - keep it transparent
const navbar = document.querySelector('.navbar');
if (navbar) {
    // Remove the scroll behavior that changes background
    // Or keep it very subtle
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        // Keep it transparent, maybe just adjust shadow slightly
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.1)';
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .stat, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        
        // Create mailto link with form data
        const subject = encodeURIComponent(`Message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:daniellesjeon@berkeley.edu?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showFormMessage('Thank you for your message! Your email client should open shortly.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            contactForm.reset();
            hideFormMessage();
        }, 5000);
        
        // Note: For a better user experience without opening email client,
        // consider using a service like Formspree (https://formspree.io)
        // or EmailJS (https://www.emailjs.com/) for static sites
    });
}

function showFormMessage(text, type) {
    if (formMessage) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
    }
}

function hideFormMessage() {
    if (formMessage) {
        formMessage.className = 'form-message';
    }
}

// Add active class styling for nav links
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Logo Loop Animation
function initLogoLoop() {
    const logoLoopContainer = document.getElementById('logoLoop');
    if (!logoLoopContainer) return;

    // Social media logos with SVG icons
    const logos = [
        {
            href: 'mailto:daniellesjeon@berkeley.edu',
            title: 'Email',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>`
        },
        {
            href: 'https://linkedin.com/in/daniellejeon06',
            title: 'LinkedIn',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>`
        },
        {
            href: 'https://github.com/daniellesjeon',
            title: 'GitHub',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>`
        },
        {
            href: 'https://www.instagram.com/daniejeon/',
            title: 'Instagram',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>`
        }
    ];

    const speed = 80; // pixels per second
    const gap = 32;
    const logoHeight = 48;
    const minCopies = 2;
    const copyHeadroom = 2;

    // Create track element
    const track = document.createElement('div');
    track.className = 'logoloop__track';
    logoLoopContainer.appendChild(track);

    // Create logo items
    function createLogoItem(logo, index) {
        const item = document.createElement('li');
        item.className = 'logoloop__item';
        item.setAttribute('role', 'listitem');
        
        const link = document.createElement('a');
        link.href = logo.href;
        link.className = 'logoloop__link';
        link.setAttribute('aria-label', logo.title);
        link.setAttribute('target', logo.href.startsWith('http') ? '_blank' : '_self');
        link.setAttribute('rel', logo.href.startsWith('http') ? 'noreferrer noopener' : '');
        link.innerHTML = logo.svg;
        
        item.appendChild(link);
        return item;
    }

    // Create list with logos
    function createList(copyIndex) {
        const list = document.createElement('ul');
        list.className = 'logoloop__list';
        list.setAttribute('role', 'list');
        if (copyIndex > 0) {
            list.setAttribute('aria-hidden', 'true');
        }
        
        logos.forEach((logo, index) => {
            list.appendChild(createLogoItem(logo, index));
        });
        
        return list;
    }

    // Calculate how many copies we need
    function calculateCopies() {
        const containerWidth = logoLoopContainer.clientWidth;
        const firstList = track.querySelector('.logoloop__list');
        if (!firstList) return minCopies;
        
        const listWidth = firstList.getBoundingClientRect().width;
        if (listWidth === 0) return minCopies;
        
        const copiesNeeded = Math.ceil(containerWidth / listWidth) + copyHeadroom;
        return Math.max(minCopies, copiesNeeded);
    }

    // Initialize lists
    function initLists() {
        track.innerHTML = '';
        const copyCount = calculateCopies();
        
        for (let i = 0; i < copyCount; i++) {
            track.appendChild(createList(i));
        }
    }

    // Animation
    let offset = 0;
    let velocity = speed;
    let rafId = null;
    let lastTimestamp = null;
    let isHovered = false;

    function animate(timestamp) {
        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        const targetVelocity = isHovered ? 0 : speed;
        const easingFactor = 1 - Math.exp(-deltaTime / 0.25);
        velocity += (targetVelocity - velocity) * easingFactor;

        const firstList = track.querySelector('.logoloop__list');
        if (firstList) {
            const listWidth = firstList.getBoundingClientRect().width;
            if (listWidth > 0) {
                offset = (offset + velocity * deltaTime) % listWidth;
                track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            }
        }

        rafId = requestAnimationFrame(animate);
    }

    // Hover handlers
    track.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    track.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Initialize
    initLists();
    
    // Wait for images to load, then start animation
    const images = track.querySelectorAll('img');
    if (images.length === 0) {
        rafId = requestAnimationFrame(animate);
    } else {
        let loadedImages = 0;
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        initLists();
                        rafId = requestAnimationFrame(animate);
                    }
                }, { once: true });
            }
        });
        if (loadedImages === images.length) {
            rafId = requestAnimationFrame(animate);
        }
    }

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initLists();
        }, 250);
    });
}

// Initialize logo loop when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLogoLoop();
});

