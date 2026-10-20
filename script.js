/**
 * Bright Future Public School — Official JavaScript
 * Pure Vanilla JavaScript (ES6)
 * Features: Dark Mode, Filterable Academics & Gallery, Lightbox,
 * Countdown Timer, Animated Counters, Admission Form Validation,
 * Testimonial Slider, Modals, PWA Service Worker registration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Loading Screen Dismissal
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => loadingScreen.remove(), 500);
    }, 450);
  }

  // 2. Scroll Progress Bar & Sticky Header
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Dark Mode Toggle
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('bfps-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bfps-theme', theme);
    updateThemeIcons(theme);
  };

  const updateThemeIcons = (theme) => {
    themeToggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
        btn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        btn.setAttribute('aria-label', 'Switch to dark mode');
      }
    });
  };

  // Initial theme
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  // 4. Mobile Menu Drawer
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.add('open');
      mobileDrawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileMenu = () => {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.remove('open');
      mobileDrawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileMenu);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 5. Active Nav Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.main-nav .nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // 6. Academics Class Filtering
  const classFilterBtns = document.querySelectorAll('.academic-filter-bar .filter-btn');
  const classCards = document.querySelectorAll('.class-card');

  classFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      classFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      classCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Gallery Filter & Lightbox
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
  const lightboxPrevBtn = document.querySelector('.lightbox-prev-btn');
  const lightboxNextBtn = document.querySelector('.lightbox-next-btn');

  let currentGalleryIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const tag = item.getAttribute('data-category');
        if (filterVal === 'all' || tag === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  const showLightboxImage = (index) => {
    const items = visibleGalleryItems();
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentGalleryIndex = index;

    const item = items[index];
    const imgSrc = item.getAttribute('data-full') || item.querySelector('img').src;
    const captionText = item.getAttribute('data-title') || item.querySelector('img').alt;

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxCaption) lightboxCaption.textContent = captionText;
    if (lightboxModal) lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleGalleryItems();
      const idx = items.indexOf(item);
      showLightboxImage(idx >= 0 ? idx : 0);
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => showLightboxImage(currentGalleryIndex - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => showLightboxImage(currentGalleryIndex + 1));

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentGalleryIndex + 1);
  });

  // 8. Event Countdown Timer
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  // Target event: 2 weeks from now
  const eventTargetDate = new Date();
  eventTargetDate.setDate(eventTargetDate.getDate() + 14);
  eventTargetDate.setHours(9, 0, 0, 0);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = eventTargetDate.getTime() - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 9. Animated Counters on Scroll
  const counters = document.querySelectorAll('.counter-value[data-target]');
  let countersAnimated = false;

  const runCounterAnimation = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  };

  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounterAnimation();
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(counters[0].closest('.achievements-grid') || counters[0]);
  } else {
    runCounterAnimation();
  }

  // 10. Testimonials Carousel Slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevSlideBtn = document.getElementById('test-prev-btn');
  const nextSlideBtn = document.getElementById('test-next-btn');
  let currentSlide = 0;
  let slideInterval = null;

  const goToSlide = (index) => {
    if (!slides.length) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;

    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5500);
  };

  const stopAutoSlide = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoSlide();
    });
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoSlide();
    });
  });

  const testimonialWrapper = document.querySelector('.testimonials-wrapper');
  if (testimonialWrapper) {
    testimonialWrapper.addEventListener('mouseenter', stopAutoSlide);
    testimonialWrapper.addEventListener('mouseleave', startAutoSlide);
    startAutoSlide();
  }

  // 11. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items for clean accordion UX
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
            otherItem.querySelector('.faq-answer-panel').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          answerPanel.style.maxHeight = null;
        } else {
          item.classList.add('open');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
        }
      });
    }
  });

  // 12. Photo Upload Preview in Admission Form
  const photoInput = document.getElementById('student-photo-input');
  const photoUploadZone = document.getElementById('photo-upload-zone');
  const photoPreviewImg = document.getElementById('photo-preview-img');
  const uploadPromptText = document.getElementById('upload-prompt-text');

  if (photoUploadZone && photoInput) {
    photoUploadZone.addEventListener('click', () => photoInput.click());

    photoUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      photoUploadZone.style.borderColor = 'var(--color-primary)';
      photoUploadZone.style.backgroundColor = 'var(--color-primary-light)';
    });

    photoUploadZone.addEventListener('dragleave', () => {
      photoUploadZone.style.borderColor = '';
      photoUploadZone.style.backgroundColor = '';
    });

    photoUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      photoUploadZone.style.borderColor = '';
      photoUploadZone.style.backgroundColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        photoInput.files = e.dataTransfer.files;
        handlePhotoFile(e.dataTransfer.files[0]);
      }
    });

    photoInput.addEventListener('change', () => {
      if (photoInput.files && photoInput.files[0]) {
        handlePhotoFile(photoInput.files[0]);
      }
    });
  }

  function handlePhotoFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (photoPreviewImg) {
        photoPreviewImg.src = e.target.result;
        photoPreviewImg.style.display = 'block';
      }
      if (uploadPromptText) {
        uploadPromptText.textContent = `Selected: ${file.name}`;
      }
    };
    reader.readAsDataURL(file);
  }

  // 13. Online Admission Form Validation & Submission
  const admissionForm = document.getElementById('admission-form');
  const admissionSuccessModal = document.getElementById('admission-success-modal');
  const successRefNumber = document.getElementById('success-ref-number');
  const successStudentName = document.getElementById('success-student-name');
  const successClass = document.getElementById('success-class');

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = admissionForm.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const errorEl = input.parentElement.querySelector('.field-error');
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          if (errorEl) errorEl.classList.add('active');
        } else {
          input.classList.remove('error');
          if (errorEl) errorEl.classList.remove('active');
        }

        // Specific phone format check (10 digits)
        if (input.type === 'tel' && input.value.trim()) {
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(input.value.replace(/[\s-]/g, ''))) {
            isValid = false;
            input.classList.add('error');
            if (errorEl) {
              errorEl.textContent = 'Please enter a valid 10-digit phone number';
              errorEl.classList.add('active');
            }
          }
        }

        // Email check
        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            input.classList.add('error');
            if (errorEl) {
              errorEl.textContent = 'Please enter a valid email address';
              errorEl.classList.add('active');
            }
          }
        }
      });

      if (!isValid) {
        const firstError = admissionForm.querySelector('.form-control.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Show submitting state
      const submitBtn = admissionForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="loader-spinner" style="width:18px;height:18px;border-width:2px;margin:0;" viewBox="0 0 24 24"></svg>
        <span>Processing Application...</span>
      `;

      setTimeout(() => {
        // Generate Unique Application ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const refId = `BFPS-2026-${randomNum}`;

        const studentNameVal = document.getElementById('student-name')?.value || 'Student';
        const classVal = document.getElementById('applying-class')?.value || 'Nursery';

        if (successRefNumber) successRefNumber.textContent = refId;
        if (successStudentName) successStudentName.textContent = studentNameVal;
        if (successClass) successClass.textContent = classVal;

        // Reset submit button & form
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        admissionForm.reset();
        if (photoPreviewImg) photoPreviewImg.style.display = 'none';
        if (uploadPromptText) uploadPromptText.textContent = 'Click to browse or drag & drop student photograph';

        // Open Success Modal
        if (admissionSuccessModal) {
          admissionSuccessModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }, 900);
    });
  }

  // Generic Modal Close
  document.querySelectorAll('.modal-close-btn, .modal-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.site-modal').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  // Print Receipt Button inside modal
  const printReceiptBtn = document.getElementById('print-receipt-btn');
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 14. Virtual Tour & Brochure Modals
  const virtualTourBtn = document.getElementById('virtual-tour-btn');
  const virtualTourModal = document.getElementById('virtual-tour-modal');
  if (virtualTourBtn && virtualTourModal) {
    virtualTourBtn.addEventListener('click', () => {
      virtualTourModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  const brochureBtn = document.getElementById('brochure-download-btn');
  const brochureModal = document.getElementById('brochure-modal');
  if (brochureBtn && brochureModal) {
    brochureBtn.addEventListener('click', () => {
      brochureModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // 15. Contact Form Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sendBtn = contactForm.querySelector('button[type="submit"]');
      const origText = sendBtn.textContent;
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending Message...';

      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = origText;
        contactForm.reset();
        showToast('Thank you! Your message has been sent to our admissions desk. We will get back to you shortly.');
      }, 700);
    });
  }

  // 16. Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Thank you! ${input.value} has been subscribed to school newsletters & announcements.`);
        newsletterForm.reset();
      }
    });
  }

  // Simple Clean Toast Notification
  function showToast(message) {
    const existingToast = document.querySelector('.site-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background-color: var(--text-heading);
      color: var(--bg-surface);
      padding: 12px 24px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 3000;
      opacity: 0;
      transition: all 250ms ease;
      max-width: 90vw;
      text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 17. Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('Service Worker Registered successfully:', reg.scope))
        .catch((err) => console.log('Service Worker Registration error:', err));
    });
  }

  // 18. PWA Install Prompt Handler
  let deferredPrompt;
  const installAppBtn = document.getElementById('pwa-install-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installAppBtn) {
      installAppBtn.style.display = 'inline-flex';
    }
  });

  if (installAppBtn) {
    installAppBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
        installAppBtn.style.display = 'none';
      }
    });
  }
});
