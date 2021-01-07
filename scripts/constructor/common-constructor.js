const path = require('path');
const replace = require('replace');
const { execSync } = require('child_process');
const { copySync, writeFileSync, readFileSync, removeSync } = require('fs-extra');

module.exports = (constructorName) => {
    const REGEXPS = {
        specificImport: new RegExp(/(?<=constructor\/).*(?=\/src)/g),
    };

    const PATHS = {
        app: path.resolve('src/core/app/app.ts'),

        paramsTo: path.resolve('src/params.ts'),
        assetsTo: path.resolve('assets'),

        paramsFrom: path.resolve(`constructor/${constructorName}/src/params.json`),
        assetsFrom: path.resolve(`constructor/${constructorName}/assets`),
    };

    // 1 MainView replacement
    replace({
        regex: REGEXPS.specificImport,
        replacement: constructorName,
        paths: [PATHS.app],
        recursive: false,
        silent: true,
    });

    // 2 Params replacement
    writeFileSync(PATHS.paramsTo, `export const params = ${readFileSync(PATHS.paramsFrom)}`, 'utf-8');

    // 3 Assets replacement
    //  3.1 general images
    removeSync(`${PATHS.assetsTo}/images/constructor`);
    copySync(`${PATHS.assetsFrom}/images`, `${PATHS.assetsTo}/images/constructor`, { overwrite: true });

    //  3.2 localized images
    removeSync(`${PATHS.assetsTo}/images_localized`);
    copySync(`${PATHS.assetsFrom}/images_localized`, `${PATHS.assetsTo}/images_localized`, { overwrite: true });

    //  3.3 particles

    // 4 Prettier
    execSync(`npx prettier --write ${(PATHS.app, PATHS.paramsTo)}`);
};
