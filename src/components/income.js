import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Income {
    constructor(action, prepareRoute) {
        this.action = action;
        this.prepareRoute = prepareRoute;
        this.createCategoriesOnPage();

        if (this.action === "create") {
            document.getElementById('btn-income-create').addEventListener('click', (e) => {
                const categoryInput = document.getElementById('income-create');
                console.log(categoryInput.value);
                if (categoryInput.value !== '') {
                    this.requestToServer(
                        '/categories/income',
                        'POST',
                        {"title": categoryInput.value});
                    this.prepareRoute('/income');
                }
            })
        }
    }

    async createCategoriesOnPage() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income')
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
                    categoryBtnEditElement.id = 'btn-income-edit';
                    categoryBtnEditElement.innerText = 'Редактировать';
                    const categoryBtnDelElement = document.createElement("button");
                    categoryBtnDelElement.className = 'btn-delete';
                    categoryBtnDelElement.id = 'btn-income-delete';
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
                categoryDivElement.className = 'categoryAAdd';
                const categoryAAddElement = document.createElement("a");
                categoryAAddElement.href = '/income/create';
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



    editCategory(category) {
    }

    addCategory(category) {

    }

    addCategoriesToBase() {

    }

    deleteCategory(category) {
    }
}