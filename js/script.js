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
    initHeroInteractions();  // ✨ Nouvelles interactions Hero
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
    const parallaxSection = document.querySelector('.parallax-section');
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        // Effet parallaxe spécial pour la section instruments
        if (parallaxSection && parallaxElements.length > 0) {
            const sectionTop = parallaxSection.offsetTop;
            const sectionHeight = parallaxSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Vérifier si la section est dans le viewport
            if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                const parallaxBg = parallaxElements[0];
                
                // Calculer le pourcentage de progression dans la section
                const progress = (scrollY + windowHeight - sectionTop) / (windowHeight + sectionHeight);
                
                // Effet parallaxe vertical pour révéler les instruments
                const yPos = -100 + (progress * 150); // De -100px à +50px
                parallaxBg.style.transform = `translateY(${yPos}px)`;
                
                // Ajuster dynamiquement la position de background pour voir plus d'instruments
                const bgPosY = 85 - (progress * 20); // De 85% à 65%
                parallaxBg.style.backgroundPosition = `center ${bgPosY}%`;
            }
        }
        
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
// HERO CARROUSEL DYNAMIQUE
// ==============================================
function initHeroInteractions() {
    console.log('🎠 Initialisation du Hero Carrousel Dynamique');
    
    const heroSection = document.getElementById('home');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!heroSection) return;
    
    // Configuration du carrousel
    const carouselState = {
        currentSlide: 0,
        totalSlides: 3,
        autoPlayInterval: null,
        isPlaying: true,
        slideDuration: 5000 // 5 secondes par slide
    };
    
    const slides = heroSection.querySelectorAll('.hero-carousel-slide');
    const slideContents = heroSection.querySelectorAll('.hero-slide-content');
    const indicators = heroSection.querySelectorAll('.indicator');
    
    // Fonction pour changer de slide
    function changeSlide(targetSlide, manual = false) {
        if (targetSlide === carouselState.currentSlide) return;
        
        // Désactiver la slide actuelle
        slides[carouselState.currentSlide]?.classList.remove('active');
        slideContents[carouselState.currentSlide]?.classList.remove('active');
        indicators[carouselState.currentSlide]?.classList.remove('active');
        
        // Activer la nouvelle slide
        carouselState.currentSlide = targetSlide;
        slides[carouselState.currentSlide]?.classList.add('active');
        slideContents[carouselState.currentSlide]?.classList.add('active');
        indicators[carouselState.currentSlide]?.classList.add('active');
        
        console.log(`🎭 Slide ${carouselState.currentSlide + 1}/${carouselState.totalSlides} ${manual ? '(manuel)' : '(auto)'}`);
        
        // Redémarrer l'autoplay si changement manuel
        if (manual && carouselState.isPlaying) {
            restartAutoPlay();
        }
    }
    
    // Slide suivante
    function nextSlide() {
        const nextIndex = (carouselState.currentSlide + 1) % carouselState.totalSlides;
        changeSlide(nextIndex);
    }
    
    // Démarrer l'autoplay
    function startAutoPlay() {
        if (carouselState.autoPlayInterval) return;
        
        carouselState.autoPlayInterval = setInterval(() => {
            if (carouselState.isPlaying) {
                nextSlide();
            }
        }, carouselState.slideDuration);
        
        console.log('▶️ Carrousel Hero - Autoplay démarré');
    }
    
    // Arrêter l'autoplay
    function stopAutoPlay() {
        if (carouselState.autoPlayInterval) {
            clearInterval(carouselState.autoPlayInterval);
            carouselState.autoPlayInterval = null;
        }
    }
    
    // Redémarrer l'autoplay
    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Gérer les clics sur les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            changeSlide(index, true);
        });
    });
    
    // Pause au hover sur le Hero
    heroSection.addEventListener('mouseenter', () => {
        carouselState.isPlaying = false;
        console.log('⏸️ Carrousel Hero - Pause (hover)');
    });
    
    heroSection.addEventListener('mouseleave', () => {
        carouselState.isPlaying = true;
        console.log('▶️ Carrousel Hero - Reprise (hover out)');
    });
    
    // Scroll smooth vers section About au clic sur scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = aboutSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Parallax subtil sur les images du carrousel
    let ticking = false;
    
    function updateHeroParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollProgress = Math.min(scrolled / heroHeight, 1);
        
        // Fade out du contenu Hero lors du scroll
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            const fadeOpacity = Math.max(1 - scrollProgress * 1.5, 0);
            heroContent.style.opacity = fadeOpacity;
            heroContent.style.transform = `translateY(${scrollProgress * 50}px)`;
        }
        
        // Parallax sur l'image active
        const activeImg = heroSection.querySelector('.hero-carousel-slide.active .hero-bg-img');
        if (activeImg) {
            const parallaxValue = scrollProgress * 20;
            activeImg.style.transform = `scale(${1 + scrollProgress * 0.05}) translateY(${parallaxValue}px)`;
        }
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHeroParallax);
            ticking = true;
        }
    }
    
    // Activer le parallax seulement sur desktop pour les performances
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }
    
    // Interaction hover sur les service items
    const serviceItems = heroSection.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-4px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(-2px) scale(1)';
        });
    });
    
    // Démarrer l'autoplay après un délai initial
    setTimeout(() => {
        startAutoPlay();
    }, 3000); // 3 secondes avant le premier changement
    
    console.log('✨ Hero Carrousel Dynamique initialisé avec succès');
    
    // Interface publique pour contrôler le carrousel
    window.HeroController = {
        nextSlide: () => changeSlide((carouselState.currentSlide + 1) % carouselState.totalSlides, true),
        prevSlide: () => changeSlide((carouselState.currentSlide - 1 + carouselState.totalSlides) % carouselState.totalSlides, true),
        goToSlide: (index) => changeSlide(index, true),
        toggleAutoPlay: () => {
            carouselState.isPlaying = !carouselState.isPlaying;
            return carouselState.isPlaying;
        },
        getCurrentSlide: () => carouselState.currentSlide,
        restart: restartAutoPlay
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