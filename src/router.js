import {Auth} from "./services/auth.js";
import {Login} from "./components/login.js";
import {Layout} from "./components/layout.js";
import {Signup} from "./components/signup";
import {CustomHttp} from "./services/custom-http";
import config from "../config/config";

// import {getEventListeners} from "http-proxy";


export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.styles1Element = document.getElementById('styles1');
        this.titleElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '/dashboard',
                title: 'Главная',
                template: '/templates/menu/main_dashboard.html',
                layout: '/templates/layout.html',
                styles: '/styles/dashboard.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    document.getElementById('nav-main').classList.add('active');
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: '/templates/auth/signup.html',
                layout: '',
                styles: '/styles/login.css',
                styles1: '/styles/validate.css',
                load: () => {
                    new Signup(this.prepareRoute.bind(this))
                }
            },
            {
                route: '/login',
                title: 'Вход в систему',
                template: '/templates/auth/login.html',
                layout: '',
                styles: '/styles/login.css',
                styles1: '/styles/validate.css',
                load: () => {
                    new Login(this.prepareRoute.bind(this))
                }
            },
            {
                route: '/income',
                title: 'Доход',
                template: '/templates/menu/income.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_outcome_income.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    new Income();
                }
            },
            {
                route: '/expense',
                title: 'Расход',
                template: '/templates/menu/expense.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_outcome_income.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                }
            },
            {
                route: '/operations',
                title: 'Операции',
                template: '/templates/menu/operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/operations.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    document.getElementById('nav-operations').classList.add('active');
                    const popupDelete = document.getElementById('popup-delete');
                    const btnDelOperation = document.getElementById('btn-del-operation');
                }
            },
            {
                route: '/operations/del',
                title: 'Удаление операции',
                template: '/templates/auth/login.html',
                layout: '',
                styles: '/styles/login.css',
                styles1: '/styles/validate.css',
                load: () => {
                    this.categoryMenu();
                }
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                template: '/templates/create/create_operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '/styles/ec_operations.css',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                }
            },
            {
                route: '/expense/create',
                title: 'Создание категории расхода',
                template: '/templates/create/create_expense.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                }
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                template: '/templates/create/create_income.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                template: '/templates/edit/edit_operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '/styles/ec_operations.css',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                }
            },
            {
                route: '/expense/edit',
                title: 'Редактирование категории расхода',
                template: '/templates/edit/edit_expense.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                }
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                template: '/templates/edit/edit_income.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');

                }
            }
        ];
        this.initRouter();
        this.ifNotLoginAccessDeny();
    }

    initRouter() {
        window.addEventListener('DOMContentLoaded', this.activeRoute.bind(this));
        window.addEventListener('popstate', this.activeRoute.bind(this));
        document.addEventListener('click', this.catchNewRoute.bind(this));
    }

    async catchNewRoute(e) {
        if (e.target.id === 'nav-item' || e.target.id === 'arrow') {
            return;
        }
        let element = null;
        console.log();
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();
            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '#' || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.prepareRoute(url)

        }
        if (document.getElementById('avatar')) {
            if (!document.getElementById('avatar').contains(e.target) &&
                !document.getElementById('logout').contains(e.target)) {
                document.getElementById('logout').style.display = 'none';
            }
        }

    }
    async balanceUpdate() {
        try {
            const result = await CustomHttp.request(config.host + '/balance')
            console.log(result);
            if (result) {
                document.getElementById('balance').innerText = result.balance + '$';
            }
        } catch (error) {
            return console.log(error);
        }

    }
    async prepareRoute(url) {
        history.pushState({}, '', url);
        await this.activeRoute();
        console.log(url);
    }

    async activeRoute() {
        const urlRoute = window.location.pathname;
        console.log(urlRoute);
        if (urlRoute === '/logout') {
            await Auth.logout();
            history.pushState({}, '', '/login');
            await this.activeRoute();
            return;
        }
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if (newRoute) {
            this.titleElement.innerHTML = newRoute.title;
            let contentBlock = this.contentElement;
            if (newRoute.layout) {
                this.contentElement.innerHTML = await fetch(newRoute.layout).then(response => response.text());
                contentBlock = document.getElementById('layoutContent');
                document.getElementById('nav-main').classList.remove('active');
                document.getElementById('nav-operations').classList.remove('active');
                document.getElementById('nav-category').classList.remove('active');
                document.getElementById('nav-income').classList.remove('active');
                document.getElementById('nav-expense').classList.remove('active');
                this.balanceUpdate();
            }
            contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            if (newRoute.styles1) {
                this.styles1Element.setAttribute('href', newRoute.styles1);
            }

        } else {
            history.pushState({}, '', '/login');
            await this.activeRoute();
        }
        newRoute.load();
        this.loginUserProfile();
    }

    async ifNotLoginAccessDeny() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            history.pushState({}, '', '/login');
            await this.activeRoute();
        }
    }

    loginUserProfile() {
        this.profileAvatar = document.getElementById('avatar');
        this.profileLogoutWindow = document.getElementById('logout');
        this.profileFullNameElement = document.getElementById('profile-full-name');
        if (this.profileAvatar !== null) {
            this.profileAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.profileLogoutWindow.style.display === 'none' ||
                    !this.profileLogoutWindow.style.display) {
                    this.profileLogoutWindow.style.display = 'block';
                } else {
                    this.profileLogoutWindow.style.display = 'none';
                }
            });
            this.profileLogoutWindow.addEventListener('click', (e) => {
                history.pushState({}, '', '/logout');
                this.activeRoute();
            })
            const userInfo = Auth.getUserInfo();
            const accessToken = localStorage.getItem(Auth.accessTokenKey);
            if (userInfo && accessToken) {
                this.profileAvatar.style.display = 'flex';
                this.profileFullNameElement.innerText = userInfo.fullName;
            } else {
                this.profileAvatar.style.display = 'none';
            }
        }
    }

    toggleCategoryMenu() {
        const navCategoryMenu = document.getElementById('nav-category-menu');
        const navItem = document.getElementById('nav-item');
        navCategoryMenu.classList.toggle('active');
        if (navCategoryMenu.classList.value === 'nav-category-menu active') {
            navItem.classList.remove('unfold');
        } else if (navCategoryMenu.classList.value === 'nav-category-menu'
            && navCategoryMenu.classList.value !== 'nav-category-menu active') {
            navItem.classList.add('unfold');
        }
        navItem.classList.add('active');
        document.getElementById('arrow').classList.toggle('active');
    }

    categoryMenu() {
        document.getElementById('nav-item').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCategoryMenu();
        });
    }
}