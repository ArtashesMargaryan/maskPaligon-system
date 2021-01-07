const { exec } = require('child_process');
const { name } = require('../package.json');

exec(`git remote remove template`, () => {
    exec(`git remote add template https://github.com/armathai/playrix-mini-game-v2.git`, () => {});
});
exec(`git remote remove upstream`, () => {
    exec(`git remote add upstream https://github.com/armathai/${name}.git`, () => {});
});
