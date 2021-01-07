import { PixiGrid } from '@armathai/pixi-grid';

export abstract class ResultViewAbstract extends PixiGrid {
    public constructor() {
        super();
        this.parentGroup = superApp.app.stage.result;
    }
}
