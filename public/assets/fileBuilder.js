const fs = require('fs');
const path = require('path');

function getFiles(dir, extensions, files_) {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files) {
        let name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, extensions, files_);
        } else {
            if (extensions.some(ext => name.endsWith(ext))) {
                files_.push(name);
            }
        }
    }
    return files_;
}

function combineFiles(files, outputFile) {
    let combinedContent = '';
    files.forEach(file => {
        combinedContent += fs.readFileSync(file, 'utf8') + '\n';
    });
    fs.writeFileSync(outputFile, combinedContent);
    console.log(`Combined file created: ${outputFile}`);
}

function buildFile(directoryPath, fileExtensions, exportLocation) {
    const filesToCombine = getFiles(directoryPath, fileExtensions);
    combineFiles(filesToCombine, exportLocation);
}

module.exports = { buildFile };
