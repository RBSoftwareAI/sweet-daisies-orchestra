/**
 * Gestionnaire du carousel de la galerie étendue
 * Gestion des 14 photos de groupe avec navigation et indicateurs
 */

/**
 * Gestionnaire principal du carousel
 */
class GalleryCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 14;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 secondes
    this.isAutoPlaying = true;
    
    this.init();
  }

  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initCarousel());
    } else {
      this.initCarousel();
    }
  }

  initCarousel() {
    // Récupérer les éléments du DOM
    this.track = document.getElementById('carouselTrack');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.indicatorsContainer = document.getElementById('carouselIndicators');
    this.photoCounter = document.querySelector('.photo-counter');

    if (!this.track) {
      console.log('🖼️ Carousel non trouvé - probablement pas sur la page galerie');
      return;
    }

    // Initialiser les indicateurs
    this.createIndicators();
    
    // Attacher les événements
    this.attachEvents();
    
    // Démarrer l'autoplay
    this.startAutoPlay();
    
    // Mettre à jour l'affichage initial
    this.updateDisplay();

    console.log('🎠 Carousel galerie initialisé avec', this.totalSlides, 'photos');
  }

  createIndicators() {
    if (!this.indicatorsContainer) return;

    // Vider le conteneur
    this.indicatorsContainer.innerHTML = '';

    // Créer un indicateur pour chaque slide
    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('div');
      indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => this.goToSlide(i));
      this.indicatorsContainer.appendChild(indicator);
    }
  }

  attachEvents() {
    // Boutons de navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Pause autoplay au survol
    if (this.track) {
      this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
      this.track.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    // Gestion du swipe sur mobile
    this.addSwipeGestures();
  }

  addSwipeGestures() {
    if (!this.track) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      this.pauseAutoPlay();
    });

    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault(); // Empêcher le scroll de la page
    });

    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      // Vérifier que c'est bien un swipe horizontal
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe vers la gauche - slide suivant
          this.nextSlide();
        } else {
          // Swipe vers la droite - slide précédent
          this.previousSlide();
        }
      }
      
      isDragging = false;
      this.resumeAutoPlay();
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateDisplay();
    this.resetAutoPlay();
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateDisplay();
    this.resetAutoPlay();
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
      this.updateDisplay();
      this.resetAutoPlay();
    }
  }

  updateDisplay() {
    if (!this.track) return;

    // Déplacer le track
    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;

    // Mettre à jour les classes actives des slides
    const slides = this.track.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    // Mettre à jour les indicateurs
    const indicators = this.indicatorsContainer?.querySelectorAll('.indicator');
    if (indicators) {
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === this.currentSlide);
      });
    }

    // Mettre à jour le compteur
    if (this.photoCounter) {
      this.photoCounter.textContent = `${this.currentSlide + 1}/${this.totalSlides}`;
    }

    // Mettre à jour les boutons
    this.updateButtons();

    console.log('🖼️ Slide actuel:', this.currentSlide + 1, '/', this.totalSlides);
  }

  updateButtons() {
    // Les boutons sont toujours actifs car le carousel est circulaire
    if (this.prevBtn) {
      this.prevBtn.disabled = false;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = false;
    }
  }

  startAutoPlay() {
    if (this.isAutoPlaying && !this.autoPlayInterval) {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoPlayDelay);
      console.log('▶️ Autoplay démarré');
    }
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
      console.log('⏸️ Autoplay en pause');
    }
  }

  resumeAutoPlay() {
    if (this.isAutoPlaying) {
      this.startAutoPlay();
      console.log('▶️ Autoplay repris');
    }
  }

  resetAutoPlay() {
    this.pauseAutoPlay();
    this.resumeAutoPlay();
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.pauseAutoPlay();
    }
    return this.isAutoPlaying;
  }

  // Méthode pour aller à une slide aléatoire (pour tests)
  randomSlide() {
    const randomIndex = Math.floor(Math.random() * this.totalSlides);
    this.goToSlide(randomIndex);
  }
}

// Initialiser le carousel
const galleryCarousel = new GalleryCarousel();

// Fonction globale pour contrôler le carousel (utile pour le débogage)
window.controlCarousel = (action, value) => {
  switch (action) {
    case 'next':
      galleryCarousel.nextSlide();
      break;
    case 'prev':
      galleryCarousel.previousSlide();
      break;
    case 'goto':
      galleryCarousel.goToSlide(value || 0);
      break;
    case 'toggle':
      const isPlaying = galleryCarousel.toggleAutoPlay();
      console.log('🎮 Autoplay:', isPlaying ? 'ON' : 'OFF');
      break;
    case 'random':
      galleryCarousel.randomSlide();
      break;
    default:
      console.log('🎮 Actions disponibles: next, prev, goto, toggle, random');
  }
};

// Debug global
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('e2b.dev')) {
  window.galleryCarousel = galleryCarousel;
  console.log('🎯 Mode développement - galleryCarousel disponible globalement');
  console.log('🎮 Utilisez: controlCarousel("next"), controlCarousel("prev"), etc.');
}

// Log de chargement
console.log('🎠 Gallery Carousel JS chargé - 14 photos de groupe disponibles');