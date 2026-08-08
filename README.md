# WARA STUDIO Standalone Website

WARA STUDIO is a standalone HTML, CSS and JavaScript frontend concept for an independent streetwear label from Mitrovicë, Kosovo. It has no Shopify code, backend, login, payment form or production checkout.

## Pages

- `index.html` — cinematic editorial homepage and four featured pieces.
- `shop.html` — complete eight-product catalog with collection, category and sorting controls.
- `product.html?id=heavyweight-tee` — reusable product page driven by a product ID query.
- `archive.html` — Archive 001 campaign, landscape and lookbook world.
- `story.html` — brand origin, manifesto and working principles.
- `cart.html` — local frontend cart with quantity and removal controls.

All links are relative, so the website works both locally and under the GitHub Pages project path `/wara-studio/`.

## Open locally

Open PowerShell in `C:\Users\oltbu\OneDrive\Documents\wara-studio` and run:

```powershell
python -m http.server 4173
```

Then open:

- Homepage: `http://localhost:4173/`
- Shop: `http://localhost:4173/shop.html`
- Product: `http://localhost:4173/product.html?id=heavyweight-tee`
- Archive: `http://localhost:4173/archive.html`
- Story: `http://localhost:4173/story.html`
- Cart: `http://localhost:4173/cart.html`

Stop the server with `Ctrl+C`. There is no build step and no package installation.

## Shared code

- `styles.css` contains the complete responsive design system and page layouts.
- `app.js` contains the loader, navigation, cursor, GSAP, ScrollTrigger and editorial interaction logic.
- `catalog.js` contains the local product catalog and localStorage cart data layer.
- `commerce.js` renders shop, product and cart interfaces from the shared catalog.
- `vendor/` contains local GSAP and ScrollTrigger builds.

## Cart and checkout boundary

The cart is stored only in the visitor's browser under the localStorage key `waraStudioCartV1`. It supports product variants, quantities, removal, totals and persistence across refreshes.

Checkout is intentionally unavailable. The website does not request or store card, payment, delivery or account information. Secure checkout will be connected later through a production commerce platform.

## Image replacement map

Current images establish the art direction. Replace them with original WARA photography or properly licensed assets while preserving the existing aspect ratios and the intended balance of roughly 55% clothing imagery and 45% atmosphere.

### Homepage — `index.html`

- Hero: full-body or mid-body campaign portrait with negative space for the layered WARA title.
- Drop 001 introduction: keep the canal, waterway or similarly strong travel image; it should remain atmospheric.
- Featured products: Heavyweight Tee, Archive Hoodie, Transit Cargo and No Destination Jacket, each with primary and hover images.
- Mitrovicë editorial: sunlit brutalist concrete geometry and a warm urban housing facade.
- Lookbook preview: four consistent vertical model looks from one campaign.
- Horizontal field archive: bridge or structure, road movement, distressed surface and night environment.
- Manifesto: fashion atelier with patterns, machines and garments in progress.

### Shared product catalog — `catalog.js`

Each product contains a `colors` array. Every colour owns its real image set and its own available sizes:

```js
{
  slug: 'archive-cream',
  name: 'Archive Cream',
  value: '#E9DFC8',
  availableSizes: ['S', 'M', 'L', 'XL'],
  images: ['front-image', 'back-image', 'detail-image']
}
```

The shop swatches, product gallery and cart line image all resolve from this same colour object. Art-directed temporary lead images live in `assets/images/products/`; remaining secondary views use licensed-source URLs. Final WARA photography can replace either path inside `catalog.js` without changing the commerce logic. Keep the order as front, back and detail.

Products: WARA Heavyweight Tee, Archive Hoodie 001, Transit Cargo, No Destination Jacket, Route Knit, Field Overshirt, WARA Cap and Archive Bag.

### Shop — `shop.html`

- Closing field note: open road or journey landscape; keep this atmospheric rather than product-led.

### Archive — `archive.html`

- Hero: ocean or large open-water horizon.
- Expanding archive slices: city architecture, canal or water, model campaign and night landscape.
- Contact sheet: Heavyweight Tee look, industrial structure, Archive Hoodie look, road landscape, Transit Cargo look and lake or mountain journey.

### Story — `story.html`

- Origin: industrial city architecture.
- Manifesto: model in motion.
- Field voices: three overlapping campaign portraits.

## Motion and accessibility

Desktop plays the complete cinematic loader whenever the homepage is loaded or refreshed. On smaller screens, the approved first-visit sequence remains intact and repeat visits within the same session use a shorter transition. `prefers-reduced-motion` replaces complex movement with a brief accessible reveal, and the loader has both a no-JavaScript fallback and a timed fail-safe.

Desktop uses layered hero type, route drawing, image reveals, parallax, lookbook stacking and horizontal archive motion. Tablet and mobile reduce or remove pinning and parallax. Navigation, filters, variant controls, quantity controls, dialogs and cart actions are keyboard accessible with visible focus states.

## Publishing

The repository is compatible with GitHub Pages from the `main` branch root. No secret values or API credentials are required. Do not add payment forms or API keys to this repository.
