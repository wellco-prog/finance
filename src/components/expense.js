import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Expense {
    constructor(action, prepareRoute) {
        this.prepareRoute = prepareRoute;
        this.action = action;
        this.init();
    }

    async init() {
        switch (this.action) {
            case "create":
                await this.createCategoriesOnPage();
                // createElement;
                break;
            case "add":
                document.getElementById("btn-create").addEventListener("click", (e) => {
                    this.addCategory();
                    this.prepareRoute('/expense');
                })
                break;
            case "edit":
                document.getElementById("btn-create").addEventListener("click", (e) => {
                    this.editCategory();
                })
                break;
        }
    }

    async requestToServer(url, method, body) {
        try {
            const result = await CustomHttp.request(config.host + url, method = 'GET', body = null);
            if (result) {
                return result;
            }
        } catch (error) {
            return console.log(error);
        }
    }

    async createCategoriesOnPage() {
        const result = await this.requestToServer("/categories/expense");
        console.log(result);

    }

    async addCategory() {
        const newCategory = document.getElementById("new-category-expense").value;
        await this.requestToServer(
            "/categories/expense",
            "POST",
            {
                "title": newCategory,
            });
    }

    editCategory(category) {

    }

    addCategoriesToBase() {
    }

    deleteCategory(category) {

    }
}