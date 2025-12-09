import {Auth} from "./services/auth.js";
import {Form} from "./components/form.js";


export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.styles1Element = document.getElementById('styles1');
        this.titleElement = document.getElementById('page-title');

        this.routes = [{
            route: '/dashboard',
            title: 'Главная',
            template: '/templates/menu/main_dashboard.html',
            layout: '/templates/layout.html',
            styles: '/styles/dashboard.css',
            styles1: '',
            load: () => {
                this.ifNotLoginAccessDeny();
                document.getElementById('nav-main').classList.add('active');
                this.userProfile();
            }
        }, {
            route: '/signup',
            title: 'Регистрация',
            template: '/templates/auth/signup.html',
            layout: '',
            styles: '/styles/login.css',
            styles1: '/styles/validate.css',
            load: () => {
                new Form("signup")
            }
        }, {
            route: '/login',
            title: 'Вход в систему',
            template: '/templates/auth/login.html',
            layout: '',
            styles: '/styles/login.css',
            styles1: '/styles/validate.css',
            load: () => {
                new Form("login")
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
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    this.userProfile();
                }
            }, {
                route: '/expense',
                title: 'Расход',
                template: '/templates/menu/expense.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_outcome_income.css',
                styles1: '',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                    this.userProfile();
                }
            }, {
                route: '/operations',
                title: 'Операции',
                template: '/templates/menu/operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/operations.css',
                styles1: '',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-operations').classList.add('active');
                    const popupDelete = document.getElementById('popup-delete');
                    const btnDelOperation = document.getElementById('btn-del-operation');
                    this.userProfile();
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

                }
            },{
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                template: '/templates/create/create_operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '/styles/ec_operations.css',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    this.userProfile();
                }
            }, {
                route: '/expense/create',
                title: 'Создание категории расхода',
                template: '/templates/create/create_expense.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                    this.userProfile();
                }
            }, {
                route: '/income/create',
                title: 'Создание категории доходов',
                template: '/templates/create/create_income.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    this.userProfile();
                }
            }, {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                template: '/templates/edit/edit_operations.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '/styles/ec_operations.css',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    this.userProfile();
                }
            }, {
                route: '/expense/edit',
                title: 'Редактирование категории расхода',
                template: '/templates/edit/edit_expense.html',
                layout: '/templates/layout.html',
                styles: '/styles/common_create_edit.css',
                styles1: '',
                load: () => {
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                    this.userProfile();
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
                    this.ifNotLoginAccessDeny();
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    this.userProfile();
                }
            }];
    }

    async openRoute() {
        const urlRoute = window.location.pathname;
        console.log(urlRoute);
        if (urlRoute === '/logout') {
            await Auth.logout();
            window.location.href = '/login';
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
            }
            contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            if (newRoute.styles1) {
                this.styles1Element.setAttribute('href', newRoute.styles1);
            }

        } else {
            window.location = '/login';
        }


        newRoute.load();
    }

    ifNotLoginAccessDeny() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            window.location.href = '/login';
        }
    }

    userProfile() {
        this.profileAvatar = document.getElementById('avatar');
        this.profileLogoutWindow = document.getElementById('logout');
        this.profileFullNameElement = document.getElementById('profile-full-name');
        //
        // this.profileAvatar.addEventListener('click', (e) => {
        //     const isHidden = this.profileLogoutWindow.style.display === 'none' ||
        //         !this.profileLogoutWindow.style.display;
        //     this.profileLogoutWindow.style.display = isHidden ? 'block' : 'none';
        //     e.stopPropagation();
        // });
        this.profileAvatar.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы не сработал document.click сразу

            if (this.profileLogoutWindow.style.display === 'none' ||
                !this.profileLogoutWindow.style.display) {
                this.profileLogoutWindow.style.display = 'block';
            } else {
                this.profileLogoutWindow.style.display = 'none';
            }
        });
        document.addEventListener('click', (e) => {
            if (!this.profileAvatar.contains(e.target) &&
                !this.profileLogoutWindow.contains(e.target)) {
                this.profileLogoutWindow.style.display = 'none';
            }
        });

        this.profileLogoutWindow.addEventListener('click', (e) => {
            window.location = '/logout'
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