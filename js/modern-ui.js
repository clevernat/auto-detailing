/**
 * Modern UI Components
 * Reusable UI components for a React-like experience
 */

// Create a namespace for our UI components
const ModernUI = (function() {
  // Toast notification system
  const toast = {
    // Show a toast notification
    show(message, type = 'info', duration = 3000) {
      ModernFramework.ui.toast(message, type, duration);
    },
    
    // Success toast
    success(message, duration = 3000) {
      this.show(message, 'success', duration);
    },
    
    // Error toast
    error(message, duration = 3000) {
      this.show(message, 'error', duration);
    },
    
    // Info toast
    info(message, duration = 3000) {
      this.show(message, 'info', duration);
    },
    
    // Warning toast
    warning(message, duration = 3000) {
      this.show(message, 'warning', duration);
    }
  };
  
  // Modal system
  const modal = {
    // Show a modal
    show(options) {
      return ModernFramework.ui.modal(options);
    },
    
    // Show a confirmation modal
    confirm(options) {
      const { title, message, onConfirm, onCancel } = options;
      
      return this.show({
        id: 'confirm-modal',
        title: title || 'Confirm',
        content: `
          <div class="modal-message">${message}</div>
          <div class="modal-actions">
            <button class="btn btn-secondary modal-cancel">Cancel</button>
            <button class="btn btn-primary modal-confirm">Confirm</button>
          </div>
        `,
        onClose: () => {
          if (onCancel) onCancel();
        }
      }).then(modal => {
        const confirmBtn = modal.element.querySelector('.modal-confirm');
        const cancelBtn = modal.element.querySelector('.modal-cancel');
        
        confirmBtn.addEventListener('click', () => {
          modal.close();
          if (onConfirm) onConfirm();
        });
        
        cancelBtn.addEventListener('click', () => {
          modal.close();
          if (onCancel) onCancel();
        });
        
        return modal;
      });
    },
    
    // Show an alert modal
    alert(options) {
      const { title, message, onClose } = options;
      
      return this.show({
        id: 'alert-modal',
        title: title || 'Alert',
        content: `
          <div class="modal-message">${message}</div>
          <div class="modal-actions">
            <button class="btn btn-primary modal-ok">OK</button>
          </div>
        `,
        onClose
      }).then(modal => {
        const okBtn = modal.element.querySelector('.modal-ok');
        
        okBtn.addEventListener('click', () => {
          modal.close();
        });
        
        return modal;
      });
    }
  };
  
  // Dropdown component
  const dropdown = {
    // Initialize dropdowns
    init(selector = '.dropdown') {
      const dropdowns = document.querySelectorAll(selector);
      
      dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other open dropdowns
          document.querySelectorAll('.dropdown.active').forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('active');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('active');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
          }
        });
        
        // Handle dropdown item selection
        const items = menu.querySelectorAll('.dropdown-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            // Update toggle text if data-select attribute is present
            if (dropdown.hasAttribute('data-select')) {
              toggle.textContent = item.textContent;
              
              // Update hidden input if it exists
              const input = dropdown.querySelector('input[type="hidden"]');
              if (input) {
                input.value = item.getAttribute('data-value') || item.textContent;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
              }
            }
            
            dropdown.classList.remove('active');
          });
        });
      });
    }
  };
  
  // Tabs component
  const tabs = {
    // Initialize tabs
    init(selector = '.tabs') {
      const tabContainers = document.querySelectorAll(selector);
      
      tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanels = container.querySelectorAll('.tab-panel');
        
        // Set initial active tab
        let activeTab = container.querySelector('.tab-button.active');
        if (!activeTab && tabButtons.length > 0) {
          activeTab = tabButtons[0];
          activeTab.classList.add('active');
        }
        
        if (activeTab) {
          const targetId = activeTab.getAttribute('data-tab');
          const targetPanel = container.querySelector(`.tab-panel[data-tab="${targetId}"]`);
          
          if (targetPanel) {
            targetPanel.classList.add('active');
          }
        }
        
        // Handle tab clicks
        tabButtons.forEach(button => {
          button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => {
              panel.classList.remove('active');
              panel.classList.remove('animate-fade-in');
            });
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            
            const targetPanel = container.querySelector(`.tab-panel[data-tab="${targetId}"]`);
            if (targetPanel) {
              targetPanel.classList.add('active');
              targetPanel.classList.add('animate-fade-in');
            }
          });
        });
      });
    }
  };
  
  // Accordion component
  const accordion = {
    // Initialize accordions
    init(selector = '.accordion', options = {}) {
      const accordions = document.querySelectorAll(selector);
      
      const defaultOptions = {
        multipleOpen: false,
        defaultOpen: null
      };
      
      const config = { ...defaultOptions, ...options };
      
      accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        
        // Check for data attributes that override options
        const multipleOpen = accordion.getAttribute('data-multiple') === 'true' || config.multipleOpen;
        
        // Set default open item if specified
        if (config.defaultOpen !== null) {
          const defaultItem = items[config.defaultOpen];
          if (defaultItem) {
            defaultItem.classList.add('active');
            const content = defaultItem.querySelector('.accordion-content');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
        
        // Handle accordion item clicks
        items.forEach(item => {
          const header = item.querySelector('.accordion-header');
          const content = item.querySelector('.accordion-content');
          
          header.addEventListener('click', () => {
            // If not multiple open, close other items
            if (!multipleOpen) {
              items.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                  otherItem.classList.remove('active');
                  const otherContent = otherItem.querySelector('.accordion-content');
                  otherContent.style.maxHeight = null;
                }
              });
            }
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
              content.style.maxHeight = content.scrollHeight + 'px';
            } else {
              content.style.maxHeight = null;
            }
          });
        });
      });
    }
  };
  
  // Carousel component
  const carousel = {
    // Initialize carousels
    init(selector = '.carousel', options = {}) {
      const carousels = document.querySelectorAll(selector);
      
      const defaultOptions = {
        autoplay: false,
        interval: 5000,
        indicators: true,
        controls: true,
        effect: 'slide' // slide, fade
      };
      
      carousels.forEach(carousel => {
        // Get options from data attributes or defaults
        const config = { ...defaultOptions, ...options };
        config.autoplay = carousel.getAttribute('data-autoplay') === 'true' || config.autoplay;
        config.interval = parseInt(carousel.getAttribute('data-interval')) || config.interval;
        config.indicators = carousel.getAttribute('data-indicators') !== 'false' && config.indicators;
        config.controls = carousel.getAttribute('data-controls') !== 'false' && config.controls;
        config.effect = carousel.getAttribute('data-effect') || config.effect;
        
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        if (!track || slides.length === 0) return;
        
        // Set up carousel
        let currentIndex = 0;
        let interval = null;
        
        // Add effect class
        carousel.classList.add(`carousel-${config.effect}`);
        
        // Set initial slide
        slides[0].classList.add('active');
        
        // Create indicators if enabled
        if (config.indicators && slides.length > 1) {
          const indicatorsContainer = document.createElement('div');
          indicatorsContainer.className = 'carousel-indicators';
          
          for (let i = 0; i < slides.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
              goToSlide(i);
            });
            
            indicatorsContainer.appendChild(indicator);
          }
          
          carousel.appendChild(indicatorsContainer);
        }
        
        // Create controls if enabled
        if (config.controls && slides.length > 1) {
          const prevButton = document.createElement('button');
          prevButton.className = 'carousel-control carousel-control-prev';
          prevButton.innerHTML = '<span class="carousel-control-icon">&lsaquo;</span>';
          prevButton.setAttribute('aria-label', 'Previous slide');
          
          const nextButton = document.createElement('button');
          nextButton.className = 'carousel-control carousel-control-next';
          nextButton.innerHTML = '<span class="carousel-control-icon">&rsaquo;</span>';
          nextButton.setAttribute('aria-label', 'Next slide');
          
          prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
          });
          
          nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
          });
          
          carousel.appendChild(prevButton);
          carousel.appendChild(nextButton);
        }
        
        // Go to specific slide
        function goToSlide(index) {
          // Handle index bounds
          if (index < 0) {
            index = slides.length - 1;
          } else if (index >= slides.length) {
            index = 0;
          }
          
          // Remove active class from current slide
          slides[currentIndex].classList.remove('active');
          
          // Update indicators
          const indicators = carousel.querySelectorAll('.carousel-indicator');
          if (indicators.length > 0) {
            indicators[currentIndex].classList.remove('active');
            indicators[index].classList.add('active');
          }
          
          // Update current index
          currentIndex = index;
          
          // Add active class to new slide
          slides[currentIndex].classList.add('active');
          
          // Reset autoplay timer
          if (config.autoplay && interval) {
            clearInterval(interval);
            startAutoplay();
          }
        }
        
        // Start autoplay
        function startAutoplay() {
          interval = setInterval(() => {
            goToSlide(currentIndex + 1);
          }, config.interval);
        }
        
        // Initialize autoplay if enabled
        if (config.autoplay && slides.length > 1) {
          startAutoplay();
          
          // Pause on hover
          carousel.addEventListener('mouseenter', () => {
            clearInterval(interval);
          });
          
          carousel.addEventListener('mouseleave', () => {
            startAutoplay();
          });
        }
        
        // Handle touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
        }, { passive: true });
        
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
      });
    }
  };
  
  // Smooth scroll
  const smoothScroll = {
    // Initialize smooth scrolling
    init(selector = 'a[href^="#"]', options = {}) {
      const links = document.querySelectorAll(selector);
      
      const defaultOptions = {
        duration: 800,
        offset: 0,
        easing: 'easeInOutCubic'
      };
      
      const config = { ...defaultOptions, ...options };
      
      // Easing functions
      const easings = {
        linear: t => t,
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      };
      
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          
          if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href === '#' ? 'body' : href;
            const targetElement = targetId === 'body' ? document.body : document.querySelector(targetId);
            
            if (targetElement) {
              // Get custom offset from data attribute or use default
              const offset = parseInt(link.getAttribute('data-offset')) || config.offset;
              
              // Get custom duration from data attribute or use default
              const duration = parseInt(link.getAttribute('data-duration')) || config.duration;
              
              // Get custom easing from data attribute or use default
              const easing = link.getAttribute('data-easing') || config.easing;
              
              // Scroll to target
              scrollTo(targetElement, duration, offset, easings[easing] || easings.easeInOutCubic);
            }
          }
        });
      });
      
      // Scroll to element
      function scrollTo(target, duration, offset, easingFn) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition - offset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const easing = easingFn(progress);
          
          window.scrollTo(0, startPosition + distance * easing);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }
        
        requestAnimationFrame(animation);
      }
    }
  };
  
  // Sticky header
  const stickyHeader = {
    // Initialize sticky header
    init(selector = '.sticky-header', options = {}) {
      const header = document.querySelector(selector);
      if (!header) return;
      
      const defaultOptions = {
        offset: 0,
        activeClass: 'sticky-active',
        hiddenClass: 'sticky-hidden',
        scrollUpOnly: false
      };
      
      const config = { ...defaultOptions, ...options };
      
      // Get options from data attributes or defaults
      config.offset = parseInt(header.getAttribute('data-sticky-offset')) || config.offset;
      config.scrollUpOnly = header.getAttribute('data-sticky-scroll-up') === 'true' || config.scrollUpOnly;
      
      let lastScrollTop = 0;
      let ticking = false;
      
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
      
      function handleScroll() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > config.offset) {
          if (config.scrollUpOnly) {
            // Show header only when scrolling up
            if (scrollTop < lastScrollTop) {
              header.classList.add(config.activeClass);
              header.classList.remove(config.hiddenClass);
            } else {
              header.classList.add(config.hiddenClass);
            }
          } else {
            // Always show header when past offset
            header.classList.add(config.activeClass);
          }
        } else {
          // Remove sticky when at top
          header.classList.remove(config.activeClass);
          header.classList.remove(config.hiddenClass);
        }
        
        lastScrollTop = scrollTop;
      }
      
      // Initial check
      handleScroll();
    }
  };
  
  // Return public API
  return {
    toast,
    modal,
    dropdown,
    tabs,
    accordion,
    carousel,
    smoothScroll,
    stickyHeader,
    
    // Initialize all components
    init() {
      this.dropdown.init();
      this.tabs.init();
      this.accordion.init();
      this.carousel.init();
      this.smoothScroll.init();
      this.stickyHeader.init();
      
      return this;
    }
  };
})();

// Initialize UI components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ModernUI.init();
});