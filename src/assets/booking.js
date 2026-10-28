(() => {
  'use strict';
  const configId = 'ntVgcxIBkOV8pLWKAKFX';
  const getWidget = () => window.WiilWidget?.getInstance(configId) || window.WiilWidget?.init();

  // Scripts are deferred in order, so the host and SDK are ready before init.
  // The SDK reuses its existing instance if its automatic init also runs.
  getWidget();

  document.addEventListener('click', (event) => {
    const bookingLink = event.target instanceof Element
      ? event.target.closest('a[data-wiil-booking]')
      : null;
    if (!bookingLink || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    try {
      const widget = getWidget();
      if (typeof widget?.open !== 'function') return;
      widget.open();
      event.preventDefault();
      document.body.classList.remove('menu-open');
      const menu = document.querySelector('.menu-toggle');
      menu?.setAttribute('aria-expanded', 'false');
      menu?.setAttribute('aria-label', 'Open menu');
    } catch (error) {
      // Retain the original booking destination if the widget cannot open.
      console.warn('The academy assistant is unavailable; opening the booking page.', error);
    }
  });
})();
