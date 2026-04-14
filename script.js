/* ============================================================
   script.js — WorkIndulge Community Landing Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     ANIMATED SPHERE — Hero section right side
     ============================================================ */
  const sphereCanvas = document.getElementById('sphereCanvas');
  if (sphereCanvas) {
    const ctx = sphereCanvas.getContext('2d');
    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";
    let time = 0;
    let frameId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = sphereCanvas.getBoundingClientRect();
      sphereCanvas.width = rect.width * dpr;
      sphereCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = sphereCanvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const isMobile = window.innerWidth < 768;
      const radius = Math.min(rect.width, rect.height) * 0.5;
      const phiStep = isMobile ? 0.2 : 0.18;
      const thetaStep = isMobile ? 0.2 : 0.18;
      const alphaMultiplier = isMobile ? 0.5 : 0.6;

      // Add movement across space
      const moveX = Math.sin(time * 0.15) * (rect.width * 0.15);
      const moveY = Math.cos(time * 0.12) * (rect.height * 0.1);
      const centerX = rect.width / 2 + moveX;
      const centerY = rect.height / 2 + moveY;

      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points = [];

      // Generate sphere points
      for (let phi = 0; phi < Math.PI * 2; phi += phiStep) {
        for (let theta = 0; theta < Math.PI; theta += thetaStep) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
          const z = Math.cos(theta);

          // Rotate around Y axis
          const rotY = time * 0.3;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X axis
          const rotX = time * 0.2;
          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const depth = (finalZ + 1) / 2;
          const charIndex = Math.floor(depth * (chars.length - 1));

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: chars[charIndex],
          });
        }
      }

      // Sort by z for depth
      points.sort((a, b) => a.z - b.z);

      // Draw points with reduced intensity
      points.forEach((point) => {
        const alpha = (0.15 + (point.z + 1) * 0.3) * alphaMultiplier;
        ctx.fillStyle = `rgba(28, 26, 22, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      time += 0.02;
      frameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    });
  }

  /* ============================================================
     NAVIGATION — scroll transform + mobile menu
     ============================================================ */
  const mainNav  = document.getElementById('main-nav');
  const menuBtn  = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }, { passive: true });

  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    mainNav.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.innerHTML = open
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mainNav.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      menuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
  });

  /* ============================================================
     HERO — animate in + rotating word
     ============================================================ */
  const heroSection = document.getElementById('hero');
  // Trigger visible after tiny delay
  requestAnimationFrame(() => {
    heroSection.classList.add('hero-visible');
  });

  const heroWordEl = document.getElementById('hero-animated-word');
  const words = ['innovate', 'build', 'deploy', 'learn'];
  let wordIndex = 0;

  function renderWord(word) {
    heroWordEl.innerHTML = '';
    word.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.animationDelay = `${i * 50}ms`;
      heroWordEl.appendChild(span);
    });
  }
  renderWord(words[0]);

  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    renderWord(words[wordIndex]);
  }, 2500);

  /* ============================================================
     HERO GRID LINES — generated
     ============================================================ */
  const gridEl = document.getElementById('hero-grid');
  for (let i = 1; i <= 8; i++) {
    const h = document.createElement('div');
    h.className = 'hero-grid-h';
    h.style.top = `${12.5 * i}%`;
    gridEl.appendChild(h);
  }
  for (let i = 1; i <= 12; i++) {
    const v = document.createElement('div');
    v.className = 'hero-grid-v';
    v.style.left = `${8.33 * i}%`;
    gridEl.appendChild(v);
  }

  /* ============================================================
     SCROLL REVEAL — IntersectionObserver
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-x-left, .reveal-x-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     HOW IT WORKS — step tabs + code animation
     ============================================================ */
  const hiwSteps    = document.querySelectorAll('.hiw-step');
  const hiwCodeBody = document.getElementById('hiw-code-body');
  const hiwCodes = [
    `import { workindulge } from '@workindulge/core'\n\nworkindulge.explore({\n  domains: ['AI', 'Web', 'IoT'],\n  level: 'beginner-to-advanced'\n})`,
    `workindulge.project.create({\n  name: 'ai-health-predictor',\n  stack: ['Python', 'TensorFlow'],\n  team: ['@student1', '@student2'],\n  type: 'collaborative'\n})`,
    `workindulge.deploy({\n  target: 'production',\n  portfolio: true\n})\n\n// Live at: workindulge.dev/projects/ai-health`
  ];
  let activeStep = 0;
  let hiwInterval;

  function renderHiwCode(code, stepIndex) {
    hiwCodeBody.innerHTML = '<pre>' + code.split('\n').map((line, li) => {
      const lineNum = `<span class="code-linenum">${li + 1}</span>`;
      const chars = Array.from(line).map((char, ci) => {
        const delay = li * 80 + ci * 15;
        const c = char === ' ' ? '\u00A0' : char.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<span class="code-char-reveal" style="animation-delay:${delay}ms">${c}</span>`;
      }).join('');
      const delay = li * 80;
      return `<div class="code-line-reveal" style="animation-delay:${delay}ms">${lineNum}<span class="inline-flex">${chars}</span></div>`;
    }).join('') + '</pre>';
  }

  function setHiwStep(idx) {
    hiwSteps.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
    renderHiwCode(hiwCodes[idx], idx);
    activeStep = idx;
  }

  hiwSteps.forEach((step, i) => {
    step.addEventListener('click', () => {
      clearInterval(hiwInterval);
      setHiwStep(i);
      startHiwInterval();
    });
  });

  function startHiwInterval() {
    hiwInterval = setInterval(() => {
      const next = (activeStep + 1) % hiwSteps.length;
      setHiwStep(next);
    }, 5000);
  }

  setHiwStep(0);
  startHiwInterval();

  /* ============================================================
     COUNTER ANIMATION — for hero stats bar
     ============================================================ */
  function animateCounter(el, end) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * end).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.end, 10));
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animated-counter').forEach(el => counterObserver.observe(el));

  /* ============================================================
     TESTIMONIALS — rotating
     ============================================================ */
  const testimonials = [
    {
      quote: "WorkIndulge gave me the confidence to build real AI projects. My portfolio landed me an internship at a top startup.",
      author: "Priya Sharma",
      role: "CS Student",
      company: "IIT Delhi",
      metric: "3 projects deployed"
    },
    {
      quote: "The collaborative environment is incredible. I teamed up with students worldwide and built a health prediction app in just 2 weeks.",
      author: "Arjun Mehta",
      role: "Engineering Student",
      company: "BITS Pilani",
      metric: "5 team projects"
    },
    {
      quote: "From zero AI knowledge to deploying a production ML model. WorkIndulge made the impossible feel achievable.",
      author: "Sneha Reddy",
      role: "Data Science Student",
      company: "NIT Trichy",
      metric: "AI domain certified"
    }
  ];

  const quoteEl     = document.getElementById('testimonial-quote');
  const authorEl    = document.getElementById('testimonial-author');
  const metricEl    = document.getElementById('testimonial-metric');
  const counterEl   = document.getElementById('testimonial-counter');
  const dotsEl      = document.getElementById('testimonial-dots');
  let activeTestimonial = 0;

  function renderDots() {
    dotsEl.innerHTML = testimonials.map((_, i) =>
      `<button class="testimonial-dot ${i === activeTestimonial ? 'active' : ''}" data-idx="${i}" aria-label="Testimonial ${i+1}"></button>`
    ).join('');
    dotsEl.querySelectorAll('.testimonial-dot').forEach(btn => {
      btn.addEventListener('click', () => goToTestimonial(parseInt(btn.dataset.idx, 10)));
    });
  }

  function renderTestimonial(t) {
    if(!quoteEl) return;
    const pTag = quoteEl.querySelector('p');
    if(pTag) pTag.textContent = `"${t.quote}"`;
    
    const avatarEl = document.getElementById('t-avatar');
    if(avatarEl) avatarEl.textContent = t.author.charAt(0);
    
    const nameEl = document.getElementById('t-name');
    if(nameEl) nameEl.textContent = t.author;
    
    const roleEl = document.getElementById('t-role');
    if(roleEl) roleEl.textContent = `${t.role}, ${t.company}`;
    
    const valEl = metricEl.querySelector('.metric-result-value');
    if(valEl) valEl.textContent = t.metric;
    
    if(counterEl) counterEl.textContent = `${String(activeTestimonial + 1).padStart(2,'0')} / ${String(testimonials.length).padStart(2,'0')}`;
    renderDots();
  }

  function goToTestimonial(idx) {
    if(!quoteEl || !authorEl || !metricEl) return;
    quoteEl.classList.add('animating');
    authorEl.classList.add('animating');
    metricEl.classList.add('animating');
    setTimeout(() => {
      activeTestimonial = idx;
      renderTestimonial(testimonials[idx]);
      quoteEl.classList.remove('animating');
      authorEl.classList.remove('animating');
      metricEl.classList.remove('animating');
    }, 300);
  }

  if(document.getElementById('testimonial-quote')){
     renderTestimonial(testimonials[0]);
     setInterval(() => {
       goToTestimonial((activeTestimonial + 1) % testimonials.length);
     }, 5000);
  }
  /* ============================================================
     CTA — spotlight mouse follow
     ============================================================ */
  const ctaBox = document.getElementById('cta-box');
  const ctaSpotlight = document.getElementById('cta-spotlight');

  if (ctaBox && ctaSpotlight) {
    ctaBox.addEventListener('mousemove', (e) => {
      const rect = ctaBox.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ctaSpotlight.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(0,0,0,0.15), transparent 40%)`;
    });

    // Reveal CTA box on scroll
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) ctaBox.classList.remove('hidden');
      });
    }, { threshold: 0.2 });
    ctaObserver.observe(ctaBox);
  }

  /* ============================================================
     SECURITY — staggered badge + card reveal
     ============================================================ */
  const securityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.security-badge').forEach((badge, i) => {
          badge.style.transitionDelay = `${i * 50 + 200}ms`;
          badge.style.opacity = '1';
          badge.style.transform = 'translateY(0)';
        });
        entry.target.querySelectorAll('.security-card').forEach((card, i) => {
          card.style.transitionDelay = `${i * 100}ms`;
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
        });
      }
    });
  }, { threshold: 0.1 });

  const secSection = document.getElementById('security');
  if (secSection) {
    secSection.querySelectorAll('.security-badge').forEach(b => {
      b.style.opacity = '0'; b.style.transform = 'translateY(16px)'; b.style.transition = 'opacity 0.5s, transform 0.5s';
    });
    secSection.querySelectorAll('.security-card').forEach(c => {
      c.style.opacity = '0'; c.style.transform = 'translateX(32px)'; c.style.transition = 'opacity 0.5s, transform 0.5s, border-color 0.3s';
    });
    securityObserver.observe(secSection);
  }

  /* ============================================================
     DUPLICATE MARQUEE CONTENT
     Each .marquee-inner-dupe should be cloned to fill at least 2× width
     ============================================================ */
  document.querySelectorAll('.marquee-needs-clone').forEach(track => {
    const inner = track.querySelector('.marquee-inner, .marquee-inner-reverse');
    if (inner) {
      const clone = inner.cloneNode(true);
      track.appendChild(clone);
    }
  });

});