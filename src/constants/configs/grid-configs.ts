import { ICellConfig } from '@armathai/pixi-grid';
import { lp } from '../../utils';
import { getGameGridLandscapeConfig, getGameGridPortraitConfig } from './grid/game-grid-configs';

export const getGameGridConfig = (): ICellConfig => {
    return lp(getGameGridLandscapeConfig, getGameGridPortraitConfig).call(null);
};
