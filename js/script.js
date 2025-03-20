// ===== MOBILE MENU FUNCTIONALITY =====
// Get DOM elements for mobile menu
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");

// Toggle mobile menu visibility when menu button is clicked
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  mobileMenuBtn.classList.toggle("active");

  // Prevent body scrolling when menu is open
  if (mobileMenu.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

// Close mobile menu when clicking a nav link
const mobileNavLinks = document.querySelectorAll(".mobile-menu a");
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !mobileMenu.contains(e.target) &&
    !mobileMenuBtn.contains(e.target) &&
    mobileMenu.classList.contains("active")
  ) {
    mobileMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ===== LAZY LOADING IMPLEMENTATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Lazy loading for images with fallback
  const lazyImages = document.querySelectorAll(".lazy-image");

  // Options for Intersection Observer
  const options = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of the item must be visible
  };

  // Load image function with error handling
  function loadImage(image) {
    const src = image.getAttribute("data-src");

    // Create a new image to test loading
    const tempImage = new Image();

    // Set up success handler
    tempImage.onload = function () {
      // Replace placeholder with actual image
      image.src = src;
      image.classList.add("loaded");

      // Find parent placeholder container and add a class to fade it out
      const placeholderContainer = image.previousElementSibling;
      if (
        placeholderContainer &&
        placeholderContainer.classList.contains("placeholder-container")
      ) {
        placeholderContainer.style.opacity = "0";

        // Remove placeholder after transition
        setTimeout(() => {
          placeholderContainer.style.display = "none";
        }, 300);
      }
    };

    // Set up error handler
    tempImage.onerror = function () {
      // Keep placeholder visible but add error message
      const placeholderContainer = image.previousElementSibling;
      if (placeholderContainer) {
        // Create error message element
        const errorMsg = document.createElement("div");
        errorMsg.className = "image-error-message";
        errorMsg.textContent = "Image could not be loaded";
        placeholderContainer.appendChild(errorMsg);

        // Add low-quality fallback image if available
        const fallbackSrc = image.getAttribute("data-fallback");
        if (fallbackSrc) {
          image.src = fallbackSrc;
          image.classList.add("fallback-loaded");
        }
      }
    };

    // Start loading the image
    tempImage.src = src;
  }

  // Use Intersection Observer if supported
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all lazy images
    lazyImages.forEach((image) => {
      observer.observe(image);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    lazyImages.forEach((image) => {
      loadImage(image);
    });
  }

  // Add timeout for slow connections
  setTimeout(() => {
    lazyImages.forEach((image) => {
      if (
        !image.classList.contains("loaded") &&
        !image.classList.contains("fallback-loaded")
      ) {
        loadImage(image);
      }
    });
  }, 3000); // 3 seconds timeout
});

// ===== DEVICE DETECTION =====
// Check if device is touch-enabled for optimizing interactions
const isTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

// Add touch-device class to body if needed for CSS targeting
if (isTouchDevice()) {
  document.body.classList.add("touch-device");
}

// ===== GALLERY FILTERING FUNCTIONALITY =====
const filterButtons = document.querySelectorAll(".gallery-filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Get the filter value (category) from the button
    const filterValue = button.getAttribute("data-filter");

    // Filter gallery items based on their category
    galleryItems.forEach((item) => {
      // Get item category
      const itemCategory = item.getAttribute("data-category");

      // Show/hide based on filter
      if (filterValue === "all" || filterValue === itemCategory) {
        item.style.display = "flex";
        // Add animation - different for touch devices
        setTimeout(() => {
          item.style.transform = isTouchDevice() ? "none" : "scale(1)";
          item.style.opacity = "1";
        }, 50);
      } else {
        item.style.transform = isTouchDevice() ? "none" : "scale(0.8)";
        item.style.opacity = "0";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// ===== SCROLL ANIMATION FOR GALLERY =====
// Add animation when gallery items come into view
const animateOnScroll = () => {
  const gallerySection = document.querySelector(".gallery");
  const galleryPosition = gallerySection.getBoundingClientRect().top;
  const screenPosition = window.innerHeight / 1.3;

  // If gallery section is in viewport
  if (galleryPosition < screenPosition) {
    // Animate each gallery item with a staggered delay
    galleryItems.forEach((item, index) => {
      setTimeout(
        () => {
          item.classList.add("animate-in");
        },
        isTouchDevice() ? 50 : 100 * index
      );
    });
    // Remove scroll listener once animation is triggered
    window.removeEventListener("scroll", animateOnScroll);
  }
};

// ===== SCROLL PERFORMANCE OPTIMIZATION =====
// Optimize scrolling performance by reducing animations during scroll
let scrollTimeout;
window.addEventListener(
  "scroll",
  function () {
    // Add a class during scroll to reduce animations
    document.body.classList.add("is-scrolling");

    // Call animate on scroll function
    animateOnScroll();

    // Remove the class after scrolling stops (debounce)
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove("is-scrolling");
    }, 100);
  },
  { passive: true } // Improve scroll performance
);

// ===== BACK TO TOP BUTTON FUNCTIONALITY =====
const backToTopButton = document.querySelector(".back-to-top");

// Show button when user scrolls down 300px from the top
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
});

// Smooth scroll to top when button is clicked
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== DOCUMENT READY FUNCTIONALITY =====
// Trigger animation if gallery is already in view on page load
document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll();

  // ===== MOBILE TOUCH INTERACTIONS =====
  // Add tap/click functionality for mobile gallery items
  if (isTouchDevice()) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        const overlay = this.querySelector(".gallery-overlay");

        // Toggle a class to show/hide the full overlay
        if (overlay.style.transform === "translateY(0px)") {
          overlay.style.transform = "translateY(65%)";
        } else {
          overlay.style.transform = "translateY(0px)";

          // Hide other overlays when one is opened
          galleryItems.forEach((otherItem) => {
            if (otherItem !== item) {
              const otherOverlay = otherItem.querySelector(".gallery-overlay");
              if (otherOverlay) {
                otherOverlay.style.transform = "translateY(65%)";
              }
            }
          });
        }
      });
    });
  }

  // ===== ORIENTATION CHANGE HANDLER =====
  // Handle device orientation changes
  window.addEventListener("orientationchange", function () {
    // Small delay to allow the browser to complete the orientation change
    setTimeout(() => {
      // Recalculate layout for gallery items
      galleryItems.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
    }, 300);
  });
});

// ===== BOOKING MODAL FUNCTIONALITY =====
const bookingButtons = document.querySelectorAll(".cta-button");
const bookingModalOverlay = document.querySelector(".booking-modal-overlay");
const bookingModal = document.querySelector(".booking-modal");
const bookingModalClose = document.querySelector(".booking-modal-close");
const bookingForm = document.getElementById("bookingForm");

// Open Booking Modal when any CTA button is clicked
bookingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bookingModalOverlay.classList.add("active");
    bookingModal.classList.add("active");
  });
});

// Close Booking Modal when close button is clicked
bookingModalClose.addEventListener("click", () => {
  bookingModalOverlay.classList.remove("active");
  bookingModal.classList.remove("active");
});

// Close Modal when clicking outside the modal content
bookingModalOverlay.addEventListener("click", (e) => {
  if (e.target === bookingModalOverlay) {
    bookingModalOverlay.classList.remove("active");
    bookingModal.classList.remove("active");
  }
});
// ===== FORM SUBMISSION HANDLING =====
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  // Collect form data
  const formData = new FormData(bookingForm);
  const bookingDetails = {};

  // Convert FormData to object for easier handling
  for (let [key, value] of formData.entries()) {
    if (key === "services") {
      // Handle multiple service selections
      if (!bookingDetails[key]) bookingDetails[key] = [];
      bookingDetails[key].push(value);
    } else {
      bookingDetails[key] = value;
    }
  }

  // Basic validation - ensure at least one service is selected
  const selectedServices = bookingDetails.services || [];
  if (selectedServices.length === 0) {
    alert("Please select at least one service.");
    return;
  }

  // Log booking details to console (for development)
  console.log("Booking Details:", bookingDetails);

  // Show success message to user
  alert(`Thank you, ${bookingDetails.name}! 
Your booking for ${selectedServices.join(", ")} services has been received. 
We'll contact you at ${bookingDetails.phone} to confirm the details.`);

  // Reset form and close modal
  bookingForm.reset();
  bookingModalOverlay.classList.remove("active");
  bookingModal.classList.remove("active");
});

// ===== ROTATING TYPEWRITER EFFECT =====
document.addEventListener("DOMContentLoaded", function () {
  // Words that will rotate in the typewriter effect
  const words = [
    "Vehicle's Elegance",
    "Automotive Experience",
    "Car's Appearance",
    "Driving Pleasure",
    "Vehicle's Brilliance",
  ];

  const typewriterElement = document.getElementById("typewriter-text");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];

    // Set typing speed - faster when deleting
    const typingSpeed = isDeleting ? 50 : 100;

    if (!isWaiting) {
      // If typing
      if (!isDeleting && charIndex < currentWord.length) {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }
      // If deleting
      else if (isDeleting && charIndex > 0) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      }

      // If word is complete, wait then start deleting
      if (!isDeleting && charIndex === currentWord.length) {
        isWaiting = true;
        setTimeout(() => {
          isDeleting = true;
          isWaiting = false;
        }, 1500); // Wait time at end of word
      }

      // If deletion is complete, move to next word
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    // Call function again after delay
    setTimeout(typeEffect, typingSpeed);
  }

  // Start the effect
  setTimeout(typeEffect, 500);
});
