// ===== MOBILE MENU FUNCTIONALITY =====
// Get DOM elements for mobile menu
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");

// Toggle mobile menu visibility when menu button is clicked
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  mobileMenuBtn.classList.toggle("active");

  // Add animation to menu items
  const menuItems = document.querySelectorAll(".mobile-menu li");
  if (mobileMenu.classList.contains("active")) {
    menuItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(-10px)";
      setTimeout(() => {
        item.style.transition = "all 0.3s ease-in-out";
        item.style.transitionDelay = `${index * 0.05}s`;
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 50);
    });
  }
});

// Close mobile menu when clicking a nav link
const mobileNavLinks = document.querySelectorAll(".mobile-menu a");
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
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
  }
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

// Enhanced Gallery Functionality for Mobile and Hover Effects
document.addEventListener("DOMContentLoaded", function () {
  // Get all gallery items
  const galleryItems = document.querySelectorAll(".gallery-item");

  // Check if device is touch-enabled
  const isTouchDevice = () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  // Add touch-device class to body if needed
  if (isTouchDevice()) {
    document.body.classList.add("touch-device");
  }

  // Enhance gallery items for mobile view
  function enhanceGalleryForMobile() {
    // Adjust gallery grid layout based on screen width
    const galleryGrid = document.querySelector(".gallery-grid");
    if (window.innerWidth <= 480) {
      // For very small screens
      galleryItems.forEach((item) => {
        // Reset all items to take full width on small screens
        item.style.gridColumn = "span 12";
        // Ensure minimum height for visibility
        item.style.minHeight = "250px";
      });
    } else if (window.innerWidth <= 768) {
      // For medium screens (tablets)
      galleryItems.forEach((item) => {
        if (item.classList.contains("large")) {
          item.style.gridColumn = "span 12";
        } else if (item.classList.contains("wide")) {
          item.style.gridColumn = "span 12";
        } else {
          item.style.gridColumn = "span 6";
        }
      });
    }

    // Center gallery items on mobile
    if (window.innerWidth <= 768) {
      galleryGrid.style.justifyItems = "center";
    } else {
      galleryGrid.style.justifyItems = "stretch";
    }

    // Enhance touch interactions for gallery items
    if (isTouchDevice()) {
      galleryItems.forEach((item) => {
        item.addEventListener("click", function () {
          const overlay = this.querySelector(".gallery-overlay");

          // Toggle overlay visibility on tap
          if (overlay.style.transform === "translateY(0px)") {
            overlay.style.transform = "translateY(65%)";
          } else {
            overlay.style.transform = "translateY(0px)";

            // Hide other overlays when one is opened
            galleryItems.forEach((otherItem) => {
              if (otherItem !== item) {
                const otherOverlay =
                  otherItem.querySelector(".gallery-overlay");
                if (otherOverlay) {
                  otherOverlay.style.transform = "translateY(65%)";
                }
              }
            });
          }
        });
      });
    }
  }

  // Enhance hover effects for gallery items
  function enhanceGalleryHoverEffects() {
    galleryItems.forEach((item) => {
      const overlay = item.querySelector(".gallery-overlay");
      const heading = overlay.querySelector("h4");
      const paragraph = overlay.querySelector("p");

      // Add hover event listeners if not a touch device
      if (!isTouchDevice()) {
        item.addEventListener("mouseenter", function () {
          // Enhance text visibility on hover
          if (heading) heading.style.color = "#ffffff";
          if (paragraph) paragraph.style.color = "#ffffff";

          // Add text shadow for better readability
          if (heading)
            heading.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.5)";
          if (paragraph)
            paragraph.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.5)";

          // Show overlay with animation
          overlay.style.transform = "translateY(0)";
        });

        item.addEventListener("mouseleave", function () {
          // Hide overlay with animation
          overlay.style.transform = "translateY(100%)";
        });
      }
    });
  }

  // Initialize gallery enhancements
  enhanceGalleryForMobile();
  enhanceGalleryHoverEffects();

  // Handle window resize events
  window.addEventListener("resize", function () {
    enhanceGalleryForMobile();
  });

  // Handle orientation change for mobile devices
  window.addEventListener("orientationchange", function () {
    // Small delay to allow the browser to complete the orientation change
    setTimeout(() => {
      enhanceGalleryForMobile();
    }, 300);
  });

  // Optimize scrolling performance
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    function () {
      // Add a class during scroll to reduce animations
      document.body.classList.add("is-scrolling");

      // Remove the class after scrolling stops (debounce)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 100);
    },
    { passive: true }
  ); // Improve scroll performance
});
