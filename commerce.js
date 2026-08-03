(() => {
  const WARA = window.WARA;
  if (!WARA) return;

  const colourMap = {
    'Weathered White': '#f7f3e8',
    'Sail Cream': '#f3e6c8',
    'Ink Black': '#171717',
    'Sun-Faded Red': '#d94a38',
    'Deep Ocean': '#1e5b8c',
    'Sea Teal': '#2f7c78',
    'Golden Mustard': '#d8a23a',
    'Field Khaki': '#8d8065'
  };

  const statusLabel = (status) => ({
    available: '',
    'sold-out': 'Sold out',
    'coming-soon': 'Coming soon'
  }[status] || '');

  const productUrl = (id) => `product.html?id=${encodeURIComponent(id)}`;

  const swatches = (product) => product.colours.map((colour) => (
    `<span class="product-swatch" style="--swatch:${colourMap[colour] || '#777'}" title="${colour}"><span class="sr-only">${colour}</span></span>`
  )).join('');

  const productCard = (product, index = 0) => {
    const unavailable = product.status !== 'available';
    return `
      <article class="commerce-card" data-category="${product.category}" data-collection="${product.collection}" style="--card-index:${index}">
        <a class="commerce-card__media" href="${productUrl(product.id)}" aria-label="View ${product.name}">
          <img src="${product.images[0]}" alt="Campaign placeholder for ${product.name}" loading="lazy" decoding="async">
          <img class="commerce-card__alternate" src="${product.images[1]}" alt="Alternate campaign placeholder for ${product.name}" loading="lazy" decoding="async">
          ${statusLabel(product.status) ? `<span class="commerce-card__status">${statusLabel(product.status)}</span>` : ''}
        </a>
        <div class="commerce-card__body">
          <div class="commerce-card__heading">
            <h2><a href="${productUrl(product.id)}">${product.name}</a></h2>
            <p>${WARA.formatMoney(product.price)}</p>
          </div>
          <div class="commerce-card__meta">
            <span>${product.category}</span>
            <span>${product.collection}</span>
          </div>
          <div class="commerce-card__swatches" aria-label="Available colours">${swatches(product)}</div>
          <div class="commerce-card__actions">
            <a class="text-button" href="${productUrl(product.id)}">View product</a>
            <button class="quick-add" type="button" data-quick-add="${product.id}" ${unavailable ? 'disabled' : ''}>${unavailable ? statusLabel(product.status) : 'Quick add'}</button>
          </div>
        </div>
      </article>
    `;
  };

  const updateCartCount = () => {
    const count = WARA.cartCount();
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
      element.textContent = String(count);
      element.setAttribute('aria-label', `${count} item${count === 1 ? '' : 's'} in cart`);
    });
  };

  const showToast = (message) => {
    let toast = document.querySelector('[data-cart-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cart-toast';
      toast.dataset.cartToast = '';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const addDefaultProduct = (id) => {
    const product = WARA.getProduct(id);
    if (!product || product.status !== 'available') return;
    if (WARA.addToCart({ id, colour: product.colours[0], size: product.sizes[0], quantity: 1 })) {
      showToast(`${product.name} added to cart`);
    }
  };

  const initialiseQuickAdd = () => {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-quick-add]');
      if (!button || button.disabled) return;
      addDefaultProduct(button.dataset.quickAdd);
    });
  };

  const initialiseShop = () => {
    const grid = document.querySelector('[data-shop-grid]');
    if (!grid) return;

    const count = document.querySelector('[data-product-count]');
    const filters = Array.from(document.querySelectorAll('[data-filter]'));
    const collection = document.querySelector('[data-collection-select]');
    const sort = document.querySelector('[data-sort]');
    let activeCategory = 'All';

    const render = () => {
      let visible = WARA.products.filter((product) => (
        (activeCategory === 'All' || product.category === activeCategory) &&
        (!collection?.value || collection.value === 'All' || product.collection === collection.value)
      ));

      if (sort?.value === 'price-low') visible.sort((a, b) => a.price - b.price);
      if (sort?.value === 'price-high') visible.sort((a, b) => b.price - a.price);
      if (sort?.value === 'name') visible.sort((a, b) => a.name.localeCompare(b.name));

      grid.innerHTML = visible.map(productCard).join('');
      if (count) count.textContent = `${visible.length} piece${visible.length === 1 ? '' : 's'}`;
    };

    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        activeCategory = filter.dataset.filter;
        filters.forEach((item) => item.classList.toggle('is-active', item === filter));
        filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
        render();
      });
    });
    collection?.addEventListener('change', render);
    sort?.addEventListener('change', render);
    render();
  };

  const optionInputs = (name, values, type) => values.map((value, index) => `
    <label class="option-chip option-chip--${type}">
      <input type="radio" name="${name}" value="${value}" ${index === 0 ? 'checked' : ''}>
      <span>${type === 'colour' ? `<i style="--swatch:${colourMap[value] || '#777'}"></i>` : ''}${value}</span>
    </label>
  `).join('');

  const initialiseProduct = () => {
    const root = document.querySelector('[data-product-page]');
    if (!root) return;

    const requestedId = new URLSearchParams(window.location.search).get('id');
    const product = WARA.getProduct(requestedId) || WARA.products[0];
    const unavailable = product.status !== 'available';
    document.title = `${product.name} — WARA STUDIO`;

    root.innerHTML = `
      <div class="product-gallery" data-product-gallery>
        ${product.images.map((image, index) => `
          <figure class="product-gallery__item ${index === 0 ? 'product-gallery__item--primary' : ''}">
            <img src="${image}" alt="${index === 0 ? 'Campaign' : `Detail ${index}`} placeholder for ${product.name}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
            <figcaption>${product.name} / View ${String(index + 1).padStart(2, '0')}</figcaption>
          </figure>
        `).join('')}
      </div>
      <aside class="product-purchase" aria-labelledby="product-title">
        <div class="product-purchase__meta"><span>${product.collection}</span><span>${product.category}</span></div>
        <h1 id="product-title">${product.name}</h1>
        <p class="product-purchase__price">${WARA.formatMoney(product.price)}</p>
        ${unavailable ? `<p class="product-purchase__status">${statusLabel(product.status)}</p>` : ''}
        <p class="product-purchase__description">${product.description}</p>
        <form class="product-form" data-product-form>
          <fieldset>
            <legend>Colour</legend>
            <div class="option-list">${optionInputs('colour', product.colours, 'colour')}</div>
          </fieldset>
          <fieldset>
            <legend>Size <button class="size-guide-link" type="button" data-size-guide-open>Size guide</button></legend>
            <div class="option-list">${optionInputs('size', product.sizes, 'size')}</div>
          </fieldset>
          <div class="quantity-control" data-quantity-control>
            <span>Quantity</span>
            <div>
              <button type="button" data-quantity-minus aria-label="Decrease quantity">−</button>
              <input type="number" name="quantity" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity">
              <button type="button" data-quantity-plus aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="purchase-button" type="submit" ${unavailable ? 'disabled' : ''}>${unavailable ? statusLabel(product.status) : 'Add to cart'}</button>
          <button class="purchase-button purchase-button--secondary" type="button" data-buy-now ${unavailable ? 'disabled' : ''}>Buy now</button>
          <p class="product-form__message" data-product-message aria-live="polite"></p>
        </form>
        <div class="product-accordions">
          <details open>
            <summary>Fabric and construction</summary>
            <ul>${product.construction.map((detail) => `<li>${detail}</li>`).join('')}</ul>
          </details>
          <details>
            <summary>Shipping and returns</summary>
            <p>Prototype information: delivery regions, rates and secure checkout will be connected when WARA STUDIO moves to its commerce platform.</p>
          </details>
        </div>
      </aside>
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
    const addSelected = () => {
      const colour = form.elements.colour.value;
      const size = form.elements.size.value;
      const added = WARA.addToCart({ id: product.id, colour, size, quantity: quantity.value });
      if (added) {
        message.textContent = `${product.name} added in ${colour}, size ${size}.`;
        showToast(`${product.name} added to cart`);
      }
      return added;
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      addSelected();
    });
    form.querySelector('[data-buy-now]')?.addEventListener('click', () => {
      if (addSelected()) window.location.href = 'cart.html';
    });
    form.querySelector('[data-quantity-minus]')?.addEventListener('click', () => {
      quantity.value = String(Math.max(1, Number(quantity.value) - 1));
    });
    form.querySelector('[data-quantity-plus]')?.addEventListener('click', () => {
      quantity.value = String(Math.min(10, Number(quantity.value) + 1));
    });

    const guide = root.querySelector('[data-size-guide]');
    root.querySelector('[data-size-guide-open]')?.addEventListener('click', () => guide.showModal());
    root.querySelector('[data-size-guide-close]')?.addEventListener('click', () => guide.close());

    const related = document.querySelector('[data-related-products]');
    if (related) {
      related.innerHTML = WARA.products.filter((item) => item.id !== product.id).slice(0, 3).map(productCard).join('');
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
            <h1>Your cart is empty.</h1>
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
              const key = WARA.itemKey(item);
              return `
                <article class="cart-line" data-cart-key="${key}">
                  <a class="cart-line__image" href="${productUrl(product.id)}"><img src="${product.images[0]}" alt="${product.name}" loading="lazy" decoding="async"></a>
                  <div class="cart-line__content">
                    <div>
                      <p class="eyebrow">${product.collection}</p>
                      <h2><a href="${productUrl(product.id)}">${product.name}</a></h2>
                      <p>${item.colour} / ${item.size}</p>
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
                  <p class="cart-line__price">${WARA.formatMoney(product.price * item.quantity)}</p>
                </article>
              `;
            }).join('')}
          </div>
          <aside class="cart-summary">
            <p class="eyebrow">ORDER SUMMARY</p>
            <div><span>Subtotal</span><strong>${WARA.formatMoney(WARA.cartTotal())}</strong></div>
            <p>Taxes and delivery are calculated when secure checkout is connected.</p>
            <button class="purchase-button" type="button" data-placeholder-checkout>Checkout</button>
            <p class="cart-summary__notice" data-checkout-message aria-live="polite">Checkout is a placeholder. No payment information is collected.</p>
            <a class="text-button" href="shop.html">Continue shopping</a>
          </aside>
        </div>
      `;
    };

    root.addEventListener('click', (event) => {
      const line = event.target.closest('[data-cart-key]');
      if (!line) {
        if (event.target.closest('[data-placeholder-checkout]')) {
          root.querySelector('[data-checkout-message]')?.classList.add('is-visible');
        }
        return;
      }
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
    initialiseQuickAdd();
    initialiseShop();
    initialiseProduct();
    initialiseCart();
    updateCartCount();
    window.addEventListener('wara:cart-change', updateCartCount);
    window.addEventListener('storage', updateCartCount);
  });
})();
