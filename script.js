document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-list a');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.setAttribute('data-state', !isOpen ? 'open' : 'closed');
    });
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = document.getElementById(href.substring(1));
          
          if (target) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('data-state', 'closed');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('data-state', 'closed');
      }
    });
  }

  const billingToggle = document.querySelector('.billing-toggle');
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const pricingGrid = document.querySelector('.pricing-grid');
  
  if (billingToggle && toggleButtons.length && pricingGrid) {
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.billing;
        
        billingToggle.setAttribute('data-mode', mode);
        
        toggleButtons.forEach(b => {
          b.setAttribute('aria-pressed', b.dataset.billing === mode);
        });
        
        const amounts = pricingGrid.querySelectorAll('.amount');
        const intervals = pricingGrid.querySelectorAll('.interval');
        
        amounts.forEach(el => {
          const monthly = el.getAttribute('data-monthly');
          const yearly = el.getAttribute('data-yearly');
          el.textContent = mode === 'yearly' ? yearly : monthly;
        });
        
        intervals.forEach(el => {
          el.textContent = mode === 'yearly' ? '/yr' : '/mo';
        });
        
        pricingGrid.setAttribute('data-billing', mode);
      });
    });
  }

  const accordionButtons = document.querySelectorAll('.accordion');
  
  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const region = document.getElementById(btn.getAttribute('aria-controls'));
      
      if (!region) return;
      
      accordionButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          const otherRegion = document.getElementById(otherBtn.getAttribute('aria-controls'));
          if (otherRegion && !otherRegion.hidden) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherRegion.hidden = true;
          }
        }
      });
      
      btn.setAttribute('aria-expanded', !isExpanded);
      region.hidden = isExpanded;
    });
  });

  const countdownContainer = document.querySelector('.countdown');
  
  if (countdownContainer) {
    const targetDate = new Date(countdownContainer.getAttribute('data-target')).getTime();
    
    function updateCountdown() {
      const now = Date.now();
      const diff = Math.max(now - targetDate, targetDate - now);
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const daysEl = countdownContainer.querySelector('[data-unit="days"]');
      const hoursEl = countdownContainer.querySelector('[data-unit="hours"]');
      const minutesEl = countdownContainer.querySelector('[data-unit="minutes"]');
      const secondsEl = countdownContainer.querySelector('[data-unit="seconds"]');
      
      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
      
      if (diff <= 0) {
        clearInterval(countdownInterval);
      }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
  }
  
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    const savedTheme = localStorage.getItem('vibrant-theme');
    const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    themeToggle.setAttribute('aria-pressed', initialTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', next);
      themeToggle.setAttribute('aria-pressed', next === 'dark');
      localStorage.setItem('vibrant-theme', next);
    });
    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const saved = localStorage.getItem('vibrant-theme');
        if (!saved) {
          const theme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', theme);
          themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
      });
    }
  }

  const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (revealElements.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.hasAttribute('data-reveal')) {
            entry.target.classList.add('is-visible');
          }
          
          if (entry.target.hasAttribute('data-reveal-group')) {
            Array.from(entry.target.children).forEach(child => {
              child.classList.add('reveal', 'is-visible');
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    });
    
    revealElements.forEach(el => {
      if (el.hasAttribute('data-reveal')) {
        el.classList.add('reveal');
      }
      
      if (el.hasAttribute('data-reveal-group')) {
        Array.from(el.children).forEach(child => {
          child.classList.add('reveal');
        });
      }
      
      observer.observe(el);
    });
  } else {
    revealElements.forEach(el => {
      if (el.hasAttribute('data-reveal')) {
        el.classList.add('is-visible');
      }
      if (el.hasAttribute('data-reveal-group')) {
        Array.from(el.children).forEach(child => {
          child.classList.add('is-visible');
        });
      }
    });
  }

  const vibeEditor = document.querySelector('[data-vibe-editor]');
  if (vibeEditor) {
    const aboutSection = document.querySelector('#what-are-we');
    const typedEl = vibeEditor.querySelector('[data-typed]');
    const caret = vibeEditor.querySelector('.caret');
    const loadingLine = vibeEditor.querySelector('[data-step="loading"]');
    const resultLines = vibeEditor.querySelectorAll('[data-step="result"]');
    const queryLine = vibeEditor.querySelector('[data-step="query"]');

    const queryText = '> best cursor for flow + fast ui';

    function typeText(text, target, speed = 12) {
      return new Promise(resolve => {
        let i = 0;
        const tick = () => {
          if (i <= text.length) {
            target.textContent = text.slice(0, i);
            i += 1;
            setTimeout(tick, speed);
          } else {
            setTimeout(resolve, 1000);
          }
        };
        tick();
      });
    }

    function runSequence() {
      if (!typedEl || !loadingLine || !resultLines.length || !queryLine) return;

      typedEl.textContent = '';
      resultLines.forEach(line => {
        line.hidden = true;
        line.style.display = 'none';
      });
      loadingLine.hidden = true;
      loadingLine.style.display = 'none';
      queryLine.hidden = false;
      queryLine.style.display = 'block';
      if (caret) caret.style.display = 'inline-block';

      typeText(queryText, typedEl).then(() => {
        if (caret) caret.style.display = 'none';
        queryLine.hidden = true;
        queryLine.style.display = 'none';
        loadingLine.hidden = false;
        loadingLine.style.display = 'block';
        
        setTimeout(() => {
          loadingLine.hidden = true;
          loadingLine.style.display = 'none';
          
          resultLines.forEach(line => {
            line.hidden = false;
            line.style.display = 'block';
          });
        }, 3000);
      });
    }

    let started = false;
    const startIfVisible = () => {
      if (started) return;
      const rect = aboutSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        started = true;
        runSequence();
      }
    };

    document.addEventListener('scroll', startIfVisible, { passive: true });
    startIfVisible();
  }
});