/**
 * MushFoam — Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initProductTabs();
  initCalculator();
  initFaq();
  initMyceliumCanvas();
  initSmoothScroll();
  initScrollReveal();
});

/* ============================================================
   1. NAVBAR — scroll class + mobile drawer + scroll-spy
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [
    { id: 'hero', href: '#hero' },
    { id: 'produk', href: '#produk' },
    { id: 'about', href: '#about' },
  ];

  // Scroll class + spy
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = 'hero';
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el && window.scrollY >= el.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // Mobile drawer toggle
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close drawer when any mobile link is clicked
    drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close drawer on outside click
  document.addEventListener('click', e => {
    if (drawer && drawer.classList.contains('open') &&
      !drawer.contains(e.target) && !toggle.contains(e.target)) {
      drawer.classList.remove('open');
    }
  });
}

/* ============================================================
   2. HERO PRODUCT TAB SWITCHER
   ============================================================ */
function initProductTabs() {
  const tabs = document.querySelectorAll('.stab');
  const img = document.getElementById('hero-preview-img');
  const nameEl = document.getElementById('hero-pill-title');

  const products = {
    panel:  { src: 'MushFlat.png',  name: 'MushFlat — Lembaran 60 × 40 cm',  cls: 'img-flat' },
    corner: { src: 'Mushcube.png',  name: 'MushCube — Blok 15 × 15 cm',       cls: 'img-cube' },
  };

  // Set initial class
  if (img) img.classList.add('img-flat');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const type = tab.dataset.type;
      if (!products[type] || !img) return;

      img.style.opacity = '0';
      img.style.transform = 'scale(0.94)';

      setTimeout(() => {
        img.src = products[type].src;
        if (nameEl) nameEl.textContent = products[type].name;
        // swap size class
        img.classList.remove('img-flat', 'img-cube');
        img.classList.add(products[type].cls);
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 140);
    });
  });

  // Apply CSS transition to the image
  if (img) {
    img.style.transition = 'opacity 0.14s ease, transform 0.14s ease';
  }
}

/* ============================================================
   3. IMPACT CALCULATOR
   ============================================================ */
function initCalculator() {
  const slider = document.getElementById('calc-slider');
  const volLabel = document.getElementById('calc-vol-display');
  const mPlastic = document.getElementById('m-plastic');
  const mCo2 = document.getElementById('m-co2');
  const mMicro = document.getElementById('m-micro');
  const mCompost = document.getElementById('m-compost');
  const mCost = document.getElementById('m-cost');
  const waBtn = document.getElementById('wa-btn');

  if (!slider) return;

  function fmt(n) { return n.toLocaleString('id-ID'); }

  function update() {
    const vol = parseInt(slider.value, 10);
    if (volLabel) volLabel.textContent = fmt(vol) + ' pcs';

    const plastic = (vol * 0.045).toFixed(1);
    const co2 = (plastic * 3.2).toFixed(1);
    const micro = fmt(vol * 45);
    const compost = (vol * 0.08).toFixed(1);
    const cost = 'Rp ' + fmt(vol * 5000);

    if (mPlastic) mPlastic.textContent = plastic.replace('.', ',') + ' kg';
    if (mCo2) mCo2.textContent = co2.replace('.', ',') + ' kg';
    if (mMicro) mMicro.textContent = micro + ' g';
    if (mCompost) mCompost.textContent = compost.replace('.', ',') + ' kg';
    if (mCost) mCost.textContent = cost;

    if (waBtn) {
      const msg = `Halo Tim MushFoam, saya tertarik berkonsultasi mengenai kebutuhan kemasan sekitar ${fmt(vol)} pcs/bulan. Mohon informasi penawaran dan pengiriman sampel.`;
      waBtn.href = `https://api.whatsapp.com/send?phone=6282137503755&text=${encodeURIComponent(msg)}`;
    }
  }

  slider.addEventListener('input', update);
  update();
}

/* ============================================================
   4. FAQ ACCORDION
   ============================================================ */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}



/* ============================================================
   6. MYCELIUM PARTICLES CANVAS (subtle glowing for dark theme)
   ============================================================ */
function initMyceliumCanvas() {
  const canvas = document.getElementById('mycelium-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize, { passive: true });

  const count = Math.min(Math.floor((W * H) / 24000), 55);
  const nodes = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 2.0 + 0.8,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Node dot - glowing emerald
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(116, 198, 157, 0.45)';
      ctx.fill();

      // Connections
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d < 130) {
          const alpha = (1 - d / 130) * 0.15;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(116, 198, 157, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   7. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   8. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep performance high
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

