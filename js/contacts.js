const CART_KEY = 'cart';
const CONTACTS = [
    {
        id: 'tverskaya',
        title: 'Бургерная на Тверской',
        address: 'Москва, ул. Тверская, 5, вход со двора',
        phone: '+7 900 787 13 13',
        schedule: 'Пн–Пт: 09:00–21:00 · Сб–Вс: 10:00–22:00',
        alwaysOpen: false,
        hours: [
            { open: 600, close: 1320 },
            { open: 540, close: 1260 },
            { open: 540, close: 1260 },
            { open: 540, close: 1260 },
            { open: 540, close: 1260 },
            { open: 540, close: 1260 },
            { open: 600, close: 1320 }
        ]
    },
    {
        id: 'leningradsky',
        title: 'Бургерная на Ленинградском',
        address: 'Москва, Ленинградский проспект, 15',
        phone: '+7 900 787 14 14',
        schedule: 'Ежедневно: 10:00–22:00',
        alwaysOpen: false,
        hours: [
            { open: 600, close: 1320 },
            { open: 600, close: 1320 },
            { open: 600, close: 1320 },
            { open: 600, close: 1320 },
            { open: 600, close: 1320 },
            { open: 600, close: 1320 },
            { open: 600, close: 1320 }
        ]
    },
    {
        id: 'arbat',
        title: 'Бургерная на Арбате',
        address: 'Москва, ул. Арбат, 12',
        phone: '+7 900 787 15 15',
        schedule: 'Ежедневно: 11:00–23:00',
        alwaysOpen: false,
        hours: [
            { open: 660, close: 1380 },
            { open: 660, close: 1380 },
            { open: 660, close: 1380 },
            { open: 660, close: 1380 },
            { open: 660, close: 1380 },
            { open: 660, close: 1380 },
            { open: 660, close: 1380 }
        ]
    },
    {
        id: 'maroseyka',
        title: 'Бургерная на Маросейке',
        address: 'Москва, ул. Маросейка, 7',
        phone: '+7 900 787 16 16',
        schedule: 'Ежедневно: 08:00–20:00',
        alwaysOpen: false,
        hours: [
            { open: 480, close: 1200 },
            { open: 480, close: 1200 },
            { open: 480, close: 1200 },
            { open: 480, close: 1200 },
            { open: 480, close: 1200 },
            { open: 480, close: 1200 },
            { open: 480, close: 1200 }
        ]
    },
    {
        id: 'kronstadt',
        title: 'Бургерная 24 часа',
        address: 'Москва, Кронштадтский бульвар, 25',
        phone: '+7 900 787 17 17',
        schedule: 'Круглосуточно, без выходных',
        alwaysOpen: true,
        hours: [
            { open: 0, close: 0 },
            { open: 0, close: 0 },
            { open: 0, close: 0 },
            { open: 0, close: 0 },
            { open: 0, close: 0 },
            { open: 0, close: 0 },
            { open: 0, close: 0 }
        ]
    }
];
const countEl = document.getElementById('cartCount');
const listEl = document.getElementById('contactList');
const openToggleEl = document.getElementById('openNowToggle');
const allDayToggleEl = document.getElementById('allDayToggle');
const hintEl = document.getElementById('filterHint');
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
function isOpenNow(contact) {
    if (contact.alwaysOpen) {
        return true;
    }
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const hours = contact.hours[now.getDay()];
    if (hours.open <= hours.close) {
        return cur >= hours.open && cur < hours.close;
    }
    return cur >= hours.open || cur < hours.close;
}
function statusBadge(contact) {
    if (contact.alwaysOpen) {
        return '<span class="status all-day">Круглосуточно</span>';
    }
    if (isOpenNow(contact)) {
        return '<span class="status open">Открыто сейчас</span>';
    }
    return '<span class="status closed">Закрыто сейчас</span>';
}
function renderContacts() {
    const openOnly = openToggleEl.checked;
    const allDayOnly = allDayToggleEl.checked;
    let visible;
    if (openOnly) {
        visible = CONTACTS.filter((c) => isOpenNow(c));
    }
    else if (allDayOnly) {
        visible = CONTACTS.filter((c) => c.alwaysOpen);
    }
    else {
        visible = CONTACTS;
    }
    if (openOnly) {
        hintEl.textContent = 'Показаны адреса, работающие прямо сейчас';
    }
    else if (allDayOnly) {
        hintEl.textContent = 'Показаны круглосуточные адреса';
    }
    else {
        hintEl.textContent = 'Показаны все адреса';
    }
    listEl.innerHTML = visible
        .map((contact) => `<div class="contact-card">
                    <div class="contact-info">
                        <h3>${contact.title}</h3>
                        <p class="contact-address">${contact.address}</p>
                        <p class="contact-schedule">${contact.schedule}</p>
                        <p class="contact-phone">${contact.phone}</p>
                    </div>
                    ${statusBadge(contact)}
                </div>`)
        .join('');
}
openToggleEl.addEventListener('change', () => {
    if (openToggleEl.checked) {
        allDayToggleEl.checked = false;
    }
    renderContacts();
});
allDayToggleEl.addEventListener('change', () => {
    if (allDayToggleEl.checked) {
        openToggleEl.checked = false;
    }
    renderContacts();
});
renderContacts();
updateCartCount();
export {};
