/* ===================================
   HALAL FOOD & PLACE - JAVASCRIPT
   PERMITHA KMITL

   Search + Pagination for halal food
   listing page. No external dependencies.
   =================================== */

var ITEMS_PER_PAGE = 5;
var currentPage = 1;
var searchQuery = '';

// ===================================
// PLACE DATA
// Add more entries here as needed.
// ===================================
var halalPlaces = [
  {
    id: 1,
    name: 'Tempat 1',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-1.jpg'
  },
  {
    id: 2,
    name: 'Tempat 2',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-2.jpg'
  },
  {
    id: 3,
    name: 'Tempat 3',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-3.jpg'
  },
  {
    id: 4,
    name: 'Tempat 4',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-4.jpg'
  },
  {
    id: 5,
    name: 'Tempat 5',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-5.jpg'
  },
  {
    id: 6,
    name: 'Tempat 6',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-6.jpg'
  },
  {
    id: 7,
    name: 'Tempat 7',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-7.jpg'
  },
  {
    id: 8,
    name: 'Tempat 8',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-8.jpg'
  },
  {
    id: 9,
    name: 'Tempat 9',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-9.jpg'
  },
  {
    id: 10,
    name: 'Tempat 10',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-10.jpg'
  },
  {
    id: 11,
    name: 'Tempat 11',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-11.jpg'
  },
  {
    id: 12,
    name: 'Tempat 12',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-12.jpg'
  },
  {
    id: 13,
    name: 'Tempat 13',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-13.jpg'
  },
  {
    id: 14,
    name: 'Tempat 14',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-14.jpg'
  },
  {
    id: 15,
    name: 'Tempat 15',
    location: 'Lokasi, Bangkok',
    mapUrl: '#',
    description: 'Deskripsi singkat tempat makan halal. Akan diperbarui.',
    image: 'images/halal-food/place-15.jpg'
  }
];

// ===================================
// i18n HELPER
// ===================================
function getHalalText(key, fallback) {
  var lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'id';
  if (lang === 'id') return fallback;
  if (typeof getLangData === 'function') {
    var data = getLangData();
    if (data[key] !== undefined) return data[key];
  }
  return fallback;
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('halal-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchQuery = this.value.trim().toLowerCase();
      currentPage = 1;
      renderHalalListing();
    });
  }

  if (typeof onLanguageChange === 'function') {
    onLanguageChange(function() {
      renderHalalListing();
    });
  }

  renderHalalListing();
});

// ===================================
// FILTERED PLACES
// ===================================
function getFilteredPlaces() {
  if (!searchQuery) return halalPlaces.slice();

  return halalPlaces.filter(function(place) {
    var name = place.name.toLowerCase();
    var location = place.location.toLowerCase();
    var desc = place.description.toLowerCase();
    return name.indexOf(searchQuery) !== -1 ||
           location.indexOf(searchQuery) !== -1 ||
           desc.indexOf(searchQuery) !== -1;
  });
}

// ===================================
// RENDER LISTING
// ===================================
function renderHalalListing() {
  var grid = document.getElementById('halal-grid');
  var navTop = document.getElementById('halal-nav-top');
  var paginationBottom = document.getElementById('halal-pagination-bottom');

  if (!grid) return;

  var filtered = getFilteredPlaces();

  if (filtered.length === 0) {
    var noResultsText = getHalalText('halal.noResults', 'Tidak ada hasil ditemukan. Coba kata kunci lain.');
    grid.innerHTML =
      '<div class="halal-empty">' +
        '<div class="halal-empty-icon">🍽️</div>' +
        '<h3>' + getHalalText('halal.noResultsTitle', 'Tidak Ditemukan') + '</h3>' +
        '<p>' + noResultsText + '</p>' +
      '</div>';
    if (navTop) navTop.innerHTML = '';
    if (paginationBottom) paginationBottom.innerHTML = '';
    return;
  }

  var totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  var startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  var endIndex = startIndex + ITEMS_PER_PAGE;
  var pageItems = filtered.slice(startIndex, endIndex);

  var cardsHtml = '';
  for (var i = 0; i < pageItems.length; i++) {
    cardsHtml += renderHalalCard(pageItems[i]);
  }
  grid.innerHTML = cardsHtml;

  var paginationHtml = renderPaginationButtons(totalPages);
  if (navTop) navTop.innerHTML = paginationHtml;
  if (paginationBottom) paginationBottom.innerHTML = paginationHtml;

  animateHalalCards();
}

// ===================================
// RENDER CARD
// ===================================
function renderHalalCard(place) {
  var mapLinkText = getHalalText('halal.mapLink', '🗺️ Google Maps');

  var imageHtml;
  if (place.image) {
    imageHtml = '<img src="' + escapeHalalHtml(place.image) + '" alt="' + escapeHalalHtml(place.name) + '">';
  } else {
    imageHtml = '<div class="halal-card-placeholder">🍽️</div>';
  }

  return (
    '<div class="halal-card">' +
      '<div class="halal-card-image">' + imageHtml + '</div>' +
      '<div class="halal-card-body">' +
        '<h3 class="halal-card-name">' + escapeHalalHtml(place.name) + '</h3>' +
        '<p class="halal-card-location">📍 ' + escapeHalalHtml(place.location) + '</p>' +
        '<a class="halal-card-map" href="' + escapeHalalHtml(place.mapUrl) + '" target="_blank" rel="noopener noreferrer">' + mapLinkText + '</a>' +
        '<p class="halal-card-desc">' + escapeHalalHtml(place.description) + '</p>' +
      '</div>' +
    '</div>'
  );
}

// ===================================
// PAGINATION
// ===================================
function renderPaginationButtons(totalPages) {
  if (totalPages <= 1) return '';

  var prevText = getHalalText('halal.prevBtn', '← Sebelumnya');
  var nextText = getHalalText('halal.nextBtn', 'Berikutnya →');

  var html = '';

  html += '<button class="halal-page-btn' + (currentPage === 1 ? ' disabled' : '') + '" onclick="goToHalalPage(' + (currentPage - 1) + ')">' + escapeHalalHtml(prevText) + '</button>';

  for (var p = 1; p <= totalPages; p++) {
    html += '<button class="halal-page-btn' + (p === currentPage ? ' active' : '') + '" onclick="goToHalalPage(' + p + ')">' + p + '</button>';
  }

  html += '<button class="halal-page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" onclick="goToHalalPage(' + (currentPage + 1) + ')">' + escapeHalalHtml(nextText) + '</button>';

  return html;
}

function goToHalalPage(page) {
  var filtered = getFilteredPlaces();
  var totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderHalalListing();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// ANIMATION
// ===================================
function animateHalalCards() {
  var cards = document.querySelectorAll('.halal-card');
  for (var i = 0; i < cards.length; i++) {
    (function(card, index) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.transitionDelay = (index * 0.08) + 's';

      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    })(cards[i], i);
  }
}

// ===================================
// UTILITY
// ===================================
function escapeHalalHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
