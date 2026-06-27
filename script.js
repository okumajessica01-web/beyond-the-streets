// --- Preloader & Icons ---
window.addEventListener("load", () => {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) {
        console.error("Lucide failed:", e);
    }

    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 700);
        }, 1200);
    }
});

// === Navbar Scroll Effect ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// === Mobile Menu ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
        mobileMenu.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
    } else {
        closeMobileMenu();
    }
});

function closeMobileMenu() {
    menuOpen = false;
    mobileMenu.style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
}

// === Scroll Reveal ===
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

scrollRevealElements.forEach(el => revealObserver.observe(el));

// === Counter Animation ===
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// === Progress Bars ===
const progressBars = document.querySelectorAll('.progress-bar');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.dataset.width;
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 300);
            progressObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(b => progressObserver.observe(b));

// === Hero Particles ===
function createParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const left = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        
        particle.style.left = left + '%';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        // Alternate colors
        if (i % 3 === 0) {
            particle.style.background = 'rgba(37, 99, 235, 0.4)';
        } else if (i % 3 === 1) {
            particle.style.background = 'rgba(249, 115, 22, 0.4)';
        } else {
            particle.style.background = 'rgba(255, 255, 255, 0.2)';
        }
        
        container.appendChild(particle);
    }
}

createParticles();

// === Donation System ===
let selectedAmount = 100;

const donationAmounts = document.querySelectorAll('.donation-amount');
const customAmountInput = document.getElementById('customAmount');
const cardAmountDisplay = document.getElementById('cardAmount');

donationAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
        donationAmounts.forEach(b => b.classList.remove('active-amount'));
        btn.classList.add('active-amount');
        selectedAmount = parseInt(btn.dataset.amount);
        customAmountInput.value = '';
        updateAmountDisplay();
    });
});

customAmountInput.addEventListener('input', () => {
    if (customAmountInput.value) {
        donationAmounts.forEach(b => b.classList.remove('active-amount'));
        selectedAmount = parseInt(customAmountInput.value) || 0;
    } else {
        // Re-select default
        selectedAmount = 100;
        donationAmounts.forEach(b => {
            if (b.dataset.amount === '100') b.classList.add('active-amount');
        });
    }
    updateAmountDisplay();
});

function updateAmountDisplay() {
    if (cardAmountDisplay) {
        cardAmountDisplay.textContent = '$' + selectedAmount.toLocaleString();
    }
}

// === Payment Tabs ===
const paymentTabs = document.querySelectorAll('.payment-tab');
const paymentContents = document.querySelectorAll('.payment-content');

paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        paymentTabs.forEach(t => t.classList.remove('active-tab'));
        tab.classList.add('active-tab');
        
        paymentContents.forEach(c => c.classList.add('hidden'));
        document.getElementById('tab-' + targetTab).classList.remove('hidden');
    });
});

// === Card Donation Handler ===
function handleCardDonation(e) {
    e.preventDefault();
    const form = e.target;
    const isValid = form.checkValidity();
    
    if (isValid) {
        showToast('Thank you! Your $' + selectedAmount.toLocaleString() + ' donation is being processed.');
        form.reset();
    }
}

// === Copy Crypto Address ===
function copyAddress(address) {
    navigator.clipboard.writeText(address).then(() => {
        showToast('Wallet address copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = address;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Wallet address copied to clipboard!');
    });
}

// === Volunteer Form Handler ===
function handleVolunteerSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('volunteerForm');
    const successMsg = document.getElementById('volunteerSuccess');
    
    form.style.display = 'none';
    successMsg.classList.remove('hidden');
    showToast('Volunteer application submitted successfully!');
    
    // Re-initialize icons in success message
    lucide.createIcons();
}

// === Contact Form Handler ===
function handleContactSubmit(e) {
    e.preventDefault();
    e.target.reset();
    showToast('Message sent! We\'ll get back to you soon.');
}

// === Gallery Lightbox ===
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.dataset.caption;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// === Back to Top Button ===
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Toast Notification ===
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// === Video Overlay Click Handlers ===
document.querySelectorAll('.aspect-video [onclick], .aspect-\\[9\\/16\\] [onclick]').forEach(overlay => {
    overlay.style.cursor = 'pointer';
});

// === Smooth Scroll for Anchor Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// === Card Number Formatting ===
const cardInput = document.querySelector('#cardForm input[placeholder="0000 0000 0000 0000"]');
if (cardInput) {
    cardInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });
}

// === Expiry Date Formatting ===
const expiryInput = document.querySelector('#cardForm input[placeholder="MM/YY"]');
if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });
}

// === Active Navigation Highlighting ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = '#f97316';
        }
    });
});

// === Performance: Lazy load images that aren't in viewport ===
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    // Native lazy loading is handled by the browser
    // This is a fallback for older browsers
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger load
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

console.log('%c🌍 Beyond The Streets - Humanity Has No Borders', 'color: #f97316; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with compassion and code.', 'color: #2563eb; font-size: 12px;');
