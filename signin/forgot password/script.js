/* ============================================================
   FORGOT PASSWORD PAGE — script.js
   Smooth page open animation + form validation + UX polish
   ============================================================ */

(function () {
  'use strict';

  // ── DOM refs ────────────────────────────────────────────
  const loader      = document.getElementById('page-loader');
  const root        = document.getElementById('forgot-root');
  const form        = document.getElementById('forgot-form');
  const submitBtn   = document.getElementById('submit-btn');

  // ══════════════════════════════════════════════════════
  // 1.  PAGE LOAD ANIMATION
  //     Loader plays → fades out → form/panel reveal
  // ══════════════════════════════════════════════════════
  function revealPage () {
    // Remove hidden class to let CSS animations begin
    root.classList.remove('page-hidden');

    // Fade out loader
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', function onEnd () {
      loader.removeEventListener('transitionend', onEnd);
      loader.style.display = 'none';
    }, { once: true });
  }

  // Allow loader bar to fill (1.2s), then reveal
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(revealPage, 1300);
  });

  // ══════════════════════════════════════════════════════
  // 2.  VALIDATION HELPERS
  // ══════════════════════════════════════════════════════
  function showError (inputId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(inputId + '-error');
    if (!input || !err) return;

    input.classList.add('has-error');
    input.classList.remove('valid');
    err.textContent = msg;
    err.classList.add('visible');

    // Shake
    input.animate([
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)'  },
      { transform: 'translateX(-3px)' },
      { transform: 'translateX(3px)'  },
      { transform: 'translateX(0)'    },
    ], { duration: 320, easing: 'ease-out' });
  }

  function clearError (inputId) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(inputId + '-error');
    if (!input || !err) return;
    input.classList.remove('has-error');
    err.textContent = '';
    err.classList.remove('visible');
  }

  function markValid (inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.remove('has-error');
    input.classList.add('valid');
  }

  // Live validation on blur
  ['email'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', function () { validateField(id); });
    el.addEventListener('input', function () {
      if (el.classList.contains('has-error')) validateField(id);
    });
  });

  function validateField (id) {
    const el = document.getElementById(id);
    if (!el) return true;
    const val = el.value.trim();

    if (id === 'email') {
      if (!val)                        { showError(id, 'Email is required.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(id, 'Enter a valid email address.'); return false; }
      clearError(id); markValid(id); return true;
    }

    return true;
  }

  // ══════════════════════════════════════════════════════
  // 3.  FORM SUBMIT
  // ══════════════════════════════════════════════════════
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields  = ['email'];
      const results = fields.map(validateField);
      const allOk   = results.every(Boolean);

      if (!allOk) return;

      // Loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate async (replace with real fetch)
      setTimeout(function () {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Success — show toast
        showToast('✓ Reset link sent to your email! Check your inbox 📧');
        form.reset();
        ['email'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.classList.remove('valid');
        });
      }, 1800);
    });
  }

  // ══════════════════════════════════════════════════════
  // 4.  TOAST
  // ══════════════════════════════════════════════════════
  function showToast (msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon">✓</span><span>' + msg + '</span>';
    document.body.appendChild(toast);

    // Force reflow then show
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 3500);
  }

  // ══════════════════════════════════════════════════════
  // 5.  GLASS CARD SUBTLE PARALLAX (desktop hover)
  // ══════════════════════════════════════════════════════
  const glassCard  = document.querySelector('.glass-card');
  const infoPanel  = document.querySelector('.info-panel');

  if (glassCard && infoPanel) {
    infoPanel.addEventListener('mousemove', function (e) {
      const rect = infoPanel.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const yRel = (e.clientY - rect.top)  / rect.height - 0.5;

      const rotX =  yRel * -6;  // degrees
      const rotY =  xRel *  6;

      glassCard.style.transform = [
        'translateY(0)',
        'rotateX(' + rotX + 'deg)',
        'rotateY(' + rotY + 'deg)',
        'scale(1)',
      ].join(' ');
      glassCard.style.transition = 'transform 0.1s ease';
    });

    infoPanel.addEventListener('mouseleave', function () {
      glassCard.style.transform  = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
      glassCard.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    });
  }

})();
