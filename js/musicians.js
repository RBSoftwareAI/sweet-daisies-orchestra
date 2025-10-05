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
      e.stopPropagation();
      this.expandBiography(musicianId, card);
    });

    // Événement pour fermer la biographie complète
    collapseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.collapseBiography(musicianId, card);
    });
  }

  expandBiography(musicianId, card) {
    // Fermer toutes les autres biographies ouvertes
    this.closeAllBiographies();

    const readMoreBtn = card.querySelector('.read-more-btn');
    const fullBio = card.querySelector('.musician-full-bio');
    
    if (!fullBio || !readMoreBtn) {
      console.error('❌ Éléments manquants pour:', musicianId);
      return false;
    }

    console.log('🔄 Expansion de la biographie pour:', musicianId);
    
    // Calculer la hauteur réelle nécessaire
    const originalDisplay = fullBio.style.display;
    const originalMaxHeight = fullBio.style.maxHeight;
    const originalOverflow = fullBio.style.overflow;
    
    fullBio.style.display = 'block';
    fullBio.style.maxHeight = 'none';
    fullBio.style.overflow = 'visible';
    const realHeight = fullBio.scrollHeight;
    
    fullBio.style.display = originalDisplay;
    fullBio.style.maxHeight = '0';
    fullBio.style.overflow = 'hidden';
    
    // Ouvrir cette biographie avec la vraie hauteur
    requestAnimationFrame(() => {
      fullBio.classList.add('expanded');
      fullBio.style.maxHeight = Math.max(realHeight + 150, 400) + 'px'; // +150px pour le padding et marge de sécurité
      readMoreBtn.classList.add('expanded');
      
      // Masquer le bouton "Lire la suite"
      readMoreBtn.style.display = 'none';
    });

    // Scroll vers le contenu après animation
    setTimeout(() => {
      card.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }, 700);

    console.log('✅ Biographie ouverte pour:', musicianId, '- Hauteur calculée:', realHeight + 'px');
    return true;
  }

  collapseBiography(musicianId, card) {
    const readMoreBtn = card.querySelector('.read-more-btn');
    const fullBio = card.querySelector('.musician-full-bio');
    
    if (!fullBio || !readMoreBtn) {
      console.error('❌ Éléments manquants pour:', musicianId);
      return;
    }

    console.log('🔄 Fermeture de la biographie pour:', musicianId);

    // Fermer la biographie avec animation
    fullBio.style.maxHeight = '0';
    fullBio.classList.remove('expanded');
    readMoreBtn.classList.remove('expanded');
    
    // Réafficher le bouton "Lire la suite" après l'animation
    setTimeout(() => {
      readMoreBtn.style.display = 'flex';
    }, 300);

    console.log('✅ Biographie fermée pour:', musicianId);
  }

  closeAllBiographies() {
    const allCards = document.querySelectorAll('.musician-card');

    allCards.forEach(card => {
      const fullBio = card.querySelector('.musician-full-bio');
      const readMoreBtn = card.querySelector('.read-more-btn');
      
      if (fullBio && fullBio.classList.contains('expanded')) {
        fullBio.style.maxHeight = '0';
        fullBio.classList.remove('expanded');
      }
      
      if (readMoreBtn) {
        readMoreBtn.classList.remove('expanded');
        readMoreBtn.style.display = 'flex'; // Toujours réafficher le bouton
      }
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
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('e2b.dev')) {
  window.musiciansManager = musiciansManager;
  console.log('🎯 Mode développement - musiciansManager disponible globalement');
  
  // Ajouter des fonctions de test globales
  window.testExpandCollapse = function() {
    console.log('🧪 DÉBUT DES TESTS EXPAND/COLLAPSE');
    const cards = document.querySelectorAll('.musician-card');
    let testResults = { passed: 0, failed: 0, details: [] };
    
    cards.forEach((card, index) => {
      try {
        const readMoreBtn = card.querySelector('.read-more-btn');
        const collapseBtn = card.querySelector('.collapse-btn');
        const fullBio = card.querySelector('.musician-full-bio');
        
        if (!readMoreBtn || !collapseBtn || !fullBio) {
          testResults.failed++;
          testResults.details.push(`❌ Carte ${index + 1}: Éléments manquants`);
          return;
        }
        
        // Test d'expansion
        readMoreBtn.click();
        setTimeout(() => {
          if (fullBio.classList.contains('expanded') && readMoreBtn.style.display === 'none') {
            // Test de fermeture
            setTimeout(() => {
              collapseBtn.click();
              setTimeout(() => {
                if (!fullBio.classList.contains('expanded') && readMoreBtn.style.display === 'flex') {
                  testResults.passed++;
                  testResults.details.push(`✅ Carte ${index + 1}: OK`);
                } else {
                  testResults.failed++;
                  testResults.details.push(`❌ Carte ${index + 1}: Échec fermeture`);
                }
              }, 900);
            }, 100);
          } else {
            testResults.failed++;
            testResults.details.push(`❌ Carte ${index + 1}: Échec ouverture`);
          }
        }, 900);
        
      } catch (error) {
        testResults.failed++;
        testResults.details.push(`❌ Carte ${index + 1}: Erreur - ${error.message}`);
      }
    });
    
    // Afficher les résultats après tous les tests
    setTimeout(() => {
      console.log('🧪 RÉSULTATS DES TESTS:');
      console.log(`✅ Réussis: ${testResults.passed}`);
      console.log(`❌ Échoués: ${testResults.failed}`);
      testResults.details.forEach(detail => console.log(detail));
      
      // Envoyer les résultats au parent si c'est un test automatisé
      if (window.opener) {
        window.opener.postMessage({
          type: 'TEST_RESULTS',
          success: testResults.failed === 0,
          details: `${testResults.passed} réussis, ${testResults.failed} échoués`
        }, '*');
      }
    }, (cards.length * 1000) + 2000);
  };
  
  // Écouter les messages de test
  window.addEventListener('message', (event) => {
    if (event.data.type === 'RUN_EXPAND_COLLAPSE_TEST') {
      setTimeout(() => window.testExpandCollapse(), 1000);
    } else if (event.data.type === 'TEST_SPECIFIC_CARD') {
      const cardIndex = event.data.cardIndex || 0;
      const cards = document.querySelectorAll('.musician-card');
      if (cards[cardIndex]) {
        const readMoreBtn = cards[cardIndex].querySelector('.read-more-btn');
        if (readMoreBtn) {
          console.log(`🧪 Test de la carte ${cardIndex + 1}`);
          readMoreBtn.click();
        }
      }
    }
  });
}