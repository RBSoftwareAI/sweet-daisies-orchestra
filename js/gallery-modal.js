/**
 * Gestionnaire des modales de galerie
 * Affichage en plein écran du visuel artistique et du logo
 */

/**
 * Gestionnaire principal des modales
 */
class GalleryModal {
  constructor() {
    this.modal = null;
    this.isOpen = false;
    this.currentImage = null;
    
    this.init();
  }

  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initModal());
    } else {
      this.initModal();
    }
  }

  initModal() {
    // Créer la structure de la modale
    this.createModal();
    
    // Attacher les événements
    this.attachEvents();
    
    console.log('🖼️ Gestionnaire de modales galerie initialisé');
  }

  createModal() {
    // Créer la modale si elle n'existe pas
    if (!document.getElementById('galleryModal')) {
      const modalHTML = `
        <div id="galleryModal" class="gallery-modal-overlay">
          <div class="gallery-modal-container">
            <button class="gallery-modal-close" id="modalClose">
              <i class="fas fa-times"></i>
            </button>
            <div class="gallery-modal-content">
              <img id="modalImage" src="" alt="" class="gallery-modal-image">
              <div class="gallery-modal-info">
                <h3 id="modalTitle">Titre</h3>
                <p id="modalDescription">Description</p>
              </div>
            </div>
            <div class="gallery-modal-controls">
              <button class="gallery-modal-btn" id="downloadBtn">
                <i class="fas fa-download"></i>
                <span>Télécharger</span>
              </button>
              <button class="gallery-modal-btn" id="shareBtn">
                <i class="fas fa-share-alt"></i>
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Récupérer les éléments
    this.modal = document.getElementById('galleryModal');
    this.modalImage = document.getElementById('modalImage');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalDescription = document.getElementById('modalDescription');
    this.closeBtn = document.getElementById('modalClose');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.shareBtn = document.getElementById('shareBtn');
  }

  attachEvents() {
    // Rendre les images cliquables
    this.makeImagesClickable();
    
    // Événements de fermeture
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Fermer en cliquant sur l'overlay
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    });

    // Boutons d'action
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    if (this.shareBtn) {
      this.shareBtn.addEventListener('click', () => this.shareImage());
    }
  }

  makeImagesClickable() {
    // Fonction pour attacher les événements à un élément cliquable
    const attachClickableEvent = (element, imageSrc, title, description) => {
      element.style.cursor = 'pointer';
      element.addEventListener('click', () => {
        this.openModal({
          src: imageSrc,
          alt: title,
          title: title,
          description: description
        });
      });
    };

    // Rendre le visuel artistique cliquable
    const heroElement = document.querySelector('.gallery-hero.gallery-clickable');
    if (heroElement) {
      const heroImage = heroElement.querySelector('img');
      if (heroImage) {
        attachClickableEvent(heroElement, heroElement.dataset.image || heroImage.src, 
          '🌼 Visuel Artistique Sweet Daisies',
          'Notre univers visuel mêlant art et musique dans un style unique et coloré.');
      }
    }

    // Rendre tous les éléments gallery-clickable cliquables
    const clickableElements = document.querySelectorAll('.gallery-clickable');
    clickableElements.forEach(element => {
      if (element.classList.contains('gallery-hero')) return; // Déjà traité
      
      const img = element.querySelector('img');
      if (!img) return;
      
      // Déterminer le titre et la description selon le type
      let title = '🖼️ Image';
      let description = 'Cliquez pour voir en grand format';
      
      if (element.classList.contains('gallery-item-small')) {
        const overlay = element.querySelector('.gallery-overlay-small h4');
        if (overlay) {
          title = overlay.textContent;
          const descElement = element.querySelector('.gallery-overlay-small p');
          if (descElement) description = descElement.textContent;
        }
      } else if (element.classList.contains('musician-photo-rect') || element.classList.contains('musician-photo-container')) {
        // Pour les photos de musiciens
        const card = element.closest('.musician-card');
        if (card) {
          const nameElement = card.querySelector('h3');
          const instrumentElement = card.querySelector('h4');
          if (nameElement) {
            title = `👤 ${nameElement.textContent}`;
            if (instrumentElement) {
              description = instrumentElement.textContent;
            }
          }
        }
      }
      
      const imageSrc = element.dataset.image || img.src;
      attachClickableEvent(element, imageSrc, title, description);
    });
  }

  addClickIndicator(container, text) {
    // Ajouter un indicateur de clic au survol
    const indicator = document.createElement('div');
    indicator.className = 'click-indicator';
    indicator.innerHTML = `
      <i class="fas fa-search-plus"></i>
      <span>${text}</span>
    `;
    container.appendChild(indicator);
  }

  openModal(imageData) {
    if (!this.modal) return;

    // Mettre à jour le contenu
    this.modalImage.src = imageData.src;
    this.modalImage.alt = imageData.alt;
    this.modalTitle.textContent = imageData.title;
    this.modalDescription.textContent = imageData.description;
    
    // Stocker l'image actuelle
    this.currentImage = imageData;

    // Afficher la modale
    this.modal.classList.add('active');
    document.body.classList.add('modal-open');
    this.isOpen = true;

    console.log('🖼️ Modale ouverte:', imageData.title);
  }

  closeModal() {
    if (!this.modal) return;

    // Masquer la modale
    this.modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    this.isOpen = false;
    this.currentImage = null;

    console.log('❌ Modale fermée');
  }

  downloadImage() {
    if (!this.currentImage) return;

    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = this.currentImage.src;
    link.download = `sweet-daisies-${this.currentImage.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('💾 Téléchargement:', this.currentImage.title);
  }

  shareImage() {
    if (!this.currentImage) return;

    // Partage natif si disponible
    if (navigator.share) {
      navigator.share({
        title: this.currentImage.title,
        text: this.currentImage.description,
        url: window.location.href
      }).then(() => {
        console.log('📤 Partage réussi');
      }).catch((error) => {
        console.log('❌ Erreur de partage:', error);
        this.fallbackShare();
      });
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    // Fallback: copier l'URL dans le presse-papiers
    const url = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showNotification('🔗 Lien copié dans le presse-papiers !');
      });
    } else {
      // Fallback très basique
      this.showNotification('🔗 Partagez cette page: ' + url);
    }
  }

  showNotification(message) {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = 'gallery-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Suppression après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}

// Initialiser le gestionnaire de modales
const galleryModal = new GalleryModal();

// Fonction globale pour ouvrir une modale (utile pour le débogage)
window.openGalleryModal = (imageData) => {
  galleryModal.openModal(imageData);
};

// Exposer globalement pour les interactions inter-modules
window.galleryModal = galleryModal;
console.log('🎯 galleryModal disponible globalement');

// Log de chargement
console.log('🖼️ Gallery Modal JS chargé - Visuel et logo cliquables');