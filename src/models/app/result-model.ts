import { ObservableModel } from '../observable-model';

export enum ResultState {
    unknown = 'unknown',
    fail = 'fail',
    success = 'success',
}

export class ResultModel extends ObservableModel {
    private _state: ResultState = null;

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

    public initialize(): void {
        this._state = ResultState.unknown;
    }
}
