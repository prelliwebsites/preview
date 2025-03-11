

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();


// modal functionality 
(function() {
  // Modal configuration object
  const accessibleModal = {
    settings: {
      openButtons: document.querySelectorAll('.modal-open'),
      closeButtons: document.querySelectorAll('.modal-close, .modal-cancel'),
      modalOverlay: document.querySelector('.modal-overlay'),
      activeClass: 'is-active',
      modalId: 'accessible-modal',
      focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      initialFocusElement: '#modal-title',
      form: document.querySelector('.modal form'),
    },

    /**
     * Initialize the modal functionality
     */
    init: () => {
      if (!accessibleModal.settings.modalOverlay) return;
      accessibleModal.bindEvents();
    },

    /**
     * Bind all event listeners
     */
    bindEvents: () => {
      const { openButtons, closeButtons, modalOverlay, form } = accessibleModal.settings;

      if (openButtons.length > 0) {
        openButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            accessibleModal.openModal();
          });
        });
      }

      if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            accessibleModal.closeModal();
          });
        });
      }

      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
            accessibleModal.closeModal();
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accessibleModal.isModalOpen()) {
          accessibleModal.closeModal();
        }

        if (e.key === 'Tab' && accessibleModal.isModalOpen()) {
          accessibleModal.trapFocus(e);
        }
      });

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();

          /* eslint-disable no-alert */
          alert("This is just a demonstration. If it were a real application, it would provide a message telling whether the entered name and email address is valid.");
          /* eslint-enable no-alert */
        });
      }
    },

    /**
     * Open the modal
     */
    openModal: () => {
      accessibleModal.settings.previouslyFocused = document.activeElement;

      accessibleModal.settings.modalOverlay.classList.add(accessibleModal.settings.activeClass);
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      accessibleModal.setInitialFocus();
    },

    /**
     * Close the modal
     */
    closeModal: () => {
      accessibleModal.settings.modalOverlay.classList.remove(accessibleModal.settings.activeClass);
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';

      document.querySelectorAll('.temp-focusable').forEach(el => {
        el.removeAttribute('tabindex');
        el.classList.remove('temp-focusable');
      });

      if (accessibleModal.settings.previouslyFocused) {
        accessibleModal.settings.previouslyFocused.focus();
      }
    },

    /**
     * Check if modal is currently open
     * @returns {boolean} True if modal is open
     */
    isModalOpen: () => {
      return accessibleModal.settings.modalOverlay.classList.contains(accessibleModal.settings.activeClass);
    },

    /**
     * Get all focusable elements inside the modal
     * @returns {NodeList} List of focusable elements
     */
    getFocusableElements: () => {
      const modal = document.getElementById(accessibleModal.settings.modalId);
      return modal ? modal.querySelectorAll(accessibleModal.settings.focusableElements) : [];
    },

    /**
     * Set initial focus when modal opens
     */
    setInitialFocus: () => {
      const focusElement = document.querySelector(accessibleModal.settings.initialFocusElement);

      if (focusElement) {
        if (!focusElement.getAttribute('tabindex')) {
          focusElement.setAttribute('tabindex', '-1');
          focusElement.classList.add('temp-focusable');
        }

        setTimeout(() => {
          focusElement.focus();
        }, 50);
        return;
      }

      const focusableElements = accessibleModal.getFocusableElements();
      if (focusableElements.length > 0) {
        setTimeout(() => {
          focusableElements[0].focus();
        }, 50);
      }
    },

    /**
     * Trap focus inside the modal
     */
    trapFocus: (e) => {
      const focusableElements = accessibleModal.getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    },
  };

  document.addEventListener('DOMContentLoaded', accessibleModal.init);
})();



// end modal 

// js for loader 

window.onload = function() {
  const preloader = document.querySelector('.preloader');
  const content = document.querySelector('.content');

  // Hide preloader and show content after 2 seconds
  setTimeout(function() {
    preloader.style.display = 'none';
    content.style.display = 'block';
  }, 5000); // You can change the time as needed
};



// script.js

// Initialize EmailJS
(function() {
  emailjs.init("_Y1lXuN-0BGBqD_wD");  // Replace with your User ID from EmailJS public keys
})();

document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from refreshing the page
  
  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Validate fields (Basic example)
  if (name === "" || email === "" || subject === "" || message === "") {
      alert("Please fill out all fields.");
      return;
  }


  emailjs.sendForm("service_ho8r2we", "template_oxgrl4h", this)
      .then(function(response) {
          document.getElementById("responseMessage").innerText = "Thank you for getting in touch! We will respond soon.";
          document.getElementById("contactForm").reset();
      }, function(error) {
          document.getElementById("responseMessage").innerText = "Sorry, something went wrong. Please try again.";
      });
});
