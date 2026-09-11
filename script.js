const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('[data-panel]');

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
const revealItems = document.querySelectorAll('.section-heading, .product-feature, .detail-card, .menu-card, .kit-card, .size-card, .option-panel, .dessert-table, .reservation-grid > div');

if (!motionQuery.matches) {
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

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('revealed'));
}
