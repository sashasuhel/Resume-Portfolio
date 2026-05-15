/* ═══════════════════════════════════════════════════════════════════
   WORLD MAP PORTFOLIO — Constellation + Scroll-Driven Background
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════
     1. MOVING CONSTELLATION (Canvas — stars + connecting lines)
     ═══════════════════════════════════════════════════════════════════ */
  const canvas = document.getElementById('starfield');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let w, h;
    let mouse = { x: -9999, y: -9999 };

    function resizeCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* Track mouse so nearby stars brighten */
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class ConstellationNode {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseSize = Math.random() * 1.8 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
        /* Color variety: cyan, purple, white, pink */
        const colors = [
          [0, 229, 255],
          [179, 136, 255],
          [220, 230, 255],
          [255, 77, 166],
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.twinkleSpeed;
        /* Wrap around edges */
        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;
      }
      draw() {
        const twinkle = Math.sin(this.phase) * 0.25 + 0.75;
        /* Brighten near mouse */
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseBoost = dist < 180 ? (1 - dist / 180) * 0.5 : 0;
        const finalOpacity = Math.min(this.opacity * twinkle + mouseBoost, 1);
        const finalSize = this.baseSize + mouseBoost * 2;

        ctx.beginPath();
        ctx.arc(this.x, this.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${finalOpacity})`;
        ctx.fill();

        /* Glow halo on brighter stars */
        if (finalOpacity > 0.4) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, finalSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${finalOpacity * 0.08})`;
          ctx.fill();
        }
      }
    }

    const count = Math.min(65, Math.floor((w * h) / 22000));
    for (let i = 0; i < count; i++) nodes.push(new ConstellationNode());

    function drawConnections() {
      const maxDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      /* Draw lines from mouse to nearby nodes */
      if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const opacity = (1 - dist / 160) * 0.08;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.strokeStyle = `rgba(179, 136, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateConstellation() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => { n.update(); n.draw(); });
      drawConnections();
      requestAnimationFrame(animateConstellation);
    }
    animateConstellation();
  }

  /* ═══════════════════════════════════════════════════════════════════
     2. SCROLL-DRIVEN BACKGROUND COLOR SHIFTS
     ═══════════════════════════════════════════════════════════════════ */
  const bgColors = [
    { r: 10, g: 14, b: 26 },   /* spawn — deep space blue */
    { r: 8,  g: 18, b: 32 },   /* about — slight teal hint */
    { r: 14, g: 12, b: 28 },   /* experience — purple shift */
    { r: 8,  g: 20, b: 22 },   /* skills — green-teal */
    { r: 16, g: 14, b: 24 },   /* education — warm purple */
    { r: 18, g: 10, b: 22 },   /* contact — pink/magenta */
  ];

  const sections = document.querySelectorAll('.region');
  const avatarContainer = document.getElementById('avatarContainer');
  const railNodes = document.querySelectorAll('.rail-node');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  let ticking = false;

  function lerpColor(a, b, t) {
    return {
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t),
    };
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(scrollY / (totalHeight || 1), 1);

      /* ── Background color interpolation ── */
      const segmentCount = bgColors.length - 1;
      const segment = scrollFraction * segmentCount;
      const idx = Math.min(Math.floor(segment), segmentCount - 1);
      const t = segment - idx;
      const c = lerpColor(bgColors[idx], bgColors[idx + 1], t);
      document.body.style.background = `rgb(${c.r}, ${c.g}, ${c.b})`;

      /* ── Avatar fade-out ── */
      if (avatarContainer) {
        const heroBottom = document.getElementById('hero').offsetHeight;
        const fadeProgress = Math.min(scrollY / (heroBottom * 0.5), 1);
        if (fadeProgress >= 1) {
          avatarContainer.classList.add('hidden');
        } else {
          avatarContainer.classList.remove('hidden');
          avatarContainer.style.opacity = 1 - fadeProgress;
          avatarContainer.style.transform = `scale(${1 - fadeProgress * 0.15})`;
        }
      }

      /* ── Parallax layers ── */
      if (!prefersReduced) {
        parallaxLayers.forEach(layer => {
          const depth = parseFloat(layer.dataset.depth) || 0.1;
          const rect = layer.closest('.region').getBoundingClientRect();
          const offset = rect.top * depth;
          layer.style.transform = `translateY(${offset}px)`;
        });
      }

      /* ── Progress rail ── */
      let currentRegion = 'spawn';
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4) {
          currentRegion = sec.dataset.region;
        }
      });
      railNodes.forEach(node => {
        node.classList.toggle('active', node.dataset.region === currentRegion);
      });

      /* ── Minimap active node ── */
      document.querySelectorAll('.map-node').forEach(node => {
        node.classList.toggle('active', node.dataset.target === currentRegion ||
          (node.dataset.target === 'hero' && currentRegion === 'spawn'));
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ═══════════════════════════════════════════════════════════════════
     3. SCROLL REVEAL + Cinematic Scene Flash
     ═══════════════════════════════════════════════════════════════════ */
  if (!prefersReduced) {
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0') * 120;
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObserver.observe(el));

    /* Cinematic flash when a new region enters */
    const regions = document.querySelectorAll('.region');
    const regionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scene-enter');
          setTimeout(() => entry.target.classList.remove('scene-enter'), 1200);
        }
      });
    }, { threshold: 0.25 });
    regions.forEach(r => regionObserver.observe(r));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  /* ═══════════════════════════════════════════════════════════════════
     4. COUNTER ANIMATION
     ═══════════════════════════════════════════════════════════════════ */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * ease);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════════════
     5. QUEST CARDS — Populate inline details (always visible)
     ═══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.quest-card').forEach(card => {
    const data = JSON.parse(card.dataset.quest);
    const detailsList = card.querySelector('.quest-details');
    const tagsDiv = card.querySelector('.quest-tags');
    if (detailsList) detailsList.innerHTML = data.details.map(d => `<li>${d}</li>`).join('');
    if (tagsDiv) tagsDiv.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
  });

  /* ═══════════════════════════════════════════════════════════════════
     6. MINIMAP / FAST TRAVEL
     ═══════════════════════════════════════════════════════════════════ */
  const warpBtn = document.getElementById('warpBtn');
  const minimapOverlay = document.getElementById('minimapOverlay');
  const minimapClose = document.getElementById('minimapClose');

  function openMinimap() {
    minimapOverlay.classList.add('open');
    minimapOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMinimap() {
    minimapOverlay.classList.remove('open');
    minimapOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  warpBtn.addEventListener('click', openMinimap);
  minimapClose.addEventListener('click', closeMinimap);
  minimapOverlay.addEventListener('click', (e) => {
    if (e.target === minimapOverlay) closeMinimap();
  });

  document.querySelectorAll('.map-node').forEach(node => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      const target = document.getElementById(node.dataset.target);
      if (target) {
        closeMinimap();
        setTimeout(() => {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - 40,
            behavior: 'smooth'
          });
        }, 200);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMinimap();
  });

  /* ═══════════════════════════════════════════════════════════════════
     7. COPY TO CLIPBOARD
     ═══════════════════════════════════════════════════════════════════ */
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(msg) {
    toast.textContent = msg || 'Copied!';
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        showToast('Copied: ' + btn.dataset.copy);
      }).catch(() => showToast('Copy failed'));
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     8. SMOOTH ANCHOR SCROLL
     ═══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 40,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     9. MOUSE GLOW FOLLOWER
     ═══════════════════════════════════════════════════════════════════ */
  const mouseGlow = document.getElementById('mouseGlow');
  if (mouseGlow && !prefersReduced) {
    let glowX = 0, glowY = 0;
    let targetX = 0, targetY = 0;
    let glowVisible = false;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!glowVisible) {
        mouseGlow.classList.add('active');
        glowVisible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      mouseGlow.classList.remove('active');
      glowVisible = false;
    });

    /* Smooth lerp so the glow trails slightly behind the cursor */
    function updateGlow() {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      mouseGlow.style.left = glowX + 'px';
      mouseGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    }
    requestAnimationFrame(updateGlow);
  }

  /* ═══════════════════════════════════════════════════════════════════
     10. CARD SPOTLIGHT — glow follows cursor inside panels
     ═══════════════════════════════════════════════════════════════════ */
  if (!prefersReduced) {
    document.querySelectorAll('.hud-panel').forEach(panel => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        panel.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     11. INITIAL STATE
     ═══════════════════════════════════════════════════════════════════ */
  railNodes[0]?.classList.add('active');
  document.querySelector('.map-node[data-target="hero"]')?.classList.add('active');

})();
