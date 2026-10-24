'use strict';
(function () {
  const menu = document.querySelector('.mobile-nav-toggle');
  const nav = document.getElementById('retail-nav');
  if (menu && nav) {
    const closeMenu = () => {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      nav.classList.remove('is-open');
    };
    menu.addEventListener('click', () => {
      const isOpen = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', isOpen);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('retailer-enquiry-form');
  if (!form) return;
  const response = document.getElementById('form-response');
  const copyButton = document.getElementById('copy-enquiry');
  const emailLink = document.getElementById('open-email-draft');
  let enquiryText = '';

  function showResponse(message, isError = false) {
    response.hidden = false;
    response.textContent = message;
    response.classList.toggle('error', isError);
  }
  function validateForm() {
    form.querySelectorAll('[aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));
    const required = [...form.querySelectorAll('[required]')];
    for (const field of required) {
      if (field.type === 'checkbox' ? !field.checked : !field.value.trim()) {
        field.setAttribute('aria-invalid', 'true');
        field.focus();
        showResponse('Please fill in the required fields and agree to be contacted.', true);
        return false;
      }
    }
    const phone = form.elements.phone.value.replace(/[\s+()-]/g, '');
    if (!/^(?:91)?[6-9]\d{9}$/.test(phone)) {
      form.elements.phone.setAttribute('aria-invalid', 'true');
      form.elements.phone.focus();
      showResponse('Please enter a valid 10-digit Indian mobile number.', true);
      return false;
    }
    if (!/^[1-9]\d{5}$/.test(form.elements.pincode.value.trim())) {
      form.elements.pincode.setAttribute('aria-invalid', 'true');
      form.elements.pincode.focus();
      showResponse('Please enter a valid 6-digit Indian PIN code.', true);
      return false;
    }
    const email = form.elements.email;
    if (email.value.trim() && !email.checkValidity()) {
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      showResponse('Please check the email address.', true);
      return false;
    }
    const gstin = form.elements.gstin;
    if (gstin.value.trim() && !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/i.test(gstin.value.trim())) {
      gstin.setAttribute('aria-invalid', 'true');
      gstin.focus();
      showResponse('Please check your 15-character GSTIN, or leave it empty.', true);
      return false;
    }
    return true;
  }
  function makeEnquiry() {
    const data = new FormData(form);
    const lines = [
      'Hello KRUNKO team,',
      '',
      'I would like to enquire about buying Plain Makhana for my business.',
      '',
      'RETAILER DETAILS',
      `Full name: ${data.get('fullName') || ''}`,
      `Mobile / WhatsApp: ${data.get('phone') || ''}`,
      `Shop / business: ${data.get('businessName') || ''}`,
      `Business type: ${data.get('businessType') || ''}`,
      `City: ${data.get('city') || ''}`,
      `State: ${data.get('state') || ''}`,
      `PIN code: ${data.get('pincode') || ''}`,
      `Shop address / area: ${data.get('shopAddress') || 'Not provided'}`,
      `GSTIN: ${data.get('gstin') || 'Not provided'}`,
      `Business email: ${data.get('email') || 'Not provided'}`,
      '',
      // 'PLAIN MAKHANA ENQUIRY',
      `Product: ${data.get('product') || 'Plain Makhana'}`,
      `Estimated quantity (kg): ${data.get('monthlyVolume') || 'Just exploring'}`,
      `Buying timeline: ${data.get('buyingTimeline') || 'Not specified'}`,
      `Contact preference: ${data.get('contactMethod') || 'WhatsApp'}`,
      `Questions / message: ${data.get('message') || 'None'}`,
      '',
      'Consent to contact: Yes',
      'Source: KRUNKO retailer page'
    ];
    return lines.join('\n');
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm()) return;
    enquiryText = makeEnquiry();
    const recipient = 'info@thefarmproject.co.in'; // Replace with your verified business inbox before launch.
    const subject = 'KRUNKO Plain Makhana Enquiry - ' + form.elements.businessName.value.trim();
    const href = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(enquiryText);
    showResponse('Your enquiry details are ready! Review them, then use Open email draft to send them from your email app. You can also copy the details. Nothing has been sent yet.');
    copyButton.hidden = false;
    emailLink.href = href;
    emailLink.hidden = false;
    // A mailto URL opens an email draft; the visitor must send it from their mail app.
  });
  copyButton.addEventListener('click', async () => {
    if (!enquiryText) return;
    try {
      await navigator.clipboard.writeText(enquiryText);
      showResponse('Enquiry details copied. You can paste them into an email and send them to info@thefarmproject.co.in.');
    } catch (_) {
      showResponse('Your browser blocked copying. Please use the email draft or select and copy the form details manually.', true);
    }
  });
})();


/* Show real photos ONLY when each file exists and loads correctly.
   If a photo is missing, preserve the original illustrations. */
(function initRetailerPhotos() {
  document.querySelectorAll('img[data-real-photo]').forEach((img) => {
    const container = img.closest('[data-photo-container]');
    if (!container) return;
    const showRealPhoto = () => {
      if (!img.naturalWidth) return;
      container.classList.add('has-real-photo');
      img.removeAttribute('aria-hidden');
      // Hide accessible illustration when a real photo is on screen.
      const fallback = container.querySelector('.plain-bowl-art, .process-illustration');
      if (fallback) fallback.setAttribute('aria-hidden', 'true');
    };
    const keepIllustration = () => {
      container.classList.remove('has-real-photo');
      img.setAttribute('aria-hidden', 'true');
    };
    img.addEventListener('load', showRealPhoto);
    img.addEventListener('error', keepIllustration);
    if (img.complete) {
      if (img.naturalWidth > 0) showRealPhoto();
      else keepIllustration();
    }
  });
})();
