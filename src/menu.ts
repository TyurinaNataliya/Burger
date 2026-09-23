interface MenuItem {
    name: string;
    desc: string;
    price: number;
    img?: string;
}

interface MenuCategory {
    id: string;
    title: string;
    slogan: string;
    items: MenuItem[];
}

const MENU: MenuCategory[] = [
    {
        id: 'burgers',
        title: 'Бургеры',
        slogan: 'Больше мяса, меньше слов. Собери свой идеальный бургер — или выбери фирменный',
        items: [
            { name: 'Чизбургер классический', desc: 'Говяжья котлета, сыр чеддер, свежие овощи, фирменный соус', price: 240, img: 'image/burger_1.jpg' },
            { name: 'Бургер «Сытный»', desc: 'Двойная котлета, бекон, сыр, карамелизированный лук', price: 290, img: 'image/burger_2.jpg' },
            { name: 'Дабл чизбургер', desc: 'Две говяжьи котлеты, двойной сыр, маринованные огурчики', price: 270, img: 'image/burger_3.jpg' },
            { name: 'Бургер «Острый»', desc: 'Острая котлета халапеньо, перец чили, сыр, соус барбекю', price: 280, img: 'image/burger_4.jpg' },
            { name: 'Бургер «Гурман»', desc: 'Мраморная говядина, трюфельный соус, руккола, пармезан', price: 350, img: 'image/burger_5.jpg' },
            { name: 'Вегги-бургер', desc: 'Котлета из нута и овощей, свежая зелень, чесночный соус', price: 210, img: 'image/burger_6.jpeg' }
        ]
    },
    {
        id: 'pizza',
        title: 'Пицца',
        slogan: 'Сыра ровно столько, чтобы тянулся, но не терял характер — попробуй нашу пиццу и убедись в этом сам.',
        items: [
            { name: 'Маргарита', desc: 'Томатный соус, моцарелла, свежий базилик', price: 450, img: 'image/pizza_1.jpg' },
            { name: 'Пепперони', desc: 'Пикантная пепперони, сыр, томатный соус', price: 520, img: 'image/pizza_2.jpg' },
            { name: 'Четыре сыра', desc: 'Моцарелла, дорблю, пармезан, чеддер', price: 550, img: 'image/pizza_3.jpg' },
            { name: 'Гавайская', desc: 'Курица, ананасы, сыр, томатный соус', price: 490, img: 'image/pizza_4.jpg' },
            { name: 'Мясная', desc: 'Бекон, ветчина, пепперони, охотничьи колбаски', price: 580, img: 'image/pizza_5.jpg' },
            { name: 'Овощная', desc: 'Болгарский перец, томаты, шампиньоны, моцарелла', price: 430, img: 'image/pizza_6.jpg' }
        ]
    },
    {
        id: 'snacks',
        title: 'Закуски',
        slogan: 'Маленькие порции — большой вкус. Дополни свой перекус, доведи его до совершенства',
        items: [
            { name: 'Картофель фри', desc: 'Хрустящий картофель с фирменным соусом', price: 120 },
            { name: 'Картофель по-деревенски', desc: 'Дольки в специях с чесночным соусом', price: 140 },
            { name: 'Луковые кольца', desc: 'В хрустящей панировке с соусом', price: 150 },
            { name: 'Наггетсы', desc: 'Куриные наггетсы с соусом барбекю', price: 180 },
            { name: 'Сырные палочки', desc: 'В панировке с тянущимся сыром внутри', price: 170 },
            { name: 'Крылышки барбекю', desc: 'Сочные куриные крылышки в соусе барбекю', price: 220 }
        ]
    }
];

const ITEMS_PER_PAGE = 6;
const PLACEHOLDER_IMG = 'image/burger.png';

const tabsEl = document.getElementById('menuTabs') as HTMLDivElement;
const listEl = document.getElementById('menuList') as HTMLDivElement;
const paginationEl = document.getElementById('pagination') as HTMLDivElement;
const sloganEl = document.getElementById('menuSlogan') as HTMLParagraphElement;

let currentCategory: string = MENU[0].id;
let currentPage: number = 1;

function getCategory(id: string): MenuCategory {
    return MENU.find((cat) => cat.id === id) as MenuCategory;
}

function renderTabs(): void {
    tabsEl.innerHTML = MENU
        .map((cat) =>
            `<button class="tab${cat.id === currentCategory ? ' active' : ''}" data-category="${cat.id}">${cat.title}</button>`
        )
        .join('');
}

function renderCards(): void {
    const category = getCategory(currentCategory);
    const pageItems = category.items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    listEl.innerHTML = pageItems
        .map((item) =>
            `<div class="card">
                <img src="${item.img ?? PLACEHOLDER_IMG}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="desc">${item.desc}</p>
                <div class="card-bottom">
                    <p class="price">${item.price} ₽</p>
                    <a href="#">заказать</a>
                </div>
            </div>`
        )
        .join('');
}

function renderPagination(): void {
    const category = getCategory(currentCategory);
    const pages = Math.ceil(category.items.length / ITEMS_PER_PAGE);
    paginationEl.innerHTML = '';

    if (pages <= 1) {
        return;
    }

    const makeBtn = (n: number, label: string, isNav: boolean): string =>
        `<button class="page-btn${n === currentPage && !isNav ? ' active' : ''}${isNav ? ' nav' : ''}" data-page="${n}" ${n < 1 || n > pages ? 'disabled' : ''}>${label}</button>`;

    const pageButtons = Array.from({ length: pages }, (_, i) => makeBtn(i + 1, String(i + 1), false)).join('');

    paginationEl.innerHTML =
        makeBtn(currentPage - 1, '‹', true) +
        pageButtons +
        makeBtn(currentPage + 1, '›', true);
}

function render(): void {
    renderTabs();
    renderCards();
    renderPagination();
    sloganEl.textContent = getCategory(currentCategory).slogan;
}

tabsEl.addEventListener('click', (e: MouseEvent) => {
    const tab = (e.target as HTMLElement).closest('.tab') as HTMLElement | null;
    if (!tab) {
        return;
    }
    currentCategory = tab.dataset.category as string;
    currentPage = 1;
    render();
});

paginationEl.addEventListener('click', (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('.page-btn') as HTMLButtonElement | null;
    if (!btn || btn.disabled || !btn.dataset.page) {
        return;
    }
    const page = Number(btn.dataset.page);
    if (page < 1 || page > Math.ceil(getCategory(currentCategory).items.length / ITEMS_PER_PAGE)) {
        return;
    }
    currentPage = page;
    render();
});

render();