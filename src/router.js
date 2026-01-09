import {Auth} from "./services/auth.js";
import {Login} from "./components/login.js";
import {Signup} from "./components/signup";
import {CustomHttp} from "./services/custom-http";
import config from "../config/config";
import {Income} from "./components/income";
import {Expense} from "./components/expense";
import {Operations} from "./components/operations";
import flatpickr from "flatpickr";
import {Russian} from "flatpickr/dist/l10n/ru";



export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.styles1Element = document.getElementById('styles1');
        this.styles2Element = document.getElementById('styles2');
        this.titleElement = document.getElementById('page-title');
        this.oldExpenseH2 = null;
        this.oldIncomeH2 = null;
        this.expenseH2Delete = null;
        this.incomeH2Delete = null;
        this.foundExpenseItem = '';
        this.foundIncomeItem = '';
        this.foundExpenseDelItem = '';
        this.foundIncomeDelItem = '';
        this.foundOperationDelItem = null;

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
                    new Expense();
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
                    document.getElementById('btn-filter-today').classList.add('active');
                    document.getElementById('nav-operations').classList.add('active');
                    new Operations('create_operations', this.prepareRoute.bind(this));
                }
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                template: '/templates/create/add_operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '/styles/ec_operations.css',
                styles2: '/styles/validate.css',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    new Operations('', this.prepareRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                template: '/templates/edit/edit_operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '/styles/ec_operations.css',
                styles2: '/styles/validate.css',
                load: () => {
                    this.categoryMenu();
                    this.toggleCategoryMenu();
                    new Operations("edit_operations", this.prepareRoute.bind(this));

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
                    new Expense("create", this.prepareRoute.bind(this));
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
                    new Income("create", this.prepareRoute.bind(this));
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

    async requestToServer(url, method, body) {
        try {
            const result = await CustomHttp.request(config.host + url, method, body);
            if (result) {
                return result;
            }
        } catch (error) {
            return console.log(error);
        }
    }

    async catchNewRoute(e) {
        if (e.target.id === 'nav-item' || e.target.id === 'arrow') {
            return;
        }
        let element = null;

        if (e.target.id === 'btn-expense-edit') {
            const buttonControl = e.target.closest('.button-control');
            this.oldExpenseH2 = buttonControl.previousElementSibling;
            element = null;
            await this.prepareRoute('/expense/edit');
            document.getElementById('edit-expense-category').value = this.oldExpenseH2.innerText;
            const result = await CustomHttp.request(config.host + '/categories/expense')
            this.foundExpenseItem = result.find(item => item.title === this.oldExpenseH2.innerText);
        }
        if (e.target.id === 'btn-income-edit') {
            const buttonControl = e.target.closest('.button-control');
            this.oldIncomeH2 = buttonControl.previousElementSibling;
            element = null;
            await this.prepareRoute('/income/edit');
            document.getElementById('edit-income-category').value = this.oldIncomeH2.innerText;
            const result = await CustomHttp.request(config.host + '/categories/income')
            this.foundIncomeItem = result.find(item => item.title === this.oldIncomeH2.innerText);
        }

        if (e.target.id === 'btn-expense-edit-save') {
            const newExpenseH2 = document.getElementById('edit-expense-category');
            if (newExpenseH2.value !== '') {
                await this.requestToServer(
                    '/categories/expense/' + this.foundExpenseItem.id,
                    'PUT',
                    {"title": newExpenseH2.value});
            }
            await this.prepareRoute('/expense');
        }
        if (e.target.id === 'btn-income-edit-save') {
            const newIncomeH2 = document.getElementById('edit-income-category');
            if (newIncomeH2.value !== '') {
                await this.requestToServer(
                    '/categories/income/' + this.foundIncomeItem.id,
                    'PUT',
                    {"title": newIncomeH2.value});
            }
            await this.prepareRoute('/income');
        }
        if (e.target.id === 'btn-expense-delete') {
            document.getElementById('popup-delete').style.display = 'flex';
            document.getElementById('popup-title').innerText = 'Вы действительно хотите удалить категорию?'
            const buttonControl = e.target.closest('.button-control');
            this.expenseH2Delete = buttonControl.previousElementSibling;
            element = null;
            const result = await CustomHttp.request(config.host + '/categories/expense')
            this.foundExpenseDelItem = result.find(item => item.title === this.expenseH2Delete.innerText);
        }
        if (e.target.id === 'btn-income-delete') {
            document.getElementById('popup-delete').style.display = 'flex';
            document.getElementById('popup-title').innerText =
                'Вы действительно хотите удалить категорию?\nСвязанные доходы останутся без категории?'
            const buttonControl = e.target.closest('.button-control');
            this.incomeH2Delete = buttonControl.previousElementSibling;
            element = null;
            const result = await CustomHttp.request(config.host + '/categories/income')
            this.foundIncomeDelItem = result.find(item => item.title === this.incomeH2Delete.innerText);
        }
        if (e.target.id === 'btn-delete') {
            console.log('/operations/' + this.foundOperationDelItem);
            if (window.location.pathname === '/expense') {
                await this.requestToServer(
                    '/categories/expense/' + this.foundExpenseDelItem.id,
                    'DELETE',
                    {});
                await this.prepareRoute('/expense');
            } else if (window.location.pathname === '/income') {
                await this.requestToServer(
                    '/categories/income/' + this.foundIncomeDelItem.id,
                    'DELETE',
                    {});
                await this.prepareRoute('/income');
            } else if (window.location.pathname === '/operations') {
                await this.requestToServer(
                    '/operations/' + this.foundOperationDelItem,
                    'DELETE',
                    {});
                await this.prepareRoute('/operations');
            }

        }
        if (e.target.id === 'btn-escape') {
            document.getElementById('popup-delete').style.display = 'none';
        }
        if (e.target.id === 'grid-a-operation-delete') {
            document.getElementById('popup-delete').style.display = 'flex';
            document.getElementById('popup-title').innerText =
                'Вы действительно хотите удалить операцию?';
            element = null;
            this.foundOperationDelItem = e.target.dataset.id;
        }
        if (e.target.id === 'grid-a-operation-edit') {
            this.CommentItemId = e.target.dataset.id;
            await this.prepareRoute('/operations/edit?id=' + this.CommentItemId);
            element = null;
        }
        if (e.target.id === 'btn-add-operations-income') {
            element = null;
            await this.prepareRoute('/operations/create?type=add_income');
        }
        if (e.target.id === 'btn-add-operations-expense') {
            element = null;
            await this.prepareRoute('/operations/create?type=add_expense');
        }
        if (e.target.id === 'btn-filter-today') {
            await this.prepareRoute('/operations?period=');
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-today').classList.add('active');
        }
        if (e.target.id === 'btn-filter-week') {
            await this.prepareRoute('/operations?period=week');
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-week').classList.add('active');
        }

        if (e.target.id === 'btn-filter-month') {
            await this.prepareRoute('/operations?period=month');
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-month').classList.add('active');
        }
        if (e.target.id === 'btn-filter-year') {
            await this.prepareRoute('/operations?period=year');
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-year').classList.add('active');
        }
        if (e.target.id === 'btn-filter-all') {
            await this.prepareRoute('/operations?period=all');
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-all').classList.add('active');
        }
        if (e.target.id === 'btn-filter-interval') {
            const date = new Date();
            const todayDay = String(date.getDate()).padStart(2, '0');
            const todayMonth = String(date.getMonth() + 1).padStart(2, '0');
            const todayYear = date.getFullYear();
            const today = `${todayDay}.${todayMonth}.${todayYear}`;
            document.getElementById('datepicker1').value = today;
            document.getElementById('datepicker2').value = today;
            let [fromDay, fromMonth, fromYear] = document.getElementById('datepicker1').value.split('.');
            let [toDay, toMonth, toYear] = document.getElementById('datepicker2').value.split('.');
            await this.prepareRoute(`/operations?period=interval&dateFrom=${fromYear}-${fromMonth}-${fromDay}&dateTo=${toYear}-${toMonth}-${toDay}`);
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-interval').classList.add('active');

            document.getElementById('check-date').style.display = "block";
            document.getElementById('datepicker1').value = today;
            document.getElementById('datepicker2').value = today;
            // document.getElementById('datepicker1-alt').focus();
        }
        if (e.target.id === 'btn-ok-interval') {
            let [fromDay, fromMonth, fromYear] = document.getElementById('datepicker1').value.split('.');
            let [toDay, toMonth, toYear] = document.getElementById('datepicker2').value.split('.');
            const datefrom = document.getElementById('datepicker1').value;
            const dateto = document.getElementById('datepicker2').value;
            await this.prepareRoute(`/operations?period=interval&dateFrom=${fromYear}-${fromMonth}-${fromDay}&dateTo=${toYear}-${toMonth}-${toDay}`);
            document.querySelectorAll('.btn-filter.active').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById('btn-filter-interval').classList.add('active');
            document.getElementById('check-date').style.display = "block";
            document.getElementById('datepicker1').value = datefrom;
            document.getElementById('datepicker2').value = dateto;
            // document.getElementById('datepicker1').focus();
        }
        if (e.target.id === 'date-input' || e.target.id === 'datepicker1' || e.target.id === 'datepicker2') {
            e.preventDefault();
            e.stopPropagation();
            const element = e.target;
            if (!element._flatpickr) {
                flatpickr(element, {
                    locale: Russian,
                    dateFormat: "d.m.Y",//"Y-m-d"
                    altInput: true,
                    altFormat: "d.m.Y",
                    allowInput: true,
                    // maxDate: new Date(),
                    placeholder: "Выберите дату",
                    static: false,
                    clickOpens: true,
                    // inline: false,
                    // disableMobile: true,
                    onReady: function (selectedDates, dateStr, instance) {
                        if (instance.altInput) {
                            instance.altInput.id = instance.input.id + "-alt";
                            instance.altInput.dataset.originalId = instance.input.id;
                        }
                    }
                });
            }
            try {
                element._flatpickr.open();
            } catch (error) {
                return console.log(error);
            }

        }
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
                await this.balanceUpdate();
            }
            contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            if (newRoute.styles1) {
                this.styles1Element.setAttribute('href', newRoute.styles1);
            }
            if (newRoute.styles2) {
                this.styles2Element.setAttribute('href', newRoute.styles2);
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