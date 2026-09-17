document.addEventListener('DOMContentLoaded', () => {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggleButtons = document.querySelectorAll('.cart-toggle, .icon-only');
  const cartClose = document.querySelector('.cart-close');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  function updateCartCount() {
    fetch('/cart.js')
      .then((response) => response.json())
      .then((cart) => {
        const countEls = document.querySelectorAll('[data-cart-count]');
        countEls.forEach((el) => {
          el.textContent = cart.item_count;
        });
      })
      .catch(() => {});
  }

  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add('is-open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('is-open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  cartToggleButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const form = event.target.closest('form');
      if (form) {
        event.preventDefault();
      }
      openCart();
    });
  });

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartDrawer) {
    cartDrawer.addEventListener('click', (event) => {
      if (event.target === cartDrawer) {
        closeCart();
      }
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });
  }

  document.querySelectorAll('.faq-q').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  document.querySelectorAll('.add-to-cart-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Add to cart failed');
        }

        updateCartCount();
        openCart();
      } catch (error) {
        console.error(error);
      }
    });
  });

  updateCartCount();
});
