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
    // Rendre le visuel artistique cliquable
    const heroImage = document.querySelector('.gallery-hero img');
    if (heroImage) {
      heroImage.style.cursor = 'pointer';
      heroImage.addEventListener('click', () => {
        this.openModal({
          src: heroImage.src,
          alt: heroImage.alt,
          title: '🌼 Visuel Artistique Sweet Daisies',
          description: 'Notre univers visuel mêlant art et musique dans un style unique et coloré.'
        });
      });
      
      // Ajouter un indicateur visuel
      this.addClickIndicator(heroImage.parentElement, 'Cliquer pour agrandir');
    }

    // Rendre le logo cliquable
    const logoImage = document.querySelector('.gallery-item-small img');
    if (logoImage) {
      logoImage.style.cursor = 'pointer';
      logoImage.addEventListener('click', () => {
        this.openModal({
          src: logoImage.src,
          alt: logoImage.alt,
          title: '🎵 Logo Sweet Daisies Orchestra',
          description: 'Notre logo officiel représentant l\'identité visuelle du groupe.'
        });
      });
      
      // Ajouter un indicateur visuel
      this.addClickIndicator(logoImage.parentElement, 'Cliquer pour agrandir');
    }
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

// Debug global
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('e2b.dev')) {
  window.galleryModal = galleryModal;
  console.log('🎯 Mode développement - galleryModal disponible globalement');
}

// Log de chargement
console.log('🖼️ Gallery Modal JS chargé - Visuel et logo cliquables');