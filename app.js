(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const gsapReady = Boolean(window.gsap && window.ScrollTrigger);

  if (gsapReady) window.gsap.registerPlugin(window.ScrollTrigger);

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

    let returningVisit = false;
    try {
      returningVisit = window.sessionStorage.getItem('waraArchiveSeen') === 'true';
    } catch (error) {
      returningVisit = false;
    }

    let sameOriginReferrer = false;
    try {
      sameOriginReferrer = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin;
    } catch (error) {
      sameOriginReferrer = false;
    }

    const navigationEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
    const hardReload = navigationEntry?.type === 'reload';
    const shortTransition = desktopLoader
      ? returningVisit && sameOriginReferrer && !hardReload
      : returningVisit;
    const failSafe = window.setTimeout(() => finishLoader(loader), shortTransition ? 1200 : (desktopLoader ? 3600 : 3200));

    if (reduceMotion || !gsapReady) {
      window.setTimeout(() => {
        window.clearTimeout(failSafe);
        finishLoader(loader);
      }, reduceMotion ? 120 : 900);
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
      if (desktopLoader) {
        shortTimeline.call(() => window.dispatchEvent(new CustomEvent('wara:hero-reveal')), null, 0.36);
      }
      shortTimeline.to(loader, { yPercent: -100, duration: 0.48, ease: 'power4.inOut' }, 0.42);
      return;
    }

    if (desktopLoader) {
      const counter = { value: 0 };
      const panels = window.gsap.utils.toArray('.loader__paper-panel');
      const timeline = window.gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          window.clearTimeout(failSafe);
          finishLoader(loader);
        }
      });

      timeline
        .set(loader, { clipPath: 'inset(0% 0% 0% 0%)' })
        .from(panels, {
          scaleY: 0,
          transformOrigin: (index) => index % 2 === 0 ? 'top' : 'bottom',
          duration: 0.82,
          stagger: 0.055
        }, 0)
        .from('.loader__top span, .loader__bottom span', {
          y: 16,
          opacity: 0,
          duration: 0.58,
          stagger: 0.045
        }, 0.08)
        .from('.loader__word span', {
          yPercent: 125,
          opacity: 0,
          rotation: (index) => index % 2 === 0 ? -3 : 3,
          duration: 0.82,
          stagger: 0.06
        }, 0.1)
        .from('[data-loader-sun]', {
          scale: 0.45,
          rotation: -24,
          opacity: 0,
          duration: 1
        }, 0.12)
        .to('[data-loader-route]', {
          strokeDashoffset: 0,
          duration: 1.45,
          ease: 'power2.inOut'
        }, 0.12)
        .from('[data-loader-route-dot]', {
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'back.out(1.8)'
        }, 1.22)
        .to(counter, {
          value: 100,
          duration: 1.5,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.value)).padStart(3, '0');
          }
        }, 0.12)
        .to('[data-loader-line]', {
          scaleX: 1,
          duration: 1.5,
          ease: 'power1.inOut'
        }, 0.12)
        .to('.loader__word span', {
          yPercent: -125,
          opacity: 0,
          duration: 0.55,
          stagger: 0.035,
          ease: 'power3.in'
        }, 1.35)
        .to('.loader__top, .loader__bottom, .loader__route-map, .loader__sun', {
          opacity: 0,
          duration: 0.32,
          ease: 'power2.in'
        }, 1.65)
        .call(() => window.dispatchEvent(new CustomEvent('wara:hero-reveal')), null, 1.7)
        .to(panels, {
          yPercent: (index) => index % 2 === 0 ? -105 : 105,
          duration: 0.82,
          stagger: 0.04,
          ease: 'power4.inOut'
        }, 1.72)
        .to(loader, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.82,
          ease: 'power4.inOut'
        }, 1.78);
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
        .from('.hero__media', { clipPath: 'inset(0 0 100% 0)', scale: 1.08, duration: 1.3, ease: 'power4.inOut' }, 0.08);

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
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: gallery,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });
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
      if (message) message.textContent = 'Prototype confirmation only. No address was stored.';
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
