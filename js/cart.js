const CART_KEY = 'cart';
const cartListEl = document.getElementById('cartList');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSummaryEl = document.getElementById('cartSummary');
const cartTotalEl = document.getElementById('cartTotal');
const cartSubtitleEl = document.getElementById('cartSubtitle');
const clearBtn = document.getElementById('clearCart');
const countEl = document.getElementById('cartCount');
function loadCart() {
    try {
        const raw = sessionStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch (err) {
        console.error('Ошибка чтения корзины', err);
        return [];
    }
}
function saveCart(cart) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const total = loadCart().reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = String(total);
    countEl.style.display = total > 0 ? 'inline-block' : 'none';
}
function changeQty(name, delta) {
    const cart = loadCart();
    const item = cart.find((i) => i.name === name);
    if (!item) {
        return;
    }
    item.qty += delta;
    const next = cart.filter((i) => i.qty > 0);
    saveCart(next);
    renderCart();
}
function removeItem(name) {
    saveCart(loadCart().filter((i) => i.name !== name));
    renderCart();
}
function clearCart() {
    saveCart([]);
    renderCart();
}
function renderCart() {
    const cart = loadCart();
    if (cart.length === 0) {
        cartEmptyEl.style.display = 'block';
        cartSummaryEl.style.display = 'none';
        cartSubtitleEl.style.display = 'none';
        updateCartCount();
        return;
    }
    cartEmptyEl.style.display = 'none';
    cartSummaryEl.style.display = 'block';
    cartSubtitleEl.style.display = 'block';
    cartListEl.innerHTML = cart
        .map((item) => `<div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">${item.price} ₽ / шт</p>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-name="${item.name}" aria-label="Уменьшить количество">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus" data-name="${item.name}" aria-label="Увеличить количество">+</button>
                    </div>
                    <p class="cart-item-subtotal">${item.price * item.qty} ₽</p>
                    <button class="remove-btn" data-name="${item.name}" aria-label="Удалить позицию">✕</button>
                </div>`)
        .join('');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = `${total} ₽`;
    updateCartCount();
}
cartListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    const name = btn ? btn.dataset.name : undefined;
    if (!btn || !name) {
        return;
    }
    if (btn.classList.contains('plus')) {
        changeQty(name, 1);
    }
    else if (btn.classList.contains('minus')) {
        changeQty(name, -1);
    }
    else if (btn.classList.contains('remove-btn')) {
        removeItem(name);
    }
});
clearBtn.addEventListener('click', clearCart);
renderCart();
export {};
