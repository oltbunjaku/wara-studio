(() => {
  // Temporary, art-directed colour photography mappings. Replace URLs inside each
  // colour object with final WARA front, back and detail photography without
  // changing any commerce logic.
  const products = [
    {
      id: 'heavyweight-tee',
      name: 'WARA Heavyweight Tee',
      price: 68,
      category: 'Tops',
      collection: 'Drop 001',
      collectionCode: 'D001 / 01',
      status: 'available',
      featuredRank: 1,
      releaseOrder: 8,
      description: 'A wide, structured tee built as the first layer of the WARA uniform. Dense cotton, dropped shoulders and a softened campaign print give it weight without stiffness.',
      construction: ['320 GSM combed cotton jersey', 'Garment-washed surface', 'Screen-printed front and back artwork', 'Relaxed, boxy cut with dropped shoulders'],
      fit: 'Oversized through the chest with a clean, cropped body. Take your usual size for the intended relaxed silhouette.',
      care: 'Wash cold inside out with similar colours. Reshape while damp and dry flat. Do not iron directly over print.',
      colors: [
        {
          slug: 'archive-cream', name: 'Archive Cream', value: '#E9DFC8', availableSizes: ['S', 'M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'muted-navy', name: 'Muted Navy', value: '#304F6E', availableSizes: ['M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'editorial-red', name: 'Editorial Red', value: '#C85D4B', availableSizes: ['S', 'M', 'L'],
          images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'archive-hoodie',
      name: 'Archive Hoodie 001',
      price: 145,
      category: 'Tops',
      collection: 'Drop 001',
      collectionCode: 'D001 / 02',
      status: 'available',
      featuredRank: 2,
      releaseOrder: 7,
      description: 'A substantial travel layer with a compact hood, generous body and distressed archive marks. Designed to soften and become more personal with wear.',
      construction: ['520 GSM brushed-back cotton', 'Double-layer hood', 'Washed archive print', 'Reinforced pouch pocket and ribbed trims'],
      fit: 'Relaxed and slightly dropped with room for a layer underneath. Choose your usual size for the WARA fit.',
      care: 'Wash cold on a gentle cycle. Dry flat away from direct heat. Steam lightly from the reverse if needed.',
      colors: [
        {
          slug: 'deep-charcoal', name: 'Deep Charcoal', value: '#242321', availableSizes: ['S', 'M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'muted-navy', name: 'Muted Navy', value: '#304F6E', availableSizes: ['M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'transit-cargo',
      name: 'Transit Cargo',
      price: 128,
      category: 'Bottoms',
      collection: 'Drop 001',
      collectionCode: 'D001 / 03',
      status: 'available',
      featuredRank: 3,
      releaseOrder: 6,
      description: 'A loose field trouser made for movement. Articulated knees, low-profile cargo pockets and adjustable hems balance utility with an editorial silhouette.',
      construction: ['Midweight cotton ripstop', 'Articulated knee panels', 'Adjustable hem system', 'Eight functional pockets'],
      fit: 'Relaxed through the seat and leg with a mid-rise waist. Use the adjusters to sharpen or loosen the hem.',
      care: 'Machine wash cold with fastenings closed. Line dry. Press on low heat from the reverse.',
      colors: [
        {
          slug: 'warm-sand', name: 'Warm Sand', value: '#D6C39E', availableSizes: ['28', '30', '32', '34', '36'],
          images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'deep-charcoal', name: 'Deep Charcoal', value: '#242321', availableSizes: ['30', '32', '34', '36'],
          images: [
            'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'destination-jacket',
      name: 'No Destination Jacket',
      price: 210,
      category: 'Outerwear',
      collection: 'Drop 001',
      collectionCode: 'D001 / 04',
      status: 'available',
      featuredRank: 4,
      releaseOrder: 5,
      description: 'The defining outer layer of Drop 001. A cropped travel jacket with map-seam construction, a removable storm collar and hand-finished route graphics.',
      construction: ['Water-resistant cotton-nylon shell', 'Breathable cotton lining', 'Removable storm collar', 'Numbered archive label'],
      fit: 'Relaxed shoulders with a compact body and adjustable hem. Designed to sit above wider trousers.',
      care: 'Spot clean when possible. Gentle cold wash only. Remove collar before washing and air dry naturally.',
      colors: [
        {
          slug: 'deep-teal', name: 'Deep Teal', value: '#4B7C78', availableSizes: ['S', 'M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'heritage-olive', name: 'Heritage Olive', value: '#66705A', availableSizes: ['M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'route-knit',
      name: 'Route Knit',
      price: 118,
      category: 'Knitwear',
      collection: 'Field Notes',
      collectionCode: 'FN01 / 01',
      status: 'available',
      featuredRank: 5,
      releaseOrder: 4,
      description: 'A dry-hand knit with irregular route lines engineered into the surface. Relaxed through the body with a compact ribbed neckline.',
      construction: ['Cotton and recycled-wool blend', 'Jacquard route artwork', 'Fully fashioned construction', 'Hand-linked shoulder seams'],
      fit: 'Easy through the body with a slightly shortened length. Choose your usual size or size up for a looser drape.',
      care: 'Hand wash cold or use a wool cycle. Dry flat and store folded. Do not hang.',
      colors: [
        {
          slug: 'oatmeal', name: 'Oatmeal', value: '#DCCFB3', availableSizes: ['S', 'M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1587393795320-6e43b260ecd0?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1563540153332-29de4b355f49?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'warm-brown', name: 'Warm Brown', value: '#765A43', availableSizes: ['M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1577393439344-b89b65dfd169?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1588601081900-d38db461be8d?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1520508358701-63027028d924?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'field-overshirt',
      name: 'Field Overshirt',
      price: 164,
      category: 'Outerwear',
      collection: 'Field Notes',
      collectionCode: 'FN01 / 02',
      status: 'available',
      featuredRank: 6,
      releaseOrder: 3,
      description: 'A generous overshirt shaped by weathered field clothing. Layered pockets and contrast repair stitching make every angle distinct.',
      construction: ['Heavy cotton canvas', 'Enzyme-washed surface', 'Layered utility pockets', 'Contrast repair stitching'],
      fit: 'Oversized enough for knitwear underneath. Take your usual size for a broad, relaxed line.',
      care: 'Wash cold with similar colours. Line dry and press lightly on the reverse.',
      colors: [
        {
          slug: 'heritage-olive', name: 'Heritage Olive', value: '#66705A', availableSizes: ['S', 'M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'soft-stone', name: 'Soft Stone', value: '#B8B0A2', availableSizes: ['M', 'L', 'XL'],
          images: [
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'wara-cap',
      name: 'WARA Cap',
      price: 48,
      category: 'Accessories',
      collection: 'Field Notes',
      collectionCode: 'FN01 / 03',
      status: 'coming-soon',
      featuredRank: 7,
      releaseOrder: 2,
      description: 'A low-profile travel cap with an uneven screen-print mark, tonal route embroidery and an adjustable metal closure.',
      construction: ['Washed cotton twill', 'Six-panel construction', 'Adjustable metal closure', 'Original WARA route embroidery'],
      fit: 'One-size adjustable fit with a low, unstructured crown.',
      care: 'Spot clean with a damp cloth. Air dry away from direct sunlight.',
      colors: [
        {
          slug: 'muted-navy', name: 'Muted Navy', value: '#304F6E', availableSizes: ['One Size'],
          images: [
            'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'soft-off-white', name: 'Soft Off-White', value: '#F7F1E6', availableSizes: ['One Size'],
          images: [
            'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    },
    {
      id: 'archive-bag',
      name: 'Archive Bag',
      price: 74,
      category: 'Accessories',
      collection: 'Field Notes',
      collectionCode: 'FN01 / 04',
      status: 'sold-out',
      featuredRank: 8,
      releaseOrder: 1,
      description: 'A compact field bag for daily movement, built with an expandable gusset and a removable internal map pouch.',
      construction: ['Recycled technical canvas', 'Adjustable webbing strap', 'Removable internal pouch', 'Weather-resistant zip'],
      fit: 'Compact cross-body shape with an adjustable strap and expandable base.',
      care: 'Wipe clean with a damp cloth. Do not machine wash or tumble dry.',
      colors: [
        {
          slug: 'warm-brown', name: 'Warm Brown', value: '#765A43', availableSizes: ['One Size'],
          images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1600&q=88'
          ]
        },
        {
          slug: 'deep-charcoal', name: 'Deep Charcoal', value: '#242321', availableSizes: ['One Size'],
          images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1600&q=88',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=88'
          ]
        }
      ]
    }
  ];

  const storageKey = 'waraStudioCartV1';
  const currency = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  const getProduct = (id) => products.find((product) => product.id === id);
  const getColor = (product, reference) => {
    if (!product) return null;
    return product.colors.find((color) => color.slug === reference || color.name === reference) || product.colors[0];
  };
  const formatMoney = (value) => currency.format(value);

  const readCart = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(stored)) return [];
      return stored.flatMap((item) => {
        const product = getProduct(item.id);
        if (!product) return [];
        const color = getColor(product, item.color || item.colour);
        const size = color.availableSizes.includes(item.size) ? item.size : color.availableSizes[0];
        return [{
          id: product.id,
          color: color.slug,
          size,
          quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1))
        }];
      });
    } catch (error) {
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('wara:cart-change', { detail: cart }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const itemKey = (item) => [item.id, item.color, item.size].join('|');

  const addToCart = ({ id, color, colour, size, quantity = 1 }) => {
    const product = getProduct(id);
    if (!product || product.status !== 'available' || !size) return false;
    const selectedColor = getColor(product, color || colour);
    if (!selectedColor.availableSizes.includes(size)) return false;

    const item = {
      id,
      color: selectedColor.slug,
      size,
      quantity: Math.max(1, Math.min(10, Number(quantity) || 1))
    };
    const cart = readCart();
    const key = itemKey(item);
    const existing = cart.find((entry) => itemKey(entry) === key);
    if (existing) existing.quantity = Math.min(10, existing.quantity + item.quantity);
    else cart.push(item);
    return saveCart(cart);
  };

  const setQuantity = (key, quantity) => {
    const cart = readCart();
    const item = cart.find((entry) => itemKey(entry) === key);
    if (!item) return false;
    item.quantity = Math.max(1, Math.min(10, Number(quantity) || 1));
    return saveCart(cart);
  };

  const removeFromCart = (key) => saveCart(readCart().filter((item) => itemKey(item) !== key));
  const cartCount = () => readCart().reduce((total, item) => total + item.quantity, 0);
  const cartTotal = () => readCart().reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  products.forEach((product) => {
    product.colours = product.colors.map((color) => color.name);
    product.sizes = [...new Set(product.colors.flatMap((color) => color.availableSizes))];
    product.images = product.colors[0].images;
  });

  window.WARA = {
    products,
    storageKey,
    getProduct,
    getColor,
    formatMoney,
    readCart,
    saveCart,
    itemKey,
    addToCart,
    setQuantity,
    removeFromCart,
    cartCount,
    cartTotal
  };
})();
