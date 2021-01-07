import { CellScale, ICellConfig } from '@armathai/pixi-grid';

export const getGameGridLandscapeConfig = (): ICellConfig => {
    return {
        // debug: { color: 0x2fc900 },
        name: 'game',
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        scale: CellScale.none,
    };
};

export const getGameGridPortraitConfig = (): ICellConfig => {
    return {
        // debug: { color: 0x2fc900 },
        name: 'game',
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        scale: CellScale.none,
    };
};
