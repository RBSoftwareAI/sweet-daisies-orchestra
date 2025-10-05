/**
 * Gestionnaire des biographies des musiciens
 * Système vertical avec expand/collapse et photos personnelles
 */

/**
 * Gestionnaire principal des musiciens
 */
class MusiciansManager {
  constructor() {
    this.musiciansData = [];
    this.init();
  }

  async init() {
    try {
      // Charger les données des musiciens depuis le JSON
      await this.loadMusiciansData();
      
      // Attendre que le DOM soit chargé
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.generateMusiciansSection());
      } else {
        setTimeout(() => this.generateMusiciansSection(), 100);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données des musiciens:', error);
    }
  }

  async loadMusiciansData() {
    try {
      const response = await fetch('./assets/bios/biographies.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.musiciansData = await response.json();
      console.log('✅ Données des musiciens chargées:', this.musiciansData.length, 'musiciens');
    } catch (error) {
      console.error('❌ Erreur lors du chargement du fichier JSON:', error);
      // Fallback: utiliser des données par défaut si le JSON ne charge pas
      this.musiciansData = this.getFallbackData();
    }
  }

  generateMusiciansSection() {
    const musiciansGrid = document.querySelector('.musicians-grid-vertical');
    if (!musiciansGrid) {
      console.error('❌ Element .musicians-grid-vertical non trouvé !');
      return;
    }

    // Vider la grille existante
    musiciansGrid.innerHTML = '';

    // Générer les cartes des musiciens
    this.musiciansData.forEach((musician, index) => {
      const musicianCard = this.createMusicianCard(musician, index);
      musiciansGrid.appendChild(musicianCard);
    });

    console.log('🌼 Section musiciens générée avec', this.musiciansData.length, 'cartes');
  }

  createMusicianCard(musician, index) {
    const card = document.createElement('div');
    card.className = 'musician-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const photoPath = `assets/bios/${musician.photo}`;
    
    card.innerHTML = `
      <div class="musician-header">
        <img src="${photoPath}" alt="${musician.firstName} ${musician.lastName}" class="musician-photo" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="musician-icon-fallback" style="display: none; width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--yellow-primary), var(--orange-retro)); align-items: center; justify-content: center; margin-right: 1.5rem;">
          <i class="${musician.icon}" style="font-size: 2.5rem; color: white;"></i>
        </div>
        <div class="musician-basic-info">
          <h3>${musician.firstName} ${musician.lastName}</h3>
          <h4>${musician.instrument}</h4>
          <p class="musician-resume">${musician.resume}</p>
          <button class="read-more-btn" data-musician-id="${musician.id}">
            <span>Lire la suite</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div class="musician-full-bio" data-musician-id="${musician.id}">
        <div class="bio-content">${musician.biographie_complete}</div>
        ${musician.specialites && musician.specialites.length > 0 ? `
          <div class="bio-specialties">
            ${musician.specialites.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
          </div>
        ` : ''}
        ${musician.citation ? `
          <div class="bio-citation">
            ${musician.citation}
          </div>
        ` : ''}
        <button class="collapse-btn" data-musician-id="${musician.id}">
          <i class="fas fa-chevron-up"></i>
          <span>Réduire</span>
        </button>
      </div>
    `;

    // Attacher les événements pour expand/collapse
    this.attachExpandCollapseEvents(card, musician.id);

    return card;
  }

  attachExpandCollapseEvents(card, musicianId) {
    const readMoreBtn = card.querySelector('.read-more-btn');
    const collapseBtn = card.querySelector('.collapse-btn');
    const fullBio = card.querySelector('.musician-full-bio');

    // Événement pour ouvrir la biographie complète
    readMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.expandBiography(musicianId, readMoreBtn, fullBio);
    });

    // Événement pour fermer la biographie complète
    collapseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.collapseBiography(musicianId, readMoreBtn, fullBio);
    });
  }

  expandBiography(musicianId, readMoreBtn, fullBio) {
    // Fermer toutes les autres biographies ouvertes
    this.closeAllBiographies();

    // Ouvrir cette biographie
    fullBio.classList.add('expanded');
    readMoreBtn.classList.add('expanded');
    
    // Changer le texte et l'icône du bouton
    const btnText = readMoreBtn.querySelector('span');
    const btnIcon = readMoreBtn.querySelector('i');
    btnText.textContent = 'Réduire';
    btnIcon.className = 'fas fa-chevron-up';

    // Scroll vers la carte pour une meilleure visibilité
    setTimeout(() => {
      fullBio.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 300);

    console.log('🔄 Biographie ouverte pour:', musicianId);
  }

  collapseBiography(musicianId, readMoreBtn, fullBio) {
    fullBio.classList.remove('expanded');
    readMoreBtn.classList.remove('expanded');
    
    // Remettre le texte et l'icône originaux du bouton
    const btnText = readMoreBtn.querySelector('span');
    const btnIcon = readMoreBtn.querySelector('i');
    btnText.textContent = 'Lire la suite';
    btnIcon.className = 'fas fa-chevron-right';

    console.log('🔄 Biographie fermée pour:', musicianId);
  }

  closeAllBiographies() {
    const allFullBios = document.querySelectorAll('.musician-full-bio.expanded');
    const allReadMoreBtns = document.querySelectorAll('.read-more-btn.expanded');

    allFullBios.forEach(bio => {
      bio.classList.remove('expanded');
    });

    allReadMoreBtns.forEach(btn => {
      btn.classList.remove('expanded');
      const btnText = btn.querySelector('span');
      const btnIcon = btn.querySelector('i');
      btnText.textContent = 'Lire la suite';
      btnIcon.className = 'fas fa-chevron-right';
    });
  }

  getFallbackData() {
    // Données de fallback en cas d'échec du chargement JSON
    return [
      {
        "id": "fallback",
        "firstName": "Données",
        "lastName": "En cours de chargement...",
        "instrument": "Veuillez patienter",
        "icon": "fas fa-spinner",
        "photo": "placeholder.jpg",
        "resume": "Les biographies des musiciens sont en cours de chargement. Veuillez rafraîchir la page.",
        "biographie_complete": "Les données des musiciens sont actuellement en cours de chargement depuis notre serveur. Si ce message persiste, veuillez rafraîchir la page ou contacter l'administrateur du site.",
        "specialites": [],
        "citation": "Patience et longueur de temps font plus que force ni que rage."
      }
    ];
  }
}

// Initialiser le gestionnaire des musiciens
const musiciansManager = new MusiciansManager();

// Fonction globale pour fermer toutes les biographies (utile pour le débogage)
window.closeAllBios = () => {
  if (window.musiciansManager) {
    window.musiciansManager.closeAllBiographies();
  }
};

// Debug global
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.musiciansManager = musiciansManager;
  console.log('🎯 Mode développement - musiciansManager disponible globalement');
}