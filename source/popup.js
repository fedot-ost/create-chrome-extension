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

// example of data, got from web-page

let currentUrl;
let cookie;
let LS;

FW.getCurrentURL((url) => {
    currentUrl = url;
    console.log('currentUrl ', currentUrl);
});

FW.getCookie((responsedCookie) => {
    cookie = responsedCookie;
    console.log('cookie ', cookie);
})

FW.getLocalStorage((localstorage) => {
    LS = localstorage;
    console.log('localstorage ',localstorage);
})