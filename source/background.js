class FW{
    static addBadgeText(text) {
        chrome.browserAction.setBadgeText({text: text});
    }
    static getBadgeText(callBack) {
        chrome.browserAction.getBadgeText({}, callBack);
    }
    static getCurrentURL() {
         return document.location.href;
    }
    static getLocalStorage() {
        return window.localStorage;
    }
    static getCookie() {
        return document.cookie;
    }
}
// listen popup queries
chrome.runtime.onMessage.addListener((type, sender, callBack) => {
    switch(type) {
        case 'url':
            callBack(FW.getCurrentURL());
            break;
        case 'localStorage':
            callBack(FW.getLocalStorage());
            break;
        case 'cookie':
            callBack(FW.getCookie());
            break;
        default:
            break;
    }
});

// example

FW.addBadgeText('123');

FW.getBadgeText((badgeText) => {
    console.log(badgeText);
});