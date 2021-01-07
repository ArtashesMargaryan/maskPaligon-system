export const createAuxiliaryObservancesCommand = (): void => {
    if (process.env.NODE_ENV !== 'production') {
        new (require('../../observances/stats-observant').StatsObservant)();
        new (require('../../observances/result-observant').ResultObservant)();
        new (require('../../observances/params-datgui-observant').ParamsDatguiObservant)();
        new (require('../../observances/iphonex-observant').IphonexObservant)();
    }
};
