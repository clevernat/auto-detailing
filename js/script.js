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
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenuBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenuBtn.classList.remove("active");
      mobileMenu.classList.remove("active");
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

  // Lazy loading for gallery images - using Intersection Observer
  const lazyImages = document.querySelectorAll(".lazy-image");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Create a new image to preload
          const preloadImg = new Image();
          preloadImg.src = img.dataset.src;
          
          // When the image is loaded, update the visible image
          preloadImg.onload = function() {
            img.src = img.dataset.src;
            img.classList.add("loaded");

            // Hide placeholder after image loads
            const placeholder = img.previousElementSibling;
            if (
              placeholder &&
              placeholder.classList.contains("placeholder-container")
            ) {
              placeholder.style.opacity = "0";
            }
          };

          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: "200px 0px", // Load images 200px before they appear in viewport
      threshold: 0.01
    });

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.add("fallback-loaded");
    });
  }

  // Gallery filter functionality - optimized
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  
  // Create a debounce function to limit filter execution
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Optimized filter function
  const filterGallery = debounce(function(filterValue) {
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
    });
  }, 100);

  filterButtons.forEach((button) => {
    button.addEventListener("click", function() {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");
      filterGallery(filterValue);
    });
  });

  // Animate gallery items on load - optimized with IntersectionObserver
  if ("IntersectionObserver" in window) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-in");
          }, 100 * (index % 5)); // Stagger animations but limit to groups of 5
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    galleryItems.forEach((item) => {
      galleryObserver.observe(item);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    setTimeout(() => {
      galleryItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("animate-in");
        }, 100 * index);
      });
    }, 500);
  }

  // Back to top button - optimized with throttle
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

  // Booking modal functionality
  const bookingButtons = document.querySelectorAll(
    ".cta-button:not(form .cta-button)"
  );
  const bookingModal = document.querySelector(".booking-modal-overlay");
  const bookingModalClose = document.querySelector(".booking-modal-close");

  if (bookingButtons.length > 0 && bookingModal && bookingModalClose) {
    bookingButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Booking button clicked");
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
          document.querySelector(".booking-modal").classList.add("active");
        }, 10);
      });
    });

    bookingModalClose.addEventListener("click", function() {
      document.querySelector(".booking-modal").classList.remove("active");

      setTimeout(() => {
        bookingModal.classList.remove("active");
        document.body.style.overflow = "";
      }, 300);
    });

    bookingModal.addEventListener("click", function(e) {
      if (e.target === bookingModal) {
        document.querySelector(".booking-modal").classList.remove("active");

        setTimeout(() => {
          bookingModal.classList.remove("active");
          document.body.style.overflow = "";
        }, 300);
      }
    });
  } else {
    console.error("Booking modal elements not found");
  }

  // Add hardware acceleration class to elements that need it
  const animatedElements = document.querySelectorAll('.gallery-item, .service-card, .pricing-card, .testimonial-card');
  animatedElements.forEach(el => {
    el.classList.add('hardware-accelerated');
  });
});
