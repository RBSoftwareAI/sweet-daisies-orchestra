/* ==============================================
   THE SWEET DAISIES ORCHESTRA - JAVASCRIPT
   Fonctionnalités interactives pour le site
   ============================================== */

// État de l'application
const AppState = {
    isMenuOpen: false,
    isScrolled: false,
    currentSection: 'home'
};

// ==============================================
// INITIALISATION
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🌼 Sweet Daisies Orchestra - Site chargé !');
    
    // Initialisation des fonctionnalités
    initNavigation();
    initScrollEffects();
    initParallax();
    initAnimations();
    initFloatingPhotos();  // ✨ Nouvelle fonctionnalité : photos flottantes
    initGallery();
    initScrollIndicator();
    
    // Gestionnaires d'événements globaux
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Animation d'entrée
    animatePageEntrance();
}

// ==============================================
// NAVIGATION
// ==============================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle menu mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            toggleMobileMenu();
        });
    }

    // Fermer le menu lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (AppState.isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Navigation fluide
    initSmoothScroll();
    
    // Mise en surbrillance des sections actives
    initActiveSection();
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    AppState.isMenuOpen = !AppState.isMenuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prévenir le scroll du body quand le menu est ouvert
    document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : 'auto';
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    function updateActiveSection() {
        const scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                if (AppState.currentSection !== sectionId) {
                    AppState.currentSection = sectionId;
                    
                    // Mettre à jour les liens de navigation
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Appel initial
}

// ==============================================
// EFFETS DE SCROLL
// ==============================================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    function updateNavbar() {
        const scrolled = window.pageYOffset > 50;
        
        if (scrolled !== AppState.isScrolled) {
            AppState.isScrolled = scrolled;
            
            if (scrolled) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
}

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: aboutSection.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
        
        // Masquer l'indicateur lors du scroll
        function toggleScrollIndicator() {
            const scrollY = window.pageYOffset;
            scrollIndicator.style.opacity = scrollY > 100 ? '0' : '1';
        }
        
        window.addEventListener('scroll', toggleScrollIndicator);
    }
}

// ==============================================
// EFFETS PARALLAX
// ==============================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = 0.5;
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
    
    // Utiliser requestAnimationFrame pour de meilleures performances
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// ==============================================
// ANIMATIONS
// ==============================================
function initAnimations() {
    // Observer pour les animations d'apparition
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Éléments à animer
    const animatedElements = document.querySelectorAll(`
        .about-content,
        .musician-card,
        .repertoire-section,
        .gallery-item,
        .contact-item,
        .future-section
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Animations spéciales pour les cartes musiciens
    initMusiciansAnimations();
    
    // Animations pour les éléments du répertoire
    initRepertoireAnimations();
}

function initMusiciansAnimations() {
    const musicianCards = document.querySelectorAll('.musician-card');
    
    musicianCards.forEach((card, index) => {
        // Animation d'apparition décalée
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Effet hover amélioré
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateY(0)';
        });
    });
}

function initRepertoireAnimations() {
    const songItems = document.querySelectorAll('.song-item');
    
    songItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Effet musical au hover
        item.addEventListener('mouseenter', () => {
            item.style.background = 'linear-gradient(90deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'rgba(255, 215, 0, 0.1)';
        });
    });
}

function animatePageEntrance() {
    // Animation du hero
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animation du titre avec effet typewriter
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        setTimeout(() => {
            typeWriter(heroTitle, text, 100);
        }, 800);
    }
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.style.borderRight = '3px solid var(--yellow-primary)';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Retirer le curseur clignotant
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    type();
}

// ==============================================
// GALERIE
// ==============================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(item);
        });
        
        // Effet 3D au hover
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

function openLightbox(item) {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    if (!img) return;
    
    // Créer le lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${img.src}" alt="${img.alt}">
            <div class="lightbox-info">
                <h3>${overlay?.querySelector('h3')?.textContent || ''}</h3>
                <p>${overlay?.querySelector('p')?.textContent || ''}</p>
            </div>
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animation d'ouverture
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    // Fermeture
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// ==============================================
// UTILITAIRES ET GESTIONNAIRES D'ÉVÉNEMENTS
// ==============================================
function handleScroll() {
    // Throttle pour optimiser les performances
    if (window.scrollThrottle) return;
    
    window.scrollThrottle = setTimeout(() => {
        window.scrollThrottle = null;
        
        // Animations au scroll
        triggerScrollAnimations();
        
        // Effet parallax léger sur les éléments
        animateScrollElements();
    }, 16); // ~60fps
}

function handleResize() {
    // Throttle pour optimiser les performances
    if (window.resizeThrottle) return;
    
    window.resizeThrottle = setTimeout(() => {
        window.resizeThrottle = null;
        
        // Réajuster les éléments si nécessaire
        if (window.innerWidth > 768 && AppState.isMenuOpen) {
            toggleMobileMenu();
        }
        
        // Recalculer les positions parallax
        initParallax();
    }, 100);
}

function triggerScrollAnimations() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Animer les éléments visibles
    document.querySelectorAll('.animate-element:not(.animate-in)').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate-in');
        }
    });
}

function animateScrollElements() {
    const scrollY = window.pageYOffset;
    
    // Effet de floating sur certains éléments
    const floatingElements = document.querySelectorAll('.musician-card, .gallery-item');
    
    floatingElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            const speed = 0.02;
            const yPos = Math.sin(scrollY * speed + index) * 2;
            element.style.transform += ` translateY(${yPos}px)`;
        }
    });
}

// ==============================================
// EASTER EGGS ET FONCTIONNALITÉS SPÉCIALES
// ==============================================

// Konami Code pour un effet spécial
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        triggerPsychedelicMode();
    }
});

function triggerPsychedelicMode() {
    document.body.classList.add('psychedelic-mode');
    
    // Ajouter des animations colorées
    const style = document.createElement('style');
    style.textContent = `
        .psychedelic-mode {
            animation: psychedelic-bg 3s infinite linear;
        }
        
        @keyframes psychedelic-bg {
            0% { filter: hue-rotate(0deg) saturate(1); }
            25% { filter: hue-rotate(90deg) saturate(1.5); }
            50% { filter: hue-rotate(180deg) saturate(2); }
            75% { filter: hue-rotate(270deg) saturate(1.5); }
            100% { filter: hue-rotate(360deg) saturate(1); }
        }
    `;
    
    document.head.appendChild(style);
    
    // Message amusant
    console.log('🌈 Mode psychédélique activé ! The Sweet Daisies Orchestra vous emmène dans les années 60-70 ! 🌼');
    
    // Désactiver après 10 secondes
    setTimeout(() => {
        document.body.classList.remove('psychedelic-mode');
        document.head.removeChild(style);
    }, 10000);
}

// ==============================================
// PHOTOS FLOTTANTES - ANIMATIONS HERO
// ==============================================
function initFloatingPhotos() {
    console.log('🌸 Initialisation des photos flottantes');
    
    const floatingContainer = document.getElementById('floatingPhotos');
    if (!floatingContainer) return;
    
    // Configuration des photos à animer
    const photoConfigs = [
        { src: 'images/sdo-1-150.jpg', alt: 'Sweet Daisies - Instruments' },
        { src: 'images/sdo-2-150.jpg', alt: 'Sweet Daisies - Collectif' },
        { src: 'images/sdo-7-150.jpg', alt: 'Sweet Daisies - Concentration' },
        { src: 'images/sdo-4-150.jpg', alt: 'Sweet Daisies - Complicité' }
    ];
    
    // État des animations
    let animationState = {
        isActive: true,
        photoElements: [],
        animationIntervals: []
    };
    
    // Créer les éléments de photos flottantes
    function createFloatingPhotos() {
        photoConfigs.forEach((config, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'floating-photo';
            photoElement.innerHTML = `<img src="${config.src}" alt="${config.alt}" loading="lazy">`;
            
            floatingContainer.appendChild(photoElement);
            animationState.photoElements.push(photoElement);
        });
    }
    
    // Lancer une nouvelle photo avec timing aléatoire
    function launchFloatingPhoto() {
        if (!animationState.isActive) return;
        
        // Sélectionner une photo aléatoire
        const randomPhoto = animationState.photoElements[Math.floor(Math.random() * animationState.photoElements.length)];
        
        // Reset de la position et de l'animation
        randomPhoto.style.animation = 'none';
        randomPhoto.offsetHeight; // Force reflow
        
        // Choisir une animation aléatoire
        const animations = ['float-petals-1', 'float-petals-2', 'float-petals-3', 'float-petals-4'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        const randomDuration = 12 + Math.random() * 8; // Entre 12 et 20 secondes (plus rapide, plus visible)
        
        // Appliquer l'animation
        randomPhoto.style.animation = `${randomAnimation} ${randomDuration}s linear`;
        
        // Programmer la prochaine photo (plus fréquent pour plus de visibilité)
        const nextLaunchDelay = 2000 + Math.random() * 4000; // Entre 2 et 6 secondes
        setTimeout(launchFloatingPhoto, nextLaunchDelay);
    }
    
    // Gérer la visibilité selon la section
    function handleSectionVisibility() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animationState.isActive = true;
                    floatingContainer.style.display = 'block';
                } else {
                    animationState.isActive = false;
                    floatingContainer.style.display = 'none';
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(heroSection);
    }
    
    // Gérer les préférences d'accessibilité
    function handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('🔇 Mode mouvement réduit détecté - animations simplifiées');
            floatingContainer.style.display = 'none';
            return false;
        }
        return true;
    }
    
    // Pause/reprise des animations au hover
    function setupHoverControls() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return;
        
        heroSection.addEventListener('mouseenter', () => {
            animationState.photoElements.forEach(photo => {
                photo.style.animationPlayState = 'paused';
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            animationState.photoElements.forEach(photo => {
                photo.style.animationPlayState = 'running';
            });
        });
    }
    
    // Performance : limiter les animations sur mobile
    function isMobileDevice() {
        return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Initialisation principale
    function initialize() {
        // Vérifier les préférences d'accessibilité
        if (!handleReducedMotion()) return;
        
        // Créer les éléments
        createFloatingPhotos();
        
        // Configurer les contrôles
        setupHoverControls();
        handleSectionVisibility();
        
        // Réduire la fréquence sur mobile
        const initialDelay = isMobileDevice() ? 5000 : 2000;
        
        // Lancer les animations après un délai initial
        setTimeout(() => {
            launchFloatingPhoto();
        }, initialDelay);
        
        console.log('✨ Photos flottantes initialisées avec succès');
    }
    
    // Démarrer l'initialisation
    initialize();
    
    // Interface publique pour contrôler les animations
    window.FloatingPhotos = {
        toggle: () => {
            animationState.isActive = !animationState.isActive;
            floatingContainer.style.display = animationState.isActive ? 'block' : 'none';
        },
        pause: () => {
            animationState.isActive = false;
            animationState.photoElements.forEach(photo => {
                photo.style.animationPlayState = 'paused';
            });
        },
        resume: () => {
            animationState.isActive = true;
            animationState.photoElements.forEach(photo => {
                photo.style.animationPlayState = 'running';
            });
        }
    };
}

// ==============================================
// CSS ANIMATIONS (ajoutées dynamiquement)
// ==============================================
function addCustomCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animations CSS pour les éléments */
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Lightbox styles */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: lightbox-enter 0.3s ease-out;
        }
        
        .lightbox-content img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-info {
            background: var(--yellow-primary);
            color: #333;
            padding: 1rem 2rem;
            border-radius: 0 0 10px 10px;
            text-align: center;
            margin-top: -5px;
            width: 100%;
        }
        
        .lightbox-close {
            position: absolute;
            top: -20px;
            right: -20px;
            background: var(--pink-hot);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .lightbox-close:hover {
            transform: scale(1.1);
            background: var(--orange-retro);
        }
        
        @keyframes lightbox-enter {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(50px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        /* Transitions supplémentaires */
        .musician-card {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .song-item {
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .gallery-item {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    `;
    
    document.head.appendChild(style);
}

// Ajouter les styles CSS personnalisés
addCustomCSS();

// ==============================================
// DEBUGGING ET DÉVELOPPEMENT
// ==============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎯 Mode développement détecté');
    console.log('🌼 Sweet Daisies Orchestra - Version de développement');
    console.log('💡 Tapez SDO.debug() dans la console pour des informations de débogage');
    
    // Objet de débogage global
    window.SDO = {
        state: AppState,
        debug: () => {
            console.log('=== DEBUG INFO ===');
            console.log('État du menu:', AppState.isMenuOpen);
            console.log('Page scrollée:', AppState.isScrolled);
            console.log('Section actuelle:', AppState.currentSection);
            console.log('Éléments animés:', document.querySelectorAll('.animate-in').length);
        },
        triggerPsychedelic: triggerPsychedelicMode,
        resetAnimations: () => {
            document.querySelectorAll('.animate-in').forEach(el => {
                el.classList.remove('animate-in');
            });
        }
    };
}

// Message de bienvenue
console.log(`
🌼 THE SWEET DAISIES ORCHESTRA 🌼
================================
Site web chargé avec succès !
10 musiciens • 10 univers • Une mission
================================
`);