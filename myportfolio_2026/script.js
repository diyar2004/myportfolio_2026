document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navbar = document.getElementById('navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      navbar.classList.toggle('open');
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Contact form: submit via fetch so we can show inline success/error
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var submitBtn = document.getElementById('contactSubmit');
    var statusEl = document.getElementById('formStatus');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.className = 'form-status';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) { return res.json().catch(function () { return { success: false, message: 'Unexpected server response.' }; }); })
        .then(function (data) {
          statusEl.textContent = data.message || (data.success ? 'Message sent.' : 'Something went wrong.');
          statusEl.classList.add('visible', data.success ? 'success' : 'error');
          if (data.success) contactForm.reset();
        })
        .catch(function () {
          statusEl.textContent = 'Could not reach the server. Please email me directly at diyarpouryousef@gmail.com.';
          statusEl.classList.add('visible', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }

  if (reduceMotion) return;

  // Cursor-tracked glow in hero sections
  var glowZones = document.querySelectorAll('.hero, .page-hero');
  glowZones.forEach(function (zone) {
    zone.addEventListener('mousemove', function (e) {
      var r = zone.getBoundingClientRect();
      var mx = ((e.clientX - r.left) / r.width) * 100;
      var my = ((e.clientY - r.top) / r.height) * 100;
      zone.style.setProperty('--mx', mx + '%');
      zone.style.setProperty('--my', my + '%');
    });
  });

  // Card tilt on mouse move
  var cards = document.querySelectorAll('.case-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      var rx = ((y / r.height) - 0.5) * -6;
      var ry = ((x / r.width) - 0.5) * 6;
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
});
