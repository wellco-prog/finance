import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Expense {
    constructor(action, prepareRoute) {
        this.prepareRoute = prepareRoute;
        this.action = action;
        this.createCategoriesOnPage();
        this.init();
    }

    async init() {
        switch (this.action) {
            case "create":
                document.getElementById('btn-expense-create').addEventListener('click', (e) => {
                    const categoryInput = document.getElementById('new-category-expense');
                    console.log(categoryInput.value);
                    if (categoryInput.value !== '') {
                        this.requestToServer(
                            '/categories/expense',
                            'POST',
                            {"title": categoryInput.value});
                        this.prepareRoute('/expense');
                    }

                })
                break;
            case "edit":
                const oldCategory = document.getElementById('edit-expense-category').value;
                console.log(oldCategory);
                document.getElementById("btn-expense-edit-save").addEventListener("click", (e) => {
                    this.editCategory(oldCategory);
                    this.prepareRoute('/expense');
                })
                break;
            case " ":
                document.getElementById("btn-create").addEventListener("click", (e) => {
                    this.editCategory();
                })
                break;
        }
    }

    async createCategoriesOnPage() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/expense')
            if (result) {
                const categoriesElement = document.getElementById('categories');
                result.forEach(item => {
                    const categoryElement = document.createElement("div");
                    categoryElement.className = 'category';
                    const categoryContainerElement = document.createElement("div");
                    categoryContainerElement.className = 'category-container';
                    const categoryBtnControlElement = document.createElement("div");
                    categoryBtnControlElement.className = 'button-control';
                    const categoryTitleElement = document.createElement("h2");
                    categoryTitleElement.innerText = item.title;
                    const categoryAEditElement = document.createElement("a");
                    categoryAEditElement.href = 'javascript:void(0)';
                    const categoryADelElement = document.createElement("a");
                    categoryADelElement.href = 'javascript:void(0)';
                    const categoryBtnEditElement = document.createElement("button");
                    categoryBtnEditElement.className = 'btn-edit';
                    categoryBtnEditElement.id = 'btn-expense-edit';
                    categoryBtnEditElement.innerText = 'Редактировать';
                    const categoryBtnDelElement = document.createElement("button");
                    categoryBtnDelElement.className = 'btn-delete';
                    categoryBtnDelElement.id = 'btn-expense-delete';
                    categoryBtnDelElement.innerText = 'Удалить';
                    categoryAEditElement.appendChild(categoryBtnEditElement);
                    categoryADelElement.appendChild(categoryBtnDelElement);
                    categoryBtnControlElement.appendChild(categoryAEditElement);
                    categoryBtnControlElement.appendChild(categoryADelElement);
                    categoryContainerElement.appendChild(categoryTitleElement);
                    categoryContainerElement.appendChild(categoryBtnControlElement);
                    categoryElement.appendChild(categoryContainerElement);
                    categoriesElement.appendChild(categoryElement);
                })
                const categoryElement = document.createElement("div");
                categoryElement.className = 'category';
                const categoryDivElement = document.createElement("div");
                const categoryAAddElement = document.createElement("a");
                categoryDivElement.className = 'categoryAAdd';
                categoryAAddElement.href = '/expense/create';

                // const categorySvgElement = this.createPlusIcon();
                // categoryDivElement.appendChild(categorySvgElement);
                categoryAAddElement.appendChild(categoryDivElement);
                categoryElement.appendChild(categoryAAddElement);
                categoriesElement.appendChild(categoryElement);
                // document.getElementById('balance').innerText = result.balance + '$';
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

    async addCategory() {
        const newCategory = document.getElementById("new-category-expense").value;
        await this.requestToServer(
            '/categories/expense',
            'POST',
            {
                "title": newCategory,
            });
    }

    async editCategory(oldValue) {
    }

        addCategoriesToBase()
        {
        }

        deleteCategory()
        {

        }
    }