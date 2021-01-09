import { ObservableModel } from '../observable-model';

export class SuperAppModel extends ObservableModel {
    private _paused = false;
    private _muted = false;

    public constructor() {
        super('SuperAppModel');
        this.makeObservable();
    }

    public get paused(): boolean {
        return this._paused;
    }

    public set paused(value: boolean) {
        this._paused = value;
    }

    public get muted(): boolean {
        return this._muted;
    }

    public set muted(value: boolean) {
        this._muted = value;
    }
}
