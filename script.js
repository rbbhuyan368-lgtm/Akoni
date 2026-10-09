/**
 * AKAONI (赤鬼) — ARTISANAL JAPANESE SUSHI & ROBATA
 * Core Interactive Engine: Dynamic Theme Colors, Wave Morphs,
 * Scrollable Categories, Dish Detail Drawers, & Table Reservations
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- AUDIO SYNTHESIS (Japanese Pentatonic Bell & Chime via Web Audio) ---
  let audioCtx = null;
  let isSoundEnabled = false;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playZenChime = (freq = 880, type = 'sine', duration = 0.5) => {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundToggleBtn.querySelector('.icon-sound-on').classList.toggle('hidden', !isSoundEnabled);
      soundToggleBtn.querySelector('.icon-sound-off').classList.toggle('hidden', isSoundEnabled);
      if (isSoundEnabled) {
        playZenChime(660);
        showToast('🔊 Zen Sound Effects Enabled', 'info');
      } else {
        showToast('🔇 Sound Muted', 'info');
      }
    });
  }

  // --- CULINARY THEMES DATA (Matching the Video Animation & Transitions) ---
  const heroThemes = {
    tuna: {
      themeName: 'tuna',
      dishName: 'HON-MAGURO OTORO',
      subtitle: 'ARTISANAL EDOMAE',
      kanji: '本鮪',
      price: '$36.00',
      description: 'Pristine Bluefin Tuna belly sashimi and nigiri, meticulously aged for umami peak, brushed with chef\'s simmered nikiri shoyu, and crowned with 24k edible gold flakes.',
      tags: ['Toyosu Direct', 'Binchotan Aged', 'Melt-in-Mouth'],
      image: './images/hero_tuna.jpg',
      accentTag: 'Toyosu Special Grade',
      floatingIcons: ['🌸', '🍃', '✨', '🥢', '🍣', '🔥'],
      wavePath: 'M0,0 L480,0 C490,140 525,230 520,330 C515,440 430,500 390,570 C340,650 280,730 240,800 L0,800 Z',
      rightShapePath: 'M720,800 C715,690 710,570 735,490 C760,420 850,340 1000,290 L1000,800 Z'
    },
    salmon: {
      themeName: 'salmon',
      dishName: 'KING SALMON TORO',
      subtitle: 'WILD ORA BELLY',
      kanji: '鮭',
      price: '$28.00',
      description: 'Velvety New Zealand Ora King Salmon belly delicately torched over Kishu Binchotan charcoal, topped with glistening house-marinated Ikura salmon roe and fresh lime zest.',
      tags: ['Ora King Belly', 'Charcoal Torched', 'Ikura Crown'],
      image: './images/hero_salmon.jpg',
      accentTag: 'Binchotan Flame Kissed',
      floatingIcons: ['🍋', '🍊', '✨', '🥢', '🍣', '🌸'],
      wavePath: 'M0,0 L540,0 C520,130 460,220 450,330 C440,450 510,530 460,610 C410,690 370,750 330,800 L0,800 Z',
      rightShapePath: 'M620,800 C630,660 640,520 680,420 C720,310 840,230 1000,180 L1000,800 Z'
    },
    uni: {
      themeName: 'uni',
      dishName: 'HOKKAIDO UNI & IKURA',
      subtitle: 'OCEAN GOLD DONBURI',
      kanji: '雲丹',
      price: '$48.00',
      description: 'Golden Grade-A Sea Urchin harvested from Hokkaido shores, paired with jewel-like shoyu-marinated wild salmon caviar over warm akazu red vinegar rice.',
      tags: ['Hokkaido Grade-A', 'Wild Ikura', 'Sweet Umami'],
      image: './images/hero_uni.jpg',
      accentTag: 'Hokkaido Fresh Auction',
      floatingIcons: ['✨', '🥢', '🍱', '🍣', '🌊', '🍙'],
      wavePath: 'M0,0 L430,0 C460,150 560,250 500,360 C430,470 340,510 330,590 C320,670 240,740 190,800 L0,800 Z',
      rightShapePath: 'M780,800 C770,710 690,620 710,530 C730,440 880,420 1000,380 L1000,800 Z'
    },
    matcha: {
      themeName: 'matcha',
      dishName: 'CEREMONIAL UJI MATCHA',
      subtitle: 'KYOTO KAISEKI DESSERT',
      kanji: '抹茶',
      price: '$18.00',
      description: 'Artisanal ceremonial-grade Uji Matcha mousse, Hokkaido red bean sweet anko, hand-churned green tea gelato, and edible gold leaf over warm Japanese slate.',
      tags: ['Kyoto Uji Harvest', 'Slow Churned', 'Pure Zen'],
      image: './images/hero_matcha.jpg',
      accentTag: 'Kyoto First Flush Harvest',
      floatingIcons: ['🍵', '🍃', '🍡', '✨', '🥢', '🌸'],
      wavePath: 'M0,0 L500,0 C510,160 480,260 475,340 C470,440 450,520 410,590 C370,660 320,740 270,800 L0,800 Z',
      rightShapePath: 'M670,800 C670,680 680,560 710,470 C740,380 860,310 1000,250 L1000,800 Z'
    }
  };

  // --- HERO TRANSITION CONTROLLER ---
  const bodyEl = document.body;
  const heroPlateImg = document.getElementById('heroPlateImage');
  const plateSpinner = document.getElementById('plateSpinner');
  const heroDishName = document.getElementById('heroDishName');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroKanji = document.getElementById('heroKanjiWatermark');
  const heroDescription = document.getElementById('heroDescription');
  const heroPrice = document.getElementById('heroPrice');
  const heroTags = document.getElementById('heroTags');
  const fluidWavePath = document.getElementById('fluidWavePath');
  const heroRightShapePath = document.getElementById('heroRightShapePath');
  const plateAccentTag = document.getElementById('plateAccentTag');
  const thumbBtns = document.querySelectorAll('.hero-thumbnails-row .thumb-btn');

  let currentThemeKey = 'tuna';

  const switchCulinaryTheme = (themeKey) => {
    const data = heroThemes[themeKey];
    if (!data) return;
    currentThemeKey = themeKey;

    playZenChime(themeKey === 'tuna' ? 523 : themeKey === 'salmon' ? 659 : themeKey === 'uni' ? 784 : 880);

    // 1. Update document theme attribute
    bodyEl.dataset.theme = data.themeName;

    // Update SVG gradients explicitly for user provided colors
    const themeWaveColors = {
      tuna: { primary: '#ED6E72', dark: '#8C272B', accent: '#FAAF6D' },
      salmon: { primary: '#FAAF6D', dark: '#8E4812', accent: '#ED6E72' },
      uni: { primary: '#D5A8BD', dark: '#6F3752', accent: '#FAAF6D' },
      matcha: { primary: '#4C614E', dark: '#1E2C20', accent: '#FAAF6D' }
    };
    const curColors = themeWaveColors[themeKey];
    if (curColors) {
      const waveGrad = document.getElementById('waveGradient');
      const rightWaveGrad = document.getElementById('rightWaveGradient');
      [waveGrad, rightWaveGrad].forEach(grad => {
        if (!grad) return;
        const stops = grad.querySelectorAll('stop');
        if (stops[0]) stops[0].setAttribute('stop-color', curColors.primary);
        if (stops[1]) stops[1].setAttribute('stop-color', curColors.dark);
        if (stops[2]) stops[2].setAttribute('stop-color', curColors.accent);
      });
    }

    // 2. Animate Wave Path Morphing for both Left and Right shapes with luminous pulse
    if (fluidWavePath && data.wavePath) {
      fluidWavePath.classList.remove('morphing');
      void fluidWavePath.offsetWidth;
      fluidWavePath.classList.add('morphing');
      fluidWavePath.setAttribute('d', data.wavePath);
    }
    if (heroRightShapePath && data.rightShapePath) {
      heroRightShapePath.classList.remove('morphing');
      void heroRightShapePath.offsetWidth;
      heroRightShapePath.classList.add('morphing');
      heroRightShapePath.setAttribute('d', data.rightShapePath);
    }

    // 3. Animate Hero Dish Plate: Current dish slides right, new dish slides in from left
    if (heroPlateImg) {
      heroPlateImg.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
      heroPlateImg.style.transform = 'translateX(110%) rotate(20deg) scale(0.9)';
      heroPlateImg.style.opacity = '0';

      setTimeout(() => {
        heroPlateImg.src = data.image;
        heroPlateImg.alt = data.dishName;
        heroPlateImg.style.transition = 'none';
        heroPlateImg.style.transform = 'translateX(-110%) rotate(-20deg) scale(0.9)';
        heroPlateImg.style.opacity = '0';

        // Force reflow
        void heroPlateImg.offsetWidth;

        heroPlateImg.style.transition = 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.38s ease-out';
        heroPlateImg.style.transform = 'translateX(0) rotate(0deg) scale(1)';
        heroPlateImg.style.opacity = '1';
      }, 300);
    }

    // 4. Update Typography & Text with Fade
    [heroDishName, heroSubtitle, heroKanji, heroDescription, heroPrice].forEach(el => {
      if (el) el.style.opacity = '0.3';
    });

    setTimeout(() => {
      if (heroDishName) heroDishName.textContent = data.dishName;
      if (heroSubtitle) heroSubtitle.textContent = data.subtitle;
      if (heroKanji) heroKanji.textContent = data.kanji;
      if (heroDescription) heroDescription.textContent = data.description;
      if (heroPrice) heroPrice.textContent = data.price;

      if (heroTags) {
        heroTags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
      }

      if (plateAccentTag) {
        const tagText = plateAccentTag.querySelector('.tag-text');
        if (tagText) tagText.textContent = data.accentTag;
      }

      // Update Floating Particles
      if (data.floatingIcons) {
        data.floatingIcons.forEach((icon, idx) => {
          const p = document.getElementById(`floatP${idx + 1}`);
          if (p) p.textContent = icon;
        });
      }

      [heroDishName, heroSubtitle, heroKanji, heroDescription, heroPrice].forEach(el => {
        if (el) el.style.opacity = '1';
      });
    }, 150);

    // 5. Update Thumbnails active state
    thumbBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeKey);
    });
  };

  // --- AUTOMATIC ROTATION / AUTOPLAY CONTROLLER ---
  const themeOrder = ['tuna', 'salmon', 'uni', 'matcha'];
  let autoPlayTimer = null;

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      const curIndex = themeOrder.indexOf(currentThemeKey);
      const nextIndex = (curIndex + 1) % themeOrder.length;
      switchCulinaryTheme(themeOrder[nextIndex]);
    }, 2850); // 25% faster auto rotation (reduced from 3800ms to 2850ms)
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  // Thumbnail Click Handlers (resets autoplay interval)
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      if (theme && theme !== currentThemeKey) {
        switchCulinaryTheme(theme);
      }
      startAutoPlay(); // Restart timer on manual interaction
    });
  });

  // Start autoplay initially
  startAutoPlay();

  // Pause hero autoplay when hero is scrolled out of view (saves massive CPU/GPU during lower page scrolling)
  const heroSectionEl = document.getElementById('heroSection');
  if (heroSectionEl && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    }, { threshold: 0.1 });
    heroObserver.observe(heroSectionEl);
  }

  // --- RESPONSIVE WAVE SCALING ---
  const updateWaveScale = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w <= 768) {
      // On mobile screens, user wants left and right shapes to expand across marked areas
      document.documentElement.style.setProperty('--wave-scale', '1');
      return;
    }
    // Desktop / Tablet reference: 1350px width, 780px height
    const scaleW = Math.min(1, Math.max(0.65, w / 1350));
    const scaleH = Math.min(1, Math.max(0.65, h / 780));
    const scale = Math.min(scaleW, scaleH);
    document.documentElement.style.setProperty('--wave-scale', scale.toFixed(3));
  };
  window.addEventListener('resize', updateWaveScale, { passive: true });
  updateWaveScale();

  // --- FLOATING PARTICLES PARALLAX ON MOUSEMOVE ---
  const heroVisualCol = document.getElementById('heroVisualCol');
  if (heroVisualCol && window.innerWidth > 992) {
    heroVisualCol.addEventListener('mousemove', (e) => {
      const rect = heroVisualCol.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const particles = heroVisualCol.querySelectorAll('.floating-item');
      particles.forEach((p, idx) => {
        const factor = (idx + 1) * 8;
        p.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });

      if (plateSpinner) {
        plateSpinner.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      }
    });

    heroVisualCol.addEventListener('mouseleave', () => {
      if (plateSpinner) plateSpinner.style.transform = 'none';
      const particles = heroVisualCol.querySelectorAll('.floating-item');
      particles.forEach(p => p.style.transform = 'none');
    });
  }

  // --- SEASONAL DISHES DATA FOR MENU CARDS ---
  let menuDishes = [
    {
      id: 'dish-1',
      category: 'nigiri',
      jpName: '本マグロ大トロ',
      enName: 'Hon-Maguro Otoro',
      sub: '本マグロ大トロ • Aged Bluefin',
      badge: 'Michelin Feature',
      price: 36.00,
      image: './images/hero_tuna.jpg',
      origin: 'Toyosu Fish Market, Tokyo',
      desc: 'Melt-in-your-mouth Bluefin tuna belly aged for optimal amino acid depth, torched with binchotan oak and finished with house nikiri shoyu and 24K gold flakes.',
      umami: 98,
      richness: 95,
      sweetness: 80,
      ingredients: ['Bluefin Otoro', 'Akazu Red Rice', 'Shizuoka Wasabi', 'Simmered Nikiri', '24K Gold Leaf'],
      pairing: 'Dassai 23 Junmai Daiginjo or Kenbishi Mizuho.'
    },
    {
      id: 'dish-2',
      category: 'nigiri',
      jpName: 'サーモントロ炙り',
      enName: 'King Salmon Aburi Toro',
      sub: 'サーモントロ炙り • Wild Ora Belly',
      badge: 'Chef Favorite',
      price: 28.00,
      image: './images/hero_salmon.jpg',
      origin: 'Marlborough Sounds, NZ',
      desc: 'Wild Ora King Salmon belly delicately seared over Japanese charcoal, crowned with glowing Ikura salmon roe, fresh lime, and micro-herbs.',
      umami: 90,
      richness: 88,
      sweetness: 85,
      ingredients: ['Ora King Salmon', 'Wild Ikura', 'Fresh Lime Zest', 'Akazu Sushi Rice', 'Toasted Sesame'],
      pairing: 'Kubota Manju Junmai Daiginjo.'
    },
    {
      id: 'dish-3',
      category: 'signature',
      jpName: '北海道生雲丹・イクラ丼',
      enName: 'Hokkaido Uni & Ikura Bowl',
      sub: '生雲丹イクラ丼 • Kelp-Fed Uni',
      badge: 'Top Signature',
      price: 48.00,
      image: './images/hero_uni.jpg',
      origin: 'Hokkaido Auction, Japan',
      desc: 'Top-grade sweet Hokkaido Sea Urchin paired with marinated wild salmon roe over seasoned sushi rice, garnished with fresh shiso and gold flakes.',
      umami: 96,
      richness: 92,
      sweetness: 90,
      ingredients: ['Hokkaido Grade-A Uni', 'Marinated Ikura', 'Shiso Leaf', 'Nori Flakes', 'Gold Foil'],
      pairing: 'Kokuryu "Black Dragon" Daiginjo.'
    },
    {
      id: 'dish-4',
      category: 'robata',
      jpName: '宮崎牛A5炭火串焼き',
      enName: 'Miyazaki A5 Wagyu Robata',
      sub: '宮崎牛炭火串 • 10-Yr Aged Tare',
      badge: 'Binchotan Sear',
      price: 42.00,
      image: './images/menu_wagyu.jpg',
      origin: 'Miyazaki Prefecture, Japan',
      desc: 'Certified A5 Miyazaki Wagyu beef skewers grilled over Kishu binchotan white oak, glazed with aged house tare sauce and scallions.',
      umami: 95,
      richness: 98,
      sweetness: 75,
      ingredients: ['A5 Miyazaki Beef', '10-Year Aged Tare', 'Tokyo Scallions', 'White Sesame', 'Smoked Sea Salt'],
      pairing: 'Yamazaki 12yr Single Malt Whisky or Full-Bodied Junmai.'
    },
    {
      id: 'dish-5',
      category: 'nigiri',
      jpName: 'ハマチトリュフ刺身',
      enName: 'Hamachi Truffle Sashimi',
      sub: 'ハマチトリュフ • Monterey Catch',
      badge: 'Seasonal Catch',
      price: 32.00,
      image: './images/menu_hamachi.jpg',
      origin: 'Kagoshima Bay & Monterey',
      desc: 'Silky yellowtail sashimi drizzled with white truffle essence, citrus yuzu ponzu, thin jalapeño rings, and fresh black winter truffle shavings.',
      umami: 92,
      richness: 82,
      sweetness: 78,
      ingredients: ['Yellowtail Hamachi', 'Black Truffle', 'Yuzu Ponzu', 'Serrano Chili', 'Black Sesame'],
      pairing: 'Born Gold Muroka Junmai Daiginjo.'
    },
    {
      id: 'dish-6',
      category: 'signature',
      jpName: '赤鬼特製ドラゴンロール',
      enName: 'Akaoni Fire Dragon Roll',
      sub: '特製ロール • Tiger Shrimp',
      badge: 'House Specialty',
      price: 26.00,
      image: './images/menu_roll.jpg',
      origin: 'Akaoni Original Recipe',
      desc: 'Crispy wild shrimp tempura and cucumber wrapped with freshwater unagi eel, creamy Hass avocado, red tobiko caviar, and spicy kabayaki glaze.',
      umami: 88,
      richness: 85,
      sweetness: 82,
      ingredients: ['Tempura Tiger Shrimp', 'Freshwater Unagi', 'Avocado', 'Tobiko Roe', 'Spicy Aioli'],
      pairing: 'Asahi Super Dry Draft or Crisp Junmai Ginjo.'
    },
    {
      id: 'dish-7',
      category: 'sake',
      jpName: '獺祭 磨き二割三分',
      enName: 'Dassai 23 Junmai Daiginjo',
      sub: '獺祭二割三分 • Prestige Sake',
      badge: 'Prestige Sake',
      price: 34.00,
      image: './images/menu_sake.jpg',
      origin: 'Yamaguchi, Asahi Shuzo',
      desc: 'Yamada Nishiki rice milled down to 23%. Notes of ripe white peach, muscat grapes, honeydew, and an ethereal, silky finish.',
      umami: 75,
      richness: 70,
      sweetness: 85,
      ingredients: ['Yamada Nishiki Rice', 'Pure Spring Dashi Water', 'Artisan Yeast #9'],
      pairing: 'Complements all Raw Nigiri, Otoro & Uni.'
    },
    {
      id: 'dish-8',
      category: 'dessert',
      jpName: '京都宇治抹茶ムース和菓子',
      enName: 'Ceremonial Uji Matcha Mousse',
      sub: '宇治抹茶ムース • First-Flush Tea',
      badge: 'Artisan Confection',
      price: 18.00,
      image: './images/hero_matcha.jpg',
      origin: 'Kyoto Uji, Japan',
      desc: 'First-flush ceremonial Uji green tea mousse cake, sweet Azuki bean compote, matcha gelato, and white chocolate blossom with gold flakes.',
      umami: 60,
      richness: 78,
      sweetness: 82,
      ingredients: ['Ceremonial Uji Matcha', 'Hokkaido Azuki Red Beans', 'Artisan Gelato', 'White Chocolate'],
      pairing: 'Hot Genmaicha Roasted Rice Tea or Umeshu Plum Wine.'
    },
    {
      id: 'dish-9',
      category: 'izakaya',
      jpName: '雲丹とトリュフの茶碗蒸し',
      enName: 'Truffle & Uni Chawanmushi',
      sub: '雲丹茶碗蒸し • Warm Umami',
      badge: 'Warm Umami',
      price: 22.00,
      image: './images/hero_uni.jpg',
      origin: 'Akaoni Kitchen',
      desc: 'Silken Japanese egg custard steamed with katsuobushi dashi, crowned with warmed Hokkaido sea urchin, shiitake mushrooms, and black truffle drizzle.',
      umami: 96,
      richness: 86,
      sweetness: 80,
      ingredients: ['Organic Eggs', 'Katsuo Dashi', 'Hokkaido Uni', 'Shiitake', 'Mitsuba Herb'],
      pairing: 'Suigei "Drunken Whale" Tokubetsu Junmai.'
    },
    {
      id: 'dish-10',
      category: 'sake',
      jpName: '柚子紫蘇クラフトハイボール',
      enName: 'Yuzu Shiso Craft Highball',
      sub: '柚子紫蘇 • Craft Highball',
      badge: 'Artisan Cocktail',
      price: 19.00,
      image: './images/menu_sake.jpg',
      origin: 'Carmel Bar Craft',
      desc: 'Roku Japanese Gin infused with fresh red shiso leaves, pressed Shikoku yuzu citrus, artisanal tonic, and effervescent soda water.',
      umami: 50,
      richness: 45,
      sweetness: 70,
      ingredients: ['Roku Gin', 'Fresh Yuzu Juice', 'Shiso Cordial', 'Artisan Tonic', 'Dehydrated Yuzu Wheel'],
      pairing: 'Refreshing aperitif for Robata skewers.'
    }
  ];

  // ==========================================================================
  // GLOBAL SCROLL ANIMATIONS ENGINE (All Pages)
  // - Cards, Buttons, Shapes: Scale smoothly from small to normal size (zoom in)
  // - Texts, Headings: Alternate sliding from Left and Right
  // ==========================================================================
  let globalScrollObserver = null;

  const initScrollAnimations = () => {
    // 1. Selector for standalone Cards, Shapes, Badges & Interactive Buttons across all pages
    const zoomSelector = [
      // Category Cards (Top row on Home Page)
      '.cat-card',
      
      // Dish Cards & Hits
      '.dish-card',
      '.hit-dish-card',
      '.menu-card',
      
      // Editorial & Philosophy Cards/Frames
      '.editorial-promo-card',
      '.editorial-arched-frame',
      '.omakase-card',
      '.experience-card',
      '.philosophy-card',
      '.chef-card',
      '.art-card',
      '.story-card',
      '.pillar-item',
      '.philosophy-banner-visual',
      
      // Location & Reservation Cards
      '.location-card',
      '.location-box',
      '.info-card',
      '.reserve-card',
      '.seating-card',
      '.reservation-card-wrapper',
      '.map-embed-wrapper',
      '.service-schedule',
      '.phone-booking',
      '.reservation-left-banner',
      
      // Badges, Hanko Seals & Shapes
      '.feature-badge-item',
      '.promo-tag-badge',
      '.rotating-seal-badge',
      '.footer-hanko-seal',
      '.hanko-seal-lg',
      '.craft-badge',
      '.footer-badge',
      '.omakase-badge',
      
      // Action Buttons & Action Controls (outside header/hero)
      '.btn-promo-pill',
      '.footer-outline-btn',
      '.reserve-submit-btn',
      '.btn-editorial-pill',
      '.social-circle-pill',
      '.cat-card-btn'
    ].join(',');

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const currentScrollY = window.scrollY || window.pageYOffset || 0;

    // Apply zoom animation to cards, shapes, badges, buttons
    const zoomElements = document.querySelectorAll(zoomSelector);
    zoomElements.forEach((el, index) => {
      // Exclude hero-section, mobile navigation drawer, and top site header
      if (el.closest('.hero-section, .site-header, .mobile-nav-drawer')) return;

      // Avoid double-nesting if a parent element is already a zooming container (unless it's a badge or button inside)
      const parentZoom = el.parentElement ? el.parentElement.closest(zoomSelector) : null;
      if (parentZoom && !el.matches('.feature-badge-item, .promo-tag-badge, .btn-promo-pill, .footer-outline-btn, .social-circle-pill, .cat-card-btn')) {
        return;
      }

      if (!el.classList.contains('scroll-in-view') && !el.classList.contains('scroll-anim-done')) {
        const rect = el.getBoundingClientRect();

        // If the user reloaded while already scrolled halfway down the page (currentScrollY > 150)
        // and the element is currently centered within the active viewport, display immediately to avoid any delay
        if (currentScrollY > 150 && rect.top >= 0 && rect.bottom <= vh) {
          el.classList.add('scroll-in-view');
          el.classList.add('scroll-anim-done');
          return;
        }

        // Add the zoom-in animation class
        el.classList.add('scroll-zoom');

        // Stagger cards in a row for a buttery-smooth wave effect (0.05s increments)
        const delay = (index % 5) * 0.05;
        el.style.transitionDelay = `${delay}s`;
      }
    });

    // 2. Headings, Section Headers, Subtitles for smooth upward slide & reveal
    const textSelector = [
      'section:not(.hero-section) .section-header h2',
      'section:not(.hero-section) .section-header .section-tag',
      'section:not(.hero-section) .section-header .section-subtitle',
      'section:not(.hero-section) .section-header p',
      '.editorial-story-title',
      '.editorial-story-desc',
      '.editorial-hits-header-left h2',
      '.editorial-hits-header-left p',
      '.editorial-hits-header-left .section-tag',
      '.promo-card-title',
      '.promo-card-desc',
      'section:not(.hero-section) .section-title',
      'section:not(.hero-section) .section-description',
      'section:not(.hero-section) .lead-text',
      '.footer-info-col'
    ].join(',');

    const textElements = document.querySelectorAll(textSelector);
    textElements.forEach((el, index) => {
      if (el.closest('.hero-section, .site-header, .mobile-nav-drawer, .dish-card, .menu-card, .cat-card')) return;
      if (!el.classList.contains('scroll-in-view') && !el.classList.contains('scroll-anim-done')) {
        const rect = el.getBoundingClientRect();
        if (currentScrollY > 150 && rect.top >= 0 && rect.bottom <= vh) {
          el.classList.add('scroll-in-view');
          el.classList.add('scroll-anim-done');
          return;
        }

        el.classList.add('scroll-slide-up');
        const delay = (index % 3) * 0.04;
        el.style.transitionDelay = `${delay}s`;
      }
    });

    // 3. Setup Intersection Observer
    const animatedElements = document.querySelectorAll('.scroll-zoom:not(.scroll-in-view):not(.scroll-anim-done), .scroll-slide-up:not(.scroll-in-view):not(.scroll-anim-done), .scroll-slide-left:not(.scroll-in-view):not(.scroll-anim-done), .scroll-slide-right:not(.scroll-in-view):not(.scroll-anim-done)');

    if ('IntersectionObserver' in window) {
      if (!globalScrollObserver) {
        globalScrollObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target;
              target.classList.add('scroll-in-view');
              target.classList.add('scroll-anim-done');
              obs.unobserve(target);

              // Seamless cleanup: after transition completes (600ms), remove animation lock classes
              // so that all hover effects (translateY, box-shadows, scales) work natively with zero interference!
              setTimeout(() => {
                target.classList.remove('scroll-zoom', 'scroll-slide-up', 'scroll-slide-left', 'scroll-slide-right', 'scroll-in-view');
                target.style.transitionDelay = '';
              }, 650);
            }
          });
        }, {
          root: null,
          rootMargin: '0px 0px -20px 0px',
          threshold: 0.04
        });
      }

      animatedElements.forEach(el => globalScrollObserver.observe(el));
    } else {
      animatedElements.forEach(el => el.classList.add('scroll-in-view'));
    }
  };

  // Helper to create individual interactive dish card (Picture 1 Exact Design)
  const createDishCardElement = (dish) => {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-id', dish.id);
    card.setAttribute('data-category', dish.category);

    const subText = dish.sub || `${dish.jpName || ''} • ${dish.origin ? dish.origin.split(',')[0] : ''}`;
    const priceNum = typeof dish.price === 'number' ? dish.price : parseFloat(dish.price) || 0;

    card.innerHTML = `
      <div class="card-media">
        <img src="${dish.image || './images/hero_tuna.jpg'}" alt="${dish.enName || 'Dish'}" class="card-img" loading="lazy" onerror="this.src='./images/hero_tuna.jpg'">
      </div>
      <div class="card-content">
        <div class="card-titles-wrap">
          <h4 class="card-en-title">${dish.enName || 'Dish'}</h4>
          <span class="card-sub-text">${subText}</span>
        </div>
        <div class="card-footer">
          <span class="card-price">$${priceNum.toFixed(2)}</span>
          <button class="card-quick-add" title="Quick Add to Order" data-id="${dish.id}" aria-label="Add ${dish.enName || 'Dish'}">+</button>
        </div>
      </div>
    `;

    // Clicking card opens the Dish Details Drawer
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-quick-add')) {
        e.stopPropagation();
        addToCart(dish.id, 1);
        playZenChime(659);
        return;
      }
      openDishDrawer(dish);
    });

    return card;
  };

  // --- HOME PAGE: SIGNATURE DISHES CENTER-FOCUS SLIDING CAROUSEL ---
  const sigViewport = document.getElementById('sigCarouselViewport');
  const sigTrack = document.getElementById('homeFeaturedGrid');
  const sigPrevBtn = document.getElementById('sigPrevBtn');
  const sigNextBtn = document.getElementById('sigNextBtn');
  const sigDotsContainer = document.getElementById('sigDotsContainer');

  if (sigTrack && sigViewport) {
    const originalCards = Array.from(sigTrack.children);
    const count = originalCards.length; // 5 cards

    // Build indicator dots for the 5 dishes
    if (sigDotsContainer) {
      sigDotsContainer.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = `sig-nav-dot ${i === 2 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `View signature dish ${i + 1}`);
        dot.addEventListener('click', () => {
          goToOriginalIndex(i);
        });
        sigDotsContainer.appendChild(dot);
      }
    }

    // Clone sets for infinite smooth wrapping: [Set0 (clones), Set1 (originals), Set2 (clones)]
    const firstOriginalCard = originalCards[0];
    originalCards.forEach(card => {
      const cloneBefore = card.cloneNode(true);
      cloneBefore.classList.add('is-clone');
      sigTrack.insertBefore(cloneBefore, firstOriginalCard);
    });
    originalCards.forEach(card => {
      const cloneAfter = card.cloneNode(true);
      cloneAfter.classList.add('is-clone');
      sigTrack.appendChild(cloneAfter);
    });

    let allCards = Array.from(sigTrack.children);
    // Center index in the 15-card array: starts at 7 (middle card of original 5)
    let currentIndex = count + Math.floor(count / 2); // 5 + 2 = 7
    let isTransitioning = false;
    let autoSlideTimer = null;
    let isHovered = false;

    const updateCarousel = (animate = true) => {
      if (!sigViewport) return;

      const viewportWidth = sigViewport.offsetWidth;
      const activeCard = allCards[currentIndex];
      if (!activeCard) return;

      const cardWidth = activeCard.offsetWidth || 226;
      const trackStyle = window.getComputedStyle(sigTrack);
      const gap = parseFloat(trackStyle.gap) || 20;
      const step = cardWidth + gap;

      // Position activeCard directly in the horizontal center of viewport
      const offset = (viewportWidth / 2) - (currentIndex * step + cardWidth / 2);

      sigTrack.style.transition = animate ? 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
      sigTrack.style.transform = `translateX(${offset}px)`;

      // Update height classes: Synchronize height for all clone instances of the active dish
      // Because sets 0, 1, and 2 are identical, synchronizing height ensures that
      // when transitioning or resetting at boundary (index 10 -> index 5 for Hon-Maguro Otoro),
      // the replacement card at index 5 ALREADY has identical height and layout.
      // Zero re-animation, zero jitter, zero lag!
      const activeOriginalIdx = ((currentIndex % count) + count) % count;
      allCards.forEach((c, idx) => {
        const cardOriginalIdx = ((idx % count) + count) % count;
        if (cardOriginalIdx === activeOriginalIdx) {
          c.classList.add('is-center');
        } else {
          c.classList.remove('is-center');
        }
      });

      // Update dot indicators
      if (sigDotsContainer) {
        const dots = sigDotsContainer.querySelectorAll('.sig-nav-dot');
        dots.forEach((dot, dIdx) => {
          dot.classList.toggle('active', dIdx === activeOriginalIdx);
        });
      }
    };

    let transitionSafetyTimer = null;

    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateCarousel(true);
      clearTimeout(transitionSafetyTimer);
      transitionSafetyTimer = setTimeout(() => {
        isTransitioning = false;
      }, 600);
    };

    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateCarousel(true);
      clearTimeout(transitionSafetyTimer);
      transitionSafetyTimer = setTimeout(() => {
        isTransitioning = false;
      }, 600);
    };

    const goToOriginalIndex = (targetOrigIdx) => {
      const currentOrigIdx = ((currentIndex % count) + count) % count;
      let diff = targetOrigIdx - currentOrigIdx;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      currentIndex += diff;
      updateCarousel(true);
      resetAutoSlide();
    };

    // Seamless Infinite Looping on transition end
    sigTrack.addEventListener('transitionend', (e) => {
      // CRITICAL FIX: Only respond to sigTrack's own transform transition!
      // Ignore bubbled transitionend events from child card elements (height, opacity, etc.)
      if (e.target !== sigTrack || e.propertyName !== 'transform') return;

      clearTimeout(transitionSafetyTimer);
      isTransitioning = false;

      // If we moved into clone set 2 or 0, reset silently to set 1 with transitions killed
      if (currentIndex >= count * 2 || currentIndex < count) {
        sigTrack.classList.add('no-transition');
        if (currentIndex >= count * 2) {
          currentIndex -= count;
        } else if (currentIndex < count) {
          currentIndex += count;
        }
        updateCarousel(false);
        void sigTrack.offsetHeight; // Force reflow
        sigTrack.classList.remove('no-transition');
      }
    });

    // Arrow buttons
    if (sigNextBtn) {
      sigNextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }
    if (sigPrevBtn) {
      sigPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    // Unified Card & Button Click Handler
    sigTrack.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.hit-add-btn');
      if (addBtn) {
        e.stopPropagation();
        const dishId = addBtn.getAttribute('data-id');
        if (dishId) {
          addToCart(dishId, 1);
          playZenChime(659);
        }
        return;
      }

      const clickedCard = e.target.closest('.hit-dish-card');
      if (!clickedCard) return;

      const clickedIdx = allCards.indexOf(clickedCard);
      if (clickedIdx !== -1) {
        currentIndex = clickedIdx;
        updateCarousel(true);
        resetAutoSlide();
      }

      // Always open full dish details drawer on click
      const dishId = clickedCard.getAttribute('data-id');
      const dish = menuDishes.find(d => d.id === dishId);
      if (dish) {
        openDishDrawer(dish);
      }
    });

    // Auto-slide right-to-left smoothly (3.5s interval with viewport pausing to eliminate scroll lag)
    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        if (!isHovered) {
          nextSlide();
        }
      }, 3500);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    const resetAutoSlide = () => {
      startAutoSlide();
    };

    // Pause on hover with auto-resume so cards continuously rotate automatically
    let hoverTimeout = null;
    sigViewport.addEventListener('mouseenter', () => {
      isHovered = true;
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        isHovered = false;
      }, 2500);
    });
    sigViewport.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      isHovered = false;
    });

    // Touch swipe support for mobile & tablet
    let touchStartX = 0;
    let isTouching = false;

    sigViewport.addEventListener('touchstart', (e) => {
      isHovered = true;
      touchStartX = e.touches[0].clientX;
      isTouching = true;
    }, { passive: true });

    sigViewport.addEventListener('touchend', (e) => {
      if (!isTouching) return;
      isTouching = false;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (diff < -35) {
        nextSlide();
      } else if (diff > 35) {
        prevSlide();
      }
      setTimeout(() => { isHovered = false; }, 800);
    }, { passive: true });

    // Window resize debounce
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCarousel(false);
      }, 100);
    }, { passive: true });

    // Initial positioning & observe viewport to only auto-slide when on screen
    setTimeout(() => {
      updateCarousel(false);
      if ('IntersectionObserver' in window) {
        const carouselObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startAutoSlide();
            } else {
              stopAutoSlide();
            }
          });
        }, { threshold: 0.1 });
        carouselObserver.observe(sigViewport);
      } else {
        startAutoSlide();
      }
    }, 150);
  }


  // Category Cards Interaction (Top Row)
  const catCards = document.querySelectorAll('.cat-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Promo Banner & Footer Reserve CTA buttons
  const promoReserveBtn = document.getElementById('promoReserveBtn');
  const footerBookBtn = document.getElementById('footerBookBtn');
  if (promoReserveBtn) {
    promoReserveBtn.addEventListener('click', () => {
      openReserveModal();
    });
  }
  if (footerBookBtn) {
    footerBookBtn.addEventListener('click', () => {
      openReserveModal();
    });
  }

  // --- MENU PAGE: FULL CATALOG WITH CATEGORIES & SEARCH ---
  const dishesGrid = document.getElementById('dishesGrid');
  let activeCategory = 'all';
  let activeDietary = 'all';
  let activeSearch = '';

  const renderDishes = () => {
    if (!dishesGrid) return;
    dishesGrid.innerHTML = '';

    const filtered = menuDishes.filter(dish => {
      const matchCat = activeCategory === 'all' || dish.category === activeCategory;
      const matchSearch = !activeSearch || 
        dish.enName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        dish.jpName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        dish.desc.toLowerCase().includes(activeSearch.toLowerCase()) ||
        dish.ingredients.some(i => i.toLowerCase().includes(activeSearch.toLowerCase()));
      
      let matchDiet = true;
      if (activeDietary === 'gluten-free') {
        matchDiet = !dish.ingredients.some(i => i.toLowerCase().includes('shoyu') || i.toLowerCase().includes('tare'));
      } else if (activeDietary === 'raw') {
        matchDiet = dish.category === 'nigiri';
      } else if (activeDietary === 'grilled') {
        matchDiet = dish.category === 'robata';
      }

      return matchCat && matchSearch && matchDiet;
    });

    if (filtered.length === 0) {
      dishesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🥢</div>
          <p style="font-size: 1.1rem; color: var(--palette-cream); font-weight: 700;">No culinary items found</p>
          <small>Try selecting a different category or clearing your search term.</small>
        </div>
      `;
      return;
    }

    filtered.forEach((dish) => {
      const card = createDishCardElement(dish);
      dishesGrid.appendChild(card);
    });

    if (typeof initScrollAnimations === 'function') {
      initScrollAnimations();
    }
  };

  renderDishes();

  // Search input listener (Menu page)
  const menuSearchInput = document.getElementById('menuSearchInput');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      activeSearch = e.target.value.trim();
      renderDishes();
    });
  }

  // Dietary tags filter (Menu page)
  const dietBtns = document.querySelectorAll('.diet-tag-btn');
  dietBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dietBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDietary = btn.dataset.filter;
      renderDishes();
      playZenChime(640);
    });
  });

  // --- SCROLLABLE CATEGORIES NAVIGATION & DYNAMIC CUSTOM CATEGORIES ---
  let menuCategories = [
    { id: "nigiri", name: "Nigiri & Sashimi", kanji: "握り" },
    { id: "signature", name: "Chef's Signatures", kanji: "特撰" },
    { id: "robata", name: "Binchotan Robata", kanji: "炉端" },
    { id: "izakaya", name: "Izakaya Small Plates", kanji: "居酒" },
    { id: "sake", name: "Sake & Drinks", kanji: "酒" },
    { id: "dessert", name: "Desserts", kanji: "甘味" }
  ];

  const attachCategoryListeners = () => {
    const container = document.getElementById('categoryScrollContainer');
    if (!container) return;
    container.querySelectorAll('.cat-pill').forEach(pill => {
      pill.onclick = () => {
        container.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.category;
        renderDishes();
        if (typeof playZenChime === 'function') playZenChime(720);
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      };
    });
  };

  const renderCategoryPills = () => {
    const container = document.getElementById('categoryScrollContainer');
    if (!container || !Array.isArray(menuCategories)) return;
    
    let html = `
      <button class="cat-pill ${activeCategory === 'all' ? 'active' : ''}" data-category="all">
        <span class="cat-kanji">全</span>
        <span class="cat-name">All Items</span>
      </button>
    `;

    menuCategories.forEach(cat => {
      const isActive = activeCategory === cat.id ? 'active' : '';
      html += `
        <button class="cat-pill ${isActive}" data-category="${cat.id}">
          <span class="cat-kanji">${cat.kanji || '食'}</span>
          <span class="cat-name">${cat.name}</span>
        </button>
      `;
    });

    container.innerHTML = html;
    attachCategoryListeners();
  };

  const syncCategoriesData = async () => {
    try {
      const local = localStorage.getItem('akaoni_menu_categories');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          menuCategories = parsed;
          renderCategoryPills();
        }
      }
    } catch(e) {}

    try {
      const res = await fetch('categories.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          menuCategories = data;
          localStorage.setItem('akaoni_menu_categories', JSON.stringify(data));
          renderCategoryPills();
        }
      }
    } catch(e) {}
  };

  const syncDishesData = async () => {
    try {
      const local = localStorage.getItem('akaoni_menu_dishes');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          menuDishes = parsed;
          renderDishes();
        }
      }
    } catch(e) {}

    try {
      const res = await fetch('dishes.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          menuDishes = data;
          localStorage.setItem('akaoni_menu_dishes', JSON.stringify(data));
          renderDishes();
        }
      }
    } catch (e) {}
  };

  // Wire up existing static pills first
  attachCategoryListeners();

  // Then sync async data
  syncDishesData();
  syncCategoriesData();

  window.addEventListener('storage', (e) => {
    if (e.key === 'akaoni_menu_dishes' && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        if (Array.isArray(updated) && updated.length > 0) {
          menuDishes = updated;
          renderDishes();
        }
      } catch (err) {}
    }
    if (e.key === 'akaoni_menu_categories' && e.newValue) {
      try {
        const updatedCats = JSON.parse(e.newValue);
        if (Array.isArray(updatedCats) && updatedCats.length > 0) {
          menuCategories = updatedCats;
          renderCategoryPills();
        }
      } catch (err) {}
    }
  });

  // --- DISH DETAILS DRAWER SYSTEM (User requirement: "menu bare jeno card thake prottecta card theke jeno drawer open hoy") ---
  const dishDrawer = document.getElementById('dishDrawer');
  const dishDrawerBackdrop = document.getElementById('dishDrawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  // Drawer Elements
  const drawerCategoryBadge = document.getElementById('drawerCategoryBadge');
  const drawerDishImage = document.getElementById('drawerDishImage');
  const drawerKanjiStamp = document.getElementById('drawerKanjiStamp');
  const drawerJpName = document.getElementById('drawerJpName');
  const drawerOrigin = document.getElementById('drawerOrigin');
  const drawerDishTitle = document.getElementById('drawerDishTitle');
  const drawerDishPrice = document.getElementById('drawerDishPrice');
  const drawerDishDesc = document.getElementById('drawerDishDesc');
  const barUmami = document.getElementById('barUmami');
  const barRichness = document.getElementById('barRichness');
  const barSweetness = document.getElementById('barSweetness');
  const drawerIngredientsList = document.getElementById('drawerIngredientsList');
  const drawerPairingText = document.getElementById('drawerPairingText');
  const drawerQtyVal = document.getElementById('drawerQtyVal');
  const drawerTotalCalc = document.getElementById('drawerTotalCalc');
  const drawerQtyMinus = document.getElementById('drawerQtyMinus');
  const drawerQtyPlus = document.getElementById('drawerQtyPlus');
  const drawerAddToCartBtn = document.getElementById('drawerAddToCartBtn');
  const drawerReserveThisBtn = document.getElementById('drawerReserveThisBtn');

  let activeDrawerDish = null;
  let drawerQty = 1;

  const openDishDrawer = (dish) => {
    activeDrawerDish = dish;
    drawerQty = 1;

    drawerCategoryBadge.textContent = dish.category.toUpperCase();
    drawerDishImage.src = dish.image;
    drawerDishImage.alt = dish.enName;
    drawerKanjiStamp.textContent = dish.jpName.slice(0, 2);
    drawerJpName.textContent = dish.jpName;
    drawerOrigin.textContent = dish.origin;
    drawerDishTitle.textContent = dish.enName;
    const priceNum = typeof dish.price === 'number' ? dish.price : parseFloat(dish.price) || 0;
    drawerDishPrice.textContent = `$${priceNum.toFixed(2)}`;
    drawerDishDesc.textContent = dish.desc;

    // Flavor bars
    barUmami.style.width = `${dish.umami || 80}%`;
    barRichness.style.width = `${dish.richness || 80}%`;
    barSweetness.style.width = `${dish.sweetness || 75}%`;

    // Ingredients
    drawerIngredientsList.innerHTML = Array.isArray(dish.ingredients) ? dish.ingredients.map(ing => `<span class="d-tag">${ing}</span>`).join('') : '';
    drawerPairingText.textContent = dish.pairing || 'Complements dry Japanese sake.';

    // Quantity & Total
    drawerQtyVal.textContent = '1';
    drawerTotalCalc.textContent = `$${priceNum.toFixed(2)}`;

    dishDrawer.style.transform = '';
    dishDrawer.classList.add('active');
    dishDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset drawer scroll to top for full view
    dishDrawer.scrollTop = 0;
    const dBody = document.getElementById('drawerBody');
    if (dBody) dBody.scrollTop = 0;

    playZenChime(600);
  };

  const closeDishDrawer = () => {
    dishDrawer.classList.remove('active');
    dishDrawerBackdrop.classList.remove('active');
    dishDrawer.style.transform = '';
    document.body.style.overflow = '';
  };

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDishDrawer);
  if (dishDrawerBackdrop) dishDrawerBackdrop.addEventListener('click', closeDishDrawer);

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dishDrawer && dishDrawer.classList.contains('active')) {
      closeDishDrawer();
    }
  });

  // Category horizontal scroll arrow button click handler
  const scrollHintBtn = document.getElementById('scrollHintIndicator');
  if (scrollHintBtn) {
    scrollHintBtn.addEventListener('click', () => {
      const container = document.getElementById('categoryScrollContainer');
      if (container) {
        container.scrollBy({ left: 200, behavior: 'smooth' });
      }
    });
  }

  // Drawer Quantity controls
  if (drawerQtyMinus && drawerQtyPlus) {
    drawerQtyMinus.addEventListener('click', () => {
      if (drawerQty > 1) {
        drawerQty--;
        drawerQtyVal.textContent = drawerQty;
        if (activeDrawerDish) {
          const p = typeof activeDrawerDish.price === 'number' ? activeDrawerDish.price : parseFloat(activeDrawerDish.price) || 0;
          drawerTotalCalc.textContent = `$${(p * drawerQty).toFixed(2)}`;
        }
      }
    });

    drawerQtyPlus.addEventListener('click', () => {
      drawerQty++;
      drawerQtyVal.textContent = drawerQty;
      if (activeDrawerDish) {
        const p = typeof activeDrawerDish.price === 'number' ? activeDrawerDish.price : parseFloat(activeDrawerDish.price) || 0;
        drawerTotalCalc.textContent = `$${(p * drawerQty).toFixed(2)}`;
      }
    });
  }

  // Drawer Add to Cart Button
  if (drawerAddToCartBtn) {
    drawerAddToCartBtn.addEventListener('click', () => {
      if (activeDrawerDish) {
        addToCart(activeDrawerDish.id, drawerQty);
        closeDishDrawer();
      }
    });
  }

  // Drawer "Book Table to Taste This" CTA
  if (drawerReserveThisBtn) {
    drawerReserveThisBtn.addEventListener('click', () => {
      closeDishDrawer();
      openReserveModal(activeDrawerDish ? `Dish requested: ${activeDrawerDish.enName}` : '');
    });
  }

  // Hero "View Tasting Details" button
  const heroDetailsBtn = document.getElementById('heroDetailsBtn');
  if (heroDetailsBtn) {
    heroDetailsBtn.addEventListener('click', () => {
      const currentDish = menuDishes.find(d => {
        if (currentThemeKey === 'tuna') return d.id === 'dish-1';
        if (currentThemeKey === 'salmon') return d.id === 'dish-2';
        if (currentThemeKey === 'uni') return d.id === 'dish-3';
        if (currentThemeKey === 'matcha') return d.id === 'dish-8';
        return d.id === 'dish-1';
      });
      if (currentDish) openDishDrawer(currentDish);
    });
  }

  // Also clicking the Hero 3D Plate directly opens the dish drawer
  const plateSpinnerEl = document.getElementById('plateSpinner');
  if (plateSpinnerEl) {
    plateSpinnerEl.style.cursor = 'pointer';
    plateSpinnerEl.setAttribute('title', 'Click to view tasting notes & artisan details');
    plateSpinnerEl.addEventListener('click', () => {
      const currentDish = menuDishes.find(d => {
        if (currentThemeKey === 'tuna') return d.id === 'dish-1';
        if (currentThemeKey === 'salmon') return d.id === 'dish-2';
        if (currentThemeKey === 'uni') return d.id === 'dish-3';
        if (currentThemeKey === 'matcha') return d.id === 'dish-8';
        return d.id === 'dish-1';
      });
      if (currentDish) openDishDrawer(currentDish);
    });
  }

  // Hero "Add to Order" button
  const heroOrderBtn = document.getElementById('heroOrderBtn');
  if (heroOrderBtn) {
    heroOrderBtn.addEventListener('click', () => {
      const currentDish = menuDishes.find(d => {
        if (currentThemeKey === 'tuna') return d.id === 'dish-1';
        if (currentThemeKey === 'salmon') return d.id === 'dish-2';
        if (currentThemeKey === 'uni') return d.id === 'dish-3';
        if (currentThemeKey === 'matcha') return d.id === 'dish-8';
        return d.id === 'dish-1';
      });
      if (currentDish) addToCart(currentDish.id, 1);
    });
  }

  // --- TABLE RESERVATION SYSTEM (User requirement: "table book korar option rakhaba") ---
  const reserveModal = document.getElementById('reserveModal');
  const reserveModalBackdrop = document.getElementById('reserveModalBackdrop');
  const reserveModalCloseBtn = document.getElementById('reserveModalCloseBtn');
  const openReserveModalBtn = document.getElementById('openReserveModalBtn');
  const mobileNavBookBtn = document.getElementById('mobileNavBookBtn');

  const bookingModalFormView = document.getElementById('bookingModalFormView');
  const bookingConfirmationView = document.getElementById('bookingConfirmationView');
  const modalBookingForm = document.getElementById('modalBookingForm');
  const confDoneBtn = document.getElementById('confDoneBtn');

  // Confirmation view elements
  const confRefCode = document.getElementById('confRefCode');
  const confGuestName = document.getElementById('confGuestName');
  const confPartySize = document.getElementById('confPartySize');
  const confDate = document.getElementById('confDate');
  const confTime = document.getElementById('confTime');
  const confSeating = document.getElementById('confSeating');

  // Prefill default date to tomorrow
  const setDefaultDate = (inputEl) => {
    if (!inputEl) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    inputEl.value = `${yyyy}-${mm}-${dd}`;
    inputEl.min = `${yyyy}-${mm}-${dd}`;
  };

  setDefaultDate(document.getElementById('resDate'));
  setDefaultDate(document.getElementById('modalDate'));

  const openReserveModal = (prefillNotes = '') => {
    if (prefillNotes) {
      const notesEl = document.getElementById('modalNotes');
      if (notesEl) notesEl.value = prefillNotes;
    }
    bookingModalFormView.classList.remove('hidden');
    bookingConfirmationView.classList.add('hidden');
    reserveModal.classList.add('active');
    reserveModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    playZenChime(660);
  };

  const closeReserveModal = () => {
    reserveModal.classList.remove('active');
    reserveModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openReserveModalBtn) openReserveModalBtn.addEventListener('click', () => openReserveModal());
  if (mobileNavBookBtn) {
    mobileNavBookBtn.addEventListener('click', () => {
      closeMobileNav();
      openReserveModal();
    });
  }
  if (reserveModalCloseBtn) reserveModalCloseBtn.addEventListener('click', closeReserveModal);
  if (reserveModalBackdrop) reserveModalBackdrop.addEventListener('click', closeReserveModal);
  if (confDoneBtn) confDoneBtn.addEventListener('click', closeReserveModal);

  // Handle Modal Reservation Submission
  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guests = document.getElementById('modalGuests').value;
      const seating = document.getElementById('modalSeating').value;
      const date = document.getElementById('modalDate').value;
      const time = document.getElementById('modalTime').value;
      const name = document.getElementById('modalName').value;
      const phone = document.getElementById('modalPhone').value;

      const refId = `#AK-${Math.floor(1000 + Math.random() * 9000)}`;

      confRefCode.textContent = refId;
      confGuestName.textContent = name;
      confPartySize.textContent = `${guests} Guests`;
      confDate.textContent = date;
      confTime.textContent = time;
      confSeating.textContent = seating;

      bookingModalFormView.classList.add('hidden');
      bookingConfirmationView.classList.remove('hidden');

      playZenChime(880, 'sine', 0.8);
      showToast(`🎉 Reservation confirmed for ${name}! Ref: ${refId}`, 'success');
    });
  }

  // Handle On-Page Main Reservation Form
  const mainBookingForm = document.getElementById('mainBookingForm');
  const guestsSelector = document.getElementById('guestsSelector');
  const guestsInput = document.getElementById('guestsInput');
  const timeSlotsGrid = document.getElementById('timeSlotsGrid');
  const timeInput = document.getElementById('timeInput');

  if (guestsSelector && guestsInput) {
    guestsSelector.querySelectorAll('.guest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        guestsSelector.querySelectorAll('.guest-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        guestsInput.value = btn.dataset.val;
        playZenChime(700);
      });
    });
  }

  if (timeSlotsGrid && timeInput) {
    timeSlotsGrid.querySelectorAll('.time-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timeSlotsGrid.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeInput.value = btn.dataset.time;
        playZenChime(750);
      });
    });
  }

  if (mainBookingForm) {
    mainBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guests = guestsInput.value;
      const seating = document.getElementById('resSeating').value;
      const date = document.getElementById('resDate').value;
      const time = timeInput.value;
      const name = document.getElementById('resName').value;

      const refId = `#AK-${Math.floor(1000 + Math.random() * 9000)}`;

      confRefCode.textContent = refId;
      confGuestName.textContent = name;
      confPartySize.textContent = `${guests} Guests`;
      confDate.textContent = date;
      confTime.textContent = time;
      confSeating.textContent = seating;

      bookingModalFormView.classList.add('hidden');
      bookingConfirmationView.classList.remove('hidden');
      reserveModal.classList.add('active');
      reserveModalBackdrop.classList.add('active');

      playZenChime(880, 'sine', 0.8);
      showToast(`🎉 Table reserved for ${name} at ${time}! Ref: ${refId}`, 'success');
    });
  }

  // --- CART / ORDER SYSTEM ---
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartDrawerSubtitle = document.getElementById('cartDrawerSubtitle');
  const cartSubtotalVal = document.getElementById('cartSubtotalVal');
  const cartTaxVal = document.getElementById('cartTaxVal');
  const cartTotalVal = document.getElementById('cartTotalVal');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  let cart = [];

  const updateCartUI = () => {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.textContent = totalCount;
    cartDrawerSubtitle.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'} selected`;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-icon">🍣</div>
          <p>Your order bag is currently empty.</p>
          <small>Explore our seasonal menu and select your favorite creations!</small>
        </div>
      `;
      cartSubtotalVal.textContent = '$0.00';
      cartTaxVal.textContent = '$0.00';
      cartTotalVal.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
      subtotal += item.price * item.qty;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';
      itemRow.innerHTML = `
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.enName}">
        </div>
        <div class="cart-item-info">
          <h5 class="cart-item-name">${item.enName}</h5>
          <span class="cart-item-unit-price">$${item.price.toFixed(2)} ea</span>
        </div>
        <div class="cart-item-controls">
          <div class="drawer-qty-control">
            <button class="qty-btn cart-minus" data-id="${item.id}">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn cart-plus" data-id="${item.id}">+</button>
          </div>
          <button class="cart-item-del-btn" data-id="${item.id}" title="Remove Item">&times;</button>
        </div>
      `;
      cartItemsList.appendChild(itemRow);
    });

    const tax = subtotal * 0.0925;
    const total = subtotal + tax;

    cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    cartTaxVal.textContent = `$${tax.toFixed(2)}`;
    cartTotalVal.textContent = `$${total.toFixed(2)}`;

    // Attach quantity event listeners
    cartItemsList.querySelectorAll('.cart-minus').forEach(btn => {
      btn.addEventListener('click', () => changeCartQty(btn.dataset.id, -1));
    });
    cartItemsList.querySelectorAll('.cart-plus').forEach(btn => {
      btn.addEventListener('click', () => changeCartQty(btn.dataset.id, 1));
    });
    cartItemsList.querySelectorAll('.cart-item-del-btn').forEach(btn => {
      btn.addEventListener('click', () => removeCartItem(btn.dataset.id));
    });
  };

  const addToCart = (dishId, qty = 1) => {
    const dish = menuDishes.find(d => d.id === dishId);
    if (!dish) return;

    const existing = cart.find(i => i.id === dishId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: dish.id,
        enName: dish.enName,
        price: dish.price,
        image: dish.image,
        qty: qty
      });
    }

    updateCartUI();
    playZenChime(800);
    showToast(`Added ${qty}x ${dish.enName} to Order`, 'success');

    // Bounce cart badge
    cartCountBadge.style.transform = 'scale(1.4)';
    setTimeout(() => {
      cartCountBadge.style.transform = 'scale(1)';
    }, 250);
  };

  const changeCartQty = (dishId, delta) => {
    const item = cart.find(i => i.id === dishId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== dishId);
    }
    updateCartUI();
  };

  const removeCartItem = (dishId) => {
    cart = cart.filter(i => i.id !== dishId);
    updateCartUI();
    showToast('Item removed from order', 'info');
  };

  const openCartDrawer = () => {
    cartDrawer.classList.add('active');
    cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    playZenChime(650);
  };

  const closeCartDrawer = () => {
    cartDrawer.classList.remove('active');
    cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', closeCartDrawer);

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Please add items to your order first.', 'warning');
        return;
      }
      playZenChime(880);
      showToast('🍣 Order sent to Akaoni Kitchen! Arigato gozaimasu.', 'success');
      cart = [];
      updateCartUI();
      closeCartDrawer();
    });
  }

  // --- MOBILE NAVIGATION DRAWER ---
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavCloseBtn = document.getElementById('mobileNavCloseBtn');

  const openMobileNav = () => {
    mobileNavDrawer.classList.add('active');
    mobileNavBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileNavDrawer.classList.remove('active');
    mobileNavBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileNav);
  if (mobileNavCloseBtn) mobileNavCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // --- HEADER SCROLL DETECTOR (Optimized with rAF & passive event listener) ---
  const siteHeader = document.getElementById('siteHeader');
  let headerTicking = false;
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      window.requestAnimationFrame(() => {
        if (siteHeader) {
          if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
          } else {
            siteHeader.classList.remove('scrolled');
          }
        }
        headerTicking = false;
      });
      headerTicking = true;
    }
  }, { passive: true });

  // --- TOAST NOTIFICATION UTILITY ---
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- SANCTUARY EDITORIAL TAB SWITCHING (Picture 1 Interactive Showcase) ---
  const editorialTabs = document.querySelectorAll('.editorial-tab-btn');
  const showcaseIntro = document.getElementById('showcaseIntro');
  const showcaseHeading = document.getElementById('showcaseHeading');
  const showcaseDesc = document.getElementById('showcaseDesc');
  const showcaseBullets = document.getElementById('showcaseBullets');
  const showcasePhoto = document.getElementById('showcasePhoto');
  const showcaseBadgeKanji = document.querySelector('.badge-kanji-stamp');
  const showcaseBadgeText = document.querySelector('.badge-sub-text');

  const editorialContent = {
    heritage: {
      intro: "When you step through our wooden noren into Akaoni Carmel, you enter an intimate sanctuary where ancient Edomae traditions honor the cold Pacific's freshest harvests.",
      heading: "The Spirit of Akaoni (赤鬼)",
      desc: "In Japanese lore, Akaoni represents fierce determination, unyielding passion, and protective loyalty. In our kitchen, that spirit manifests in an uncompromising obsession with pure ingredients — Toyosu Bluefin, Hokkaido Uni, aged akazu rice, and binchotan embers.",
      bullets: [
        { mark: "✿", title: "Artisanal Akazu Rice:", text: "Seasoned at exact body temperature with aged sake lees vinegar for deep golden umami." },
        { mark: "✿", title: "Pure Kishu Binchotan:", text: "Smokeless 1000°C white oak charcoal imparting crisp seared robata perfection." },
        { mark: "✿", title: "Intimate 20 Counter Seats:", text: "A tranquil Japanese haven away from crowds, focused purely on each exquisite bite." }
      ],
      photo: "./images/restaurant_interior.jpg",
      badgeKanji: "一期一会",
      badgeText: "Ichigo Ichie — Treasure Every Encounter"
    },
    harvest: {
      intro: "Air-freighted twice weekly across the Pacific and harvested daily from Carmel Bay, each cut is served at the absolute zenith of seasonal flavor.",
      heading: "Tokyo’s Toyosu & Monterey Pacific Harvest",
      desc: "Our master chef personally evaluates seasonal fish auctions direct from Toyosu Market, Tokyo. Combined with wild Pacific Hamachi, King Salmon, and Santa Barbara Sea Urchin, every piece reflects our devotion to unadulterated freshness.",
      bullets: [
        { mark: "✿", title: "Hon-Maguro Bluefin:", text: "Pristine Otoro and Chutoro cuts aged under controlled temperature to unlock deep fatty melt." },
        { mark: "✿", title: "Hokkaido Bafun Uni:", text: "Rich, creamy kelp-fed sea urchin harvested from cold sub-Arctic Japanese waters." },
        { mark: "✿", title: "Local Monterey Catch:", text: "Wild sea harvests landed fresh along the rugged California coastline daily." }
      ],
      photo: "./images/hero_tuna.jpg",
      badgeKanji: "産地直送",
      badgeText: "Toyosu Auction Grade & Monterey Harvest"
    },
    craft: {
      intro: "True Edomae mastery requires an unspoken dialogue between heat, vinegared rice, and hand technique honed over decades of culinary discipline.",
      heading: "Artisanal Robata & Counter Omakase",
      desc: "Over smokeless Kishu white oak binchotan charcoal, skewers develop an intensely crisp sear while locking in natural umami. Our 20-seat counter offers front-row immersion into culinary artistry.",
      bullets: [
        { mark: "✿", title: "High-Heat Robata Sear:", text: "1000°C embers creating subtle smoky sweetness without harsh flame or bitter soot." },
        { mark: "✿", title: "Nigiri Balance:", text: "Rice gently molded to hold its shape until placed in your mouth, dissolving effortlessly." },
        { mark: "✿", title: "Artisan Sake Pairings:", text: "Curated Junmai Daiginjo and rare sakes selected to elevate each course's subtle notes." }
      ],
      photo: "./images/chef_craft.jpg",
      badgeKanji: "職人技",
      badgeText: "Master Craft & 20-Counter Seat Sanctuary"
    }
  };

  if (editorialTabs && editorialTabs.length > 0) {
    editorialTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        const data = editorialContent[tabKey];
        if (!data) return;

        editorialTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (showcasePhoto) {
          showcasePhoto.style.opacity = '0.2';
          showcasePhoto.style.transform = 'scale(0.97)';
          setTimeout(() => {
            showcasePhoto.src = data.photo;
            showcasePhoto.style.opacity = '1';
            showcasePhoto.style.transform = 'scale(1)';
          }, 200);
        }

        if (showcaseIntro) showcaseIntro.textContent = data.intro;
        if (showcaseHeading) showcaseHeading.textContent = data.heading;
        if (showcaseDesc) showcaseDesc.textContent = data.desc;
        if (showcaseBadgeKanji) showcaseBadgeKanji.textContent = data.badgeKanji;
        if (showcaseBadgeText) showcaseBadgeText.textContent = data.badgeText;

        if (showcaseBullets) {
          showcaseBullets.innerHTML = data.bullets.map(b => `
            <div class="showcase-bullet-item">
              <span class="bullet-flower-mark">${b.mark}</span>
              <div class="bullet-text">
                <strong>${b.title}</strong> ${b.text}
              </div>
            </div>
          `).join('');
        }

        playZenChime(740, 'sine', 0.25);
      });
    });
  }
  // Run scroll animations setup
  initScrollAnimations();

  // Expose global test helpers if needed
  window.Akaoni = {
    switchCulinaryTheme,
    openDishDrawer,
    openReserveModal,
    addToCart,
    initScrollAnimations
  };
});
