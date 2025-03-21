// Main JavaScript file for RJ Auto Detailing

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

  // Typewriter effect for hero section
  const typewriterText = document.getElementById("typewriter-text");
  if (typewriterText) {
    const words = ["Vehicle", "Experience", "Investment"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
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

      setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
  }

  // Lazy loading for gallery images
  const lazyImages = document.querySelectorAll(".lazy-image");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");

          // Hide placeholder after image loads
          img.addEventListener("load", function () {
            const placeholder = img.previousElementSibling;
            if (
              placeholder &&
              placeholder.classList.contains("placeholder-container")
            ) {
              placeholder.style.opacity = "0";
            }
          });

          imageObserver.unobserve(img);
        }
      });
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

  // Gallery filter functionality
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

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
  });

  // Animate gallery items on load
  setTimeout(() => {
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("animate-in");
      }, 100 * index);
    });
  }, 500);

  // Back to top button
  const backToTopButton = document.querySelector(".back-to-top");

  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Booking modal functionality
  const ctaButtons = document.querySelectorAll(".cta-button");
  const bookingModal = document.querySelector(".booking-modal-overlay");
  const bookingModalClose = document.querySelector(".booking-modal-close");

  if (ctaButtons.length > 0 && bookingModal && bookingModalClose) {
    ctaButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
          document.querySelector(".booking-modal").classList.add("active");
        }, 10);
      });
    });

    bookingModalClose.addEventListener("click", function () {
      document.querySelector(".booking-modal").classList.remove("active");

      setTimeout(() => {
        bookingModal.classList.remove("active");
        document.body.style.overflow = "";
      }, 300);
    });

    bookingModal.addEventListener("click", function (e) {
      if (e.target === bookingModal) {
        document.querySelector(".booking-modal").classList.remove("active");

        setTimeout(() => {
          bookingModal.classList.remove("active");
          document.body.style.overflow = "";
        }, 300);
      }
    });
  }

  // Form submission handling
  const contactForm = document.querySelector(".contact-form");
  const bookingForm = document.getElementById("bookingForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Here you would typically send the form data to a server
      // For demo purposes, we'll just show an alert
      alert("Thank you for your message! We'll get back to you soon.");
      contactForm.reset();
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Here you would typically send the booking data to a server
      // For demo purposes, we'll just show an alert
      alert(
        "Thank you for your booking! We'll confirm your appointment shortly."
      );
      bookingForm.reset();

      // Close the modal
      document.querySelector(".booking-modal").classList.remove("active");
      setTimeout(() => {
        document
          .querySelector(".booking-modal-overlay")
          .classList.remove("active");
        document.body.style.overflow = "";
      }, 300);
    });
  }
});
