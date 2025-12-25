import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Login {

    constructor(prepareNewRoute) {
        this.prepareNewRoute = prepareNewRoute;
        this.rememberMe = null;
        this.processElement = document.getElementById('process');
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                valid: false
            }
        ];

        this.processElement.addEventListener('click', (e) => {
            this.processForm();
        })

        if (accessToken) {
            location.href = '/dashboard';
            return;
        }
        document.getElementById('password').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.processForm();
            }
        });

        document.getElementById(this.fields[0].id).addEventListener('input', (event) => {
            this.validateField(this.fields[0], event.target);
        })

    }

    async processForm() {
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            this.validateField(item, item.element);
            console.log(this.fields)
        })
        let valForm = this.validateForm();

        if (valForm) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            try {
                const rememberMe = false;
                localStorage.setItem('email', email);
                localStorage.setItem('pass', password);

                const result =  await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })
                if (result) {
                    if (result.error || !result.tokens.refreshToken || !result.tokens.accessToken
                        || !result.user.name || !result.user.id) {
                        document.getElementById('message').innerText = result.validation ? result.validation[0].message : result.message;
                        document.getElementById('field').classList.add('active-message');
                        document.getElementById('message').classList.add('active-message');

                        throw new Error(result.message);
                    }

                    Auth.setToken(result.tokens.accessToken, result.tokens.refreshToken);
                    console.log(result.tokens);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName,
                        userId: result.user.id,
                        email: email
                    })
                    await this.prepareNewRoute('/dashboard');
                }
            } catch (error) {
                console.log(error);
            }

        }
    }

    validateField(field, element) {
        const parentElement = element.parentElement.parentElement.parentElement
        parentElement.classList.remove('is-valid', 'is-invalid');

        if (element.dataset.validate !== 'login-password') {
            if (field.regex.test(element.value)) {
                parentElement.classList.add('is-valid');
                field.valid = true;
            } else {
                parentElement.classList.add('is-invalid');
                field.valid = false;
            }

        } else if (element.dataset.validate === 'login-password') {
            field.valid = true;
        }
    };

    validateForm() {
        return this.fields.every(item => item.valid);
    };
}


