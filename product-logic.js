
/* =============================================================
   KRUNKO: 3-product expanding cards + product-specific enquiry.
   No jQuery required; works alongside existing retailer.js logic.
   ============================================================= */
(function initRetailerProductCards() {
  'use strict';
  const grid = document.getElementById('kr-product-grid');
  const form = document.getElementById('retailer-enquiry-form');
  if (!grid || !form) return;

  const cards = Array.from(grid.querySelectorAll('.kr-product-card'));
  const selectedText = document.getElementById('kr-selected-product-name');
  const selectedRow = document.getElementById('kr-selected-product-row');
  let activeCard = null;

  function setOpen(nextCard) {
    cards.forEach(card => {
      const isActive = card === nextCard;
      const details = card.querySelector('.kr-product-expanded');
      const trigger = card.querySelector('.kr-product-trigger');
      card.classList.toggle('is-active', isActive);
      trigger.setAttribute('aria-expanded', String(isActive));
      details.setAttribute('aria-hidden', String(!isActive));
      details.inert = !isActive;
    });
    grid.classList.toggle('active-mode', Boolean(nextCard));
    activeCard = nextCard;
  }

  cards.forEach(card => {
    const trigger = card.querySelector('.kr-product-trigger');
    const close = card.querySelector('.kr-close-product');

    trigger.addEventListener('click', () => setOpen(activeCard === card ? null : card));
    close.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(null);
      trigger.focus({preventScroll:true});
    });
    // Clicking an empty area of the selected card also closes it (Team.html-style).
    card.addEventListener('click', event => {
      if (event.target.closest('button, a')) return;
      if (event.target.closest('.kr-product-gallery')) return; // Don't close while inspecting photos.
      if (activeCard === card && event.target.closest('.kr-product-preview')) setOpen(null);
    });
  });

  // Escape closes the currently expanded card, just like a close button.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !activeCard) return;
    const trigger = activeCard.querySelector('.kr-product-trigger');
    setOpen(null);
    trigger.focus({preventScroll:true});
  });

  // Enquiry always carries ONLY the product whose button was clicked.
  grid.querySelectorAll('.kr-enquire-product').forEach(link => {
    link.addEventListener('click', () => {
      const product = link.dataset.product;
      form.elements.product.value = product;
      if (selectedText) selectedText.textContent = product;
      if (selectedRow) selectedRow.classList.add('is-selected');
      const response = document.getElementById('form-response');
      if (response) response.hidden = true;
      const copy = document.getElementById('copy-enquiry');
      if (copy) copy.hidden = true;
      const draft = document.getElementById('open-email-draft');
      if (draft) { draft.hidden = true; draft.removeAttribute('href'); }
      // Normal #enquiry anchor navigation handles smooth scrolling.
    });
  });
})();
