import { lego } from '@armathai/lego';
import { MainView } from '../../../constructor/default/src/main-view';
import { AppEvent } from '../../events/app';
import { fitDimension, lp } from '../../utils';
import { AssetsLoader } from '../assets-loader';
import { Device } from '../device/device';
import { Stage } from './stage';

export class App extends PIXI.Application {
    public stage: Stage;
    private _assetsLoader: AssetsLoader;
    private _appBounds: PIXI.Rectangle;
    private _appScale: number;
    private _appRatio: number;
    private _gameScale: number;

    public constructor() {
        super({
            resolution: window.devicePixelRatio || 1,
            sharedTicker: true,
        });
    }

    public get appBounds(): PIXI.Rectangle {
        return this._appBounds;
    }

    public get appScale(): number {
        return this._appScale;
    }

    public get appRatio(): number {
        return this._appRatio;
    }

    public get gameScale(): number {
        return this._gameScale;
    }

    public init(): void {
        this.view.classList.add('app');
        document.body.appendChild(this.view);

        this.stage = new Stage();

        this._calculateTransform();
        this._loadAssets();

        lego.event.emit(AppEvent.init);
    }

    public ready(): void {
        this.stage.addChild(new MainView());
        this.view.classList.add('fadeIn');

        lego.event.emit(AppEvent.ready);
    }

    public pause(): void {
        PIXI.Ticker.shared.stop();
        PIXI.tween.ticker.sleep();

        lego.event.emit(AppEvent.pause);
    }

    public resume(): void {
        PIXI.Ticker.shared.start();
        PIXI.tween.ticker.wake();

        lego.event.emit(AppEvent.resume);
    }

    public mute(): void {
        lego.event.emit(AppEvent.mute);
    }

    public unmute(): void {
        lego.event.emit(AppEvent.unmute);
    }

    public onResize(size: ScreenSize): void {
        const { min, max } = appconfig.size.ratio;
        const { width, height } = fitDimension(size, min, max);

        this._resizeCanvas(width, height);
        this._resizeRenderer(width, height);
        this._calculateTransform();

        lego.event.emit(AppEvent.resize, this.appBounds, this.appScale);
    }

    private _resizeRenderer(width: number, height: number): void {
        const [wC, hC] = Device.rendererSizeCoefficient;
        this.renderer.resize(width * wC, height * hC);
    }

    private _resizeCanvas(width: number, height: number): void {
        const { style } = this.renderer.view;

        style.width = `${width}px`;
        style.height = `${height}px`;
    }

    private async _loadAssets(): Promise<void> {
        try {
            this._assetsLoader = new AssetsLoader();
            await this._assetsLoader.load();
            this.ready();
        } catch (e) {
            throw e;
        }
    }

    private _calculateTransform(): void {
        this._appScale = this._getAppScale();
        this._appBounds = this._getAppBounds();
        this._appRatio = this._getAppRatio();
        this._gameScale = this._getGameScale();
    }

    private _getDesignBounds(): PIXI.Rectangle {
        const { width, height } = lp(appconfig.size.design.landscape, appconfig.size.design.portrait);

        return new PIXI.Rectangle(0, 0, width, height);
    }

    private _getGameBounds(): PIXI.Rectangle {
        const { width, height } = lp(appconfig.size.game.landscape, appconfig.size.game.portrait);

        return new PIXI.Rectangle(0, 0, width, height);
    }

    private _getAppScale(): number {
        const { width: screenWidth, height: screenHeight } = this.renderer.screen;
        const { width: designWidth, height: designHeight } = this._getDesignBounds();

        return Math.min(screenWidth / designWidth, screenHeight / designHeight);
    }

    private _getGameScale(): number {
        const { width: screenWidth, height: screenHeight } = this.renderer.screen;
        const { width: designWidth, height: designHeight } = this._getGameBounds();

        return Math.min(screenWidth / designWidth, screenHeight / designHeight) / this._appScale;
    }

    private _getAppBounds(): PIXI.Rectangle {
        const { renderer, appScale: scale } = this;
        const { x, y, width, height } = renderer.screen;

        return new PIXI.Rectangle(x, y, width / scale, height / scale);
    }

    private _getAppRatio(): number {
        const { width: screenWidth, height: screenHeight } = this.renderer.screen;

        return Math.min(screenWidth / screenHeight, screenHeight / screenWidth);
    }
}
