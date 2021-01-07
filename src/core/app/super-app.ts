import { lego } from '@armathai/lego';
import { AppEvent } from '../../events/app';
import { AppModelEvent } from '../../events/model';
import { SuperAppEvent } from '../../events/super-app';
import { WindowEvent } from '../../events/window';
import { App } from './app';

export class SuperApp {
    private _app: App;

    public constructor() {
        lego.event.on(WindowEvent.resize, this._onWindowResize, this);
        lego.event.on(AppModelEvent.pausedUpdate, this._onAppPausedUpdate, this);
        lego.event.on(AppModelEvent.mutedUpdate, this._onAppMutedUpdate, this);
        lego.event.on(AppEvent.init, this._onAppInit, this);
    }

    public get app(): App {
        return this._app;
    }

    public init(): void {
        this._app = new App();
        this._app.init();
    }

    public screenSize(): ScreenSize {
        const { clientWidth, clientHeight } = document.body;

        return { width: clientWidth, height: clientHeight };
    }

    public resize(size: ScreenSize): void {
        const { width, height } = size;

        if (width === 0 || height === 0) {
            return;
        }

        this._app.onResize({ width, height });
    }

    public pause(): void {
        lego.event.emit(SuperAppEvent.pause);
    }

    public resume(): void {
        lego.event.emit(SuperAppEvent.resume);
    }

    public mute(): void {
        lego.event.emit(SuperAppEvent.mute);
    }

    public unmute(): void {
        lego.event.emit(SuperAppEvent.unmute);
    }

    private _pause(): void {
        this._app.pause();
    }

    private _resume(): void {
        this._app.resume();

        this.resize(this.screenSize());
    }

    private _mute(): void {
        this._app.mute();
    }

    private _unmute(): void {
        this._app.unmute();
    }

    private _onWindowResize(): void {
        this.resize(this.screenSize());
    }

    private _onAppPausedUpdate(paused: boolean): void {
        paused ? this._pause() : this._resume();
    }

    private _onAppMutedUpdate(muted: boolean): void {
        muted ? this._mute() : this._unmute();
    }

    private _onAppInit(): void {
        this.resize(this.screenSize());
    }
}
