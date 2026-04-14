/* ============================================================
   REGISTER PAGE — register.js
   Smooth page open animation + form validation + UX polish
   ============================================================ */

(function () {
  'use strict';

  // ── DOM refs ────────────────────────────────────────────
  const loader      = document.getElementById('page-loader');
  const root        = document.getElementById('register-root');
  const form        = document.getElementById('register-form');
  const submitBtn   = document.getElementById('submit-btn');
  const pwInput     = document.getElementById('password');
  const pwToggle    = document.getElementById('pw-toggle');
  const pwStrength  = document.getElementById('pw-strength');
  const pwFill      = document.getElementById('pw-fill');
  const pwLabel     = document.getElementById('pw-label');
  const customSelect = document.getElementById('custom-role');
  const roleInput    = document.getElementById('role');

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
  // 2.  PASSWORD TOGGLE
  // ══════════════════════════════════════════════════════
  if (pwToggle && pwInput) {
    pwToggle.addEventListener('click', function () {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';

      const eyeOpen   = pwToggle.querySelector('.eye-open');
      const eyeClosed = pwToggle.querySelector('.eye-closed');
      eyeOpen.style.display   = isPassword ? 'none'  : '';
      eyeClosed.style.display = isPassword ? ''      : 'none';
    });
  }

  // ══════════════════════════════════════════════════════
  // 3.  PASSWORD STRENGTH METER
  // ══════════════════════════════════════════════════════
  const strengthLevels = [
    { min: 0,  max: 25,  label: 'Weak',   color: 'var(--strength-weak)',   pct: 25  },
    { min: 26, max: 50,  label: 'Fair',   color: 'var(--strength-fair)',   pct: 50  },
    { min: 51, max: 75,  label: 'Good',   color: 'var(--strength-good)',   pct: 75  },
    { min: 76, max: 100, label: 'Strong', color: 'var(--strength-strong)', pct: 100 },
  ];

  function scorePassword (pw) {
    let score = 0;
    if (pw.length >= 8)  score += 20;
    if (pw.length >= 12) score += 10;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 30;
    return Math.min(score, 100);
  }

  if (pwInput && pwStrength) {
    pwStrength.classList.add('hidden');

    pwInput.addEventListener('input', function () {
      const val = pwInput.value;

      if (!val) {
        pwStrength.classList.add('hidden');
        pwFill.style.width = '0%';
        return;
      }

      pwStrength.classList.remove('hidden');
      const score = scorePassword(val);
      const level = strengthLevels.find(l => score >= l.min && score <= l.max)
                    || strengthLevels[strengthLevels.length - 1];

      pwFill.style.width           = level.pct + '%';
      pwFill.style.backgroundColor = level.color;
      pwLabel.textContent          = level.label;
      pwLabel.style.color          = level.color;
    });
  }

  // ══════════════════════════════════════════════════════
  // 4.  VALIDATION HELPERS
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
  ['fullname', 'email', 'password'].forEach(function (id) {
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

    if (id === 'fullname') {
      if (!val)            { showError(id, 'Full name is required.'); return false; }
      if (val.length < 2)  { showError(id, 'Name must be at least 2 characters.'); return false; }
      clearError(id); markValid(id); return true;
    }

    if (id === 'email') {
      if (!val)                        { showError(id, 'Email is required.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(id, 'Enter a valid email address.'); return false; }
      clearError(id); markValid(id); return true;
    }

    if (id === 'password') {
      if (!val)           { showError(id, 'Password is required.'); return false; }
      if (val.length < 8) { showError(id, 'Password must be at least 8 characters.'); return false; }
      clearError(id); markValid(id); return true;
    }

    if (id === 'role') {
      if (!val) { showError(id, 'Please select your role.'); return false; }
      clearError(id); markValid(id); return true;
    }

    return true;
  }

  // ══════════════════════════════════════════════════════
  // 5.  FORM SUBMIT
  // ══════════════════════════════════════════════════════
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields  = ['fullname', 'email', 'password', 'role'];
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

        // Success — show toast & ripple
        showToast('✓ Account created! Welcome aboard 🎉');
        form.reset();
        ['fullname', 'email', 'password', 'role'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.classList.remove('valid');
        });
        if (pwStrength) pwStrength.classList.add('hidden');
      }, 1800);
    });
  }

  // ══════════════════════════════════════════════════════
  // 6.  TOAST
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
  // 7.  OAUTH BUTTON RIPPLE EFFECT
  // ══════════════════════════════════════════════════════
  document.querySelectorAll('.oauth-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'width:10px',
        'height:10px',
        'background:rgba(28,26,22,0.12)',
        'pointer-events:none',
        'transform:scale(0)',
        'transition:transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s',
        'left:' + (x - 5) + 'px',
        'top:' + (y - 5) + 'px',
      ].join(';');

      btn.appendChild(ripple);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          ripple.style.transform = 'scale(20)';
          ripple.style.opacity   = '0';
        });
      });
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  // ══════════════════════════════════════════════════════
  // 8.  CUSTOM DROPDOWN
  // ══════════════════════════════════════════════════════
  if (customSelect && roleInput) {
    const dropdown = customSelect.parentElement.querySelector('.custom-select-dropdown');
    const valueDisplay = customSelect.querySelector('.custom-select-value');
    
    if (!dropdown) {
      console.error('Dropdown element not found');
      return;
    }
    
    const options = dropdown.querySelectorAll('.custom-select-option');
    let isOpen = false;

    function toggleDropdown() {
      isOpen = !isOpen;
      customSelect.classList.toggle('active', isOpen);
      dropdown.classList.toggle('show', isOpen);
      customSelect.setAttribute('aria-expanded', isOpen);
    }

    function closeDropdown() {
      isOpen = false;
      customSelect.classList.remove('active');
      dropdown.classList.remove('show');
      customSelect.setAttribute('aria-expanded', 'false');
    }

    function selectOption(option) {
      const value = option.getAttribute('data-value');
      const text = option.textContent;

      // Update display and hidden input
      valueDisplay.textContent = text;
      valueDisplay.setAttribute('data-value', value);
      roleInput.value = value;

      // Update selected state
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      // Validate field
      validateField('role');

      closeDropdown();
    }

    // Click to toggle
    customSelect.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown();
    });

    // Option selection
    options.forEach(function (option) {
      option.addEventListener('click', function (e) {
        e.stopPropagation();
        selectOption(option);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!customSelect.contains(e.target)) {
        closeDropdown();
      }
    });

    // Keyboard navigation
    customSelect.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      }
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Form reset handler
    if (form) {
      form.addEventListener('reset', function () {
        valueDisplay.textContent = 'Select your role';
        valueDisplay.setAttribute('data-value', '');
        roleInput.value = '';
        options.forEach(opt => opt.classList.remove('selected'));
        clearError('role');
      });
    }
  }

  // ══════════════════════════════════════════════════════
  // 9.  GLASS CARD SUBTLE PARALLAX (desktop hover)
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