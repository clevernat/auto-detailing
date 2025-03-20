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
