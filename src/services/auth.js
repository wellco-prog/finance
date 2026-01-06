import config from "../../config/config.js";

export class Auth {
    static accessTokenKey = 'accessToken'
    static refreshTokenKey = 'refreshToken'
    static userInfoKey = 'userInfo'

    static async proccessUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken && refreshToken !== 'undefined') {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.setToken(result.accessToken, result.refreshToken);
                    console.log(result.accessToken);
                    console.log(result.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        // location.href = '/login';
        return false;
    }

    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        console.log(refreshToken);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true;
                }
            }
        }

    }

    static setToken(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeTokens(accessToken, refreshToken) {
        localStorage.removeItem(this.accessTokenKey, accessToken);
        localStorage.removeItem(this.refreshTokenKey, refreshToken);
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}