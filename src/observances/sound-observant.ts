import { lego } from '@armathai/lego';
import { Sounds } from '../assets';
import { AppEvent } from '../events/app';
import { AppModelEvent } from '../events/model';
import { CloseViewEvent, LoseViewEvent, WinViewEvent } from '../events/view';
import { AppState } from '../models/app-model';
import { ResultState } from '../models/result-model';
import { store } from '../models/store';

export class SoundObservant {
    public constructor() {
        lego.event
            .on(AppEvent.pause, this._pauseAll, this)
            .on(AppEvent.resume, this._resumeAll, this)
            .on(AppEvent.mute, this._muteAll, this)
            .on(AppEvent.unmute, this._unmuteAll, this)

            .on(AppModelEvent.stateUpdate, this._onAppStateUpdate, this)
            .on(LoseViewEvent.retryBtnClick, this._playTap, this)
            .on(WinViewEvent.claimBtnClick, this._playTap, this)
            .on(CloseViewEvent.closeBtnClick, this._playTap, this);
    }

    private _onAppStateUpdate(state: AppState): void {
        switch (state) {
            case AppState.result:
                this._onAppResult();
                break;
            case AppState.game:
                this._onAppPlay();
                break;
        }
    }

    private _onAppPlay(): void {
        this._playTheme();
    }

    private _onAppResult(): void {
        const soundKey = store.app.result.state === ResultState.success ? Sounds['win'] : Sounds['lose'];
        PIXI.sound.fadeIn(soundKey, 0.2, { volume: 1 });
        PIXI.sound.stop(Sounds['theme']);
    }

    private _playTheme(): void {
        PIXI.sound.play(Sounds['theme'], { loop: true, volume: 0.8 });
    }

    private _playTap(): void {
        PIXI.sound.play(Sounds['tap']);
    }

    private _unmuteAll(): void {
        PIXI.sound.unmuteAll();
    }

    private _muteAll(): void {
        PIXI.sound.muteAll();
    }

    private _resumeAll(): void {
        PIXI.sound.resumeAll();
    }

    private _pauseAll(): void {
        PIXI.sound.pauseAll();
    }
}
