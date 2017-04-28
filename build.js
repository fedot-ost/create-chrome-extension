const FS = require('fs-extra');
const DESTINATION_FOLDER = './build';
const SOURCE_FOLDER = './source';
const MESSAGES = {
    DELETE_ERROR: 'Can not delete file'
};

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
//copy all files from source folder
FS.readdir(SOURCE_FOLDER, (err, files) => {
    files.forEach((fileName) => {
        FS.copy(
            `${SOURCE_FOLDER}/${fileName}`,
            `${DESTINATION_FOLDER}/${fileName}`
        );
    });
});