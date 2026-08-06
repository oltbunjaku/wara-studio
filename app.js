(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  let gsapReady = false;

  if (window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);
      gsapReady = typeof window.gsap.timeline === 'function'
        && typeof window.ScrollTrigger.create === 'function'
        && window.gsap.core.globals().ScrollTrigger === window.ScrollTrigger;
    } catch (error) {
      gsapReady = false;
      console.warn('WARA motion engine registration failed; using the CSS loader fallback.');
    }
  }

  document.documentElement.dataset.motionEngine = gsapReady ? 'gsap' : 'css';

  const finishLoader = (loader) => {
    if (loader.dataset.finished === 'true') return;
    loader.dataset.finished = 'true';
    loader.hidden = true;
    loader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-loading');
    try {
      window.sessionStorage.setItem('waraArchiveSeen', 'true');
    } catch (error) {
      // Session storage can be unavailable in privacy-restricted browsers.
    }
    window.dispatchEvent(new CustomEvent('wara:ready'));
    if (gsapReady) window.ScrollTrigger.refresh();
    const targetSelector = window.location.hash;
    if (targetSelector) {
      window.setTimeout(() => {
        try {
          document.querySelector(targetSelector)?.scrollIntoView({ block: 'start' });
        } catch (error) {
          // Ignore malformed URL fragments rather than blocking the page reveal.
        }
      }, 80);
    }
  };

  const initialiseLoader = () => {
    const loader = document.querySelector('[data-loader]');
    const count = document.querySelector('[data-loader-count]');
    if (!loader) return;

    const desktopLoader = window.matchMedia('(min-width: 821px)').matches;
    const loaderStartedAt = window.performance.now();
    const desktopMinimumDuration = 2850;

    let returningVisit = false;
    try {
      returningVisit = window.sessionStorage.getItem('waraArchiveSeen') === 'true';
    } catch (error) {
      returningVisit = false;
    }

    const shortTransition = !desktopLoader && returningVisit;
    const failSafeDuration = !gsapReady ? 2200 : (shortTransition ? 1200 : (desktopLoader ? 4400 : 3200));
    const failSafe = window.setTimeout(() => finishLoader(loader), failSafeDuration);

    const runCssFallback = () => {
      const startedAt = window.performance.now();
      const counterDuration = 950;
      loader.classList.add('loader--fallback');

      const updateCounter = (now) => {
        const progress = Math.min(1, (now - startedAt) / counterDuration);
        if (count) count.textContent = String(Math.round(progress * 100)).padStart(3, '0');
        if (progress < 1) window.requestAnimationFrame(updateCounter);
      };

      window.requestAnimationFrame(updateCounter);
      window.setTimeout(() => {
        if (count) count.textContent = '100';
        window.dispatchEvent(new CustomEvent('wara:hero-reveal'));
        loader.classList.add('loader--fallback-out');
      }, 1050);
      window.setTimeout(() => {
        window.clearTimeout(failSafe);
        finishLoader(loader);
      }, 1500);
    };

    if (!gsapReady) {
      runCssFallback();
      return;
    }

    document.documentElement.classList.add('wara-loader-gsap');

    if (reduceMotion) {
      const counter = { value: 0 };
      loader.classList.add('loader--reduced');
      window.gsap.set('.loader__word span, .loader__top span, .loader__bottom span, [data-loader-route], [data-loader-route-dot], [data-loader-sun]', { clearProps: 'all' });
      window.gsap.set('.loader__paper-panel', { scaleY: 1 });
      window.gsap.set('.loader__word span', { x: 0, y: 0, yPercent: 0, rotation: 0, opacity: 1 });
      window.gsap.set('.loader__top span, .loader__bottom span', { y: 0, opacity: 1 });
      window.gsap.set('[data-loader-route]', { strokeDashoffset: 0 });
      window.gsap.set('[data-loader-route-dot], [data-loader-sun]', { scale: 1, opacity: 1 });

      const reducedTimeline = window.gsap.timeline({
        defaults: { ease: 'power1.out' },
        onComplete: () => {
          if (count) count.textContent = '100';
          window.clearTimeout(failSafe);
          finishLoader(loader);
        }
      });

      reducedTimeline
        .to(counter, {
          value: 100,
          duration: 0.68,
          ease: 'none',
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.value)).padStart(3, '0');
          }
        }, 0)
        .to('[data-loader-line]', { scaleX: 1, duration: 0.68, ease: 'none' }, 0)
        .call(() => window.dispatchEvent(new CustomEvent('wara:hero-reveal')), null, 0.62)
        .to(loader, { opacity: 0, duration: 0.24, ease: 'power1.inOut' }, 0.64);
      return;
    }

    if (shortTransition) {
      const shortTimeline = window.gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          window.clearTimeout(failSafe);
          finishLoader(loader);
        }
      });

      shortTimeline
        .from('.loader__word span', { yPercent: 90, opacity: 0, duration: 0.32, stagger: 0.025 })
        .to('[data-loader-line]', { scaleX: 1, duration: 0.45, ease: 'power1.inOut' }, 0);
      shortTimeline.to(loader, { yPercent: -100, duration: 0.48, ease: 'power4.inOut' }, 0.42);
      return;
    }

    if (desktopLoader) {
      const counter = { value: 0 };
      const panels = window.gsap.utils.toArray('.loader__paper-panel');
      const letters = window.gsap.utils.toArray('[data-loader-letter]');
      const heroLetters = window.gsap.utils.toArray('[data-hero-letter]');
      const routePath = document.querySelector('[data-loader-route]');
      const routeDot = document.querySelector('[data-loader-route-dot]');
      const routeJourney = { value: 0 };
      const routeLength = routePath?.getTotalLength?.() || 0;
      const positionRouteDot = () => {
        if (!routePath || !routeDot || !routeLength) return;
        const point = routePath.getPointAtLength(routeLength * routeJourney.value);
        routeDot.setAttribute('cx', point.x.toFixed(2));
        routeDot.setAttribute('cy', point.y.toFixed(2));
      };
      const getHeroTarget = (letter, index) => {
        const heroLetter = heroLetters[index];
        if (!heroLetter) return { x: 0, y: 0, scale: 0.94 };
        const source = letter.getBoundingClientRect();
        const target = heroLetter.getBoundingClientRect();
        return {
          x: target.left + (target.width / 2) - source.left - (source.width / 2),
          y: target.top + (target.height / 2) - source.top - (source.height / 2),
          scale: Math.max(0.72, Math.min(1.18, target.height / Math.max(1, source.height)))
        };
      };
      const completeDesktopLoader = () => {
        const remaining = desktopMinimumDuration - (window.performance.now() - loaderStartedAt);
        if (remaining > 0) {
          window.setTimeout(() => {
            window.clearTimeout(failSafe);
            finishLoader(loader);
          }, remaining);
          return;
        }
        window.clearTimeout(failSafe);
        finishLoader(loader);
      };
      const timeline = window.gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: completeDesktopLoader
      });

      positionRouteDot();
      timeline
        .set(loader, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 })
        .set(panels, { scaleY: 1, xPercent: 0, transformOrigin: 'center' })
        .set(letters, {
          '--loader-print-opacity': 0.18,
          '--loader-print-x': '0.018em',
          '--loader-print-y': '0.012em'
        })
        .fromTo(panels, { scaleX: 0.965, opacity: 0.92 }, {
          scaleX: 1,
          opacity: 1,
          duration: 0.48,
          stagger: 0.035,
          ease: 'power2.out'
        }, 0)
        .fromTo('.loader__top span, .loader__bottom span', {
          y: 16,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 0.58,
          stagger: 0.045
        }, 0.08)
        .fromTo(letters, {
          xPercent: (index) => [0, 0, 128, -128][index],
          yPercent: (index) => [132, -132, 0, 0][index],
          opacity: 0,
          rotation: (index) => [-7, 3, 4, -4][index]
        }, {
          xPercent: (index) => [9, -7, 6, -8][index],
          yPercent: (index) => [-4, 5, -2, 4][index],
          opacity: 1,
          rotation: (index) => [-1.8, 1.4, -1.1, 1.6][index],
          duration: 0.72,
          stagger: 0.055,
          ease: 'power4.out'
        }, 0.16)
        .to(letters, {
          '--loader-print-opacity': 0.72,
          '--loader-print-x': '0.064em',
          '--loader-print-y': '0.042em',
          duration: 0.28,
          ease: 'power2.out'
        }, 0.58)
        .to(letters, {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          '--loader-print-opacity': 0.3,
          '--loader-print-x': '0.024em',
          '--loader-print-y': '0.016em',
          duration: 0.38,
          stagger: 0.018,
          ease: 'back.out(2.35)'
        }, 1.02)
        .fromTo('[data-loader-sun]', {
          scale: 0.45,
          rotation: -24,
          opacity: 0
        }, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.92
        }, 0.2)
        .fromTo('[data-loader-route]', { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          duration: 1.58,
          ease: 'power2.inOut'
        }, 0.14)
        .fromTo(routeDot, { scale: 0, opacity: 0 }, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.8)'
        }, 0.16)
        .to(routeJourney, {
          value: 0.67,
          duration: 1.52,
          ease: 'power1.inOut',
          onUpdate: positionRouteDot
        }, 0.18)
        .to(counter, {
          value: 100,
          duration: 1.42,
          ease: 'power3.in',
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.value)).padStart(3, '0');
          }
        }, 0.58)
        .to('[data-loader-line]', {
          scaleX: 1,
          duration: 1.42,
          ease: 'power3.in'
        }, 0.58)
        .fromTo('[data-loader-tear]', {
          xPercent: -105,
          opacity: 0
        }, {
          xPercent: 105,
          opacity: 1,
          duration: 0.62,
          ease: 'power3.inOut'
        }, 1.78)
        .to('[data-loader-tear]', { opacity: 0, duration: 0.12 }, 2.3)
        .to('.loader__top, .loader__bottom, .loader__route-map, .loader__sun', {
          opacity: 0,
          duration: 0.34,
          ease: 'power2.in'
        }, 2.04)
        .call(() => window.dispatchEvent(new CustomEvent('wara:hero-reveal')), null, 1.72)
        .to(letters, {
          x: (index, letter) => getHeroTarget(letter, index).x,
          y: (index, letter) => getHeroTarget(letter, index).y,
          scale: (index, letter) => getHeroTarget(letter, index).scale,
          opacity: 0.12,
          duration: 0.92,
          stagger: 0.015,
          ease: 'power3.inOut'
        }, 2.08)
        .set(loader, { backgroundColor: 'transparent' }, 2.16)
        .to(panels, {
          xPercent: (index) => [-110, -212, 212, 110][index],
          rotation: (index) => [-0.8, 0.65, -0.65, 0.8][index],
          duration: 0.94,
          stagger: 0.025,
          ease: 'power4.inOut'
        }, 2.17)
        .to(loader, {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.out'
        }, 2.98);
      return;
    }

    const counter = { value: 0 };
    const timeline = window.gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => {
        window.clearTimeout(failSafe);
        finishLoader(loader);
      }
    });

    timeline
      .from('.loader__top span, .loader__bottom span', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05
      })
      .from('.loader__word span', {
        yPercent: 120,
        opacity: 0,
        duration: 0.75,
        stagger: 0.055
      }, 0.1)
      .from('.loader__paper-panel', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.8,
        stagger: 0.06
      }, 0.05)
      .to(counter, {
        value: 100,
        duration: 1.45,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(counter.value)).padStart(3, '0');
        }
      }, 0.1)
      .to('[data-loader-line]', {
        scaleX: 1,
        duration: 1.45,
        ease: 'power1.inOut'
      }, 0.1)
      .to('.loader__word span', {
        yPercent: -120,
        opacity: 0,
        duration: 0.55,
        stagger: 0.035,
        ease: 'power3.in'
      }, 1.25)
      .to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut'
      }, 1.65);
  };

  const initialiseHeader = () => {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!header) return;

    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 28);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (!toggle || !menu) return;

    const closeMenu = (returnFocus = false) => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      header.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      if (returnFocus) toggle.focus();
    };

    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
      header.classList.add('is-open');
      document.body.classList.add('menu-open');
      menu.querySelector('a')?.focus();
    };

    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
      else openMenu();
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) closeMenu();
    });
  };

  const initialiseSmoothNavigation = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  };

  const initialiseCursor = () => {
    const cursor = document.querySelector('[data-cursor]');
    if (!cursor || coarsePointer || reduceMotion) return;

    const label = cursor.querySelector('span');
    let x = -100;
    let y = -100;
    let frame = null;

    const render = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = null;
    };

    window.addEventListener('pointermove', (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.add('is-visible');
      if (!frame) frame = window.requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener('pointerover', (event) => {
      const interactive = event.target.closest('a, button, [data-cursor-label]');
      cursor.classList.toggle('is-active', Boolean(interactive));
      if (label) label.textContent = interactive?.dataset.cursorLabel || (interactive ? 'OPEN' : 'VIEW');
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
  };

  const splitManifesto = () => {
    const manifesto = document.querySelector('[data-manifesto]');
    if (!manifesto || manifesto.dataset.split === 'true') return [];

    const copy = manifesto.textContent.trim();
    const fragment = document.createDocumentFragment();
    copy.split(/\s+/).forEach((word, index, words) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.setAttribute('aria-hidden', 'true');
      fragment.appendChild(span);
      if (index < words.length - 1) fragment.appendChild(document.createTextNode(' '));
    });

    manifesto.textContent = '';
    manifesto.setAttribute('aria-label', copy);
    manifesto.appendChild(fragment);
    manifesto.dataset.split = 'true';
    return Array.from(manifesto.querySelectorAll('span'));
  };

  const initialiseMotion = () => {
    const manifestoWords = splitManifesto();
    if (!gsapReady || reduceMotion) return;

    const { gsap, ScrollTrigger } = window;
    const isSmall = window.matchMedia('(max-width: 820px)').matches;

    const hero = document.querySelector('[data-hero]');
    if (hero) {
      const loader = document.querySelector('[data-loader]');
      const holdDesktopHero = !isSmall && loader && loader.dataset.finished !== 'true';
      const heroTimeline = gsap.timeline({ delay: holdDesktopHero ? 0 : 0.15, paused: holdDesktopHero })
        .from('.site-header__inner', { y: -24, opacity: 0, duration: 0.75 })
        .from('.hero__meta span', { y: 18, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.08)
        .from('.hero__drop', { x: -28, opacity: 0, duration: 0.8 }, 0.12)
        .from('[data-adventure-shape]', { scale: 0.72, rotation: -8, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' }, 0.08)
        .from('.hero__route', { opacity: 0, duration: 1.1 }, 0.18)
        .from('.hero__route path', { strokeDashoffset: 140, duration: 1.5, stagger: 0.08, ease: 'power2.out' }, 0.2)
        .from('[data-hero-colour]', { scaleX: 0.94, opacity: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, 0.15)
        .from('[data-hero-letter]', { yPercent: 115, opacity: 0, duration: 1.15, stagger: 0.07, ease: 'power4.out' }, 0.18)
        .from('.hero__studio', { y: 25, opacity: 0, duration: 0.8 }, 0.55)
        .from('.hero__statement > *', { y: 28, opacity: 0, duration: 0.85, stagger: 0.08 }, 0.62)
        .from('.hero__footer span', { y: 12, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.85)
        .from('.hero__media', {
          clipPath: 'polygon(8% 100%, 100% 100%, 100% 100%, 0 100%, 4% 100%, 0 100%, 5% 100%, 1% 100%, 7% 100%, 2% 100%)',
          scale: 1.08,
          duration: 1.15,
          ease: 'power3.out'
        }, 0.08);

      if (holdDesktopHero) {
        let heroStarted = false;
        const startHero = () => {
          if (heroStarted) return;
          heroStarted = true;
          heroTimeline.play(0);
        };
        window.addEventListener('wara:hero-reveal', startHero, { once: true });
        window.addEventListener('wara:ready', startHero, { once: true });
      }
    } else {
      const pageHero = document.querySelector('.page-hero');
      const pageHeroRoute = pageHero?.querySelector('.page-hero__route');
      const pageHeroLead = pageHero?.querySelector('.page-hero__lead');
      const pageTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.site-header__inner', { y: -20, opacity: 0, duration: 0.65 });

      if (pageHero) {
        pageTimeline
          .from(pageHero.querySelectorAll('.page-hero__meta > *'), { y: 16, opacity: 0, duration: 0.65, stagger: 0.05 }, 0.08);
        if (pageHeroRoute) pageTimeline.from(pageHeroRoute, { scale: 0.82, rotation: -20, opacity: 0, duration: 1.1 }, 0.06);
        pageTimeline.from(pageHero.querySelectorAll('.page-hero__title > span'), { yPercent: 70, opacity: 0, duration: 1 }, 0.18);
        if (pageHeroLead) pageTimeline.from(pageHeroLead, { y: 26, opacity: 0, duration: 0.8 }, 0.46);
      }

      if (!isSmall && pageHeroRoute) {
        gsap.to(pageHeroRoute, {
          yPercent: 12,
          rotation: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: pageHero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      }
    }

    if (!isSmall) {
      gsap.to('.hero__colour-layer--red', {
        xPercent: -7,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: '20% top',
          end: 'bottom top',
          scrub: 0.8
        }
      });

      gsap.to('.hero__colour-layer--blue', {
        xPercent: 7,
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: '20% top',
          end: 'bottom top',
          scrub: 0.8
        }
      });

      gsap.to('.hero__sun', {
        yPercent: 34,
        rotation: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.9
        }
      });

      gsap.to('.hero__wave', {
        xPercent: -24,
        rotation: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.9
        }
      });

      gsap.to('.hero__brush', {
        xPercent: 7,
        yPercent: -10,
        rotation: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.9
        }
      });

      document.querySelectorAll('[data-hero-letter]').forEach((letter, index, letters) => {
        const midpoint = (letters.length - 1) / 2;
        gsap.to(letter, {
          xPercent: (index - midpoint) * 22,
          yPercent: index % 2 === 0 ? -18 : 14,
          opacity: 0.16,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero]',
            start: '32% top',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      });

      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (hero && finePointer) {
        const redLayer = hero.querySelector('.hero__colour-layer--red');
        const blueLayer = hero.querySelector('.hero__colour-layer--blue');
        const heroMedia = hero.querySelector('.hero__media');
        const moveRedX = redLayer ? gsap.quickTo(redLayer, 'x', { duration: 0.75, ease: 'power3.out' }) : null;
        const moveRedY = redLayer ? gsap.quickTo(redLayer, 'y', { duration: 0.75, ease: 'power3.out' }) : null;
        const moveBlueX = blueLayer ? gsap.quickTo(blueLayer, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
        const moveBlueY = blueLayer ? gsap.quickTo(blueLayer, 'y', { duration: 0.9, ease: 'power3.out' }) : null;
        const moveMediaX = heroMedia ? gsap.quickTo(heroMedia, 'x', { duration: 1.05, ease: 'power3.out' }) : null;
        const moveMediaY = heroMedia ? gsap.quickTo(heroMedia, 'y', { duration: 1.05, ease: 'power3.out' }) : null;

        hero.addEventListener('pointermove', (event) => {
          const bounds = hero.getBoundingClientRect();
          const horizontal = ((event.clientX - bounds.left) / bounds.width) - 0.5;
          const vertical = ((event.clientY - bounds.top) / bounds.height) - 0.5;
          moveRedX?.(horizontal * -15);
          moveRedY?.(vertical * -9);
          moveBlueX?.(horizontal * 13);
          moveBlueY?.(vertical * 8);
          moveMediaX?.(horizontal * 10);
          moveMediaY?.(vertical * 7);
        });

        hero.addEventListener('pointerleave', () => {
          moveRedX?.(0);
          moveRedY?.(0);
          moveBlueX?.(0);
          moveBlueY?.(0);
          moveMediaX?.(0);
          moveMediaY?.(0);
        });
      }

      if (finePointer) {
        document.querySelectorAll('.button').forEach((button) => {
          button.addEventListener('pointermove', (event) => {
            const bounds = button.getBoundingClientRect();
            const x = (event.clientX - bounds.left - (bounds.width / 2)) * 0.12;
            const y = (event.clientY - bounds.top - (bounds.height / 2)) * 0.16;
            gsap.to(button, { x, y, duration: 0.36, ease: 'power3.out', overwrite: 'auto' });
          });
          button.addEventListener('pointerleave', () => {
            gsap.to(button, { x: 0, y: 0, duration: 0.62, ease: 'elastic.out(1, 0.42)', overwrite: 'auto' });
          });
        });
      }

      document.querySelectorAll('.chapter-heading h2, .products__header h2, .editorial__copy h2, .lookbook__intro h2, .newsletter__heading h2').forEach((heading) => {
        gsap.fromTo(heading, { yPercent: 5 }, {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: heading,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.85
          }
        });
      });
    }

    document.querySelectorAll('.reveal-group').forEach((group) => {
      gsap.from(group.children, {
        y: isSmall ? 28 : 54,
        opacity: 0,
        duration: 1,
        stagger: 0.07,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 82%',
          once: true
        }
      });
    });

    document.querySelectorAll('.image-reveal').forEach((image) => {
      gsap.fromTo(image,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.25,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: image, start: 'top 86%', once: true }
        }
      );
      const media = image.querySelector('img');
      if (media) {
        gsap.fromTo(media,
          { scale: 1.14 },
          {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: image, start: 'top 86%', once: true }
          }
        );
      }
    });

    if (!isSmall) {
      document.querySelectorAll('[data-parallax]').forEach((element) => {
        const image = element.tagName === 'IMG' ? element : element.querySelector('img');
        if (!image) return;
        const speed = Number(element.dataset.speed || 0.08);
        gsap.to(image, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      });
    }

    const homepageCards = document.querySelectorAll('.product-card');
    const homepageGrid = document.querySelector('[data-product-grid]');
    if (homepageCards.length && homepageGrid) {
      gsap.from(homepageCards, {
        y: 70,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: homepageGrid,
          start: 'top 78%',
          once: true
        }
      });
    }

    const currentLook = document.querySelector('[data-lookbook-current]');
    document.querySelectorAll('[data-lookbook-card]').forEach((card, index, cards) => {
      gsap.set(card, { zIndex: index + 1 });
      gsap.fromTo(card,
        { scale: index === 0 ? 1 : 0.88, opacity: index === 0 ? 1 : 0.25 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'top 18%',
            scrub: 0.7,
            onEnter: () => { if (currentLook) currentLook.textContent = card.dataset.index; },
            onEnterBack: () => { if (currentLook) currentLook.textContent = card.dataset.index; }
          }
        }
      );

      if (index < cards.length - 1) {
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.22,
          filter: 'brightness(0.45)',
          ease: 'none',
          scrollTrigger: {
            trigger: cards[index + 1],
            start: 'top 88%',
            end: 'top 18%',
            scrub: 0.7
          }
        });
      }
    });

    if (!isSmall) {
      const gallery = document.querySelector('[data-horizontal-gallery]');
      const track = document.querySelector('[data-horizontal-track]');
      if (gallery && track) {
        const viewport = gallery.querySelector('.horizontal-gallery__viewport');
        const distance = () => Math.max(0, track.scrollWidth - (viewport?.clientWidth || window.innerWidth));
        let refreshFrame = null;
        let lastTrackWidth = track.scrollWidth;
        let lastViewportWidth = viewport?.clientWidth || window.innerWidth;
        const scheduleGalleryRefresh = () => {
          if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
          refreshFrame = window.requestAnimationFrame(() => {
            refreshFrame = null;
            ScrollTrigger.refresh();
          });
        };

        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: gallery,
            start: 'top top',
            end: () => `+=${Math.max(1, distance())}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });

        const galleryItems = Array.from(track.querySelectorAll('.horizontal-item'));
        galleryItems.forEach((item, index) => {
          const startRotation = index % 2 === 0 ? -0.75 : 0.65;
          const endRotation = index % 2 === 0 ? 1.15 : -1.05;
          gsap.fromTo(item, { rotation: startRotation }, {
            rotation: endRotation,
            ease: 'none',
            scrollTrigger: {
              trigger: gallery,
              start: 'top top',
              end: () => `+=${Math.max(1, distance())}`,
              scrub: 0.8,
              invalidateOnRefresh: true
            }
          });
        });

        const images = Array.from(track.querySelectorAll('img'));
        const imageReady = (image) => {
          if (image.complete) return image.decode?.().catch(() => undefined) || Promise.resolve();
          return new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          });
        };
        Promise.allSettled(images.map(imageReady)).then(scheduleGalleryRefresh);

        if ('ResizeObserver' in window && viewport) {
          const galleryResizeObserver = new ResizeObserver(() => {
            const nextTrackWidth = track.scrollWidth;
            const nextViewportWidth = viewport.clientWidth;
            if (nextTrackWidth === lastTrackWidth && nextViewportWidth === lastViewportWidth) return;
            lastTrackWidth = nextTrackWidth;
            lastViewportWidth = nextViewportWidth;
            scheduleGalleryRefresh();
          });
          galleryResizeObserver.observe(track);
          galleryResizeObserver.observe(viewport);
        }

        window.addEventListener('resize', scheduleGalleryRefresh, { passive: true });
      }
    }

    if (manifestoWords.length) {
      gsap.to(manifestoWords, {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-manifesto]',
          start: 'top 78%',
          end: 'bottom 42%',
          scrub: 0.8
        }
      });
    }

    ScrollTrigger.refresh();
  };

  const initialiseNewsletter = () => {
    const form = document.querySelector('[data-newsletter-form]');
    const message = document.querySelector('[data-newsletter-message]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (message) message.textContent = 'Transmission window opens with Drop 001.';
      form.reset();
    });
  };

  const initialiseFieldCarousel = () => {
    const carousel = document.querySelector('[data-field-carousel]');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('[data-field-slide]'));
    const count = carousel.querySelector('[data-field-count]');
    let current = 0;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.hidden = !active;
        slide.classList.toggle('is-active', active);
      });
      if (count) count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };

    carousel.querySelector('[data-field-prev]')?.addEventListener('click', () => show(current - 1));
    carousel.querySelector('[data-field-next]')?.addEventListener('click', () => show(current + 1));
    show(0);
  };

  const initialise = () => {
    initialiseHeader();
    initialiseSmoothNavigation();
    initialiseCursor();
    initialiseMotion();
    initialiseNewsletter();
    initialiseFieldCarousel();
    initialiseLoader();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
})();
