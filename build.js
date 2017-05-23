const FS = require('fs-extra');
const IMAGE = require('jimp');
const PROMPT = require('PROMPT');
const DESTINATION_FOLDER = './build';
const SOURCE_FOLDER = './source';
const OPTIONAL_FOLDER = './optional';
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
    description: 'Please enter project description',
    customizable: 'Do you need make your app customizable?(y/n)'
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
            this.createIconOfExtension();
            this.clearBuildFolder();
            this.buildExtension();
        });
    }
    clearBuildFolder() {
        // delete all from destination folder
        FS.readdir(DESTINATION_FOLDER, (err, files) => {
            if (err) return;
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
    createIconOfExtension() {
        let iconText = questions[USER_DATA.name][0].toUpperCase(); //first symbol of project name
         new IMAGE(128, 128, 0x000000, (err, image) => {
             if (!err) {
                 IMAGE.loadFont(IMAGE.FONT_SANS_128_BLACK).then((font) => {
                     image
                         .print(font, 20, 0, iconText)
                         .write(`${DESTINATION_FOLDER}/icon.png`)
                         .write(`${DESTINATION_FOLDER}/icon_128.png`);
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
                        if (questions[USER_DATA.customizable] == 'y') {
                            FS.readFile(`${OPTIONAL_FOLDER}/isConfigurableSetting.json`, 'utf8', (err2, content) => {
                                if (!err2) {
                                    let completeData = JSON.stringify(Object.assign(JSON.parse(data), JSON.parse(content)));
                                    FS.writeFile(`${DESTINATION_FOLDER}/${fileName}`, completeData);
                                    // save options.html file
                                    FS.readFile(`${OPTIONAL_FOLDER}/options.html`, (optReadErr, options) => {
                                        FS.writeFile(`${DESTINATION_FOLDER}/options.html`, options);
                                    });
                                } else {
                                    console.log(err2);
                                }
                            });
                        } else {
                            FS.writeFile(`${DESTINATION_FOLDER}/${fileName}`, data);
                        }
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
        });
    }
    buildingFinish() {
        console.log('YOUR EXTENSION WAS BUILT');
    }
}

let builder = new ExtensionBuilder();