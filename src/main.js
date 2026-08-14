import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VanillaTilt from 'vanilla-tilt';

import { initSpaceScene } from './three-space.js';
import { renderSkills } from './skills-radar.js';
import { renderGitHubSection } from './github-stats.js';
import { sfx } from './audio-sys.js';

// Suppress third-party WebGL frame animation warnings
window.addEventListener('error', (event) => {
  if (event.message && (event.message.includes('position') || event.message.includes('spline'))) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return true;
  }
});

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER HUD ANIMATION SEQUENCE
  const preloader = document.getElementById('preloader');
  const progressFill = document.getElementById('loader-progress');
  const percentText = document.getElementById('loader-percent');

  let loadPercent = 0;
  const interval = setInterval(() => {
    loadPercent += Math.floor(Math.random() * 12) + 5;
    if (loadPercent >= 100) {
      loadPercent = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        initScrollAnimations();
      }, 400);
    }
    if (progressFill) progressFill.style.width = `${loadPercent}%`;
    if (percentText) percentText.textContent = `${loadPercent}%`;
  }, 40);

  // 2. INIT THREE.JS 3D SPACE CANVAS
  initSpaceScene();

  // 3. RENDER DYNAMIC SECTIONS
  renderSkills('all');
  renderGitHubSection();

  // 4. LENIS SMOOTH INERTIA SCROLLING
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize GSAP ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // 5. ANIMATED TYPING EFFECT (HERO SECTION)
  const typingElement = document.getElementById('typing-text');
  const roles = [
    '3D WebGL & Interactive Models',
    'AI & Smart Backend Services',
    'Frontend Web Applications',
    'Data Structures & Algorithms'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typingElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // 6. CUSTOM CURSOR GLOW TRAIL
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');

  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }
    if (cursorDot) {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    }
  });

  // SFX Hover Listeners on Buttons & Interactive Elements
  document.querySelectorAll('a, button, .glass-card, .skills-tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => sfx.playHover());
    el.addEventListener('click', () => sfx.playClick());
  });

  // 7. SOUND TOGGLE BUTTON
  const soundBtn = document.getElementById('sound-control');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = soundBtn ? soundBtn.querySelector('.sound-text') : null;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = sfx.toggle();
      if (active) {
        soundBtn.classList.add('active');
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high text-cyan';
        if (soundText) soundText.textContent = 'SFX ON';
        showToast('🔊 Sci-Fi SFX Audio Enabled!');
      } else {
        soundBtn.classList.remove('active');
        if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
        if (soundText) soundText.textContent = 'SFX OFF';
        showToast('🔇 Sci-Fi SFX Audio Muted');
      }
    });
  }

  // 8. STICKY NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Observer
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 9. MOBILE NAVIGATION MENU TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
      });
    });
  }

  // 10. SKILLS CATEGORY FILTER TABS
  const skillTabs = document.querySelectorAll('.skills-tab-btn');
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      renderSkills(category);
      // Re-initialize tilt on new elements
      initTilt();
    });
  });

  // 11. PROJECTS FILTER TABS
  const projectTabs = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 12. CONTACT FORM SUBMISSION & DIRECT INBOX DELIVERY TO keshavg408@gmail.com
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Message...';
      }

      const name = document.getElementById('contact-name')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const phone = document.getElementById('contact-phone')?.value || '';
      const subject = document.getElementById('contact-subject')?.value || 'Portfolio Inquiry';
      const message = document.getElementById('contact-message')?.value || '';

      const bodyText = `Hello Keshav,\n\n${message}\n\nSender Details:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}`;
      const mailtoUrl = `mailto:keshavg408@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      try {
        const response = await fetch("https://formsubmit.co/ajax/keshavg408@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            _subject: `🚀 New Transmission from Portfolio: ${subject}`,
            _template: "table",
            _captcha: "false"
          })
        });

        if (response.ok) {
          showToast('🚀 Transmission Delivered to keshavg408@gmail.com!');
          contactForm.reset();
        } else {
          // Fallback to mailto if endpoint returns error
          window.location.href = mailtoUrl;
          showToast('📬 Launching email client for transmission...');
        }
      } catch (err) {
        // Fallback to mailto link
        window.location.href = mailtoUrl;
        showToast('📬 Launching email client for transmission...');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Transmission';
        }
        sfx.playChirp(440, 1760, 0.3);
      }
    });
  }

  // Resume Download Buttons
  const resumeBtns = [
    document.getElementById('nav-resume-btn'),
    document.getElementById('hero-resume-btn'),
    document.getElementById('footer-resume-btn')
  ];

  resumeBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📄 Downloading Keshav Gupta Resume PDF...');
        sfx.playChirp(880, 1400, 0.2);
      });
    }
  });

  // Interactive Demo Modal Buttons
  document.querySelectorAll('.demo-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('⚡ Opening Live Project Telemetry Environment...');
    });
  });

  // 13. VANILLA TILT CARDS
  function initTilt() {
    VanillaTilt.init(document.querySelectorAll(".tilt-element"), {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.25,
    });
  }
  initTilt();

  // 14. GSAP SCROLLTRIGGER REVEAL ANIMATIONS & COUNTERS
  function initScrollAnimations() {
    // Fade Up Reveal for Section Headers & Cards
    gsap.utils.toArray('.glass-card, .section-header').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Timeline Node Animations
    gsap.utils.toArray('.timeline-item').forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
        },
        x: item.classList.contains('right') ? 60 : -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    });

    // Timeline Line Fill Animation
    gsap.to('#timeline-progress', {
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: true,
      },
      height: '100%',
      ease: 'none',
    });

    // Animated Statistics Counters
    gsap.utils.toArray('.counter').forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      gsap.to(counter, {
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          once: true,
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power2.out',
      });
    });
  }
});

// Toast Helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-atom text-cyan"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
