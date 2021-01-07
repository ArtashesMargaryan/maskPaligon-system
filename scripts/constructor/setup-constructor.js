const { name: packageName } = require('../../package.json');
const commonConstructor = require('./common-constructor');
const constructorName = packageName.match(new RegExp(/(?<=playrix-).*(?=_)/)) || 'default';

switch (constructorName) {
    case 'ws':
        setupWS();
        break;
    case 'hs':
        setupHS();
        break;
    case 'ts':
        setupTS();
        break;
    case 'gs':
        setupGS();
        break;
    case 'fd':
        setupFD();
        break;
    default:
        setupDefault();
}

function setupDefault() {
    commonConstructor('default');
}

function setupWS() {
    commonConstructor('ws');
}

function setupHS() {
    commonConstructor('hs');
}

function setupGS() {
    commonConstructor('gs');
}

function setupTS() {
    commonConstructor('ts');
}

function setupFD() {
    commonConstructor('fd');
}
