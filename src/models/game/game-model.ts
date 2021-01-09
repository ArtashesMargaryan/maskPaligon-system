import { ObservableModel } from '../observable-model';
import { HintModel } from './hint-model';

export class GameModel extends ObservableModel {
    private _hint: HintModel = null;

    public constructor() {
        super('GameModel');

        this.makeObservable();
    }

    public get hint(): HintModel {
        return this._hint;
    }

    public initializeHintModel(): void {
        this._hint = new HintModel();
        this._hint.initialize();
    }

    public destroyHintModel(): void {
        this._hint.destroy();
        this._hint = null;
    }
}
