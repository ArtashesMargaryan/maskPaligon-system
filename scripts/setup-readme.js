const { writeFileSync } = require('fs');
const path = require('path');
const url = path.resolve('README.md');
const { name } = require('../package.json');

const result = `
<h1 align="center">${name}</h1>

# Instructions

## Install

\`\`\`sh
git clone https://github.com/armathai/${name}
cd ${name}
npm install
\`\`\`

## Usage

### to start a dev server

\`\`\`sh
npm start
\`\`\`

### to build single html file in dist folder

\`\`\`sh
npm run build
\`\`\`

## Preview

https://armathai.github.io/${name}
`;

writeFileSync(url, result, 'utf-8');
