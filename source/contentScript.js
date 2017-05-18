class App{
    constructor() {
        this.waitRequests();
    }
    waitRequests() {
        chrome.runtime.onMessage(() => {
            console.log('message from bg');
        })
    }
}

let app = new App();