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
    private _viewBounds: PIXI.Rectangle;
    private _viewScale: number;
    private _viewRatio: number;

    public constructor() {
        super({
            resolution: window.devicePixelRatio || 1,
            sharedTicker: true,
        });
    }

    public get viewBounds(): PIXI.Rectangle {
        return this._viewBounds;
    }

    public get viewScale(): number {
        return this._viewScale;
    }

    public get viewRatio(): number {
        return this._viewRatio;
    }

    public init(): void {
        this.view.classList.add('app');
        document.body.appendChild(this.view);

        this.stage = new Stage();

        console.warn(Device.osVersion);
        console.warn(Device.performance);
        console.warn(Device.rendererSizeCoefficient);
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

        lego.event.emit(AppEvent.resize, this.viewBounds, this.viewScale);
    }

    private _resizeRenderer(width: number, height: number): void {
        const [wC, hC] = Device.rendererSizeCoefficient;
        console.warn(wC, hC);
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
        this._viewScale = this._getViewScale();
        this._viewBounds = this._getViewBounds();
        this._viewRatio = this._getViewRatio();
    }

    private _getAppBounds(): PIXI.Rectangle {
        const { width, height } = lp(appconfig.size.landscape, appconfig.size.portrait);

        return new PIXI.Rectangle(0, 0, width, height);
    }

    private _getViewScale(): number {
        const { width: screenWidth, height: screenHeight } = this.renderer.screen;
        const { width: designWidth, height: designHeight } = this._getAppBounds();

        return Math.min(screenWidth / designWidth, screenHeight / designHeight);
    }

    private _getViewBounds(): PIXI.Rectangle {
        const { renderer, viewScale: scale } = this;
        const { x, y, width, height } = renderer.screen;

        return new PIXI.Rectangle(x, y, width / scale, height / scale);
    }

    private _getViewRatio(): number {
        const { width: screenWidth, height: screenHeight } = this.renderer.screen;

        return Math.min(screenWidth / screenHeight, screenHeight / screenWidth);
    }
}
