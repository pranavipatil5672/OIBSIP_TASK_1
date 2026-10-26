/**
 * ApexPulse - Modern Landing Page Scripts
 * Oasis Infobyte Web Development Internship - Task 1
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const counters = document.querySelectorAll('.counter');
  const pricingToggle = document.getElementById('pricing-toggle');
  const priceValues = document.querySelectorAll('.price-value');
  const faqItems = document.querySelectorAll('.faq-item');
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const toast = document.getElementById('toast');
  const demoBtn = document.getElementById('demo-btn');
  const demoModal = document.getElementById('demo-modal');
  const modalClose = document.getElementById('modal-close');

  /* -------------------------------------------------------------------------
     1. Sticky Header & Back to Top Visibility
     ------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header blur effect
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* -------------------------------------------------------------------------
     2. Mobile Navigation Toggle
     ------------------------------------------------------------------------- */
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile nav when clicking any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', false);
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', false);
    }
  });

  /* -------------------------------------------------------------------------
     3. Active Nav Link on Scroll (Intersection Observer)
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  /* -------------------------------------------------------------------------
     4. Animated Statistics Counter
     ------------------------------------------------------------------------- */
  let countersAnimated = false;
  const metricsSection = document.querySelector('.hero-metrics');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 2000; // ms
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = easeProgress * target;

            counter.innerText = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target;
            }
          };

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.5 });

  if (metricsSection) {
    counterObserver.observe(metricsSection);
  }

  /* -------------------------------------------------------------------------
     5. Pricing Switcher (Monthly vs Annual)
     ------------------------------------------------------------------------- */
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.checked;
      priceValues.forEach(priceEl => {
        const monthly = priceEl.getAttribute('data-monthly');
        const annual = priceEl.getAttribute('data-annual');
        
        priceEl.style.opacity = '0';
        priceEl.style.transform = 'translateY(-10px)';

        setTimeout(() => {
          priceEl.textContent = isAnnual ? annual : monthly;
          priceEl.style.opacity = '1';
          priceEl.style.transform = 'translateY(0)';
        }, 150);
      });
    });
  }

  /* -------------------------------------------------------------------------
     6. FAQ Accordion
     ------------------------------------------------------------------------- */
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  /* -------------------------------------------------------------------------
     7. Interactive Demo Modal
     ------------------------------------------------------------------------- */
  if (demoBtn && demoModal && modalClose) {
    demoBtn.addEventListener('click', () => {
      demoModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      demoModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);

    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !demoModal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  /* -------------------------------------------------------------------------
     8. Toast Notification Helper
     ------------------------------------------------------------------------- */
  let toastTimer;
  function showToast(message, isSuccess = true) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    const iconEl = toast.querySelector('.toast-icon');

    msgEl.textContent = message;
    iconEl.innerHTML = isSuccess 
      ? '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>' 
      : '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>';
    toast.style.borderColor = isSuccess ? '#10b981' : '#ef4444';

    toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  /* -------------------------------------------------------------------------
     9. Contact Form Validation & Submission
     ------------------------------------------------------------------------- */
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateField(input, condition, errorMsgId) {
      const group = input.closest('.form-group');
      if (!condition) {
        group.classList.add('has-error');
        return false;
      } else {
        group.classList.remove('has-error');
        return true;
      }
    }

    // Input listeners to clear error dynamically
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2, 'name-error');
      const isEmailValid = validateField(emailInput, emailPattern.test(emailInput.value.trim()), 'email-error');
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 2, 'subject-error');
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10, 'message-error');

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');

        // Simulate API call
        setTimeout(() => {
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
          contactForm.reset();
          showToast(`Thank you, ${nameInput.value.trim() || 'friend'}! We received your message and will respond shortly.`);
        }, 1200);
      }
    });
  }

  /* -------------------------------------------------------------------------
     10. Newsletter Form Validation
     ------------------------------------------------------------------------- */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const val = emailInput.value.trim();
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (emailPattern.test(val)) {
        showToast('Subscribed! Welcome to the ApexPulse weekly insights.');
        newsletterForm.reset();
      } else {
        showToast('Please enter a valid email address.', false);
      }
    });
  }
});
