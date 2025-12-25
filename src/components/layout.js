import {Router} from "/src/router.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Layout {
    constructor() {
        this.profileAvatar = document.getElementById('avatar');
        this.profileLogoutWindow = document.getElementById('logout');
        this.profileFullNameElement = document.getElementById('profile-full-name');
        // this.balanceUpdate();
    }


}