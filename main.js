function initFAQ() {
  const faqQuestions = document.getElementsByClassName('faq__question');

  if (!faqQuestions.length) return;

  [...faqQuestions].forEach((q) => {
    q.addEventListener('click', () => {
      q.classList.toggle('faq__question--hidden');
    });
  });
}

function animateValue(start, end, duration, callback) {
  const startTime = performance.now();

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  function update(currentTime) {
    const elapsed = currentTime - startTime;

    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easeOutQuart(progress);

    const currentValue = Math.floor(start + (end - start) * easedProgress);

    callback(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initHeroCounters() {
  const expFeatures = document.getElementsByClassName('hero__exp-item');

  if (!expFeatures.length) return;

  [...expFeatures].forEach((f, i) => {
    const titleElem = f.querySelector('.hero__exp-title');

    if (!titleElem) return;

    const originalHTML = titleElem.innerHTML;

    const targetValue = parseInt(originalHTML.replace(/[^\d]/g, ''));

    if (isNaN(targetValue)) return;

    const formattedTarget = targetValue.toLocaleString('ru-RU');

    const tempHTML = originalHTML.replace(/(\d[\d\s]*\d|\d)/, formattedTarget);

    titleElem.innerHTML = tempHTML;

    const finalWidth = titleElem.getBoundingClientRect().width;

    titleElem.style.width = finalWidth + 'px';

    titleElem.style.display = 'inline-block';

    titleElem.style.textAlign = 'center';

    titleElem.innerHTML = originalHTML.replace(/(\d[\d\s]*\d|\d)/, '0');

    setTimeout(() => {
      f.classList.add('hero__exp-item--up');

      animateValue(0, targetValue, 1000, (val) => {
        titleElem.innerHTML = originalHTML.replace(
          /(\d[\d\s]*\d|\d)/,
          val.toLocaleString('ru-RU')
        );
      });
    }, 500 * i);
  });
}

function initClientsSlider() {
  const container = document.querySelector('.clients__container');

  if (!container || !container.parentNode) return;

  if (container.parentElement.classList.contains('clients__scroll-wrapper')) {
    return;
  }

  const children = [...container.children];

  const wrapper = document.createElement('div');

  wrapper.classList.add('clients__scroll-wrapper');

  container.parentNode.insertBefore(wrapper, container);

  wrapper.appendChild(container);

  children.forEach((child) => {
    const clone = child.cloneNode(true);

    container.appendChild(clone);
  });
}

function initWorkCarousel() {
  const wrapper = document.querySelector('.our-work__gallery-wrapper');

  const gallery = document.querySelector('.our-work__gallery-content');

  const items = [...document.querySelectorAll('.our-work__item')];

  const dotsContainer = document.querySelector('.dots-list');

  const leftBtn = document.querySelector('.our-work__btn-left');

  const rightBtn = document.querySelector('.our-work__btn-right');

  if (
    !wrapper ||
    !gallery ||
    !items.length ||
    !dotsContainer ||
    !leftBtn ||
    !rightBtn
  )
    return;

  let visibleItems = window.innerWidth <= 768 ? 1 : 3;

  let resizeTimer;

  let currentPage = 0;

  let totalPages = 1;

  const getGap = () => {
    const style = getComputedStyle(gallery);

    return parseFloat(style.gap) || 0;
  };

  const updateDots = () => {
    const dots = [...dotsContainer.children];

    dots.forEach((dot, index) => {
      dot.classList.toggle('dots-list__dot--active', index === currentPage);
    });
  };

  const createDots = () => {
    if (dotsContainer.children.length === totalPages) return;

    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('li');

      dot.classList.add('dots-list__dot');

      dot.addEventListener('click', () => {
        currentPage = i;

        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    }
  };

  const updateCarousel = () => {
    const containerWidth = wrapper.clientWidth;

    const gap = getGap();

    const itemWidth =
      (containerWidth - (visibleItems - 1) * gap) / visibleItems;

    items.forEach((item) => {
      item.style.width = `${itemWidth}px`;
    });

    const totalWidth = items.length * itemWidth + (items.length - 1) * gap;

    gallery.style.width = `${totalWidth}px`;

    totalPages = Math.max(1, Math.ceil(items.length / visibleItems));

    if (currentPage >= totalPages) {
      currentPage = totalPages - 1;
    }

    const stepWidth = containerWidth + gap;

    gallery.style.transform = `translateX(${-currentPage * stepWidth}px)`;

    createDots();

    updateDots();

    leftBtn.classList.toggle('our-work__btn--deactivated', currentPage === 0);

    rightBtn.classList.toggle(
      'our-work__btn--deactivated',
      currentPage >= totalPages - 1
    );
  };

  leftBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;

      updateCarousel();
    }
  });

  rightBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;

      updateCarousel();
    }
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        visibleItems = 1;
      } else if (window.innerWidth <= 1200) {
        visibleItems = 2;
      } else {
        visibleItems = 3;
      }

      updateCarousel();
    }, 100);
  });

  updateCarousel();
}

function initHeader() {
  const header = document.querySelector('.header');

  const button = document.querySelector('.nav__btn');

  if (!header || !button) return;

  const scrollThreshold = 50;

  const onScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');

      button.classList.add('btn-small--black-fill');

      button.classList.remove('btn-small--white-fill');
    } else {
      header.classList.remove('header--scrolled');

      button.classList.add('btn-small--white-fill');

      button.classList.remove('btn-small--black-fill');
    }
  };

  window.addEventListener('scroll', onScroll, {
    passive: true,
  });

  onScroll();
}

function initPolicy() {
  const policy = document.querySelector('.policy');

  const agreedToCookies = localStorage.getItem('cookie_consent');
  if (agreedToCookies === 'true') return;

  if (!policy) return;

  policy.classList.add('policy--active');

  window.closePolicy = () => {
    localStorage.setItem('cookie_consent', 'true');
    policy.style.display = 'none';
  };
}

function initBurgerMenu() {
  const burgerMenu = document.querySelector('.burger-menu');

  const openBtn = document.querySelector('.btn-burger');

  const closeBtn = document.querySelector('.burger-menu__close-btn');

  const links = document.querySelectorAll('.burger-menu__nav-link');

  if (!burgerMenu || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    burgerMenu.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    burgerMenu.style.display = 'none';
  });

  links.forEach((item) => {
    const link = item.querySelector('a');

    if (!link) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();

      burgerMenu.style.display = 'none';

      window.location.href = link.href;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFAQ();

  initHeroCounters();

  initClientsSlider();

  initWorkCarousel();

  initHeader();

  initPolicy();

  initBurgerMenu();
});
