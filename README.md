# WARA STUDIO Local Visual Prototype

This folder is a standalone visual-design prototype. It does not connect to Shopify, a cart, checkout, payments, customer accounts, or a product database.

## Open it directly

Double-click `index.html`, or open it from a browser with `Ctrl+O`.

The HTML, CSS, local JavaScript, GSAP, and ScrollTrigger work without a build step. The placeholder photography is loaded from `picsum.photos`, so an internet connection is needed for those images and for the Outfit webfont.

## Recommended local server

For the most consistent browser behavior, open PowerShell in this `prototype` folder and run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

No project package files are created by this command. Stop the server with `Ctrl+C`.

## Files

- `index.html` contains the full homepage structure and prototype content.
- `styles.css` contains the responsive visual system and layout.
- `app.js` contains loader, navigation, cursor, GSAP, ScrollTrigger, and form-demo behavior.
- `vendor/` contains local copies of GSAP and ScrollTrigger already used by the WARA theme foundation.

## Placeholder photography

Every replaceable image has visible `PLACEHOLDER` metadata in the interface and descriptive alternative text. Replace image `src` values in `index.html` while keeping the surrounding classes and aspect ratios.

Recommended final art direction:

- Hero: full-length vertical campaign portrait with clear negative space on the left.
- Drop introduction: high-contrast silhouette or garment detail.
- Products: front and alternate editorial images for each of the four mock products.
- Mitrovicë editorial: one architectural vertical and one close street detail.
- Lookbook: four consistent full-body vertical frames from one campaign.
- Horizontal archive: four environment, road, texture, and night photographs.
- Manifesto: tight human or garment-detail crop.

Use original WARA photography or properly licensed material only. Do not introduce anime characters, logos, or copied artwork.

## Motion and accessibility

Desktop uses GSAP for the hero, reveal masks, parallax, lookbook stacking, manifesto text, and the pinned horizontal gallery. Tablet and mobile reduce or remove pinning and parallax. `prefers-reduced-motion` disables complex motion and keeps all content visible.
