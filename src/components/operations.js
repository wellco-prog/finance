import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Operations {
    constructor(action, prepareRoute) {
        this.prepareRoute = prepareRoute;
        this.action = action;
        this.categoryData = [];
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            this.id = urlParams.get("id");
            this.type = urlParams.get("type");
        }
        console.log(this.type);
        this.fields = [
            {
                name: 'category',
                id: 'create-category-input',
                element: null,
                // regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                valid: false
            },
            {
                name: 'amount',
                id: 'create-amount-input',
                element: null,
                regex: /^[0-9]+$/,
                // /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                valid: false
            },
            {
                name: 'date',
                id: 'create-date-input',
                element: null,
                // regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            },
            {
                name: 'comment',
                id: 'create-comment-input',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false
            }
        ];
        this.init();
    }

    async init() {
        const incomeCategories = await CustomHttp.request(config.host + '/categories/income');
        const expenseCategories = await CustomHttp.request(config.host + '/categories/expense');
        this.categoryData = {
            expense: expenseCategories,
            income: incomeCategories
        };


        switch (this.type || this.action) {
            case "add_expense":
                document.getElementById("create-type-input").disabled = true;
                document.getElementById('nav-category').classList.add('active');
                document.getElementById('nav-item').classList.add('active');
                document.getElementById('nav-expense').classList.add('active');
                document.getElementById("create-type-input").value = 'Расход';
                this.selectCategory('expense', 'create-category-input');
                document.getElementById('create-type-input').addEventListener('change', (e) => {
                    const type = e.target.value;
                    this.selectCategory(type,'create-category-input')
                });
                break;
            case "add_income":
                // document.getElementById('btn-operations-create').addEventListener('click', (e) => {
                //     const createTypeInput = document.getElementById("create-type-input");
                //     const createCategoryInput = document.getElementById("create-category-input");
                //     const createAmountInput = document.getElementById("create-amount-input");
                //     const createDateInput = document.getElementById("create-date-input");
                //     const createCommentInput = document.getElementById("create-comment-input");
                //
                //
                // })
                // document.getElementById("create-type-input").value = "income";
                document.getElementById("create-type-input").disabled = true;
                document.getElementById('nav-category').classList.add('active');
                document.getElementById('nav-item').classList.add('active');
                document.getElementById('nav-income').classList.add('active');
                document.getElementById("create-type-input").value = 'Доход';
                this.selectCategory('income', 'create-category-input');
                document.getElementById('create-type-input').addEventListener('change', (e) => {
                    const type = e.target.value;
                    this.selectCategory(type,'create-category-input')
                });

                // if (categoryInput.value !== '') {
                //     this.requestToServer('/operations', 'POST', {
                //         "type": createTypeInput,
                //         "amount": createAmountInput,
                //         "date": createDateInput,
                //         "comment": createCommentInput,
                //         "category_id": 11
                //     });
                //     this.prepareRoute('/operations');
                // }
                break;
            case "create_operations":
                await this.createOperationsOnPage();
                break;
            case "edit_operations":
                const result = await CustomHttp.request(config.host + '/operations?period=all')
                const foundCommentItem = result.find(item => item.id === Number(this.id));
                console.log('foundCommentItem', foundCommentItem);
                if (foundCommentItem.type === 'expense') {
                    document.getElementById("operations-type-edit-input").value = 'Расход';
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-expense').classList.add('active');
                    this.selectCategory('expense','operations-category-edit-input')
                    document.getElementById('operations-type-edit-input').addEventListener('change', (e) => {
                        const type = e.target.value;
                        this.selectCategory(type,'operations-category-edit-input')
                    });
                } else if (foundCommentItem.type === 'income') {
                    document.getElementById("operations-type-edit-input").value = 'Доход';
                    document.getElementById('nav-category').classList.add('active');
                    document.getElementById('nav-item').classList.add('active');
                    document.getElementById('nav-income').classList.add('active');
                    this.selectCategory('income','operations-category-edit-input')
                    document.getElementById('operations-type-edit-input').addEventListener('change', (e) => {
                        const type = e.target.value;
                        this.selectCategory(type,'operations-category-edit-input')
                    });
                }
                document.getElementById("operations-type-edit-input").disabled = true;
                document.getElementById("operations-category-edit-input").value = foundCommentItem.category;
                document.getElementById("operations-amount-input").value = new Intl.NumberFormat('ru-RU').format(foundCommentItem.amount) + '$';
                let [year, month, day] = foundCommentItem.date.split('-');
                document.getElementById("date-input").value = `${day}.${month}.${year}`;
                document.getElementById("operations-comment-input").value = foundCommentItem.comment;
                break;
        }
    }

    selectCategory(type,idElement) {
        const categorySelect = document.getElementById(idElement);
        if (type) {
            categorySelect.innerHTML = '<option value="">Выберите категорию</option>';

            this.categoryData[type].forEach(category => {
                const option = document.createElement('option');
                option.value = category.title;
                option.textContent = category.title;
                categorySelect.appendChild(option);
            });
        } else {
            categorySelect.disabled = true;
            categorySelect.innerHTML = '<option value="">Сначала выберите тип</option>';
        }
    }

    async createOperationsOnPage() {
        try {
            const operationTableElement = document.getElementById('grid-table');
            const operationHeaderIdElement = document.createElement("div");
            operationHeaderIdElement.className = 'grid-header';
            operationHeaderIdElement.innerText = '№ операции';
            const operationHeaderTypeElement = document.createElement("div");
            operationHeaderTypeElement.className = 'grid-header';
            operationHeaderTypeElement.innerText = 'Тип';
            const operationHeaderCategoryElement = document.createElement("div");
            operationHeaderCategoryElement.className = 'grid-header';
            operationHeaderCategoryElement.innerText = 'Категория';
            const operationHeaderSumElement = document.createElement("div");
            operationHeaderSumElement.className = 'grid-header';
            operationHeaderSumElement.innerText = 'Сумма';
            const operationHeaderDateElement = document.createElement("div");
            operationHeaderDateElement.className = 'grid-header';
            operationHeaderDateElement.innerText = 'Дата';
            const operationHeaderCommentElement = document.createElement("div");
            operationHeaderCommentElement.className = 'grid-header';
            operationHeaderCommentElement.innerText = 'Комментарий';
            operationTableElement.appendChild(operationHeaderIdElement);
            operationTableElement.appendChild(operationHeaderTypeElement);
            operationTableElement.appendChild(operationHeaderCategoryElement);
            operationTableElement.appendChild(operationHeaderSumElement);
            operationTableElement.appendChild(operationHeaderDateElement);
            operationTableElement.appendChild(operationHeaderCommentElement);

            const result = await CustomHttp.request(config.host + '/operations?period=all');
            if (result) {
                result.forEach(item => {
                    const rowElement = document.createElement("div");
                    rowElement.className = 'operation-row';
                    rowElement.dataset.id = item.id;
                    const operationIdElement = document.createElement("div");
                    operationIdElement.className = 'grid-cell';
                    operationIdElement.innerText = item.id;
                    const operationTypeElement = document.createElement("div");
                    if (item.type === 'expense') {
                        operationTypeElement.className = 'grid-cell red';
                        operationTypeElement.innerText = 'расход';
                    } else if (item.type === 'income') {
                        operationTypeElement.className = 'grid-cell green';
                        operationTypeElement.innerText = 'доход';
                    }
                    const operationCategoryElement = document.createElement("div");
                    operationCategoryElement.className = 'grid-cell';
                    operationCategoryElement.innerText = item.category.toLowerCase();
                    const operationSumElement = document.createElement("div");
                    operationSumElement.className = 'grid-cell';
                    let formatted = new Intl.NumberFormat('ru-RU').format(item.amount);
                    operationSumElement.innerText = formatted + '$';
                    const operationDateElement = document.createElement("div");
                    operationDateElement.className = 'grid-cell';
                    let [year, month, day] = item.date.split('-');
                    operationDateElement.innerText = `${day}.${month}.${year}`;

                    const operationCommentElement = document.createElement("div");
                    operationCommentElement.className = 'grid-cell';
                    const operationGridCellComment = document.createElement("div");
                    operationGridCellComment.className = 'grid-cell-comment';
                    operationGridCellComment.innerText = item.comment;
                    const operationGridCellSvg = document.createElement("div");
                    operationGridCellSvg.className = 'grid-cell-svg';
                    const operationGridADeleteElement = document.createElement("a");
                    const operationGridADelete = document.createElement("div");
                    operationGridADelete.className = 'grid-a-operation-delete';
                    operationGridADelete.id = 'grid-a-operation-delete';
                    operationGridADelete.dataset.id = item.id;
                    const operationGridAEditElement = document.createElement("a");
                    const operationGridAEdit = document.createElement("div");
                    operationGridAEdit.className = 'grid-a-operation-edit';
                    operationGridAEdit.id = 'grid-a-operation-edit';
                    operationGridAEdit.dataset.id = item.id;
                    operationGridADeleteElement.appendChild(operationGridADelete);
                    operationGridAEditElement.appendChild(operationGridAEdit);
                    operationGridCellSvg.appendChild(operationGridADeleteElement);
                    operationGridCellSvg.appendChild(operationGridAEditElement);
                    operationCommentElement.appendChild(operationGridCellComment);
                    operationCommentElement.appendChild(operationGridCellSvg);
                    rowElement.appendChild(operationIdElement);
                    rowElement.appendChild(operationTypeElement);
                    rowElement.appendChild(operationCategoryElement);
                    rowElement.appendChild(operationSumElement);
                    rowElement.appendChild(operationDateElement);
                    rowElement.appendChild(operationCommentElement);
                    operationTableElement.appendChild(rowElement);
                })
            }
        } catch (error) {
            return console.log(error);
        }
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


}