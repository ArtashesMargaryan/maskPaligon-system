import { ObservableModel } from '../observable-model';

export class HintModel extends ObservableModel {
    private _visible = false;

    public constructor() {
        super('HintModel');
        this.makeObservable();
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(value: boolean) {
        this._visible = value;
    }

    public initialize(): void {
        this._visible = true;
    }
}
