/* ============================================================
   community.js — WorkIndulge Community Promotion Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     HERO — animate in + rotating word (like landing page)
     ============================================================ */
  const promoHeroSection = document.getElementById('promo-hero');
  // Trigger visible after tiny delay
  requestAnimationFrame(() => {
    promoHeroSection.classList.add('hero-visible');
  });

  const promoWordEl = document.getElementById('promo-animated-word');
  const promoWords = ['building?', 'creating?', 'shipping?', 'deploying?'];
  let promoWordIndex = 0;

  function renderPromoWord(word) {
    promoWordEl.innerHTML = '';
    word.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.animationDelay = `${i * 50}ms`;
      promoWordEl.appendChild(span);
    });
  }
  renderPromoWord(promoWords[0]);

  setInterval(() => {
    promoWordIndex = (promoWordIndex + 1) % promoWords.length;
    renderPromoWord(promoWords[promoWordIndex]);
  }, 2500);

  /* ============================================================
     NAVIGATION — scroll transform + mobile menu
     (same logic as script.js so the shared nav works correctly)
     ============================================================ */
  const mainNav    = document.getElementById('main-nav');
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  const ICON_HAMBURGER = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`;
  const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>`;

  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    mainNav.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    menuBtn.innerHTML = open ? ICON_CLOSE : ICON_HAMBURGER;
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mainNav.classList.remove('menu-open');
      document.body.style.overflow = '';
      menuBtn.innerHTML = ICON_HAMBURGER;
    });
  });


  /* ============================================================
     HERO GRID LINES — generated
     ============================================================ */
  const gridEl = document.getElementById('promo-hero-grid');
  if (gridEl) {
    for (let i = 1; i <= 8; i++) {
      const h = document.createElement('div');
      h.className = 'promo-hero-grid-h';
      h.style.top = `${12.5 * i}%`;
      gridEl.appendChild(h);
    }
    for (let i = 1; i <= 12; i++) {
      const v = document.createElement('div');
      v.className = 'promo-hero-grid-v';
      v.style.left = `${8.33 * i}%`;
      gridEl.appendChild(v);
    }
  }


  /* ============================================================
     SCROLL REVEAL — IntersectionObserver (enhanced from landing page)
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-x-left, .reveal-x-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Additional reveal for elements that need staggered animation
  document.querySelectorAll('.problem-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    revealObserver.observe(el);
  });

  document.querySelectorAll('.solution-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    revealObserver.observe(el);
  });

  document.querySelectorAll('.for-who-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    revealObserver.observe(el);
  });


  /* ============================================================
     OUTCOME ROWS — staggered reveal
     ============================================================ */
  const outcomeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.outcome-row').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    outcomeObserver.observe(el);
  });


  /* ============================================================
     HOW IT WORKS — interactive step tabs
     ============================================================ */
  const promoSteps = document.querySelectorAll('.promo-step');
  const phvContent = document.getElementById('phv-content');
  const phvDots    = document.getElementById('phv-dots');

  const stepData = [
    {
      badge:   '01 / Join',
      heading: 'Sign up in seconds.',
      body:    'Create your profile, browse open projects, and pick the domain you want to build in. AI, Web, IoT, Fintech — it\'s all here.',
    },
    {
      badge:   '02 / Build',
      heading: 'Write real code from day one.',
      body:    'No fake projects. No tutorial clones. You\'re contributing to real codebases with teammates and mentor guidance from the start.',
    },
    {
      badge:   '03 / Collaborate',
      heading: 'Work like a pro dev team.',
      body:    'Daily standups, code reviews, PR merges. You\'ll learn the collaboration skills that matter most in your first job.',
    },
    {
      badge:   '04 / Deploy',
      heading: 'Ship it. Own it.',
      body:    'Deploy your project to production and earn a verified portfolio entry. Something you\'re proud to show recruiters and teammates.',
    },
  ];

  let activePromoStep = 0;
  let promoStepInterval;

  function buildDots() {
    if (!phvDots) return;
    phvDots.innerHTML = '';
    stepData.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'phv-dot' + (i === activePromoStep ? ' active' : '');
      d.addEventListener('click', () => {
        clearInterval(promoStepInterval);
        setPromoStep(i);
        startPromoInterval();
      });
      phvDots.appendChild(d);
    });
  }

  function setPromoStep(idx) {
    if (!phvContent) return;
    phvContent.classList.add('out');

    setTimeout(() => {
      promoSteps.forEach((s, i) => s.classList.toggle('active', i === idx));

      const d = stepData[idx];
      phvContent.innerHTML = `
        <div class="phv-step-badge">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--foreground);display:inline-block;flex-shrink:0;"></span>
          ${d.badge}
        </div>
        <h3 class="phv-step-heading">${d.heading}</h3>
        <p class="phv-step-body">${d.body}</p>
      `;

      activePromoStep = idx;
      buildDots();
      phvContent.classList.remove('out');
    }, 200);
  }

  function startPromoInterval() {
    promoStepInterval = setInterval(() => {
      setPromoStep((activePromoStep + 1) % stepData.length);
    }, 5000);
  }

  promoSteps.forEach((step, i) => {
    step.addEventListener('click', () => {
      clearInterval(promoStepInterval);
      setPromoStep(i);
      startPromoInterval();
    });
  });

  // Staggered reveal for step rows
  const stepRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.promo-step').forEach((s, i) => {
          s.style.transitionDelay = `${i * 80}ms`;
          s.classList.add('visible');
        });
      }
    });
  }, { threshold: 0.1 });

  const promoHowSection = document.getElementById('promo-how');
  if (promoHowSection) stepRevealObserver.observe(promoHowSection);

  if (promoSteps.length) {
    setPromoStep(0);
    startPromoInterval();
  }


  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  function animateCounter(el, end) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * end).toLocaleString() + suffix;
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
  }, { threshold: 0.5 });

  document.querySelectorAll('.animated-counter').forEach(el => counterObserver.observe(el));


  /* ============================================================
     ACTIVITY FEED — live community updates
     ============================================================ */
  const activities = [
    { dot: 'dot-green',  text: 'Meera S. merged PR #42 into <strong>ai-health-predictor</strong>',    time: 'just now' },
    { dot: 'dot-blue',   text: 'Rahul K. joined project <strong>smart-agri-iot</strong>',              time: '2m ago'   },
    { dot: 'dot-amber',  text: 'Team Codex deployed <strong>fintrack-v2</strong> to production',       time: '5m ago'   },
    { dot: 'dot-purple', text: 'Nia B. got mentor feedback on <strong>ml-sentiment-api</strong>',     time: '9m ago'   },
    { dot: 'dot-green',  text: 'Aryan T. opened issue #17 in <strong>climate-viz-dashboard</strong>', time: '12m ago'  },
    { dot: 'dot-blue',   text: 'Priya J. onboarded to <strong>web3-wallet-ui</strong>',               time: '15m ago'  },
    { dot: 'dot-amber',  text: 'Vikram R. pushed 3 commits to <strong>edtech-platform</strong>',      time: '18m ago'  },
    { dot: 'dot-purple', text: 'Sara L. created team for <strong>healthcare-nlp</strong>',             time: '21m ago'  },
  ];

  const feedEl = document.getElementById('activity-feed');
  let feedIndex = 0;

  function addActivityItem() {
    if (!feedEl) return;
    const a = activities[feedIndex % activities.length];
    const item = document.createElement('div');
    item.className = 'solution-activity-item';
    item.innerHTML = `
      <span class="solution-activity-dot ${a.dot}"></span>
      <span style="line-height:1.4;">${a.text}</span>
      <span class="activity-time">${a.time}</span>
    `;
    if (feedEl.children.length >= 5) feedEl.removeChild(feedEl.firstChild);
    feedEl.appendChild(item);
    feedIndex++;
  }

  // Seed initial items
  for (let i = 0; i < 4; i++) addActivityItem();
  setInterval(addActivityItem, 3200);


  /* ============================================================
     FINAL CTA — spotlight mouse follow + scroll reveal
     ============================================================ */
  const promoCTABox      = document.getElementById('promo-cta-box');
  const promoCTASpotlight = document.getElementById('promo-cta-spotlight');

  if (promoCTABox && promoCTASpotlight) {
    promoCTABox.addEventListener('mousemove', (e) => {
      const rect = promoCTABox.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      promoCTASpotlight.style.background =
        `radial-gradient(600px circle at ${x}% ${y}%, rgba(0,0,0,0.12), transparent 40%)`;
    });

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    ctaObserver.observe(promoCTABox);
  }


  /* ============================================================
     SOCIAL PROOF CARDS — staggered reveal
     (mirrors the security section animation from script.js)
     ============================================================ */
  const socialProofSection = document.getElementById('social-proof');
  if (socialProofSection) {
    socialProofSection.querySelectorAll('.security-card').forEach(c => {
      c.style.opacity   = '0';
      c.style.transform = 'translateX(24px)';
      c.style.transition = 'opacity 0.5s, transform 0.5s, border-color 0.3s';
    });

    const spObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.security-card').forEach((card, i) => {
            card.style.transitionDelay = `${i * 100}ms`;
            card.style.opacity   = '1';
            card.style.transform = 'translateX(0)';
          });
        }
      });
    }, { threshold: 0.1 });
    spObserver.observe(socialProofSection);
  }

});
