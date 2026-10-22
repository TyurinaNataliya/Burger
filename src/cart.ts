interface CartItem {
    name: string;
    price: number;
    img: string;
    qty: number;
}

interface OrderRequest {
    name: string;
    phone: string;
    address: string;
    comment: string;
    payment: string;
    items: CartItem[];
    total: number;
}

const CART_KEY = 'cart';

const cartListEl = document.getElementById('cartList') as HTMLDivElement;
const cartEmptyEl = document.getElementById('cartEmpty') as HTMLDivElement;
const cartSummaryEl = document.getElementById('cartSummary') as HTMLDivElement;
const cartTotalEl = document.getElementById('cartTotal') as HTMLSpanElement;
const cartSubtitleEl = document.getElementById('cartSubtitle') as HTMLParagraphElement;
const clearBtn = document.getElementById('clearCart') as HTMLButtonElement;
const countEl = document.getElementById('cartCount') as HTMLSpanElement;
const checkoutBtn = document.getElementById('checkoutBtn') as HTMLButtonElement;
const orderModalEl = document.getElementById('orderModal') as HTMLDivElement;
const orderModalBackdropEl = document.getElementById('orderModalBackdrop') as HTMLDivElement;
const orderModalCloseEl = document.getElementById('orderModalClose') as HTMLButtonElement;
const orderFormBlockEl = document.getElementById('orderFormBlock') as HTMLDivElement;
const orderFormEl = document.getElementById('orderForm') as HTMLFormElement;
const orderErrorEl = document.getElementById('orderError') as HTMLParagraphElement;
const orderTotalEl = document.getElementById('orderTotal') as HTMLSpanElement;
const orderSuccessEl = document.getElementById('orderSuccess') as HTMLDivElement;
const orderSuccessCloseEl = document.getElementById('orderSuccessClose') as HTMLButtonElement;

function loadCart(): CartItem[] {
    try {
        const raw = sessionStorage.getItem(CART_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch (err) {
        console.error('Ошибка чтения корзины', err);
        return [];
    }
}

function saveCart(cart: CartItem[]): void {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount(): void {
    const total = loadCart().reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = String(total);
    countEl.style.display = total > 0 ? 'inline-block' : 'none';
}

function changeQty(name: string, delta: number): void {
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

function removeItem(name: string): void {
    saveCart(loadCart().filter((i) => i.name !== name));
    renderCart();
}

function clearCart(): void {
    saveCart([]);
    renderCart();
}

function renderCart(): void {
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
        .map(
            (item) =>
                `<div class="cart-item">
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
                </div>`
        )
        .join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = `${total} ₽`;
    updateCartCount();
}

cartListEl.addEventListener('click', (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('button') as HTMLButtonElement | null;
    const name = btn ? btn.dataset.name : undefined;
    if (!btn || !name) {
        return;
    }
    if (btn.classList.contains('plus')) {
        changeQty(name, 1);
    } else if (btn.classList.contains('minus')) {
        changeQty(name, -1);
    } else if (btn.classList.contains('remove-btn')) {
        removeItem(name);
    }
});

clearBtn.addEventListener('click', clearCart);

function cartTotal(): number {
    return loadCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function openOrderModal(): void {
    orderTotalEl.textContent = `${cartTotal()} ₽`;
    orderErrorEl.style.display = 'none';
    orderFormBlockEl.style.display = 'block';
    orderSuccessEl.classList.remove('open');
    orderModalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeOrderModal(): void {
    orderModalEl.classList.remove('open');
    document.body.style.overflow = '';
}

function showOrderError(message: string): void {
    orderErrorEl.textContent = message;
    orderErrorEl.style.display = 'block';
}

function collectOrder(): OrderRequest {
    const data = new FormData(orderFormEl);
    return {
        name: String(data.get('name') ?? '').trim(),
        phone: String(data.get('phone') ?? '').trim(),
        address: String(data.get('address') ?? '').trim(),
        comment: String(data.get('comment') ?? '').trim(),
        payment: String(data.get('payment') ?? 'card'),
        items: loadCart(),
        total: cartTotal()
    };
}

function validateOrder(order: OrderRequest): string {
    if (!order.name) {
        return 'Укажите имя';
    }
    if (order.phone.replace(/\D/g, '').length < 10) {
        return 'Укажите корректный номер телефона';
    }
    if (!order.address) {
        return 'Укажите адрес доставки';
    }
    return '';
}

checkoutBtn.addEventListener('click', openOrderModal);
orderModalCloseEl.addEventListener('click', closeOrderModal);
orderModalBackdropEl.addEventListener('click', closeOrderModal);
orderSuccessCloseEl.addEventListener('click', closeOrderModal);

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && orderModalEl.classList.contains('open')) {
        closeOrderModal();
    }
});

orderFormEl.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const order = collectOrder();
    const error = validateOrder(order);
    if (error) {
        showOrderError(error);
        return;
    }

    orderErrorEl.style.display = 'none';
    console.log('Заказ сформирован (отправка отключена)', order);

    orderFormBlockEl.style.display = 'none';
    orderSuccessEl.classList.add('open');

    clearCart();
});

renderCart();


export {};
