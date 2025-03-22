/**
 * Testimonials Carousel Implementation
 * This file handles the testimonials carousel functionality
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize testimonials carousel
  initTestimonialsCarousel();

  // Function to initialize the testimonials carousel
  function initTestimonialsCarousel() {
    const carousel = document.querySelector(".testimonials-carousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;

    let currentIndex = 0;
    let interval = null;
    const autoplay = carousel.getAttribute("data-autoplay") === "true";
    const intervalTime =
      parseInt(carousel.getAttribute("data-interval")) || 5000;
    const effect = carousel.getAttribute("data-effect") || "slide";

    // Add effect class
    carousel.classList.add(`carousel-${effect}`);

    // Set initial slide
    slides[0].classList.add("active");

    // Create indicators
    createIndicators();

    // Create navigation controls
    createControls();

    // Start autoplay if enabled
    if (autoplay) {
      startAutoplay();

      // Pause on hover
      carousel.addEventListener("mouseenter", () => {
        clearInterval(interval);
      });

      carousel.addEventListener("mouseleave", () => {
        startAutoplay();
      });
    }

    // Handle touch events for swipe
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      const threshold = 50; // Minimum distance for swipe

      if (touchEndX < touchStartX - threshold) {
        // Swipe left, go to next slide
        goToSlide(currentIndex + 1);
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe right, go to previous slide
        goToSlide(currentIndex - 1);
      }
    }

    // Function to go to a specific slide
    function goToSlide(index) {
      // Handle index bounds
      if (index < 0) {
        index = slides.length - 1;
      } else if (index >= slides.length) {
        index = 0;
      }

      // Remove active class from current slide
      slides[currentIndex].classList.remove("active");

      // Update indicators
      const indicators = carousel.querySelectorAll(".carousel-indicator");
      if (indicators.length > 0) {
        indicators[currentIndex].classList.remove("active");
        indicators[index].classList.add("active");
      }

      // Update current index
      currentIndex = index;

      // Add active class to new slide
      slides[currentIndex].classList.add("active");

      // Reset autoplay timer
      if (autoplay && interval) {
        clearInterval(interval);
        startAutoplay();
      }
    }

    // Function to create indicators
    function createIndicators() {
      if (slides.length <= 1) return;

      const indicatorsContainer = document.createElement("div");
      indicatorsContainer.className = "carousel-indicators";

      for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement("button");
        indicator.className = "carousel-indicator";
        indicator.setAttribute("aria-label", `Go to slide ${i + 1}`);
        if (i === 0) indicator.classList.add("active");

        indicator.addEventListener("click", () => {
          goToSlide(i);
        });

        indicatorsContainer.appendChild(indicator);
      }

      carousel.appendChild(indicatorsContainer);
    }

    // Function to create controls
    function createControls() {
      if (slides.length <= 1) return;

      const prevButton = document.createElement("button");
      prevButton.className = "carousel-control carousel-control-prev";
      prevButton.innerHTML =
        '<div class="carousel-control-icon"><i class="fas fa-chevron-left"></i></div>';
      prevButton.setAttribute("aria-label", "Previous testimonial");

      const nextButton = document.createElement("button");
      nextButton.className = "carousel-control carousel-control-next";
      nextButton.innerHTML =
        '<div class="carousel-control-icon"><i class="fas fa-chevron-right"></i></div>';
      nextButton.setAttribute("aria-label", "Next testimonial");

      prevButton.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
      });

      nextButton.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
      });

      carousel.appendChild(prevButton);
      carousel.appendChild(nextButton);
    }

    // Function to start autoplay
    function startAutoplay() {
      interval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, intervalTime);
    }
  }
});
