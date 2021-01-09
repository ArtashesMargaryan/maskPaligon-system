import { delayRunnable } from '../../utils';
import { ObservableModel } from '../observable-model';
import { ResultModel } from './result-model';

export enum AppState {
    unknown = 'unknown',
    game = 'game',
    result = 'result',
    retry = 'retry',
}

export class AppModel extends ObservableModel {
    private _result: ResultModel = new ResultModel();
    private _state: AppState = AppState.unknown;
    private _paused = false;
    private _muted = false;
    private _retries = 0;

    public constructor() {
        super('AppModel');
        this.makeObservable();
    }

    public get state(): AppState {
        return this._state;
    }

    public set state(value: AppState) {
        this._state = value;
    }

    public get result(): ResultModel {
        return this._result;
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

    public get retries(): number {
        return this._retries;
    }

    public set retries(value: number) {
        this._retries = value;
    }

    public startCompletionTimer(delay: number): void {
        delayRunnable(delay, () => {
            this._state = AppState.result;
        });
    }
}
