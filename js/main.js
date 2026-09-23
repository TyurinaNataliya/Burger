const CART_KEY = 'cart';
const countEl = document.getElementById('cartCount');
const timerEl = document.getElementById('hitTimer');
const formEl = document.getElementById('leadForm');
const successEl = document.getElementById('leadSuccess');
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
function updateCartCount() {
    const total = loadCart().reduce((sum, item) => sum + item.qty, 0);
    if (!countEl) {
        return;
    }
    countEl.textContent = String(total);
    countEl.style.display = total > 0 ? 'inline-block' : 'none';
}
function pad(n) {
    return String(n).padStart(2, '0');
}
function tickTimer() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (timerEl) {
        timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
}
if (formEl && successEl) {
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        formEl.style.display = 'none';
        successEl.hidden = false;
    });
}
updateCartCount();
tickTimer();
setInterval(tickTimer, 1000);
export {};
