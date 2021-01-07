import { lego } from '@armathai/lego';
import '../styles/index.scss';
import { bootstrapCommand } from './commands/core/bootstrap-command';
import { SuperApp } from './core/app/super-app';

(function () {
    if (process.env.NODE_ENV !== 'production') {
        const { legologger } = require('@armathai/lego-logger');
        const { legoLoggerConfig } = require('./constants/configs/lego-config');
        legologger.start(lego, legoLoggerConfig);
    }

    lego.command.execute(bootstrapCommand);

    window.superApp = new SuperApp();
    superApp.init();
})();
