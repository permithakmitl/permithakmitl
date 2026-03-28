/* ===================================
   PERMITHA KMITL - SHARED JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ===================================
  // 1. HAMBURGER TOGGLE
  // ===================================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('nav-open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('nav-open');
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('nav-open');
      });
    });
  }

  // ===================================
  // 2. DROPDOWN — Info & Scholarship
  // ===================================
  const dropdown = document.querySelector('.nav-dropdown');

  if (dropdown) {
    let hideTimeout;
    const isMobile = function () {
      return window.innerWidth <= 768;
    };

    // Desktop: mouseenter / mouseleave
    dropdown.addEventListener('mouseenter', function () {
      if (!isMobile()) {
        clearTimeout(hideTimeout);
        dropdown.classList.add('open');
      }
    });

    dropdown.addEventListener('mouseleave', function () {
      if (!isMobile()) {
        hideTimeout = setTimeout(function () {
          dropdown.classList.remove('open');
        }, 200);
      }
    });

    // Mobile: click toggle
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        if (isMobile()) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  }

  // Mobile dropdown toggle
  const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
  const mobileDropdownItems = document.querySelector('.mobile-dropdown-items');

  if (mobileDropdownToggle && mobileDropdownItems) {
    mobileDropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      mobileDropdownItems.classList.toggle('open');
      this.classList.toggle('open');
    });
  }

  // ===================================
  // 3. ACTIVE NAV LINK
  // ===================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Desktop nav links
  document.querySelectorAll('.nav-links > a, .nav-dropdown-trigger').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('#')[0].split('/').pop();
    if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile nav links
  document.querySelectorAll('.mobile-menu > a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('#')[0].split('/').pop();
    if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===================================
  // 4. SUB-NAV SCROLL SPY
  // ===================================
  const subNavLinks = document.querySelectorAll('.sub-nav-links a');

  if (subNavLinks.length > 0) {
    const sections = [];
    subNavLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href.includes('#')) {
        const id = href.split('#')[1];
        const section = document.getElementById(id);
        if (section) {
          sections.push({ id: id, el: section, link: link });
        }
      }
    });

    if (sections.length > 0) {
      const observerOptions = {
        rootMargin: '-120px 0px -50% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            subNavLinks.forEach(function (l) { l.classList.remove('active'); });
            const match = sections.find(function (s) { return s.el === entry.target; });
            if (match) {
              match.link.classList.add('active');
            }
          }
        });
      }, observerOptions);

      sections.forEach(function (s) {
        observer.observe(s.el);
      });
    }
  }

  // ===================================
  // 5. SCROLL ANIMATION (fade-in)
  // ===================================
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

});

// ===================================
// PHOTO GALLERY SCROLL
// ===================================
function scrollPhotos(wrapperId, direction) {
  var wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    var scrollAmount = wrapper.clientWidth * 0.8;
    wrapper.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}
