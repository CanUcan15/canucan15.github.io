document.addEventListener('DOMContentLoaded', () => {

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const infoCard = document.getElementById('info-card');
  if (!infoCard) {
    console.error('script.js: #info-card not found in DOM.');
    return;
  }

  const showCardClass = () => infoCard.classList.add('visible');
  const hideCardClass = () => infoCard.classList.remove('visible');
  const hideCard = () => hideCardClass();

  function findElementAncestor(node) {
    while (node) {
      if (node.classList && node.classList.contains && node.classList.contains('element')) return node;
      node = node.parentNode;
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    let clickedEl = null;
    try { clickedEl = e.target.closest && e.target.closest('.element'); } catch (err) { clickedEl = null; }
    if (!clickedEl) clickedEl = findElementAncestor(e.target);

    if (!clickedEl) {
      const obj = document.querySelector('object[type="image/svg+xml"], iframe[src$=".svg"]');
      if (obj && obj.contentDocument) {
        try {
          const objRect = obj.getBoundingClientRect();
          const localX = e.clientX - objRect.left;
          const localY = e.clientY - objRect.top;
          const elAtPoint = obj.contentDocument.elementFromPoint(localX, localY);
          if (elAtPoint) {
            let cand = elAtPoint;
            while (cand) {
              if (cand.classList && cand.classList.contains && cand.classList.contains('element')) {
                clickedEl = cand;
                break;
              }
              cand = cand.parentNode;
            }
          }
        } catch (err) { /* ignore cross-origin */ }
      }
    }

    if (clickedEl) {
      e.stopPropagation();

      const read = (k) => clickedEl.getAttribute(k) ?? clickedEl.dataset?.[k] ?? '';

      const name = read('data-name') || read('name') || read('name') || 'Unknown';
      const symbol = read('data-symbol') || read('symbol') || '';
      const atomic = read('data-atomic-number') || read('atomic-number') || read('atomic') || '';
      const group = read('data-group') || '';
      const period = read('data-period') || '';
      const block = read('data-block') || '';
      const configuration = read('data-configuration') || '';
      const mass = read('data-mass') || '';
      const electronegativity = read('data-electronegativity') || '';
      const ionization = read('data-ionization') || '';
      const affinity = read('data-affinity') || '';
      const radius = read('data-radius') || '';
      const melting = read('data-melting') || '';
      const boiling = read('data-boiling') || '';
      const density = read('data-density') || '';
      const state = read('data-state') || '';
      const appearance = read('data-appearance') || '';
      const discoverer = read('data-discoverer') || '';
      const year = read('data-year') || '';
      const magnetic = read('data-magnetic') || '';

      const nameEl = document.getElementById('info-name');
      const symbolEl = document.getElementById('info-symbol');
      if (symbol) {
        history.replaceState(null, '', `#${symbol}`);
      }
      const numberEl = document.getElementById('info-number');
      const groupEl = document.getElementById('info-group');
      const periodEl = document.getElementById('info-period');
      const blockEl = document.getElementById('info-block')
      const configEl = document.getElementById('info-configuration');
      const massEl = document.getElementById('info-mass')
      const electronegativityEl = document.getElementById('info-electronegativity');
      const ionizationEl = document.getElementById('info-ionization');
      const affinityEl = document.getElementById('info-affinity');
      const radiusEl = document.getElementById('info-radius');
      const meltingEl = document.getElementById('info-melting');
      const boilingEl = document.getElementById('info-boiling');
      const densityEl = document.getElementById('info-density');
      const stateEl = document.getElementById('info-state');
      const appearanceEl = document.getElementById('info-appearance');
      const discovererEl = document.getElementById('info-discoverer');
      const yearEl = document.getElementById('info-year');
      const magneticEl = document.getElementById('info-magnetic');

      const contentEl = infoCard.querySelector('.info-card-content') || infoCard;

      contentEl.classList.add('fading');
      setTimeout(() => {
        if (nameEl) nameEl.textContent = name;
        if (symbolEl) symbolEl.textContent = symbol;
        if (numberEl) numberEl.textContent = atomic;
        if (groupEl) groupEl.textContent = group;
        if (periodEl) periodEl.textContent = period;
        if (blockEl) blockEl.textContent = block;
        if (configEl) configEl.textContent = configuration;
        if (massEl) massEl.textContent = mass;
        if (electronegativityEl) electronegativityEl.textContent = electronegativity;
        if (ionizationEl) ionizationEl.textContent = ionization;
        if (affinityEl) affinityEl.textContent = affinity;
        if (radiusEl) radiusEl.textContent = radius;
        if (meltingEl) meltingEl.textContent = melting;
        if (boilingEl) boilingEl.textContent = boiling;
        if (densityEl) densityEl.textContent = density;
        if (stateEl) stateEl.textContent = state;
        if (appearanceEl) appearanceEl.textContent = appearance;
        if (discovererEl) discovererEl.textContent = discoverer;
        if (yearEl) yearEl.textContent = year;
        if (magneticEl) magneticEl.textContent = magnetic;
        contentEl.classList.remove('fading');
      }, 190);

      const wasVisible = infoCard.classList.contains('visible');

      if (!wasVisible) {
        infoCard.style.visibility = 'hidden';
        infoCard.style.opacity = '0';
        infoCard.style.pointerEvents = 'none';
        showCardClass();
        void infoCard.offsetHeight;
      }

      const cardRect = infoCard.getBoundingClientRect();
      let elRect;
      try { elRect = clickedEl.getBoundingClientRect(); }
      catch (err) { elRect = { left: e.clientX, right: e.clientX, top: e.clientY, bottom: e.clientY, width: 0, height: 0 }; }

      const scrollX = window.scrollX || document.documentElement.scrollLeft || 0;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

      const GAP = 12;
      let targetX = elRect.right + scrollX + GAP;
      let targetY = elRect.top + scrollY + (elRect.height - cardRect.height) / 2;

      let flipped = false;
      if (targetX + cardRect.width > scrollX + window.innerWidth - 16) {
        targetX = elRect.left + scrollX - cardRect.width - GAP;
        flipped = true;
      }

      const maxY = scrollY + window.innerHeight - cardRect.height - 8;
      if (targetY > maxY) targetY = maxY;
      if (targetY < scrollY + 8) targetY = scrollY + 8;

      if (flipped) infoCard.classList.add('flipped'); else infoCard.classList.remove('flipped');

      infoCard.style.left = `${Math.round(targetX)}px`;
      infoCard.style.top = `${Math.round(targetY)}px`;
      infoCard.style.visibility = 'visible';
      infoCard.style.opacity = '';
      infoCard.style.pointerEvents = '';

      const arrow = infoCard.querySelector('.info-card-arrow');
      if (arrow) {
        const finalCardRect = infoCard.getBoundingClientRect();
        const elementCenterPageY = elRect.top + scrollY + (elRect.height / 2);
        const cardTopPageY = targetY;
        const offset = elementCenterPageY - (cardTopPageY + finalCardRect.height / 2);
        arrow.style.top = `calc(50% + ${Math.round(offset)}px)`;
      }

      return;
    }

    const insideCard = e.target.closest && e.target.closest('#info-card');
    if (!insideCard) hideCard();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideCard(); });

  hideCard();

  document.querySelectorAll('.element').forEach(el => {
    const rect = el.querySelector('rect');
    const fill = rect ? rect.getAttribute('fill') || '#ffffff' : '#ffffff';

    el.style.setProperty('--accent', fill);
    el.addEventListener('mouseenter', () => el.classList.add('hover-glow'));
    el.addEventListener('mouseleave', () => el.classList.remove('hover-glow'));
  });

  const tooltip = document.getElementById('element-tooltip');

  document.addEventListener('mousemove', (e) => {
    if (!tooltip.classList.contains('visible')) return;

    const offsetX = 12;
    const offsetY = 14;

    const maxX = window.innerWidth - tooltip.offsetWidth - 8;
    const maxY = window.innerHeight - tooltip.offsetHeight - 8;

    const x = Math.min(e.clientX + offsetX, maxX);
    const y = Math.min(e.clientY + offsetY, maxY);

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  });

  
  document.querySelectorAll('.element').forEach(el => {
    const name = el.dataset.name;
    const symbol = el.dataset.symbol;

    el.addEventListener('mouseenter', () => {
      tooltip.innerHTML = `<strong>${symbol}</strong> — ${name}`;
      tooltip.classList.add('visible');
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });

  const canvas = document.getElementById('bg-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  const zoomRange = document.getElementById('zoomRange');
  const svgTable = document.getElementById('periodic-table');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const resetBtn = document.getElementById('resetZoom');

  if (zoomRange && svgTable) {
    let currentZoom = 1;
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    function updateTransform() {
      if (Math.abs(currentZoom - 1) < 0.001) {
        translateX = 0; translateY = 0;
      }
      svgTable.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
      svgTable.style.transformOrigin = 'center center';
    }

    zoomRange.addEventListener('input', () => {
      currentZoom = zoomRange.value / 100;
      updateTransform();
      svgTable.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    });

    const zoomStep = 10;
    zoomInBtn?.addEventListener('click', () => {
      const newValue = Math.min(Number(zoomRange.value) + zoomStep, zoomRange.max);
      zoomRange.value = newValue; currentZoom = newValue / 100; updateTransform();
      svgTable.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    });
    zoomOutBtn?.addEventListener('click', () => {
      const newValue = Math.max(Number(zoomRange.value) - zoomStep, zoomRange.min);
      zoomRange.value = newValue; currentZoom = newValue / 100; updateTransform();
      svgTable.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    });

    svgTable.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || currentZoom <= 1) return;
      isPanning = true; startX = e.clientX - translateX; startY = e.clientY - translateY; svgTable.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      translateX = e.clientX - startX; translateY = e.clientY - startY; updateTransform();
    });
    document.addEventListener('mouseup', () => { if (!isPanning) return; isPanning = false; svgTable.style.cursor = currentZoom > 1 ? 'grab' : 'default'; });

    resetBtn?.addEventListener('click', () => { currentZoom = 1; translateX = 0; translateY = 0; zoomRange.value = 100; updateTransform(); svgTable.style.cursor = 'default'; });

    updateTransform();
  }

  const searchInput = document.getElementById("elementSearch");
  if (searchInput) {
    let lastHighlighted = [];

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();

      lastHighlighted.forEach(el => el.classList.remove("highlight"));
      lastHighlighted = [];

      if (!query) return;

      document.querySelectorAll(".element").forEach((el) => {
        const name = el.dataset.name?.toLowerCase() || "";
        const symbol = el.dataset.symbol?.toLowerCase() || "";

        if (name.includes(query) || symbol.includes(query)) {
          el.classList.add("highlight");
          lastHighlighted.push(el);
        }
      });
    });
  }

  const clearBtn = document.getElementById("clearSearch");

  if (searchInput && clearBtn) {
    searchInput.addEventListener("input", () => {
      clearBtn.style.display = searchInput.value ? "inline" : "none";
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.style.display = "none";

      document.querySelectorAll(".element.highlight").forEach((el) =>
        el.classList.remove("highlight")
      );

      searchInput.focus();
    });
  }

  const filterContainer = document.getElementById('category-filters');
  if (!filterContainer) {
    console.warn("⚠️ No filter container found.");
  } else {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;

      const filter = btn.getAttribute('data-filter');
      console.log(`Filter selected: ${filter}`);

      filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const allGroups = document.querySelectorAll('g.element, g.element-group');

      allGroups.forEach(g => {
        const isGroup = g.classList.contains('element-group');
        const category = g.getAttribute('data-category');

        if (isGroup) {
          g.style.opacity = '1';
          g.style.pointerEvents = 'none';
          return;
        }

        if (filter === 'all' || category === filter) {
          g.style.opacity = '1';
          g.style.pointerEvents = 'auto';
        } else {
          g.style.opacity = '0.15';
          g.style.pointerEvents = 'none';
        }

        g.style.transition = 'opacity 0.25s ease';
      });

      const lanth = document.getElementById('lanthanides');
      const actin = document.getElementById('actinides');

      if (filter === 'all') {
        if (lanth) lanth.style.display = '';
        if (actin) actin.style.display = '';
      } else {
        if (lanth) lanth.style.opacity = '0.15';
        if (actin) actin.style.opacity = '0.15';
      }
    });
  }

});
