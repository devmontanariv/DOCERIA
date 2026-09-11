const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('[data-panel]');

const menuCategories = document.querySelectorAll('[data-menu-category]');
const menuPanels = document.querySelectorAll('[data-menu-panel]');
const categorySections = document.querySelectorAll('.menu-category-panel');
const revealSelector = '.section-heading, .product-feature, .detail-card, .menu-card, .kit-card, .size-card, .option-panel, .dessert-table, .reservation-grid > div';

const revealPanelItems = (panel) => {
  panel.querySelectorAll(revealSelector).forEach((item) => {
    item.classList.add('revealed');
  });
};

menuCategories.forEach((categoryButton) => {
  categoryButton.addEventListener('click', (event) => {
    event.preventDefault();
    const category = categoryButton.dataset.menuCategory;

    menuCategories.forEach((item) => {
      const isActive = item === categoryButton;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
    menuPanels.forEach((panel) => {
      const isActive = panel.dataset.menuPanel === category;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
      if (isActive) revealPanelItems(panel);
    });
    categorySections.forEach((section) => {
      section.classList.toggle('active', section.id === category || (
        category === 'sobremesas' && section.id === 'sobremesas-especiais'
      ));
    });

    document.querySelector('#catalogo-completo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.panel !== category);
    });
  });
});

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const tiltItems = document.querySelectorAll('.product-feature, .detail-card, .menu-card, .kit-card, .size-card, .option-panel');
const revealItems = document.querySelectorAll(revealSelector);

if (!motionQuery.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  tiltItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = item.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    item.addEventListener('pointerleave', () => {
      item.style.transform = '';
    });
  });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('revealed'));
}

menuPanels.forEach((panel) => {
  const isActive = panel.classList.contains('active');
  panel.setAttribute('aria-hidden', String(!isActive));
  if (isActive) revealPanelItems(panel);
});
