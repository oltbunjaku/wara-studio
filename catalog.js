(() => {
  const products = [
    {
      id: 'heavyweight-tee',
      name: 'WARA Heavyweight Tee',
      price: 68,
      category: 'Tops',
      collection: 'Drop 001',
      status: 'available',
      colours: ['Soft Off-White', 'Deep Charcoal', 'Soft Editorial Red'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'A wide, structured tee built as the first layer of the WARA uniform. Dense cotton, dropped shoulders and a worn-in campaign print give it weight without stiffness.',
      construction: ['320 GSM combed cotton jersey', 'Garment washed for a sun-faded surface', 'Screen-printed front and back artwork', 'Cut and sewn with a relaxed, boxy fit'],
      images: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'archive-hoodie',
      name: 'Archive Hoodie 001',
      price: 145,
      category: 'Layers',
      collection: 'Drop 001',
      status: 'available',
      colours: ['Deep Charcoal', 'Ocean Blue'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'A substantial travel layer with a compact hood, exaggerated body and distressed archive marks. Designed to soften and become more personal with wear.',
      construction: ['520 GSM brushed-back cotton', 'Double-layer hood', 'Washed archive print', 'Ribbed cuffs and reinforced pocket'],
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'transit-cargo',
      name: 'Transit Cargo',
      price: 128,
      category: 'Bottoms',
      collection: 'Drop 001',
      status: 'available',
      colours: ['Warm Sand', 'Deep Charcoal'],
      sizes: ['28', '30', '32', '34', '36'],
      description: 'A loose field trouser made for movement. Articulated knees, low-profile cargo pockets and adjustable hems balance utility with a clean editorial silhouette.',
      construction: ['Midweight cotton ripstop', 'Articulated knee panels', 'Adjustable hem system', 'Eight functional pockets'],
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'destination-jacket',
      name: 'No Destination Jacket',
      price: 210,
      category: 'Outerwear',
      collection: 'Drop 001',
      status: 'available',
      colours: ['Sea Teal', 'Deep Charcoal'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'The defining outer layer of Drop 001. A cropped travel jacket with map-seam construction, removable storm collar and hand-finished route graphics.',
      construction: ['Water-resistant cotton nylon shell', 'Breathable cotton lining', 'Removable storm collar', 'Numbered archive label'],
      images: [
        'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'route-knit',
      name: 'Route Knit',
      price: 118,
      category: 'Tops',
      collection: 'Field Notes',
      status: 'available',
      colours: ['Muted Mustard', 'Warm Sand'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'A dry-hand knit with irregular route lines engineered into the surface. Relaxed through the body with a compact ribbed neckline.',
      construction: ['Cotton and recycled wool blend', 'Jacquard route artwork', 'Fully fashioned construction', 'Hand-linked shoulder seams'],
      images: [
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'field-overshirt',
      name: 'Field Overshirt',
      price: 164,
      category: 'Layers',
      collection: 'Field Notes',
      status: 'available',
      colours: ['Soft Editorial Red', 'Warm Sand'],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'A generous overshirt inspired by weathered workwear found on the road. Layered pockets and contrast repair stitching make every angle distinct.',
      construction: ['Heavy cotton canvas', 'Enzyme-washed surface', 'Layered utility pockets', 'Contrast repair stitching'],
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'wara-cap',
      name: 'WARA Cap',
      price: 48,
      category: 'Objects',
      collection: 'Field Notes',
      status: 'coming-soon',
      colours: ['Ocean Blue', 'Soft Off-White'],
      sizes: ['One Size'],
      description: 'A low-profile travel cap with an uneven screen-print mark and an adjustable metal closure.',
      construction: ['Washed cotton twill', 'Six-panel construction', 'Adjustable metal closure', 'Original WARA route embroidery'],
      images: [
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1400&q=86'
      ]
    },
    {
      id: 'archive-bag',
      name: 'Archive Bag',
      price: 74,
      category: 'Objects',
      collection: 'Field Notes',
      status: 'sold-out',
      colours: ['Deep Charcoal', 'Warm Sand'],
      sizes: ['One Size'],
      description: 'A compact field bag for daily movement, built with an expandable gusset and a removable map pouch.',
      construction: ['Recycled technical canvas', 'Adjustable webbing strap', 'Removable internal pouch', 'Weather-resistant zip'],
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=86',
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1400&q=86'
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
  const formatMoney = (value) => currency.format(value);

  const readCart = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(stored)) return [];
      return stored.flatMap((item) => {
        const product = getProduct(item.id);
        if (!product) return [];
        return [{
          id: product.id,
          colour: product.colours.includes(item.colour) ? item.colour : product.colours[0],
          size: product.sizes.includes(item.size) ? item.size : product.sizes[0],
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

  const itemKey = (item) => [item.id, item.colour, item.size].join('|');

  const addToCart = ({ id, colour, size, quantity = 1 }) => {
    const product = getProduct(id);
    if (!product || product.status !== 'available') return false;

    const item = {
      id,
      colour: product.colours.includes(colour) ? colour : product.colours[0],
      size: product.sizes.includes(size) ? size : product.sizes[0],
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

  window.WARA = {
    products,
    storageKey,
    getProduct,
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
