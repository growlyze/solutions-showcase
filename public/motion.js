// Scroll reveal in the growlyze.com manner: items fade up 24px as they come into view,
// one after another within a row. Re-runs whenever app.js redraws #app.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('gz-motion');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('gz-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function scan() {
    document.querySelectorAll('#app .section-title, #app .card, #app .category-header, #app .case-detail-header').forEach((el) => {
      if (el.dataset.gz) return;
      el.dataset.gz = '1';
      const i = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty('--gz-delay', Math.min(i, 6) * 80 + 'ms');
      io.observe(el);
    });
  }

  new MutationObserver(scan).observe(document.getElementById('app'), { childList: true });
  scan();
})();
