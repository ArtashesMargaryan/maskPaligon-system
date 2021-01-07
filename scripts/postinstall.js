const { exec } = require('child_process');

// Generates README.md
exec('node ./scripts/setup-readme.js', () => {});

// Setup git remotes
exec('node ./scripts/setup-git.js', () => {});
