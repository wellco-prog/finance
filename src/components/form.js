import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    #passwordField = null;

    constructor(page) {
        this.page = page;
        this.rememberMe = null;
        this.processElement = null;
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
        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false
                },
                {
                    name: 'lastName',
                    id: 'last-name',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false
                },
                {
                    name: 'confirm-password',
                    id: 'confirm-password',
                    element: null,
                    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                    valid: false
                }
            )
        }


        if (accessToken) {
            location.href = '/dashboard';
            return;
        }
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.addEventListener('input', (event) => {
                this.validateField(item, event.target)
            })
        });
        //
        this.processElement = document.getElementById('process');
        this.processElement.onclick = () => {
            this.processForm();
        }

    }

    validateField(field, element) {
        const parentElement = element.parentElement.parentElement.parentElement
        parentElement.classList.remove('is-valid', 'is-invalid');
        if (element.dataset.validate === 'password') {
            this.#passwordField = element.value;
        }
        if (field.id === 'confirm-password' && element.value === this.#passwordField) {
            parentElement.classList.add('is-valid');
            field.valid = true;
        } else if (field.id === 'confirm-password' && element.value !== this.#passwordField) {
            parentElement.classList.add('is-invalid');
            field.valid = false;
        }
        if (element.dataset.validate !== 'login-password' && field.id !== 'confirm-password') {
            if (field.regex.test(element.value)) {
                parentElement.classList.add('is-valid');
                field.valid = true;
            } else {
                parentElement.classList.add('is-invalid');
                field.valid = false;
            }
            const isValid = this.validateForm();
            console.log(isValid);
        } else if (element.dataset.validate === 'login-password') {
            field.valid = true;
        }
    };

    validateForm() {
        return this.fields.every(item => item.valid);
    };

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value,
                        lastName: this.fields.find(item => item.name === 'lastName').element.value,
                        email: email,
                        password: password,
                        passwordRepeat: this.#passwordField
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }

            }

            try {
                const rememberMe = false;
                localStorage.setItem('email', email);
                localStorage.setItem('pass', password);

                const result = await CustomHttp.request('http://localhost:3000/api/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })
                if (result) {
                    if (result.error || !result.tokens.refreshToken || !result.tokens.accessToken
                        || !result.user.name || !result.user.id) {
                        document.getElementById('message').style.display = 'block';
                        throw new Error(result.message);
                    }

                    Auth.setToken(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName,
                        userId: result.user.id,
                        email: email
                    })
                    location.href = '/dashboard';
                }
            } catch (error) {
                 console.log(error);
            }


        } else {
            this.fields.forEach(item => {
                item.element = document.getElementById(item.id);
                this.validateField(item, item.element);
                console.log(this.fields)
            })
        }
    }
}

//     document.getElementById("name").addEventListener("input", (e) => {
//
//     if (document.getElementById("name").value.match(/[a-z0-9]/) && document.getElementById("name").value !== '') {
//     document.getElementById("name").parentElement.parentElement.parentElement.classList.remove('is-invalid');
//     document.getElementById("name").parentElement.parentElement.parentElement.classList.add('is-valid');
// } else {
//     document.getElementById("name").parentElement.parentElement.parentElement.classList.remove('is-valid');
//     document.getElementById("name").parentElement.parentElement.parentElement.classList.add('is-invalid');
//     field.valid = false;
// }
//
// })
// validateForm() {
//     const self = this;
//     document.querySelectorAll('[data-validate]').forEach(inputField => {
//         inputField.addEventListener('input', function () {
//             self.validateField(inputField);
//         });
//         inputField.addEventListener('blur', function () {
//             self.validateField(inputField);
//         });
//
//     });
//
// }

// validateField(inputField) {
//     const fieldElement = inputField.parentElement.parentElement.parentElement;
//     fieldElement.classList.remove('is-valid', 'is-invalid');
//     const validationType = inputField.dataset.validate;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const nameRegex = /^[А-Я][а-я]+\s*$/;
//     const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
//     let isValid = true;
//     let errorMessage = '';
//     if (this.page === "signup") {
//         switch (validationType) {
//             case 'name':
//                 if (inputField.value && !inputField.value.match(this.fields.name.regex1)) {
//                     isValid = false;
//                     errorMessage = 'Введите имя кириллицей';
//                 } else {
//                     this.fields.name.valid = true;
//                 }
//                 break;
//             case 'last-name':
//                 if (inputField.value && !inputField.value.match(nameRegex)) {
//                     isValid = false;
//                     errorMessage = 'Введите имя кириллицей';
//                 }
//                 break;
//             case 'email':
//                 if (inputField.value && !emailRegex.test(inputField.value)) {
//                     isValid = false;
//                     errorMessage = 'Введите корректный email';
//                 }
//                 break;
//             case 'password':
//                 if (inputField.value) {
//                     this.#passwordField = inputField.value;
//                     if (!passwordRegex.test(inputField.value)) {
//                         isValid = false;
//                         errorMessage = "Пароль должен быть на латинице и состоять из не менее 6 знаков и не более 16, должна быть по крайней мере одна цифра и один специальный знак"
//                     }
//                 }
//                 break;
//             case 'confirm-password':
//                 if (inputField.value && this.#passwordField !== inputField.value) {
//                     isValid = false;
//                 }
//                 break;
//         }
//     } else if (validationType === 'email' && field.value && !emailRegex.test(inputField.value)) {
//         isValid = false;
//         errorMessage = 'Введите корректный email';
//     }
//     if (validationType !== 'login-password') {
//         if (isValid && inputField.value.length >= 2) {
//             fieldElement.classList.add('is-valid');
//         } else if (!isValid && inputField.value) {
//             fieldElement.classList.add('is-invalid');
//         }
//     }
// }

