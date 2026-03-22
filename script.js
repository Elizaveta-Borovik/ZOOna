document.addEventListener('DOMContentLoaded', function() {
    // МЕНЮ
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    let menuOverlay = document.getElementById('menuOverlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.id = 'menuOverlay';
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }
    
    window.closeMenu = function() {
        if (burgerMenu) burgerMenu.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        if (body) body.classList.remove('no-scroll');
    };
    
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
        
        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMenu);
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                closeMenu();
            }
        });
        
        const style = document.createElement('style');
        style.textContent = '.no-scroll { overflow: hidden !important; }';
        document.head.appendChild(style);
    }
    
    // СЛАЙДЕР
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (slides.length > 0 && dots.length > 0) {
        console.log('Слайдер найден:', slides.length, 'слайдов');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;
        
        function showSlide(index) {
            console.log('Показываем слайд:', index);
            
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = index;
            if (currentSlide >= totalSlides) currentSlide = 0;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            
            console.log('Текущий слайд:', currentSlide);
        }
        
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        function startAutoSlide() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
            console.log('Автопереключение запущено каждые 5 секунд');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                console.log('Клик на Next');
                clearInterval(slideInterval);
                nextSlide();
                startAutoSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                console.log('Клик на Prev');
                clearInterval(slideInterval);
                prevSlide();
                startAutoSlide();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                console.log('Клик на точку:', index);
                clearInterval(slideInterval);
                showSlide(index);
                startAutoSlide();
            });
        });
        
        const slider = document.querySelector('.simple-slider');
        if (slider) {
            slider.addEventListener('mouseenter', function() {
                console.log('Пауза слайдера');
                clearInterval(slideInterval);
            });
            
            slider.addEventListener('mouseleave', function() {
                console.log('Продолжение слайдера');
                startAutoSlide();
            });
        }
        
        showSlide(0);
        startAutoSlide();
    } else {
        console.log('Элементы слайдера не найдены');
    }
    
    // ВАЛИДАЦИЯ ТЕЛЕФОНА И ВХОД В ЛИЧНЫЙ КАБИНЕТ 
    const phoneInput = document.getElementById('phoneInput');
    const authButton = document.getElementById('authButton');
    
    const authForm = document.querySelector('.auth-form');
    const accountPage = document.getElementById('accountPage');
    const logoutButton = document.getElementById('logoutButton');
    
    if (phoneInput && authButton) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            let formatted = '';
            if (value.length > 0) {
                formatted = value.substring(0, 2);
            }
            if (value.length > 2) {
                formatted += ' ' + value.substring(2, 5);
            }
            if (value.length > 5) {
                formatted += '-' + value.substring(5, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.substring(7, 9);
            }
            
            phoneInput.value = formatted;
        });
        
        authButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            
            if (!phoneDigits) {
                alert('Введите номер телефона');
                return;
            }
            
            if (phoneDigits.length !== 9) {
                alert('Номер должен содержать 9 цифр');
                return;
            }
            
            const operatorCode = phoneDigits.substring(0, 2);
            const validCodes = ['29', '33', '44', '25'];
            
            if (!validCodes.includes(operatorCode)) {
                alert('Код оператора должен быть: 29, 33, 44 или 25');
                return;
            }
            
            const fullPhone = `+375 ${phoneDigits.substring(0, 2)} ${phoneDigits.substring(2, 5)}-${phoneDigits.substring(5, 7)}-${phoneDigits.substring(7, 9)}`;
            
            if (authForm && accountPage) {
                authForm.style.display = 'none';
                accountPage.style.display = 'block';
                
                const phoneElement = document.querySelector('.user-details h3');
                if (phoneElement) {
                    phoneElement.textContent = fullPhone;
                }
                
                console.log('Успешный вход в личный кабинет. Номер:', fullPhone);
            }
        });
        
        phoneInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                authButton.click();
            }
        });
    }
    
    // ВЫХОД ИЗ ЛИЧНОГО КАБИНЕТА
    if (logoutButton && authForm && accountPage) {
        logoutButton.addEventListener('click', function() {
            accountPage.style.display = 'none';
            authForm.style.display = 'block';
            
            if (phoneInput) {
                phoneInput.value = '';
            }
            
            console.log('Выполнен выход из личного кабинета');
        });
    }
    
    // ДАТА ДЛЯ ПЕЧАТИ
    var now = new Date();
    var printDate = now.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.body.setAttribute('data-print-date', printDate);
    
    console.log('Все скрипты загружены успешно');
    
    // ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ДОКУМЕНТА
    
    cart.init();
    
    initAddToCartButtons();
    
    initSearch();
    initMobileSearch();
    
    cart.updateCartCount();
    
    console.log('Все скрипты инициализированы');
});

// КОРЗИНА
const cart = {
    items: JSON.parse(localStorage.getItem('cart')) || [],
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    },
    
    add(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.save();
        this.showNotification('Товар добавлен в корзину');
    },
    
    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    },
    
    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (quantity < 1) {
                this.remove(id);
            } else {
                item.quantity = quantity;
                this.save();
            }
        }
    },
    
    clear() {
        this.items = [];
        this.save();
    },
    
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(element => {
            element.textContent = count;
        });
    },
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #DC935C;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    },
    
    render() {
        const emptyCart = document.querySelector('.cart__main');
        const fullCart = document.getElementById('fullCart');
        const cartItems = document.getElementById('cartItems');
        const totalPrice = document.getElementById('totalPrice');
        
        if (this.items.length === 0) {
            if (emptyCart) emptyCart.style.display = 'flex';
            if (fullCart) fullCart.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (fullCart) fullCart.style.display = 'block';
            
            if (cartItems) {
                cartItems.innerHTML = '';
                this.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                        </div>
                        <div class="item-price">${item.price.toFixed(2)} руб.</div>
                        <div class="item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Удалить</button>
                    `;
                    cartItems.appendChild(itemElement);
                });
            }
            
            if (totalPrice) {
                totalPrice.textContent = `${this.getTotal().toFixed(2)} руб.`;
            }
        }
        
        this.updateCartCount();
    },
    
    init() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const id = e.target.dataset.id;
                const isPlus = e.target.classList.contains('plus');
                const isMinus = e.target.classList.contains('minus');
                
                if (id) {
                    const item = this.items.find(item => item.id === id);
                    if (item) {
                        if (isPlus) {
                            this.updateQuantity(id, item.quantity + 1);
                        } else if (isMinus) {
                            this.updateQuantity(id, item.quantity - 1);
                        }
                        this.render();
                    }
                }
            }
            
            if (e.target.classList.contains('remove-btn')) {
                const id = e.target.dataset.id;
                if (id) {
                    this.remove(id);
                    this.render();
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('checkout-btn')) {
                if (this.items.length === 0) {
                    alert('Корзина пуста!');
                } else {
                    alert(`Заказ оформлен! Сумма: ${this.getTotal().toFixed(2)} руб.`);
                    this.clear();
                    this.render();
                }
            }
        });
        
        this.render();
    }
};

// КНОПКИ "ДОБАВИТЬ В КОРЗИНУ" 
function initAddToCartButtons() {
    document.addEventListener('click', function(e) {
        const addButton = e.target.closest('.add-to-cart');
        
        if (addButton) {
            e.preventDefault();
            
            const product = {
                id: addButton.dataset.id || Date.now().toString(),
                name: addButton.dataset.name || 'Товар',
                price: parseFloat(addButton.dataset.price) || 0,
                image: addButton.dataset.image || 'img/no-image.jpg'
            };
            
            cart.add(product);
            
            if (window.location.pathname.includes('cart.html')) {
                cart.render();
            }
        }
    });
}

//  ПОИСК ТОВАРОВ 
function initSearch() {
    const searchInputDesktop = document.getElementById('searchInputDesktop');
    const searchInputMain = document.getElementById('searchInputMain');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchResults = document.getElementById('searchResults');
    const searchForm = document.getElementById('searchForm');
    
    const products = [
        // Кошки - корма
        { id: 'acana-cat-food', name: 'ACANA Wild Prairie Cat 4,5 кг', price: 194.85, category: 'Кошки', image: 'img/cat-food__acana.jpg' },
        { id: 'royalcanin-kitten', name: 'Royal Canin Kitten 4,0 кг', price: 85.18, category: 'Кошки', image: 'img/cat-food__royalcanin.jpg' },
        { id: 'perfectfit-cat-food', name: 'Perfect Fit 0,65 кг', price: 53.13, category: 'Кошки', image: 'img/cat-food__perfectfit.jpg' },
        { id: 'ambrosia-kitten', name: 'AMBROSIA для выращивания котят', price: 51.51, category: 'Кошки', image: 'img/cat-food__ambrosia.jpg' },
        { id: 'alphapet-superpremium', name: 'AlphaPet Wow Superpremium 0,75 кг', price: 45.01, category: 'Кошки', image: 'img/cat-food__alphapet.jpg' },
        { id: 'trendline-adult-cat', name: 'Trendline Adult Cat Chicken 1,0 кг', price: 67.76, category: 'Кошки', image: 'img/cat-food__trendline.jpg' },
        
        // Кошки - уход
        { id: 'cat-collar', name: 'Ошейник для кошек, регулируемый', price: 36.63, category: 'Кошки', image: 'img/cat-care__collar.jpg' },
        { id: 'cat-toilet', name: 'Туалет ZooExpress для кошек', price: 42.23, category: 'Кошки', image: 'img/cat-care__toilet.jpg' },
        { id: 'cat-scoop', name: 'Совок для кошачьего туалета с крупной сеткой', price: 12.67, category: 'Кошки', image: 'img/cat-care__savok.jpg' },
        
        // Собаки - корма
        { id: 'royalcanin-mini-adult', name: 'Royal Canin Mini Adult 2,0 кг', price: 50.23, category: 'Собаки', image: 'img/dog-food__royalcanin.jpg' },
        { id: 'vetlife-canin', name: 'FARMINA VET LIFE CANIN 2,0 кг', price: 153.18, category: 'Собаки', image: 'img/dog-food__vetlife.jpg' },
        { id: 'armando-dog-food', name: 'ARMANDO Говядина 1,0 кг', price: 28.52, category: 'Собаки', image: 'img/dog-food__armando.jpg' },
        { id: 'brit-dog-food', name: 'BRIT Care Mini Adult 3,0 кг', price: 126.20, category: 'Собаки', image: 'img/dog-food__brit.jpg' },
        { id: 'mamynat-dog-food', name: 'MamyNat Adult Sensitive Skin 1,0 кг', price: 32.79, category: 'Собаки', image: 'img/dog-food__mamynat.jpg' },
        { id: 'gentledog-dog-food', name: 'Gentle Dog Adult & Senior 1,0 кг', price: 66.00, category: 'Собаки', image: 'img/dog-food__gentledog.jpg' },
        
        // Собаки - уход
        { id: 'dog-bowls-mrkranch', name: 'Mr.Kranch Миски на подставке двойные', price: 52.96, category: 'Собаки', image: 'img/dog-care__bowls.jpg' },
        { id: 'dog-collar', name: 'Ошейник для собак', price: 22.90, category: 'Собаки', image: 'img/dog-care__collar.jpg' },
        { id: 'dog-comb', name: 'Щётка для собак, рукавичка', price: 13.50, category: 'Собаки', image: 'img/dog-care__comb.jpg' },
        
        // Птицы - корма
        { id: 'rio-budgies', name: 'RIO Корм для Волнистых попугайчиков 1,0 кг', price: 11.63, category: 'Птицы', image: 'img/bird-food__rio.jpg' },
        { id: 'prestige-budgies', name: 'Versele-Laga Prestige Budgies 1,0 кг', price: 41.94, category: 'Птицы', image: 'img/bird-food__prestigebudgies.jpg' },
        { id: 'prestige-loroparque', name: 'Versele-Laga Prestige Loroparque', price: 30.82, category: 'Птицы', image: 'img/bird-food__prestigeloroparque.jpg' },
        { id: 'grums-parrot', name: 'GRuMs корм для попугаев зерновой', price: 16.32, category: 'Птицы', image: 'img/bird-food__grums.jpg' },
        { id: 'grandmix-bird', name: 'GRANDMiX попугай, канарейка 1,0 кг', price: 14.00, category: 'Птицы', image: 'img/bird-food__grandmix.jpg' },
        { id: 'triol-bird-food', name: 'Triol корм для канареек 400 г', price: 14.00, category: 'Птицы', image: 'img/bird-food__triol.jpg' },
        
        // Птицы - уход
        { id: 'zooflor-bird', name: 'ZOOfLOR песок для птиц 1,0 кг', price: 8.90, category: 'Птицы', image: 'img/bird-care__zooflor.jpg' },
        { id: 'walnut-treat', name: 'Лакомство для птиц грецкий орех 1,0 кг', price: 17.83, category: 'Птицы', image: 'img/bird-care__walnut.jpg' },
        { id: 'proxider-bird-care', name: 'PROXiDER прессованный наполнитель 1,0 кг', price: 8.00, category: 'Птицы', image: 'img/bird-care__proxider.jpg' },
        
        // Грызуны - корма
        { id: 'versele-laga-fibres', name: 'Корм для грызунов и кроликов Crispy Snack Fibres 0,65 кг', price: 21.63, category: 'Грызуны', image: 'img/rodent-food__verselelaga.jpg' },
        { id: 'mikemeals-rodent', name: 'mike+meals корм для грызунов', price: 32.56, category: 'Грызуны', image: 'img/rodent-food__mikemeals.jpg' },
        { id: 'bambini-rodent', name: 'BAMBINI зверёк 250 г', price: 11.00, category: 'Грызуны', image: 'img/rodent-food__bambini.jpg' },
        { id: 'gryzunok-food', name: 'Грызунок корм для грызунов зерновой', price: 13.90, category: 'Грызуны', image: 'img/rodent-food__gryzunok.jpg' },
        { id: 'happujungle-rodent', name: 'HAPPY JUNGLE грызун 300 г', price: 17.50, category: 'Грызуны', image: 'img/rodent-food__happujungle.jpg' },
        { id: 'littleone-rodent', name: 'LITTLE ONE корм для хомяков и мышей', price: 11.55, category: 'Грызуны', image: 'img/rodent-food__littleone.jpg' },
        
        // Грызуны - уход
        { id: 'veda-rodent-care', name: 'VEDA наполнитель для грызунов 1,0 кг', price: 9.90, category: 'Грызуны', image: 'img/rodent-care__veda.jpg' },
        { id: 'ilovemypet-rodent', name: 'I LOVE MY PET опилки для грызунов 2,5 л', price: 6.55, category: 'Грызуны', image: 'img/rodent-care__ilovemypet.jpg' },
        { id: 'kormiks-rodent', name: 'КОРМИКС наполнитель для грызунов 2,5 л', price: 7.00, category: 'Грызуны', image: 'img/rodent-care__kormiks.jpg' },
        
        // Рыбки - корма
        { id: 'gammarus-jar', name: 'Гаммарус основной корм для рыб 250мл, банка', price: 11.93, category: 'Рыбки', image: 'img/fish-food__gammarusjar.jpg' },
        { id: 'tablet-fish-food', name: 'Tetra TABLET MINI таблетки для рыб 100 мл', price: 20.04, category: 'Рыбки', image: 'img/fish-food__tablet.jpg' },
        { id: 'gammarus-bag', name: 'Гаммарус основной корм для рыб 250 мл, пакет', price: 9.25, category: 'Рыбки', image: 'img/fish-food__gammarusbag.jpg' },
        { id: 'cocktail-fish-food', name: 'COCKTAIL мотыль 100 мл', price: 13.50, category: 'Рыбки', image: 'img/fish-food__cocktail.jpg' },
        { id: 'littlefish-food', name: 'LITTLE FISH корм для рыб 250 мл', price: 13.50, category: 'Рыбки', image: 'img/fish-food__littlefish.jpg' },
        { id: 'anubias-plant', name: 'Анубиас живое растение в горшочке', price: 15.72, category: 'Рыбки', image: 'img/fish-food__anubias.jpg' },
        
        // Рыбки - уход
        { id: 'aquaelfun-filter', name: 'AQUAEL FUN фильтр для аквариумов', price: 19.90, category: 'Рыбки', image: 'img/fish-care__aquaelfun.jpg' },
        { id: 'priming-fish-care', name: 'PRIMING грунт для аквариумов 3,0 кг', price: 8.90, category: 'Рыбки', image: 'img/fish-care__priming.jpg' },
        { id: 'feeder-fish-care', name: 'Кормушка для рыбок', price: 4.50, category: 'Рыбки', image: 'img/fish-care__feeder.jpg' },
        
        // Ветаптека
        { id: 'hollykalm-anti-emetic', name: 'Холликалм 24 мг противорвотное средство для собак', price: 56.79, category: 'Ветаптека', image: 'img/pharmacy__hollykalm.jpg' },
        { id: 'citoderm-antifungal', name: 'Цитодерм спрей противогрибковый+', price: 20.40, category: 'Ветаптека', image: 'img/pharmacy__citoderm.jpg' },
        { id: 'vazopril-pharmacy', name: 'ВАЗОПРИЛ 0,125 мг/мл раствор для инъекций', price: 48.62, category: 'Ветаптека', image: 'img/pharmacy__vazopril.jpg' },
        { id: 'gepatolux-pharmacy', name: 'ГЕПАТОЛЮКС гепатопротектор для кошек и собак', price: 31.55, category: 'Ветаптека', image: 'img/pharmacy__gepatolux.jpg' },
        { id: 'kvantum-pharmacy', name: 'КВАНТУМ гель для суставов', price: 51.90, category: 'Ветаптека', image: 'img/pharmacy__kvantum.jpg' },
        { id: 'fleksoprofen-pharmacy', name: 'ФЛЕКСОПРОФЕН суспензия для собак 2,0%', price: 44.89, category: 'Ветаптека', image: 'img/pharmacy__fleksoprofen.jpg' },
        
        // Акции
        { id: 'whiskas-promo', name: 'Whiskas Вкусные подушечки с говядиной', price: 12.50, category: 'Акции', image: 'img/whiskas.jpg' },
        { id: 'gourmet-promo', name: 'Gourmet Гастрономическое наслаждение', price: 15.75, category: 'Акции', image: 'img/gourmet.jpg' }
    ];
    
    if (searchInputDesktop) {
        searchInputDesktop.addEventListener('click', function() {
            openSearchOverlay();
            if (searchInputMain && this.value) {
                searchInputMain.value = this.value;
            }
        });
    }
    
    function openSearchOverlay() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (searchInputMain) {
            setTimeout(() => {
                searchInputMain.focus();
            }, 100);
        }
    }
    
    function closeSearch() {
        searchOverlay.classList.remove('active');
        if (searchResults) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
        }
        if (searchInputMain) searchInputMain.value = '';
        if (searchInputDesktop) searchInputDesktop.value = '';
        document.body.style.overflow = '';
    }
    
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', closeSearch);
    }
    
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });
    
    if (searchInputMain) {
        searchInputMain.addEventListener('input', function() {
            performSearch(this.value);
        });
        
        searchInputMain.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInputMain) {
                performSearch(searchInputMain.value);
            }
        });
    }
    
    window.performSearch = function(query) {
        query = query.trim().toLowerCase();
        
        if (!query || !searchResults) {
            if (searchResults) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
            }
            return;
        }
        
        const results = products.filter(product => {
            return product.name.toLowerCase().includes(query) ||
                   product.category.toLowerCase().includes(query);
        });
        
        displayResults(results, query);
    };
    
    function displayResults(results, query) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>По запросу "${query}" ничего не найдено</p>
                    <p style="margin-top: 10px; font-size: 14px; color: #999;">
                        Попробуйте ввести другой запрос
                    </p>
                </div>
            `;
            searchResults.classList.add('active');
            return;
        }
        
        let html = '';
        
        const limitedResults = results.slice(0, 10);
        
        limitedResults.forEach(product => {
            html += `
                <a href="${getProductLink(product.category)}" class="search-result-item" data-id="${product.id}">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p>${product.price.toFixed(2)} руб.</p>
                        <small>${product.category}</small>
                    </div>
                </a>
            `;
        });
        
        if (results.length > 10) {
            html += `
                <div class="more-results">
                    <p>И ещё ${results.length - 10} товаров. Уточните запрос для более точного поиска.</p>
                </div>
            `;
        }
        
        searchResults.innerHTML = html;
        searchResults.classList.add('active');
        
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.id;
                
                closeSearch();
                
                const url = this.getAttribute('href');
                window.location.href = url;
            });
        });
    }
    
    function getProductLink(category) {
        const links = {
            'Кошки': 'cat.html',
            'Собаки': 'dog.html',
            'Птицы': 'bird.html',
            'Грызуны': 'rodent.html',
            'Рыбки': 'fish.html',
            'Ветаптека': 'pharmacy.html',
            'Акции': 'promotion.html'
        };
        
        return links[category] || 'index.html';
    }
}

// ПОИСК В МОБИЛЬНОМ МЕНЮ 
function initMobileSearch() {
    const mobileSearchInput = document.getElementById('searchInputMobile');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    
    if (mobileSearchInput && mobileSearchBtn) {

        mobileSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const query = mobileSearchInput.value.trim();
            
            if (query) {

                if (typeof closeMenu === 'function') {
                    closeMenu();
                }
                
                const searchOverlay = document.getElementById('searchOverlay');
                const searchInputMain = document.getElementById('searchInputMain');
                
                if (searchOverlay && searchInputMain) {
                    searchOverlay.classList.add('active');
                    searchInputMain.value = query;
                    setTimeout(() => {
                        searchInputMain.focus();
                        searchInputMain.select();
                    }, 100);
                    document.body.style.overflow = 'hidden';
                    
                    if (typeof performSearch === 'function') {
                        performSearch(query);
                    }
                }
            }
        });
        
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                mobileSearchBtn.click();
            }
        });
    }
}