/* LABEL NUVI - Interactive JavaScript Engine & Redesign Script */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Wait for custom fonts to load so layout renders correctly
    if (document.fonts) {
        document.fonts.ready.then(() => {
            initApp();
        });
    } else {
        setTimeout(initApp, 600);
    }
});

function initApp() {
    // ----------------------------------------------------
    // 1. CUSTOM CURSOR TRACKING & LERP
    // ----------------------------------------------------
    const customCursor = document.getElementById('custom-cursor');
    const cursorText = customCursor ? customCursor.querySelector('.cursor-text') : null;
    
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        if (!isMoving && customCursor) {
            gsap.to(customCursor, { opacity: 1, duration: 0.3 });
            isMoving = true;
        }
    });

    function updateCursor() {
        cursorX += (targetX - cursorX) * 0.16;
        cursorY += (targetY - cursorY) * 0.16;
        
        if (customCursor) {
            customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // ----------------------------------------------------
    // 2. 3D INTERACTIVE SMARTPHONE TILT & FLOATING
    // ----------------------------------------------------
    const phoneContainer = document.getElementById('phone-3d');
    const phoneBody = document.querySelector('.phone-body');

    if (phoneContainer) {
        // Desktop mouse tracking for 3D tilt
        window.addEventListener('mousemove', (e) => {
            // Calculate distance from screen center (-1 to 1)
            const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            
            // Limit tilt values: X-tilt (-12deg to 12deg), Y-tilt (-12deg to 12deg)
            const rotateX = -y * 12;
            const rotateY = x * 12;
            
            gsap.to(phoneContainer, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.7,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        // Clear tilt when mouse leaves window
        document.addEventListener('mouseleave', () => {
            gsap.to(phoneContainer, {
                rotateX: 0,
                rotateY: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Subtle idle floating animation on the inner phone body
        if (phoneBody) {
            gsap.to(phoneBody, {
                y: '+=10',
                rotation: '+=0.8',
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    // ----------------------------------------------------
    // 3. LOOKBOOK SLIDESHOW TOGGLE
    // ----------------------------------------------------
    const screenClick = document.getElementById('phone-screen-click');
    const slides = document.querySelectorAll('.slide');
    const lookTag = document.getElementById('screen-look-tag');
    const lookName = document.getElementById('screen-look-name');
    let currentSlide = 0;

    if (screenClick && slides.length > 0) {
        screenClick.addEventListener('click', () => {
            // Fade out current slide
            slides[currentSlide].classList.remove('active');
            
            // Increment
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Fade in new active slide
            slides[currentSlide].classList.add('active');
            
            // Update labels
            const lookTagText = slides[currentSlide].getAttribute('data-look');
            const lookNameText = slides[currentSlide].getAttribute('data-name');
            
            if (lookTag && lookName) {
                lookTag.textContent = lookTagText;
                lookName.textContent = lookNameText;
                
                // Quick text pop animation
                gsap.fromTo([lookTag, lookName], 
                    { opacity: 0, y: 5 }, 
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
                );
            }
        });

        // Custom Cursor interaction when hovering over phone screen
        screenClick.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('hovering-phone');
                if (cursorText) cursorText.textContent = 'TAP LOOKS';
            }
        });

        screenClick.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.classList.remove('hovering-phone');
                if (cursorText) cursorText.textContent = 'EXPLORE';
            }
        });
    }

    // Interactive custom cursor sizes for links/buttons
    const interactives = document.querySelectorAll('a, button, input, .screen-date-pill');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('hovering-link');
            }
        });
        el.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.classList.remove('hovering-link');
            }
        });
    });

    // ----------------------------------------------------
    // 4. GSAP ENTRANCE TIMELINE
    // ----------------------------------------------------
    if (window.gsap) {
        const tl = gsap.timeline();
        
        // Initial setup states
        gsap.set(['.grid-overlay', '.header', '.phone-perspective-wrapper', '.control-center', '.footer', '.marquee', '.kinetic-bg'], { opacity: 0 });
        gsap.set('.phone-container-3d', { scale: 0.85, rotateX: 25 });
        
        tl.to('.grid-overlay', { opacity: 1, duration: 1.5, ease: 'power2.out' })
          .to('.header', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8')
          .to('.kinetic-bg', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.5')
          .to('.phone-perspective-wrapper', { opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=1')
          .to('.phone-container-3d', { scale: 1, rotateX: 0, duration: 1.5, ease: 'back.out(1.2)' }, '-=1.2')
          .to('.control-center', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
          .to('.footer', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
          .to('.marquee', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.8');
    }

    // ----------------------------------------------------
    // 5. COUNTDOWN TIMER
    // ----------------------------------------------------
    const targetDate = new Date('2026-09-09T00:00:00Z').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // ----------------------------------------------------
    // 6. SIDEBAR MENU CONTROLS
    // ----------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.getElementById('sidebar-menu');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // ----------------------------------------------------
    // 7. SUBSCRIPTION FORM SUBMISSION
    // ----------------------------------------------------
    const subscribeForm = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('email-input');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.querySelector('.submit-btn');
    const subscriptionCard = document.querySelector('.subscription-card');

    function setFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback ' + type;
        
        if (type !== 'success') {
            setTimeout(() => {
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback';
            }, 4000);
        }
    }

    // Check existing subscription
    if (localStorage.getItem('nuvi_subscribed') === 'true') {
        renderSubscribedState();
    }

    function renderSubscribedState() {
        if (subscriptionCard) {
            subscriptionCard.innerHTML = `
                <div style="text-align: center; padding: 10px 0;">
                    <i data-lucide="check-circle" style="color: #5eff5e; width: 32px; height: 32px; margin-bottom: 12px; display: inline-block;"></i>
                    <h3 class="card-title" style="color: #5eff5e; margin-bottom: 5px; letter-spacing: 0.2em;">ACCESS RESERVED</h3>
                    <p class="card-subtitle" style="margin-bottom: 0;">YOU ARE CURRENTLY IN THE ATELIER QUEUE. COLLECTION I KEYS WILL BE SENT TO YOUR EMAIL.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }
    }

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailValue = emailInput.value.trim();
            if (!emailValue) {
                setFeedback('PLEASE ENTER A VALID EMAIL', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                setFeedback('INVALID EMAIL FORMAT', 'error');
                return;
            }

            submitBtn.disabled = true;
            emailInput.disabled = true;
            submitBtn.innerHTML = `<span class="btn-text">RESERVING</span>`;

            setTimeout(() => {
                localStorage.setItem('nuvi_subscribed', 'true');
                setFeedback('ACCESS GRANTED. VERIFICATION SENT.', 'success');
                
                if (window.gsap) {
                    gsap.to(subscriptionCard, {
                        opacity: 0,
                        y: -10,
                        duration: 0.4,
                        onComplete: () => {
                            renderSubscribedState();
                            gsap.to(subscriptionCard, { opacity: 1, y: 0, duration: 0.4 });
                        }
                    });
                } else {
                    renderSubscribedState();
                }
            }, 1200);
        });
    }
}
