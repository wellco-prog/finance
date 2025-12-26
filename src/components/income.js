import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Income {
    constructor() {
        this.createCategoriesOnPage();

    }
   async createCategoriesOnPage() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income')
            if (result) {
                console.log(result);
                // document.getElementById('balance').innerText = result.balance + '$';
            }
        } catch (error) {
            return console.log(error);
        }
    }
    editCategory(category){}
    addCategory(category){}
    addCategoriesToBase() {}
    deleteCategory(category){}
}