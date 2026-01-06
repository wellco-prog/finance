import "./styles/styles.scss";
import {Router} from "./router.js";
import {initDatepickers} from "./datepicker";


class App {
    constructor() {
        this.router = new Router();
        initDatepickers();
    }

}

(new App())