import { lego } from '@armathai/lego';
import { AppEvent } from '../events/app';
import { AppModelEvent } from '../events/model';
import { CloseViewEvent, WinViewEvent } from '../events/view';
import { AppState } from '../models/app-model';
import { ResultState } from '../models/result-model';
import { store } from '../models/store';

export enum NativeEvents {
    ready = 'ready',
    win = 'win',
    lose = 'lose',
    retry = 'retry',
    close = 'close',
    finish = 'finish',
}

class DummyNativeInterface implements NativeInterface {
    public postMessage(msg: string): void {
        void msg;
    }
}

export class NativeInterfaceObservant {
    private _nativeInterface: NativeInterface;

    public constructor() {
        this._detectNativeInterface();

        lego.event
            .once(AppEvent.ready, this._emit.bind(this, NativeEvents.ready))
            .on(AppModelEvent.stateUpdate, this._onAppStateUpdate, this)
            .once(WinViewEvent.screenClick, this._emit.bind(this, NativeEvents.finish))
            .once(WinViewEvent.claimBtnClick, this._emit.bind(this, NativeEvents.finish))
            .once(WinViewEvent.idleTime, this._emit.bind(this, NativeEvents.finish))
            .once(CloseViewEvent.closeBtnClick, this._emit.bind(this, NativeEvents.close));
    }

    private _onAppStateUpdate(state: AppState): void {
        switch (state) {
            case AppState.result:
                this._onResult();
                break;
            case AppState.retry:
                this._onRetry();
                break;
        }
    }

    private _onResult(): void {
        switch (store.app.result.state) {
            case ResultState.success:
                this._emit(NativeEvents.win);
                break;
            case ResultState.fail:
                this._emit(NativeEvents.lose);
                break;
        }
    }

    private _onRetry(): void {
        this._emit(NativeEvents.retry);
    }

    private _emit(event: string): void {
        window.console.log(`[PostMessage] ${event}`);
        this._nativeInterface.postMessage(event);
    }

    private _detectNativeInterface(): void {
        this._nativeInterface =
            window.nativeInterface ||
            (window.webkit && window.webkit.messageHandlers.nativeInterface) ||
            new DummyNativeInterface();
    }
}
