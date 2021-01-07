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
            bounds: superApp.app.viewBounds,
            cells: [
                {
                    name: 'game',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
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
                    align: CellAlign.leftTop,
                    offset: { x: superApp.app.viewRatio > 0.55 ? 20 : 60, y: 20 },
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
            bounds: superApp.app.viewBounds,
            cells: [
                {
                    name: 'game',
                    bounds: { x: 0, y: 0, width: 1, height: 1 },
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
                    align: CellAlign.leftTop,
                    offset: { x: 20, y: superApp.app.viewRatio > 0.55 ? 20 : 50 },
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
    protected curtainTweenRepeatDelay = 0.6;

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
