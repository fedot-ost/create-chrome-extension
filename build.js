const FS = require('fs-extra');
const PROMPT = require('PROMPT');
const DESTINATION_FOLDER = './build';
const SOURCE_FOLDER = './source';
const MESSAGES = {
    DELETE_ERROR: 'Can not delete file'
};
const CONFIGURABLE_FILES = {
    manifest: 'manifest.json',
    popup: 'popup.html'
};
const DEFAULT_DATA = {
    name: 'Create chrome extension',
    description: 'Simple creating of new chrome extension'
};
const USER_DATA = {
    name: 'Please enter project name',
    description: 'Please enter project description'
};
let questions = [];
for (let prop in USER_DATA) {
    questions.push(USER_DATA[prop]);
};
class ExtensionBuilder {
    constructor() {
        PROMPT.start();
        PROMPT.get(questions, (err, result) => {
            if (err) return;
            questions = result;
            this.clearBuildFolder();
            this.buildExtension();
        });
    }
    clearBuildFolder() {
        // delete all from destination folder
        FS.readdir(DESTINATION_FOLDER, (err, files) => {
            for (let i = 0; i < files.length; i++) {
                FS.unlink(`${DESTINATION_FOLDER}/${files[i]}`, (err) => {
                    if (err) {
                        console.log(`${MESSAGES.DELETE_ERROR}: ${files[i]}`);
                        return;
                    }
                });
            }
        });
    }
    buildExtension() {
        FS.readdir(SOURCE_FOLDER, (err, files) => {
            files.forEach((fileName) => {
                // if it manifest.json
                if (fileName == CONFIGURABLE_FILES.manifest) {
                    FS.readFile(`${SOURCE_FOLDER}/${fileName}`, 'utf8', (err, data) => {
                        if (err) return;
                        data = data.replace(DEFAULT_DATA.name, questions[USER_DATA.name]).replace(DEFAULT_DATA.description, questions[USER_DATA.description]);
                        FS.writeFile(`${DESTINATION_FOLDER}/${fileName}`, data);
                    });
                }
                else if (fileName == CONFIGURABLE_FILES.popup) {
                    FS.readFile(`${SOURCE_FOLDER}/${fileName}`, 'utf8', (err, data) => {
                        if (err) return;
                        data = data.replace(DEFAULT_DATA.name, questions[USER_DATA.name]).replace(DEFAULT_DATA.description, questions[USER_DATA.description]);
                        FS.writeFile(`${DESTINATION_FOLDER}/${fileName}`, data);
                    });
                } else {
                    FS.copy(
                        `${SOURCE_FOLDER}/${fileName}`,
                        `${DESTINATION_FOLDER}/${fileName}`
                    );
                }
            });
            console.log('YOUR EXTENSION WAS BUILT');
        });
    }
}

let builder = new ExtensionBuilder();