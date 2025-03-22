/**
 * Page Transitions and Animations
 * Smooth transitions between pages and sections
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize page transition system
  const PageTransitions = (function() {
    // DOM elements
    const body = document.body;
    let transitionElement = document.querySelector('.page-transition');
    
    // Create transition element if it doesn't exist
    if (!transitionElement) {
      transitionElement = document.createElement('div');
      transitionElement.className = 'page-transition';
      body.appendChild(transitionElement);
    }
    
    // Initialize
    function init() {
      // Add event listeners to all links that should trigger page transitions
      document.querySelectorAll('a[data-transition]').forEach(link => {
        link.addEventListener('click', handleLinkClick);
      });
      
      // Handle browser back/forward buttons
      window.addEventListener('popstate', handlePopState);
    }
    
    // Handle link clicks
    function handleLinkClick(e) {
      const link = e.currentTarget;
      const href = link.getAttribute('href');
      
      // Skip if modifier keys are pressed or it's an external link
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || isExternalLink(href)) {
        return;
      }
      
      e.preventDefault();
      
      // Get transition type
      const transitionType = link.getAttribute('data-transition') || 'default';
      
      // Perform page transition
      navigateTo(href, transitionType);
    }
    
    // Handle browser back/forward buttons
    function handlePopState(e) {
      // Perform page transition without animation
      loadPage(window.location.href, false);
    }
    
    // Navigate to a new page with transition
    function navigateTo(url, transitionType = 'default') {
      // Start transition animation
      startTransition(transitionType);
      
      // After animation completes, load the new page
      setTimeout(() => {
        // Update browser history
        window.history.pushState({}, '', url);
        
        // Load the new page
        loadPage(url, true);
      }, 600); // Match this with your CSS transition duration
    }
    
    // Start transition animation
    function startTransition(type) {
      // Add transition class based on type
      transitionElement.className = 'page-transition';
      transitionElement.classList.add(`transition-${type}`);
      
      // Trigger animation
      setTimeout(() => {
        transitionElement.classList.add('active');
      }, 50);
      
      // Prevent scrolling during transition
      body.style.overflow = 'hidden';
    }
    
    // End transition animation
    function endTransition() {
      transitionElement.classList.add('exit');
      
      setTimeout(() => {
        transitionElement.classList.remove('active', 'exit');
        transitionElement.className = 'page-transition';
        
        // Re-enable scrolling
        body.style.overflow = '';
      }, 600); // Match this with your CSS transition duration
    }
    
    // Load page content
    function loadPage(url, animate = true) {
      fetch(url)
        .then(response => response.text())
        .then(html => {
          // Parse the HTML string
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Get the new page content
          const newContent = doc.querySelector('main') || doc.querySelector('.main-content');
          
          if (newContent) {
            // Replace the current page content
            const currentContent = document.querySelector('main') || document.querySelector('.main-content');
            
            if (currentContent) {
              currentContent.innerHTML = newContent.innerHTML;
              
              // Update page title
              document.title = doc.title;
              
              // Initialize components on the new page
              initNewPageComponents();
              
              // End transition animation if needed
              if (animate) {
                endTransition();
              }
              
              // Scroll to top
              window.scrollTo(0, 0);
            }
          }
        })
        .catch(error => {
          console.error('Error loading page:', error);
          
          // Fallback: redirect without animation
          window.location.href = url;
        });
    }
    
    // Initialize components on the new page
    function initNewPageComponents() {
      // Re-initialize animations
      initAnimations();
      
      // Re-initialize lazy loading
      if (typeof ModernFramework !== 'undefined') {
        ModernFramework.lazyLoad.images();
        ModernFramework.lazyLoad.components();
      }
      
      // Re-initialize UI components
      if (typeof ModernUI !== 'undefined') {
        ModernUI.init();
      }
      
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('pageLoaded'));
    }
    
    // Check if a URL is external
    function isExternalLink(url) {
      if (!url) return false;
      
      // If the URL starts with http:// or https:// and doesn't contain the current hostname
      return (url.startsWith('http://') || url.startsWith('https://')) && 
             !url.includes(window.location.hostname);
    }
    
    // Return public API
    return {
      init,
      navigateTo
    };
  })();
  
  // Initialize page transitions
  PageTransitions.init();
  
  // Initialize animations
  initAnimations();
  
  // Initialize scroll progress indicator
  initScrollProgress();
});

// Initialize animations for elements
function initAnimations() {
  // Get all elements with data-animate attribute
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (animatedElements.length === 0) return;
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animated class when element is visible
        entry.target.classList.add('animated');
        
        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });
  
  // Observe each element
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Initialize stagger animations for lists
  const staggerLists = document.querySelectorAll('.stagger-list');
  
  staggerLists.forEach(list => {
    const listObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animated class when list is visible
          entry.target.classList.add('animated');
          
          // Stop observing after animation
          listObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    listObserver.observe(list);
  });
}

// Initialize scroll progress indicator
function initScrollProgress() {
  // Create progress bar if it doesn't exist
  let progressBar = document.querySelector('.progress-bar');
  
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
  }
  
  // Update progress bar width on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}