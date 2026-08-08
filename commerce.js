(() => {
  const WARA = window.WARA;
  if (!WARA) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statusLabel = (status) => ({
    available: '',
    'sold-out': 'Sold out',
    'coming-soon': 'Coming soon'
  }[status] || '');

  const productUrl = (id, color) => {
    const params = new URLSearchParams({ id });
    if (color) params.set('color', color);
    return `product.html?${params.toString()}`;
  };

  const cardSwatches = (product, selectedColor) => product.colors.map((color) => `
    <button
      class="commerce-swatch"
      type="button"
      style="--swatch:${color.value}"
      data-card-color="${color.slug}"
      aria-label="Show ${product.name} in ${color.name}"
      aria-pressed="${String(color.slug === selectedColor.slug)}"
      title="${color.name}"
    ><span aria-hidden="true"></span></button>
  `).join('');

  const quickSizes = (color) => color.availableSizes.map((size) => `
    <button type="button" data-quick-size="${size}" aria-pressed="false">${size}</button>
  `).join('');

  const productCard = (product, index = 0) => {
    const selectedColor = product.colors[0];
    const primaryImage = selectedColor.images[0];
    const alternateImage = primaryImage.startsWith('assets/images/products/')
      ? primaryImage
      : selectedColor.images[1];
    const unavailable = product.status !== 'available';
    const url = productUrl(product.id, selectedColor.slug);

    return `
      <article
        class="commerce-card"
        data-product-id="${product.id}"
        data-category="${product.category}"
        data-collection="${product.collection}"
        data-selected-color="${selectedColor.slug}"
        style="--card-index:${index}"
      >
        <a class="commerce-card__media" href="${url}" aria-label="View ${product.name}" data-card-product-link>
          <img src="${primaryImage}" alt="${product.name} in ${selectedColor.name}, front view" loading="lazy" decoding="async" data-card-primary>
          <img class="commerce-card__alternate" src="${alternateImage}" alt="${product.name} in ${selectedColor.name}, alternate view" loading="lazy" decoding="async" data-card-alternate>
          ${statusLabel(product.status) ? `<span class="commerce-card__status commerce-card__status--${product.status}">${statusLabel(product.status)}</span>` : ''}
        </a>

        <div class="commerce-card__body">
          <div class="commerce-card__meta">
            <span>${product.collectionCode}</span>
            <span>${product.category}</span>
          </div>
          <div class="commerce-card__heading">
            <h2><a href="${url}" data-card-product-link>${product.name}</a></h2>
            <p>${WARA.formatMoney(product.price)}</p>
          </div>

          <div class="commerce-card__colour-row">
            <p><span>Colour</span><strong data-card-color-name>${selectedColor.name}</strong></p>
            <div class="commerce-card__swatches" aria-label="Choose colour for ${product.name}">
              ${cardSwatches(product, selectedColor)}
            </div>
          </div>

          <div class="commerce-card__actions">
            <a class="text-button" href="${url}" data-card-product-link>View product</a>
            <button
              class="quick-add"
              type="button"
              data-quick-add-toggle
              aria-expanded="false"
              ${unavailable ? 'disabled' : ''}
            >${unavailable ? statusLabel(product.status) : 'Quick add'}</button>
          </div>

          ${unavailable ? '' : `
            <div class="quick-add-panel" data-quick-panel hidden>
              <div class="quick-add-panel__heading">
                <p>Quick add / <span data-quick-color-name>${selectedColor.name}</span></p>
                <button type="button" data-quick-add-close aria-label="Close quick add">Close</button>
              </div>
              <fieldset>
                <legend>Select a size</legend>
                <div class="quick-add-panel__sizes" data-quick-sizes>${quickSizes(selectedColor)}</div>
              </fieldset>
              <p class="quick-add-panel__message" data-quick-message aria-live="polite">Select a size before moving.</p>
              <button class="quick-add-panel__submit" type="button" data-quick-add-submit disabled>Add selected piece</button>
            </div>
          `}
        </div>
      </article>
    `;
  };

  const animateCommerceGrid = (grid, initialRender) => {
    if (!window.gsap || reduceMotion) return;
    const cards = Array.from(grid.querySelectorAll('.commerce-card'));
    if (!cards.length) return;
    window.gsap.from(cards, {
      y: initialRender ? 34 : 14,
      opacity: 0,
      duration: initialRender ? 0.72 : 0.42,
      stagger: initialRender ? 0.045 : 0.025,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  };

  const updateCartCount = () => {
    const count = WARA.cartCount();
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
      const changed = element.textContent !== String(count);
      element.textContent = String(count);
      element.setAttribute('aria-label', `${count} item${count === 1 ? '' : 's'} in cart`);
      if (changed && !reduceMotion) {
        element.classList.remove('is-bumping');
        window.requestAnimationFrame(() => element.classList.add('is-bumping'));
      }
    });
  };

  const showToast = (message, includeCartLink = false) => {
    let toast = document.querySelector('[data-cart-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cart-toast';
      toast.dataset.cartToast = '';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${message}</span>${includeCartLink ? '<a href="cart.html">View cart</a>' : ''}`;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  };

  const renderQuickSizes = (card, color) => {
    const sizes = card.querySelector('[data-quick-sizes]');
    if (!sizes) return;
    sizes.innerHTML = quickSizes(color);
    card.dataset.quickSize = '';
    const submit = card.querySelector('[data-quick-add-submit]');
    if (submit) submit.disabled = true;
    const message = card.querySelector('[data-quick-message]');
    if (message) message.textContent = 'Select a size before moving.';
  };

  const updateCardColor = (card, product, color) => {
    card.dataset.selectedColor = color.slug;
    const primary = card.querySelector('[data-card-primary]');
    const alternate = card.querySelector('[data-card-alternate]');
    const colorName = card.querySelector('[data-card-color-name]');
    const quickColorName = card.querySelector('[data-quick-color-name]');

    card.classList.add('is-changing-colour');
    window.setTimeout(() => {
      if (primary) {
        primary.src = color.images[0];
        primary.alt = `${product.name} in ${color.name}, front view`;
      }
      if (alternate) {
        alternate.src = color.images[0].startsWith('assets/images/products/') ? color.images[0] : color.images[1];
        alternate.alt = `${product.name} in ${color.name}, alternate view`;
      }
      card.classList.remove('is-changing-colour');
    }, reduceMotion ? 0 : 150);

    if (colorName) colorName.textContent = color.name;
    if (quickColorName) quickColorName.textContent = color.name;
    card.querySelectorAll('[data-card-product-link]').forEach((link) => {
      link.href = productUrl(product.id, color.slug);
    });
    card.querySelectorAll('[data-card-color]').forEach((swatch) => {
      swatch.setAttribute('aria-pressed', String(swatch.dataset.cardColor === color.slug));
    });
    renderQuickSizes(card, color);
  };

  const closeQuickPanel = (card) => {
    const panel = card.querySelector('[data-quick-panel]');
    const toggle = card.querySelector('[data-quick-add-toggle]');
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    card.classList.remove('is-quick-open');
  };

  const initialiseCommerceInteractions = () => {
    document.addEventListener('click', (event) => {
      const quickSubmit = event.target.closest('[data-quick-add-submit]');
      if (quickSubmit) {
        event.preventDefault();
        const card = quickSubmit.closest('.commerce-card');
        const product = card ? WARA.getProduct(card.dataset.productId) : null;
        const message = card?.querySelector('[data-quick-message]');
        if (!card || !product || !message) return;

        const color = WARA.getColor(product, card.dataset.selectedColor);
        const size = card.dataset.quickSize;
        if (!size) {
          message.textContent = 'Select a size before moving.';
          return;
        }

        if (WARA.addToCart({ id: product.id, color: color.slug, size, quantity: 1 })) {
          message.innerHTML = 'Added to archive. <a href="cart.html">View cart</a>';
          showToast('Added to archive.', true);
        } else {
          message.textContent = 'This size has left the route.';
        }
        return;
      }

      const legacyQuickAdd = event.target.closest('[data-quick-add]');
      if (legacyQuickAdd && !legacyQuickAdd.matches('[data-quick-add-toggle]')) {
        const product = WARA.getProduct(legacyQuickAdd.dataset.quickAdd);
        if (product) window.location.href = productUrl(product.id, product.colors[0].slug);
        return;
      }

      const card = event.target.closest('.commerce-card');
      if (!card) return;
      const product = WARA.getProduct(card.dataset.productId);
      if (!product) return;

      const colorButton = event.target.closest('[data-card-color]');
      if (colorButton) {
        event.preventDefault();
        const color = WARA.getColor(product, colorButton.dataset.cardColor);
        updateCardColor(card, product, color);
        return;
      }

      const toggle = event.target.closest('[data-quick-add-toggle]');
      if (toggle) {
        const panel = card.querySelector('[data-quick-panel]');
        if (!panel) return;
        const opening = panel.hidden;
        document.querySelectorAll('.commerce-card.is-quick-open').forEach((openCard) => {
          if (openCard !== card) closeQuickPanel(openCard);
        });
        panel.hidden = !opening;
        toggle.setAttribute('aria-expanded', String(opening));
        card.classList.toggle('is-quick-open', opening);
        if (opening) panel.querySelector('[data-quick-size]')?.focus();
        return;
      }

      if (event.target.closest('[data-quick-add-close]')) {
        closeQuickPanel(card);
        card.querySelector('[data-quick-add-toggle]')?.focus();
        return;
      }

      const sizeButton = event.target.closest('[data-quick-size]');
      if (sizeButton) {
        card.dataset.quickSize = sizeButton.dataset.quickSize;
        card.querySelectorAll('[data-quick-size]').forEach((button) => {
          button.setAttribute('aria-pressed', String(button === sizeButton));
        });
        card.querySelector('[data-quick-add-submit]').disabled = false;
        card.querySelector('[data-quick-message]').textContent = `${sizeButton.dataset.quickSize} selected.`;
        return;
      }

    });
  };

  const initialiseShop = () => {
    const grid = document.querySelector('[data-shop-grid]');
    if (!grid) return;

    const countElements = Array.from(document.querySelectorAll('[data-product-count]'));
    const resultsSummary = document.querySelector('[data-results-summary]');
    const filters = Array.from(document.querySelectorAll('[data-filter]'));
    const search = document.querySelector('[data-product-search]');
    const sorts = Array.from(document.querySelectorAll('[data-sort]'));
    const mobileFilters = Array.from(document.querySelectorAll('[data-mobile-filter]'));
    const clear = document.querySelector('[data-clear-filters]');
    let activeCategory = 'All';
    let hasRendered = false;

    const render = () => {
      const query = search?.value.trim().toLocaleLowerCase() || '';
      let visible = WARA.products.filter((product) => {
        const searchable = [
          product.name,
          product.category,
          product.collection,
          product.collectionCode,
          ...product.colors.map((color) => color.name)
        ].join(' ').toLocaleLowerCase();
        return (activeCategory === 'All' || product.category === activeCategory) && (!query || searchable.includes(query));
      });

      const sortValue = sorts[0]?.value || 'featured';
      if (sortValue === 'price-low') visible.sort((a, b) => a.price - b.price);
      if (sortValue === 'price-high') visible.sort((a, b) => b.price - a.price);
      if (sortValue === 'newest') visible.sort((a, b) => b.releaseOrder - a.releaseOrder);
      if (sortValue === 'featured') visible.sort((a, b) => a.featuredRank - b.featuredRank);

      grid.innerHTML = visible.length
        ? visible.map(productCard).join('')
        : '<div class="shop-empty"><p>No pieces found on this route.</p><button type="button" data-empty-clear>Clear filters</button></div>';

      const countText = `${visible.length} piece${visible.length === 1 ? '' : 's'}`;
      countElements.forEach((element) => { element.textContent = countText; });
      if (resultsSummary) {
        resultsSummary.textContent = visible.length
          ? `${countText} in the current edit.`
          : 'Try another name, colour or category.';
      }
      if (clear) clear.disabled = activeCategory === 'All' && !query;
      window.requestAnimationFrame(() => animateCommerceGrid(grid, !hasRendered));
      hasRendered = true;
      window.ScrollTrigger?.refresh();
    };

    const clearFilters = () => {
      activeCategory = 'All';
      if (search) search.value = '';
      filters.forEach((filter) => {
        const active = filter.dataset.filter === 'All';
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      mobileFilters.forEach((filter) => { filter.value = 'All'; });
      render();
    };

    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        activeCategory = filter.dataset.filter;
        mobileFilters.forEach((item) => { item.value = activeCategory; });
        filters.forEach((item) => item.classList.toggle('is-active', item === filter));
        filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
        render();
      });
    });
    search?.addEventListener('input', render);
    sorts.forEach((sort) => {
      sort.addEventListener('change', () => {
        sorts.forEach((item) => { item.value = sort.value; });
        render();
      });
    });
    mobileFilters.forEach((mobileFilter) => {
      mobileFilter.addEventListener('change', () => {
        activeCategory = mobileFilter.value;
        mobileFilters.forEach((item) => { item.value = activeCategory; });
        filters.forEach((item) => {
          const active = item.dataset.filter === activeCategory;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        render();
      });
    });
    clear?.addEventListener('click', clearFilters);
    grid.addEventListener('click', (event) => {
      if (event.target.closest('[data-empty-clear]')) clearFilters();
    });
    render();

    const campaigns = Array.from(document.querySelectorAll('[data-shop-campaign-media]'));
    if (campaigns.length && window.gsap && window.ScrollTrigger && !reduceMotion) {
      campaigns.forEach((campaign) => {
        window.gsap.fromTo(campaign, { y: 26, opacity: 0.86 }, {
          y: -10,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: campaign, start: 'top 88%', end: 'bottom 32%', scrub: 0.7 }
        });
      });
    }
  };

  const galleryMarkup = (product, color) => `
    <div class="product-gallery__viewport" data-gallery-viewport tabindex="0" aria-label="${product.name} image gallery in ${color.name}">
      <div class="product-gallery__track" data-gallery-track>
        ${color.images.map((image, index) => `
          <figure class="product-gallery__item" data-gallery-item="${index}">
            <img src="${image}" alt="${product.name} in ${color.name}, ${['front', 'back', 'detail'][index] || `view ${index + 1}`} view" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
            <figcaption>${color.name} / ${String(index + 1).padStart(2, '0')}</figcaption>
          </figure>
        `).join('')}
      </div>
    </div>
    <div class="product-gallery__nav">
      <div class="product-gallery__thumbs" aria-label="Choose product image">
        ${color.images.map((image, index) => `
          <button type="button" data-gallery-thumb="${index}" aria-label="Show ${product.name} ${['front', 'back', 'detail'][index] || `view ${index + 1}`}" aria-current="${index === 0 ? 'true' : 'false'}">
            <img src="${image}" alt="" loading="lazy" decoding="async">
          </button>
        `).join('')}
      </div>
      <p data-gallery-position>01 / ${String(color.images.length).padStart(2, '0')}</p>
    </div>
  `;

  const productColorButtons = (product, selectedColor) => product.colors.map((color) => `
    <button
      class="product-colour"
      type="button"
      style="--swatch:${color.value}"
      data-product-color="${color.slug}"
      aria-pressed="${String(color.slug === selectedColor.slug)}"
    ><span aria-hidden="true"></span><strong>${color.name}</strong></button>
  `).join('');

  const productSizeButtons = (product, selectedColor) => product.sizes.map((size) => {
    const available = selectedColor.availableSizes.includes(size);
    return `
      <button
        type="button"
        data-product-size="${size}"
        aria-pressed="false"
        ${available ? '' : 'disabled'}
        title="${available ? `Select size ${size}` : `${size} unavailable in ${selectedColor.name}`}"
      >${size}</button>
    `;
  }).join('');

  const initialiseProduct = () => {
    const root = document.querySelector('[data-product-page]');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const product = WARA.getProduct(params.get('id')) || WARA.products[0];
    let selectedColor = WARA.getColor(product, params.get('color'));
    let selectedSize = '';
    const unavailable = product.status !== 'available';
    document.title = `${product.name} — WARA STUDIO`;
    root.dataset.productId = product.id;

    root.innerHTML = `
      <div class="product-gallery" data-product-gallery>${galleryMarkup(product, selectedColor)}</div>

      <aside class="product-purchase" aria-labelledby="product-title">
        <div class="product-purchase__meta"><span>${product.collectionCode}</span><span>${product.category}</span></div>
        <h1 id="product-title">${product.name}</h1>
        <div class="product-purchase__price-row">
          <p class="product-purchase__price">${WARA.formatMoney(product.price)}</p>
          ${unavailable ? `<p class="product-purchase__status">${statusLabel(product.status)}</p>` : '<p>VAT included</p>'}
        </div>
        <p class="product-purchase__description">${product.description}</p>

        <form class="product-form" data-product-form>
          <fieldset class="product-option product-option--colour">
            <legend><span>Colour</span><strong data-selected-colour-name>${selectedColor.name}</strong></legend>
            <div class="product-colours">${productColorButtons(product, selectedColor)}</div>
            <p class="sr-only" data-colour-announcement aria-live="polite">${selectedColor.name} selected.</p>
          </fieldset>

          <fieldset class="product-option product-option--size">
            <legend><span>Size</span><button class="size-guide-link" type="button" data-size-guide-open>Size guide</button></legend>
            <div class="product-sizes" data-product-sizes>${productSizeButtons(product, selectedColor)}</div>
          </fieldset>

          <div class="quantity-control" data-quantity-control>
            <span>Quantity</span>
            <div>
              <button type="button" data-quantity-minus aria-label="Decrease quantity">−</button>
              <input type="number" name="quantity" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity">
              <button type="button" data-quantity-plus aria-label="Increase quantity">+</button>
            </div>
          </div>

          <button class="purchase-button" type="submit" disabled>${unavailable ? statusLabel(product.status) : 'Select a size'}</button>
          <button class="purchase-button purchase-button--secondary" type="button" disabled>Secure checkout — coming soon</button>
          <p class="product-form__message" data-product-message aria-live="polite">Select a size before moving.</p>
        </form>

        <div class="product-accordions">
          <details open><summary>Fabric and construction</summary><ul>${product.construction.map((detail) => `<li>${detail}</li>`).join('')}</ul></details>
          <details><summary>Fit notes</summary><p>${product.fit}</p></details>
          <details><summary>Care instructions</summary><p>${product.care}</p></details>
          <details><summary>Shipping and returns</summary><p>Delivery regions, timing and return terms will be confirmed before Drop 001 opens. No payment information is collected on this website.</p></details>
        </div>
      </aside>

      <div class="mobile-purchase-bar" data-mobile-purchase aria-hidden="true">
        <div><span>${WARA.formatMoney(product.price)}</span><strong data-mobile-variant>${selectedColor.name}</strong></div>
        <button type="button" data-mobile-add>Add to cart</button>
      </div>

      <dialog class="size-guide" data-size-guide>
        <button type="button" data-size-guide-close aria-label="Close size guide">Close</button>
        <p class="eyebrow">WARA FIT SYSTEM</p>
        <h2>Size guide</h2>
        <p>WARA pieces use a relaxed editorial fit. Choose your usual size for the intended silhouette or size down for a closer fit.</p>
        <div class="size-guide__table" role="table" aria-label="Garment size guide">
          <div role="row"><strong role="columnheader">Size</strong><strong role="columnheader">Chest</strong><strong role="columnheader">Length</strong></div>
          <div role="row"><span>S</span><span>112 cm</span><span>69 cm</span></div>
          <div role="row"><span>M</span><span>118 cm</span><span>71 cm</span></div>
          <div role="row"><span>L</span><span>124 cm</span><span>73 cm</span></div>
          <div role="row"><span>XL</span><span>130 cm</span><span>75 cm</span></div>
        </div>
      </dialog>
    `;

    const form = root.querySelector('[data-product-form]');
    const quantity = form.querySelector('input[name="quantity"]');
    const message = form.querySelector('[data-product-message]');
    const submit = form.querySelector('button[type="submit"]');
    const mobileBar = root.querySelector('[data-mobile-purchase]');
    const mobileVariant = root.querySelector('[data-mobile-variant]');

    const updatePurchaseState = () => {
      const ready = Boolean(selectedColor && selectedSize && !unavailable);
      submit.disabled = !ready;
      submit.textContent = unavailable ? statusLabel(product.status) : (ready ? 'Add to cart' : 'Select a size');
      mobileBar.classList.toggle('is-visible', ready);
      mobileBar.setAttribute('aria-hidden', String(!ready));
      mobileVariant.textContent = ready ? `${selectedColor.name} / ${selectedSize}` : selectedColor.name;
    };

    const bindGallery = () => {
      const viewport = root.querySelector('[data-gallery-viewport]');
      const track = root.querySelector('[data-gallery-track]');
      const position = root.querySelector('[data-gallery-position]');
      const thumbs = Array.from(root.querySelectorAll('[data-gallery-thumb]'));
      if (!viewport || !track || !position) return;

      const setIndex = (index) => {
        position.textContent = `${String(index + 1).padStart(2, '0')} / ${String(selectedColor.images.length).padStart(2, '0')}`;
        thumbs.forEach((thumb, thumbIndex) => thumb.setAttribute('aria-current', String(thumbIndex === index)));
      };

      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const index = Number(thumb.dataset.galleryThumb);
          viewport.scrollTo({ left: viewport.clientWidth * index, behavior: reduceMotion ? 'auto' : 'smooth' });
          setIndex(index);
        });
      });
      viewport.addEventListener('scroll', () => {
        const index = Math.max(0, Math.min(selectedColor.images.length - 1, Math.round(viewport.scrollLeft / Math.max(1, viewport.clientWidth))));
        setIndex(index);
      }, { passive: true });
    };

    const updateGallery = () => {
      const gallery = root.querySelector('[data-product-gallery]');
      gallery.classList.add('is-changing');
      window.setTimeout(() => {
        gallery.innerHTML = galleryMarkup(product, selectedColor);
        gallery.classList.remove('is-changing');
        bindGallery();
      }, reduceMotion ? 0 : 150);
    };

    const updateSizes = (previousSize = selectedSize) => {
      const sizes = root.querySelector('[data-product-sizes]');
      const stillAvailable = previousSize && selectedColor.availableSizes.includes(previousSize);
      if (!stillAvailable && previousSize) {
        selectedSize = '';
        message.textContent = 'This size has left the route.';
      }
      sizes.innerHTML = productSizeButtons(product, selectedColor);
      sizes.querySelectorAll('[data-product-size]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.productSize === selectedSize));
      });
      updatePurchaseState();
    };

    const selectColor = (color) => {
      const previousSize = selectedSize;
      selectedColor = color;
      root.querySelector('[data-selected-colour-name]').textContent = color.name;
      root.querySelector('[data-colour-announcement]').textContent = `${color.name} selected. Gallery updated.`;
      root.querySelectorAll('[data-product-color]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.productColor === color.slug));
      });
      const nextUrl = productUrl(product.id, color.slug);
      window.history.replaceState({}, '', nextUrl);
      updateGallery();
      updateSizes(previousSize);
    };

    const addSelected = () => {
      if (!selectedSize) {
        message.textContent = 'Select a size before moving.';
        root.querySelector('[data-product-sizes] button:not(:disabled)')?.focus();
        return false;
      }
      const added = WARA.addToCart({ id: product.id, color: selectedColor.slug, size: selectedSize, quantity: quantity.value });
      if (added) {
        message.innerHTML = 'Added to archive. <a href="cart.html">View cart</a>';
        showToast('Added to archive.', true);
      } else {
        message.textContent = 'This size has left the route.';
      }
      return added;
    };

    root.addEventListener('click', (event) => {
      const colorButton = event.target.closest('[data-product-color]');
      if (colorButton) selectColor(WARA.getColor(product, colorButton.dataset.productColor));

      const sizeButton = event.target.closest('[data-product-size]');
      if (sizeButton && !sizeButton.disabled) {
        selectedSize = sizeButton.dataset.productSize;
        root.querySelectorAll('[data-product-size]').forEach((button) => {
          button.setAttribute('aria-pressed', String(button === sizeButton));
        });
        message.textContent = `${selectedSize} selected.`;
        updatePurchaseState();
      }

      if (event.target.closest('[data-quantity-minus]')) quantity.value = String(Math.max(1, Number(quantity.value) - 1));
      if (event.target.closest('[data-quantity-plus]')) quantity.value = String(Math.min(10, Number(quantity.value) + 1));
      if (event.target.closest('[data-mobile-add]')) addSelected();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      addSelected();
    });

    const guide = root.querySelector('[data-size-guide]');
    root.querySelector('[data-size-guide-open]')?.addEventListener('click', () => guide.showModal());
    root.querySelector('[data-size-guide-close]')?.addEventListener('click', () => guide.close());

    bindGallery();
    updatePurchaseState();

    const related = document.querySelector('[data-related-products]');
    if (related) {
      related.innerHTML = WARA.products
        .filter((item) => item.id !== product.id)
        .slice(0, 3)
        .map(productCard)
        .join('');
    }
  };

  const initialiseCart = () => {
    const root = document.querySelector('[data-cart-page]');
    if (!root) return;

    const render = () => {
      const cart = WARA.readCart();
      if (!cart.length) {
        root.innerHTML = `
          <div class="cart-empty">
            <p class="eyebrow">THE ROUTE IS OPEN</p>
            <h2>Your cart is empty.</h2>
            <p>Explore Drop 001 and choose the pieces that travel with you.</p>
            <a class="purchase-button" href="shop.html">Enter the shop</a>
          </div>
        `;
        return;
      }

      root.innerHTML = `
        <div class="cart-layout">
          <div class="cart-lines">
            ${cart.map((item) => {
              const product = WARA.getProduct(item.id);
              const color = WARA.getColor(product, item.color);
              const key = WARA.itemKey(item);
              return `
                <article class="cart-line" data-cart-key="${key}">
                  <a class="cart-line__image" href="${productUrl(product.id, color.slug)}">
                    <img src="${color.images[0]}" alt="${product.name} in ${color.name}" loading="lazy" decoding="async">
                  </a>
                  <div class="cart-line__content">
                    <div class="cart-line__identity">
                      <p class="eyebrow">${product.collectionCode} / ${product.category}</p>
                      <h2><a href="${productUrl(product.id, color.slug)}">${product.name}</a></h2>
                      <dl><div><dt>Colour</dt><dd>${color.name}</dd></div><div><dt>Size</dt><dd>${item.size}</dd></div></dl>
                    </div>
                    <div class="cart-line__controls">
                      <div class="quantity-control quantity-control--compact">
                        <button type="button" data-cart-minus aria-label="Decrease ${product.name} quantity">−</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" inputmode="numeric" data-cart-quantity aria-label="${product.name} quantity">
                        <button type="button" data-cart-plus aria-label="Increase ${product.name} quantity">+</button>
                      </div>
                      <button class="cart-line__remove" type="button" data-cart-remove>Remove</button>
                    </div>
                  </div>
                  <div class="cart-line__price">
                    <p><span>Unit</span><strong>${WARA.formatMoney(product.price)}</strong></p>
                    <p><span>Line total</span><strong>${WARA.formatMoney(product.price * item.quantity)}</strong></p>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
          <aside class="cart-summary">
            <p class="eyebrow">ORDER SUMMARY</p>
            <div><span>Subtotal</span><strong>${WARA.formatMoney(WARA.cartTotal())}</strong></div>
            <p>Taxes and delivery will be confirmed before Drop 001 opens.</p>
            <button class="purchase-button purchase-button--unavailable" type="button" disabled>Secure checkout — coming soon</button>
            <p class="cart-summary__notice">No card or payment information is collected.</p>
            <a class="text-button" href="shop.html">Continue shopping</a>
          </aside>
        </div>
      `;
    };

    root.addEventListener('click', (event) => {
      const line = event.target.closest('[data-cart-key]');
      if (!line) return;
      const key = line.dataset.cartKey;
      const input = line.querySelector('[data-cart-quantity]');
      if (event.target.closest('[data-cart-remove]')) WARA.removeFromCart(key);
      if (event.target.closest('[data-cart-minus]')) WARA.setQuantity(key, Number(input.value) - 1);
      if (event.target.closest('[data-cart-plus]')) WARA.setQuantity(key, Number(input.value) + 1);
    });
    root.addEventListener('change', (event) => {
      if (!event.target.matches('[data-cart-quantity]')) return;
      const line = event.target.closest('[data-cart-key]');
      WARA.setQuantity(line.dataset.cartKey, event.target.value);
    });
    window.addEventListener('wara:cart-change', render);
    window.addEventListener('storage', render);
    render();
  };

  const initialiseActiveNavigation = () => {
    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav-page]').forEach((link) => {
      if (link.dataset.navPage === page) link.setAttribute('aria-current', 'page');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initialiseActiveNavigation();
    initialiseCommerceInteractions();
    initialiseShop();
    initialiseProduct();
    initialiseCart();
    updateCartCount();
    window.addEventListener('wara:cart-change', updateCartCount);
    window.addEventListener('storage', updateCartCount);
  });
})();
