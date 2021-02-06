import { ObservableModel } from '../observable-model';

export enum ResultState {
    unknown = 'unknown',
    fail = 'fail',
    success = 'success',
}

export class ResultModel extends ObservableModel {
    private _state: ResultState = null;
    private _delay: number = null;

    public constructor() {
        super('ResultModel');
        this.makeObservable();
    }

    public get state(): ResultState {
        return this._state;
    }

    public set state(value: ResultState) {
        this._state = value;
    }

    public get delay(): number {
        return this._delay;
    }

    public set delay(value: number) {
        this._delay = value;
    }

    public initialize(): void {
        this._state = ResultState.unknown;
        this._delay = 0.2;
    }
}
