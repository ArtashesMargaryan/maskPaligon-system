import { CellAlign, CellScale, ICellConfig } from '@armathai/pixi-grid';
import { lp } from '../../../src/utils';
import { MainViewAbstract } from '../../base/main-view-abstract';
import { CloseBtnView } from './close-btn-view';
import { LoseView } from './lose-view';
import { WinView } from './win-view';

const getGridConfig = (): ICellConfig => {
    return lp(
        {
            name: 'main',
            bounds: superApp.app.appBounds,
            cells: [
                {
                    name: 'game',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.none,
                },
                {
                    name: 'result',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                },
                {
                    name: 'vignette',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.fill,
                },
                {
                    name: 'close_btn',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    align: CellAlign.rightTop,
                    offset: { x: superApp.app.appRatio > 0.55 ? -20 : -60, y: 30 },
                },
                {
                    name: 'blocker',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.fill,
                },
            ],
        },
        {
            name: 'main',
            bounds: superApp.app.appBounds,
            cells: [
                {
                    name: 'game',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.none,
                },
                {
                    name: 'result',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                },
                {
                    name: 'vignette',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.fill,
                },
                {
                    name: 'close_btn',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    align: CellAlign.rightTop,
                    offset: { x: -30, y: superApp.app.appRatio > 0.55 ? 20 : 50 },
                },
                {
                    name: 'blocker',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
                    scale: CellScale.fill,
                },
            ],
        },
    );
};

export class MainView extends MainViewAbstract {
    public constructor() {
        super();
        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getGridConfig();
    }

    protected getCloseBtnView(): CloseBtnView {
        return new CloseBtnView();
    }

    protected getWinView(): WinView {
        return new WinView();
    }

    protected getLoseView(): LoseView {
        return new LoseView();
    }
}
