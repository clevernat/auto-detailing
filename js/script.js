// Main JavaScript file for RJ Auto Detailing

// Performance optimization - Use passive event listeners
const passiveSupported = () => {
  let passive = false;
  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() { passive = true; return true; }
    });
    window.addEventListener("test", null, options);
    window.removeEventListener("test", null, options);
  } catch(err) {}
  return passive;
};

const passiveOption = passiveSupported() ? { passive: true } : false;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize state management
  const appState = {
    currentSection: 'home',
    isMenuOpen: false,
    isBookingModalOpen: false,
    formData: {},
    galleryFilter: 'all',
    isLoading: false
  };
  
  // Set up state observers
  ModernFramework.state.subscribe('currentSection', (value) => {
    updateActiveNavLink(value);
  });
  
  ModernFramework.state.subscribe('isMenuOpen', (value) => {
    toggleMobileMenu(value);
  });
  
  ModernFramework.state.subscribe('isBookingModalOpen', (value) => {
    toggleBookingModal(value);
  });
  
  ModernFramework.state.subscribe('galleryFilter', (value) => {
    filterGallery(value);
  });
  
  // Mobile menu toggle with state management
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      ModernFramework.state.setState('isMenuOpen', !ModernFramework.state.getState('isMenuOpen'));
    });
  }
  
  function toggleMobileMenu(isOpen) {
    if (mobileMenuBtn && mobileMenu) {
      if (isOpen) {
        mobileMenuBtn.classList.add("active");
        mobileMenu.classList.add("active");
        document.body.style.overflow = "hidden";
      } else {
        mobileMenuBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  }

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      ModernFramework.state.setState('isMenuOpen', false);
    });
  });

  // Typewriter effect for hero section - optimized
  const typewriterText = document.getElementById("typewriter-text");
  if (typewriterText) {
    const words = ["Vehicle", "Experience", "Investment"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      // Only run animation if element is in viewport
      if (isElementInViewport(typewriterText)) {
        const currentWord = words[wordIndex];

        if (isDeleting) {
          typewriterText.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
          typeSpeed = 50;
        } else {
          typewriterText.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
          typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
          isDeleting = true;
          typeSpeed = 1000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          typeSpeed = 500; // Pause before starting new word
        }
      }

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
  }

  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Initialize lazy loading for images using our framework
  ModernFramework.lazyLoad.images('.lazy-image', {
    rootMargin: '200px 0px',
    threshold: 0.01,
    placeholder: true
  });

  // Gallery filter functionality with state management
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  
  // Filter gallery based on state
  function filterGallery(filterValue) {
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      galleryItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
          setTimeout(() => {
            item.classList.add("animate-in");
          }, 50);
        } else {
          item.classList.remove("animate-in");
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
      
      // Update active filter button
      filterButtons.forEach((btn) => {
        if (btn.getAttribute("data-filter") === filterValue) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function() {
      const filterValue = this.getAttribute("data-filter");
      ModernFramework.state.setState('galleryFilter', filterValue);
    });
  });

  // Back to top button with smooth scrolling
  const backToTopButton = document.querySelector(".back-to-top");

  if (backToTopButton) {
    // Throttle function to limit scroll event execution
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }

    // Throttled scroll handler
    const handleScroll = throttle(function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    }, 100);

    window.addEventListener("scroll", handleScroll, passiveOption);

    backToTopButton.addEventListener("click", function() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Booking modal functionality with state management
  const bookingButtons = document.querySelectorAll(".cta-button:not(form .cta-button)");
  const bookingModal = document.querySelector(".booking-modal-overlay");
  const bookingModalClose = document.querySelector(".booking-modal-close");

  if (bookingButtons.length > 0 && bookingModal && bookingModalClose) {
    bookingButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        ModernFramework.state.setState('isBookingModalOpen', true);
      });
    });

    bookingModalClose.addEventListener("click", function() {
      ModernFramework.state.setState('isBookingModalOpen', false);
    });

    bookingModal.addEventListener("click", function(e) {
      if (e.target === bookingModal) {
        ModernFramework.state.setState('isBookingModalOpen', false);
      }
    });
    
    // Handle booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        ModernFramework.state.setState('isLoading', true);
        
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {};
        
        for (let [key, value] of formData.entries()) {
          bookingData[key] = value;
        }
        
        // Store in state
        ModernFramework.state.setState('formData', bookingData);
        
        // Simulate API call
        setTimeout(() => {
          // Hide loading state
          ModernFramework.state.setState('isLoading', false);
          
          // Close modal
          ModernFramework.state.setState('isBookingModalOpen', false);
          
          // Show success message
          ModernUI.toast.success('Booking submitted successfully! We will contact you shortly.');
          
          // Reset form
          bookingForm.reset();
        }, 1500);
      });
    }
  }
  
  function toggleBookingModal(isOpen) {
    if (bookingModal) {
      if (isOpen) {
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";
        
        setTimeout(() => {
          document.querySelector(".booking-modal").classList.add("active");
        }, 10);
      } else {
        document.querySelector(".booking-modal").classList.remove("active");
        
        setTimeout(() => {
          bookingModal.classList.remove("active");
          document.body.style.overflow = "";
        }, 300);
      }
    }
  }

  // Contact form submission with validation and toast notifications
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Initialize form validation
    const formValidator = ModernFramework.forms.initValidation('contactForm', {
      onSubmit: function(data, form) {
        // Show loading state
        ModernFramework.state.setState('isLoading', true);
        
        // Simulate form submission
        setTimeout(() => {
          // Hide loading state
          ModernFramework.state.setState('isLoading', false);
          
          // Show success message
          ModernUI.toast.success('Message sent successfully! We will get back to you soon.');
          
          // Reset form
          form.reset();
        }, 1500);
      }
    });
  }
  
  // Update active navigation link based on scroll position
  function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      
      if (href === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Track current section on scroll
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', throttle(function() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
    
    if (currentSection !== ModernFramework.state.getState('currentSection')) {
      ModernFramework.state.setState('currentSection', currentSection);
    }
  }, 100), passiveOption);
  
  // Initialize particles animation for hero section
  initParticles();
  
  // Initialize smooth scrolling for navigation links
  ModernUI.smoothScroll.init('.nav-link, .mobile-menu a', {
    duration: 800,
    offset: 80,
    easing: 'easeInOutCubic'
  });
  
  // Initialize sticky header
  ModernUI.stickyHeader.init('.sticky-header', {
    offset: 100,
    scrollUpOnly: true
  });
  
  // Initialize carousel for testimonials
  ModernUI.carousel.init('.testimonials-carousel', {
    autoplay: true,
    interval: 5000,
    effect: 'fade'
  });
  
  // Add hardware acceleration class to elements that need it
  const animatedElements = document.querySelectorAll('.gallery-item, .service-card, .pricing-card, .testimonial-card');
  animatedElements.forEach(el => {
    el.classList.add('hardware-accelerated');
  });
});

// Initialize particles animation
function initParticles() {
  const particles = document.querySelectorAll('.particle');
  
  particles.forEach((particle, index) => {
    // Set random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Set random size
    const size = Math.random() * 30 + 10;
    
    // Set random animation duration
    const duration = Math.random() * 20 + 10;
    
    // Set random animation delay
    const delay = Math.random() * 5;
    
    // Apply styles
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
  });
}
