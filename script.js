// Simple storefront interactions. This static preview has no checkout or backend.
const cart = [];
const dialog = document.querySelector('#info-dialog');
const menuButton = document.querySelector('.menu-button');
let toastTimer;
function showToast(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function toggleMenu() {
  const isOpen = document.querySelector('.navigation').classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}
menuButton.addEventListener('click', toggleMenu);
document.querySelectorAll('.navigation a, .navigation button').forEach(link => link.addEventListener('click', () => {
  if (menuButton.getAttribute('aria-expanded') === 'true') toggleMenu();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') toggleMenu();
});
function togglePacketImage(button) {
  const flipped = button.classList.toggle('is-flipped');
  button.setAttribute('aria-pressed', flipped);
  button.setAttribute('aria-label', button.getAttribute('aria-label').replace(flipped ? 'back' : 'front', flipped ? 'front' : 'back'));
}
document.querySelectorAll('.packet-image').forEach(button => {
  button.addEventListener('click', () => togglePacketImage(button));
  button.addEventListener('mouseleave', () => {
    if (matchMedia('(hover: hover)').matches && button.classList.contains('is-flipped')) togglePacketImage(button);
  });
});
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('.cart-button').setAttribute('aria-label', `Open cart, ${count} items`);
}
function addToCart(name, price) {
  const item = cart.find(item => item.name === name);
  if (item) item.quantity += 1;
  else cart.push({name, price, quantity: 1});
  updateCartCount();
  showToast(`${name} added to cart`);
}
document.querySelectorAll('.add-cart').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.product, Number(button.dataset.price))));
function openDialog(title, content) {
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-content').replaceChildren();
  if (typeof content === 'string') {
    const paragraph = document.createElement('p');
    paragraph.textContent = content;
    document.querySelector('#dialog-content').append(paragraph);
  } else document.querySelector('#dialog-content').append(content);
  if (!dialog.open) dialog.showModal();
}
function showCart() {
  const contents = document.createElement('div');
  cart.forEach((item, index) => {
    const row = document.createElement('div'); row.className = 'cart-row';
    const name = document.createElement('span'); name.textContent = `${item.name} × ${item.quantity} · ₹${item.price * item.quantity}`;
    const remove = document.createElement('button'); remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${item.name}`);
    remove.addEventListener('click', () => {cart.splice(index, 1); updateCartCount(); showCart();});
    row.append(name, remove); contents.append(row);
  });
  const total = document.createElement('p'); total.className = 'cart-total';
  total.textContent = cart.length ? `Subtotal: ₹${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}` : 'Your cart is waiting for a little crunch.';
  const note = document.createElement('p'); note.className = 'cart-note'; note.textContent = 'Storefront preview: prices are sample values. Checkout and payments are not enabled.';
  const shop = document.createElement('button'); shop.className = 'button'; shop.textContent = 'Continue Shopping'; shop.addEventListener('click', () => {dialog.close(); document.querySelector('#shop').scrollIntoView();});
  contents.append(total, note, shop); openDialog('Your Crunch Cart', contents);
}
document.querySelector('.cart-button').addEventListener('click', showCart);
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if (event.target === dialog) {const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();}});
// Product search searches both the jars and packs.
document.querySelector('.search').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (innerWidth <= 650 && !form.classList.contains('search-open')) {form.classList.add('search-open'); document.querySelector('#search').focus(); return;}
  const query = document.querySelector('#search').value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll('.product-card').forEach(card => {const match = card.dataset.name.toLowerCase().includes(query); card.hidden = !match; if (match) count++;});
  const status = document.querySelector('.search-result'); status.hidden = false;
  status.textContent = query ? `${count} product${count === 1 ? '' : 's'} found for “${query}”. Clear the search to see all products.` : 'Showing all products.';
  document.querySelector('#shop').scrollIntoView();
});
document.querySelector('#search').addEventListener('input', event => {
  if (!event.target.value) {document.querySelectorAll('.product-card').forEach(card => card.hidden = false); document.querySelector('.search-result').hidden = true;}
});
// Newsletter uses a local success state; no email is sent or stored.
document.querySelector('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#newsletter-message').textContent = 'Thanks for joining the crunch! Preview only — your email has not been saved.';
  event.currentTarget.reset();
});
const info = {
  account: ['Your Account', 'This is a storefront preview. Account sign-in will be available when the online store launches.'],
  combos: ['Mix Up Your Crunch', 'Choose your favourite jar flavours and add them to your cart individually. Bundle pricing is not available in this preview.'],
  arrivals: ['Meet the Crunch Collection', 'Explore Cheese, Himalayan Salt, Peri Peri and Tangy Tomato in Our Crunchy Jars, plus our easy-to-carry makhana packs.'],
  offers: ['A Little Extra Goodness', 'Free shipping on orders above ₹499 is the featured launch offer. Checkout is not enabled in this preview.'],
  story: ['Rooted in Goodness', 'KRUNKO is a brand by Kaushal Agro Industries. Our passion is bringing the goodness of makhana to everyday snack breaks, with flavours that make every handful a little more fun.'],
  farmers: ['From Farm to Crunch', 'Makhana starts its journey in lotus ponds. KRUNKO celebrates this humble ingredient through a range of delicious snack flavours.'],
  quality: ['Goodness in Every Handful', 'See the back of the supplied green and pink pack images for product information. Check the packaging for ingredients, allergens and nutritional details before consuming.'],
  contact: ['Let’s Talk Crunch', 'Contact Kaushal Agro Industries at info@thefarmproject.co.in. Address: C-41, P.C. Colony, Kankarbagh, Patna, Bihar 800020, India.'],
  social: ['Keep It KRUNKO', 'Official social profile links have not been supplied yet. For brand enquiries, contact info@thefarmproject.co.in.'],
  privacy: ['Privacy Notice', 'This static preview does not send your email, cart or search information to a server. Cart selections last only while this page is open. A live-store privacy policy must be supplied before launch.'],
  terms: ['Storefront Preview', 'Products are presented for design review. Prices and weights are sample values. This page does not accept orders or payments. Final store terms must be supplied before launch.'],
  shipping: ['Shipping Information', 'The featured offer is free shipping on orders above ₹499. Orders cannot be placed through this preview. Delivery areas, timelines and the final shipping policy must be confirmed before launch.']
};
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', event => {event.preventDefault(); const entry = info[button.dataset.info]; openDialog(entry[0], entry[1]);}));
document.querySelector('#year').textContent = new Date().getFullYear();


// KRUNKO Showcase — manual scrolling, mouse drag and optional decorative video.
(() => {
    const section = document.querySelector('.krunko-showcase');
    if (!section) return;

    const slider = section.querySelector('.showcase-slider');
    const cards = [...section.querySelectorAll('.showcase-card')];
    const previous = section.querySelector('.showcase-prev');
    const next = section.querySelector('.showcase-next');
    const position = section.querySelector('.showcase-position');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    section.querySelector('.showcase-arrows').hidden = false;

    function cardStep() {
        return cards[1].offsetLeft - cards[0].offsetLeft;
    }
    function scrollToCard(index) {
        slider.scrollTo({
            left: Math.max(0, index) * cardStep(),
            behavior: reducedMotion.matches ? 'instant' : 'smooth'
        });
    }
    function updateShowcase() {
        const end = slider.scrollWidth - slider.clientWidth;
        previous.disabled = slider.scrollLeft <= 2;
        next.disabled = slider.scrollLeft >= end - 2;
        const first = Math.round(slider.scrollLeft / cardStep()) + 1;
        const visible = Math.max(1, Math.floor((slider.clientWidth + 2) / cards[0].offsetWidth));
        const last = Math.min(cards.length, first + visible - 1);
        position.textContent = first === last ? `${first} of ${cards.length}` : `${first}–${last} of ${cards.length}`;
    }
    previous.addEventListener('click', () => scrollToCard(Math.round(slider.scrollLeft / cardStep()) - 1));
    next.addEventListener('click', () => scrollToCard(Math.round(slider.scrollLeft / cardStep()) + 1));
    let scrollTimer;
    slider.addEventListener('scroll', () => {
        // Debounce the live region so screen readers announce the settled range.
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateShowcase, 120);
    }, { passive: true });
    new ResizeObserver(updateShowcase).observe(slider);
    slider.addEventListener('keydown', event => {
        const current = Math.round(slider.scrollLeft / cardStep());
        const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
        if (!(event.key in targets)) return;
        event.preventDefault();
        scrollToCard(targets[event.key]);
    });
    // Native touch and trackpad scrolling are retained. Only mouse drag is custom.
    let drag = null;
    let suppressClick = false;
    slider.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        suppressClick = false;
        drag = { id: event.pointerId, x: event.clientX, left: slider.scrollLeft, moved: false };
    });
    slider.addEventListener('pointermove', event => {
        if (!drag || event.pointerId !== drag.id) return;
        const distance = event.clientX - drag.x;
        if (!drag.moved && Math.abs(distance) < 6) return;
        if (!drag.moved) {
            drag.moved = true;
            slider.classList.add('is-dragging');
            slider.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        slider.scrollLeft = drag.left - distance;
    });
    function finishDrag(event) {
        if (!drag || event.pointerId !== drag.id) return;
        const moved = drag.moved;
        drag = null;
        slider.classList.remove('is-dragging');
        if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
        if (moved) {
            suppressClick = true;
            scrollToCard(Math.round(slider.scrollLeft / cardStep()));
        }
    }
    slider.addEventListener('pointerup', finishDrag);
    slider.addEventListener('pointercancel', finishDrag);
    slider.addEventListener('lostpointercapture', finishDrag);
    slider.addEventListener('pointerleave', event => { if (drag && !drag.moved) drag = null; });
    slider.addEventListener('dragstart', event => event.preventDefault());
    slider.addEventListener('click', event => {
        if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
    }, true);
    updateShowcase();

    // Change only data-video-src in the HTML to use an MP4 or transparent WebM.
    const video = section.querySelector('.showcase-video');
    const media = section.querySelector('.showcase-media');
    const toggle = section.querySelector('.showcase-video-toggle');
    const source = video.dataset.videoSrc.trim();
    let inView = false;
    let userPaused = false;
    let failed = false;
    video.muted = true;
    video.autoplay = !reducedMotion.matches;

    function updateVideoButton() {
        toggle.textContent = video.paused ? 'Play video' : 'Pause video';
        toggle.setAttribute('aria-label', video.paused ? 'Play decorative video' : 'Pause decorative video');
    }
    function playVideo() {
        video.play().catch(() => {
            // Autoplay can be blocked by the browser. Keep the poster and offer Play.
            updateVideoButton();
        });
    }
    function syncVideo() {
        if (!source || failed) return;
        if (inView && !document.hidden && !reducedMotion.matches && !userPaused) playVideo();
        else video.pause();
    }
    video.addEventListener('playing', () => { media.classList.add('has-video'); updateVideoButton(); });
    video.addEventListener('pause', updateVideoButton);
    video.addEventListener('error', () => {
        failed = true;
        media.classList.remove('has-video');
        toggle.hidden = true;
    });
    toggle.addEventListener('click', () => {
        if (video.paused) { userPaused = false; playVideo(); }
        else { userPaused = true; video.pause(); }
    });
    reducedMotion.addEventListener('change', () => {
        video.autoplay = !reducedMotion.matches;
        syncVideo();
    });
    document.addEventListener('visibilitychange', syncVideo);
    if (source) {
        const observer = new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            if (inView && !video.getAttribute('src')) {
                video.src = source;
                toggle.hidden = false;
                updateVideoButton();
            }
            syncVideo();
        }, { threshold: .15 });
        observer.observe(media);
    }
})();
