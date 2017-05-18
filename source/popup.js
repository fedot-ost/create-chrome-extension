class FW{
    static addBadge() {
        console.dir(this);
    }
    static getCurrentURL(callBack) {
        return this.backgroundQuery('url', callBack);
    }
    static getLocalStorage(callBack) {
        return this.backgroundQuery('localStorage', callBack);
    }
    static getCookie(callBack) {
        return this.backgroundQuery('cookie', callBack);
    }
    static backgroundQuery(type, callBack) {
        return new Promise(function(resolve) {
            chrome.runtime.sendMessage(
                type,
                (result) => {
                    resolve(result);
                }
            );
        }).then((result) => {
            callBack(result);
        });
    }
}

// example

let currentUrl;

FW.getCurrentURL(
    function (url) {
        currentUrl = url;
    }
);