/**
 * Modern JavaScript Framework
 * A lightweight framework to mimic React-like behavior without using React
 */

// Create a namespace for our framework
const ModernFramework = (function() {
  // State management system
  const state = {
    data: {},
    listeners: {},
    
    // Set state and notify listeners
    setState(key, value) {
      this.data[key] = value;
      if (this.listeners[key]) {
        this.listeners[key].forEach(callback => callback(value));
      }
      return value;
    },
    
    // Get state
    getState(key) {
      return this.data[key];
    },
    
    // Subscribe to state changes
    subscribe(key, callback) {
      if (!this.listeners[key]) {
        this.listeners[key] = [];
      }
      this.listeners[key].push(callback);
      
      // Return unsubscribe function
      return () => {
        this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
      };
    }
  };
  
  // Virtual DOM-like component system
  const component = {
    // Create a new component
    create(id, template, data = {}) {
      const element = document.getElementById(id);
      if (!element) return null;
      
      // Store initial data in state
      Object.keys(data).forEach(key => {
        state.setState(`${id}.${key}`, data[key]);
      });
      
      // Initial render
      this.render(id, template, data);
      
      // Return component API
      return {
        setProps: (newData) => {
          Object.keys(newData).forEach(key => {
            state.setState(`${id}.${key}`, newData[key]);
          });
          this.render(id, template, this.getComponentData(id));
        },
        getProps: () => this.getComponentData(id),
        element
      };
    },
    
    // Get component data from state
    getComponentData(id) {
      const data = {};
      Object.keys(state.data).forEach(key => {
        if (key.startsWith(`${id}.`)) {
          const propKey = key.replace(`${id}.`, '');
          data[propKey] = state.data[key];
        }
      });
      return data;
    },
    
    // Render component with data
    render(id, template, data) {
      const element = document.getElementById(id);
      if (!element) return;
      
      // Add transition class for animation
      element.classList.add('component-exit');
      
      // Use setTimeout to create a smooth transition
      setTimeout(() => {
        // Replace content with new template
        element.innerHTML = typeof template === 'function' 
          ? template(this.getComponentData(id)) 
          : template;
        
        // Add enter transition classes
        element.classList.remove('component-exit');
        element.classList.add('component-enter');
        
        // Remove transition class after animation completes
        setTimeout(() => {
          element.classList.remove('component-enter');
        }, 300);
        
        // Initialize any child components
        this.initChildComponents(element);
      }, 50);
    },
    
    // Initialize child components
    initChildComponents(parentElement) {
      const childComponents = parentElement.querySelectorAll('[data-component]');
      childComponents.forEach(el => {
        const componentId = el.getAttribute('data-component');
        const componentTemplate = el.innerHTML;
        el.innerHTML = ''; // Clear the template
        
        // Create the child component
        this.create(componentId, componentTemplate);
      });
    }
  };
  
  // Router for SPA-like navigation
  const router = {
    routes: {},
    currentRoute: null,
    
    // Initialize router
    init(rootElementId = 'app', defaultRoute = '/') {
      this.rootElement = document.getElementById(rootElementId);
      
      // Handle navigation
      document.addEventListener('click', (e) => {
        // Find closest anchor tag
        const anchor = e.target.closest('a');
        if (anchor && anchor.getAttribute('data-route') !== null) {
          e.preventDefault();
          const href = anchor.getAttribute('href');
          this.navigate(href);
        }
      });
      
      // Handle back/forward navigation
      window.addEventListener('popstate', () => {
        this.handleRouteChange();
      });
      
      // Initial route
      this.handleRouteChange();
    },
    
    // Register a route
    register(path, callback) {
      this.routes[path] = callback;
    },
    
    // Navigate to a route
    navigate(path) {
      window.history.pushState({}, '', path);
      this.handleRouteChange();
    },
    
    // Handle route change
    handleRouteChange() {
      const path = window.location.pathname;
      
      // Find matching route
      const route = Object.keys(this.routes).find(routePath => {
        if (routePath === path) return true;
        
        // Simple pattern matching (e.g., '/product/:id')
        if (routePath.includes(':')) {
          const routeParts = routePath.split('/');
          const pathParts = path.split('/');
          
          if (routeParts.length !== pathParts.length) return false;
          
          const params = {};
          const match = routeParts.every((part, i) => {
            if (part.startsWith(':')) {
              params[part.slice(1)] = pathParts[i];
              return true;
            }
            return part === pathParts[i];
          });
          
          if (match) {
            this.currentParams = params;
            return true;
          }
        }
        
        return false;
      });
      
      // Execute route callback
      if (route && this.routes[route]) {
        // Add exit animation
        if (this.rootElement) {
          this.rootElement.classList.add('page-transition-exit');
          
          setTimeout(() => {
            // Call route handler
            this.routes[route](this.currentParams || {});
            
            // Add enter animation
            this.rootElement.classList.remove('page-transition-exit');
            this.rootElement.classList.add('page-transition-enter');
            
            setTimeout(() => {
              this.rootElement.classList.remove('page-transition-enter');
            }, 400);
          }, 300);
        } else {
          this.routes[route](this.currentParams || {});
        }
        
        this.currentRoute = route;
      }
    }
  };
  
  // UI utilities
  const ui = {
    // Create a toast notification
    toast(message, type = 'info', duration = 3000) {
      // Create toast container if it doesn't exist
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      
      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-icon">
          ${this.getToastIcon(type)}
        </div>
        <div class="toast-content">${message}</div>
      `;
      
      // Add to container
      container.appendChild(toast);
      
      // Animate in
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      // Remove after duration
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          container.removeChild(toast);
        }, 300);
      }, duration);
    },
    
    // Get icon for toast type
    getToastIcon(type) {
      switch(type) {
        case 'success':
          return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        case 'error':
          return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        case 'warning':
          return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        case 'info':
        default:
          return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      }
    },
    
    // Create a modal
    modal(options) {
      const { id, title, content, onClose } = options;
      
      // Create modal container if it doesn't exist
      let modalContainer = document.getElementById(id);
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = id;
        modalContainer.className = 'modal-container';
        document.body.appendChild(modalContainer);
      }
      
      // Set modal content
      modalContainer.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
        </div>
      `;
      
      // Show modal
      setTimeout(() => {
        modalContainer.classList.add('active');
      }, 10);
      
      // Handle close button
      const closeBtn = modalContainer.querySelector('.modal-close');
      const overlay = modalContainer.querySelector('.modal-overlay');
      
      const closeModal = () => {
        modalContainer.classList.remove('active');
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      };
      
      closeBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', closeModal);
      
      // Return modal API
      return {
        close: closeModal,
        element: modalContainer
      };
    },
    
    // Create a skeleton loader
    skeleton(count = 1, type = 'line') {
      let html = '';
      
      for (let i = 0; i < count; i++) {
        if (type === 'line') {
          html += `<div class="skeleton" style="height: 20px; margin-bottom: 10px;"></div>`;
        } else if (type === 'circle') {
          html += `<div class="skeleton" style="height: 50px; width: 50px; border-radius: 50%;"></div>`;
        } else if (type === 'card') {
          html += `
            <div class="skeleton-card">
              <div class="skeleton" style="height: 200px;"></div>
              <div class="skeleton" style="height: 30px; margin-top: 15px; width: 60%;"></div>
              <div class="skeleton" style="height: 15px; margin-top: 15px;"></div>
              <div class="skeleton" style="height: 15px; margin-top: 10px;"></div>
            </div>
          `;
        }
      }
      
      return html;
    }
  };
  
  // Animation utilities
  const animation = {
    // Animate elements when they enter the viewport
    animateOnScroll(selector = '.animate-on-scroll', options = {}) {
      const elements = document.querySelectorAll(selector);
      
      const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
        animation: 'animate-fade-in',
        stagger: 100
      };
      
      const config = { ...defaultOptions, ...options };
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add(config.animation);
              }, index * config.stagger);
              
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: config.threshold,
          rootMargin: config.rootMargin
        });
        
        elements.forEach(el => {
          observer.observe(el);
        });
      } else {
        // Fallback for browsers without IntersectionObserver
        elements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add(config.animation);
          }, index * config.stagger);
        });
      }
    },
    
    // Parallax effect
    parallax(selector = '.parallax', options = {}) {
      const elements = document.querySelectorAll(selector);
      
      const defaultOptions = {
        speed: 0.5,
        direction: 'up'
      };
      
      const config = { ...defaultOptions, ...options };
      
      const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        
        elements.forEach(el => {
          const elementTop = el.offsetTop;
          const elementHeight = el.offsetHeight;
          const windowHeight = window.innerHeight;
          
          // Check if element is in viewport
          if (
            elementTop + elementHeight > scrollTop &&
            elementTop < scrollTop + windowHeight
          ) {
            const distance = scrollTop - elementTop;
            const speed = parseFloat(el.getAttribute('data-speed') || config.speed);
            const direction = el.getAttribute('data-direction') || config.direction;
            
            let translateY = 0;
            
            if (direction === 'up') {
              translateY = distance * speed * -1;
            } else if (direction === 'down') {
              translateY = distance * speed;
            }
            
            el.style.transform = `translate3d(0, ${translateY}px, 0)`;
          }
        });
      };
      
      // Throttle scroll event
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
      
      // Initial call
      handleScroll();
    }
  };
  
  // Lazy loading utilities
  const lazyLoad = {
    // Initialize lazy loading for images
    images(selector = '.lazy-image', options = {}) {
      const defaultOptions = {
        rootMargin: '200px 0px',
        threshold: 0.01,
        placeholder: true
      };
      
      const config = { ...defaultOptions, ...options };
      const images = document.querySelectorAll(selector);
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              
              // Create a new image to preload
              const preloadImg = new Image();
              preloadImg.src = src;
              
              preloadImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
                
                // Hide placeholder if it exists
                if (config.placeholder) {
                  const placeholder = img.previousElementSibling;
                  if (placeholder && placeholder.classList.contains('placeholder-container')) {
                    placeholder.style.opacity = '0';
                  }
                }
              };
              
              imageObserver.unobserve(img);
            }
          });
        }, {
          rootMargin: config.rootMargin,
          threshold: config.threshold
        });
        
        images.forEach(img => {
          imageObserver.observe(img);
        });
      } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
          img.src = img.getAttribute('data-src');
          img.classList.add('fallback-loaded');
        });
      }
    },
    
    // Initialize lazy loading for components
    components(selector = '[data-lazy-component]', options = {}) {
      const defaultOptions = {
        rootMargin: '100px 0px',
        threshold: 0.1
      };
      
      const config = { ...defaultOptions, ...options };
      const components = document.querySelectorAll(selector);
      
      if ('IntersectionObserver' in window) {
        const componentObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const componentId = el.getAttribute('data-lazy-component');
              const componentUrl = el.getAttribute('data-component-url');
              
              // Show loading state
              el.innerHTML = ui.skeleton(1, 'card');
              
              // Fetch component
              fetch(componentUrl)
                .then(response => response.text())
                .then(html => {
                  // Delay to show transition
                  setTimeout(() => {
                    el.innerHTML = html;
                    
                    // Initialize any scripts
                    const scripts = el.querySelectorAll('script');
                    scripts.forEach(script => {
                      const newScript = document.createElement('script');
                      Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                      });
                      newScript.appendChild(document.createTextNode(script.innerHTML));
                      script.parentNode.replaceChild(newScript, script);
                    });
                    
                    // Remove lazy loading attributes
                    el.removeAttribute('data-lazy-component');
                    el.removeAttribute('data-component-url');
                    
                    // Add animation
                    el.classList.add('component-enter');
                    setTimeout(() => {
                      el.classList.remove('component-enter');
                    }, 300);
                  }, 500);
                })
                .catch(error => {
                  console.error('Error loading component:', error);
                  el.innerHTML = `<div class="error-message">Failed to load component</div>`;
                });
              
              componentObserver.unobserve(el);
            }
          });
        }, {
          rootMargin: config.rootMargin,
          threshold: config.threshold
        });
        
        components.forEach(component => {
          componentObserver.observe(component);
        });
      } else {
        // Fallback for browsers without IntersectionObserver
        components.forEach(el => {
          const componentUrl = el.getAttribute('data-component-url');
          
          fetch(componentUrl)
            .then(response => response.text())
            .then(html => {
              el.innerHTML = html;
              
              // Initialize any scripts
              const scripts = el.querySelectorAll('script');
              scripts.forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                  newScript.setAttribute(attr.name, attr.value);
                });
                newScript.appendChild(document.createTextNode(script.innerHTML));
                script.parentNode.replaceChild(newScript, script);
              });
            })
            .catch(error => {
              console.error('Error loading component:', error);
              el.innerHTML = `<div class="error-message">Failed to load component</div>`;
            });
        });
      }
    }
  };
  
  // Form handling utilities
  const forms = {
    // Initialize form validation
    initValidation(formId, options = {}) {
      const form = document.getElementById(formId);
      if (!form) return null;
      
      const defaultOptions = {
        errorClass: 'form-error',
        successClass: 'form-success',
        onSubmit: null
      };
      
      const config = { ...defaultOptions, ...options };
      
      // Add validation attributes
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label) {
          label.innerHTML += ' <span class="required">*</span>';
        }
      });
      
      // Handle form submission
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        const isValid = this.validateForm(form, config);
        
        if (isValid && config.onSubmit) {
          // Get form data
          const formData = new FormData(form);
          const data = {};
          
          for (let [key, value] of formData.entries()) {
            data[key] = value;
          }
          
          // Call onSubmit callback
          config.onSubmit(data, form);
        }
      });
      
      // Live validation on blur
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(field => {
        field.addEventListener('blur', () => {
          this.validateField(field, config);
        });
      });
      
      return {
        validate: () => this.validateForm(form, config),
        reset: () => form.reset(),
        getValues: () => {
          const formData = new FormData(form);
          const data = {};
          
          for (let [key, value] of formData.entries()) {
            data[key] = value;
          }
          
          return data;
        }
      };
    },
    
    // Validate a single field
    validateField(field, config) {
      // Remove existing error messages
      const existingError = field.parentNode.querySelector(`.${config.errorClass}`);
      if (existingError) {
        existingError.remove();
      }
      
      field.classList.remove(config.errorClass);
      field.classList.remove(config.successClass);
      
      // Check if field is required and empty
      if (field.hasAttribute('required') && !field.value.trim()) {
        this.showError(field, 'This field is required', config);
        return false;
      }
      
      // Check email format
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          this.showError(field, 'Please enter a valid email address', config);
          return false;
        }
      }
      
      // Check minimum length
      if (field.hasAttribute('minlength') && field.value.trim()) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (field.value.length < minLength) {
          this.showError(field, `Minimum length is ${minLength} characters`, config);
          return false;
        }
      }
      
      // Check pattern
      if (field.hasAttribute('pattern') && field.value.trim()) {
        const pattern = new RegExp(field.getAttribute('pattern'));
        if (!pattern.test(field.value)) {
          this.showError(field, field.getAttribute('data-error') || 'Please match the requested format', config);
          return false;
        }
      }
      
      // Field is valid
      field.classList.add(config.successClass);
      return true;
    },
    
    // Validate entire form
    validateForm(form, config) {
      const fields = form.querySelectorAll('input, textarea, select');
      let isValid = true;
      
      fields.forEach(field => {
        if (!this.validateField(field, config)) {
          isValid = false;
        }
      });
      
      return isValid;
    },
    
    // Show error message
    showError(field, message, config) {
      field.classList.add(config.errorClass);
      
      const errorElement = document.createElement('div');
      errorElement.className = config.errorClass;
      errorElement.textContent = message;
      
      field.parentNode.appendChild(errorElement);
    }
  };
  
  // Return public API
  return {
    state,
    component,
    router,
    ui,
    animation,
    lazyLoad,
    forms,
    
    // Initialize framework
    init() {
      // Add touch detection
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
      }
      
      // Initialize animations
      this.animation.animateOnScroll();
      
      // Initialize lazy loading
      this.lazyLoad.images();
      this.lazyLoad.components();
      
      // Add scroll detection for performance optimizations
      let isScrolling = false;
      window.addEventListener('scroll', () => {
        document.body.classList.add('is-scrolling');
        isScrolling = true;
        
        // Clear timeout if it exists
        if (window.scrollTimeout) {
          clearTimeout(window.scrollTimeout);
        }
        
        // Set timeout to remove class after scrolling stops
        window.scrollTimeout = setTimeout(() => {
          document.body.classList.remove('is-scrolling');
          isScrolling = false;
        }, 100);
      }, { passive: true });
      
      return this;
    }
  };
})();

// Initialize framework when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ModernFramework.init();
});