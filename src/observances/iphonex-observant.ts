import { lego } from '@armathai/lego';
import { AppEvent } from '../events/app';
import { lp } from '../utils';

const roundedBorders = 'border-radius';
const homeIndicator = 'home-indicator';
const homeIndicatorL = 'home-indicator-l';
const homeIndicatorP = 'home-indicator-p';
const notch = 'notch';
const notchTop = 'notch-top';
const notchLeft = 'notch-left';
const notchRight = 'notch-right';

const addStyle = (css: string): void => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
};

const addRoundedBordersClass = (): void => {
    const css = `
    .${roundedBorders} {
        border-radius: 44px;
    }
    `;
    addStyle(css);
};

const addHomeIndicatorClass = (): void => {
    const css = `
    .${homeIndicator} {
        position: absolute;
        left: 50%;
        bottom: 5px;
        height: 5px;
        background-color: #FFF;
        border-radius: 3px;
    }

    .${homeIndicatorL} {
        width: 180px;
        margin-left: -90px;
    }

    .${homeIndicatorP} {
        width: 140px;
        margin-left: -70px;
    }
    `;
    addStyle(css);
};

const addNotchClass = (): void => {
    const css = `
    .${notch} {
        position: absolute;
        background-color: #000000;
        z-index: 222;
        opacity: .9;
    }

    .${notchTop} {
        left: 50%;
        top: 0;
        width: 210px;
        height: 30px;
        margin-left: -105px;
        border-radius: 0 0 20px 20px;
    }

    .${notchLeft} {
        left: 0;
        top: 50%;
        height: 210px;
        width: 30px;
        margin-top: -105px;
        border-radius: 0 20px 20px 0;
    }
    
    .${notchRight} {
        right: 0;
        top: 50%;
        height: 210px;
        width: 30px;
        margin-top: -105px;
        border-radius: 20px 0 0 20px;
    }
    `;
    addStyle(css);
};

const isIphoneXScreenSize = (screen: PIXI.Rectangle): boolean => {
    const { width, height } = screen;
    return lp(
        () => width === 812 && height === 375,
        () => width === 375 && height === 812,
    )();
};

export class IphonexObservant {
    private _application: PIXI.Application;
    private _elements: HTMLElement[] = [];

    public constructor() {
        this._application = superApp.app;
        addRoundedBordersClass();
        addHomeIndicatorClass();
        addNotchClass();

        lego.event.on(AppEvent.resize, this._onAppResize, this);
    }

    private _onAppResize(): void {
        this._removeElements();
        this._removeClasses();
        if (this._isIphoneX) {
            this._addElements();
            this._addClasses();
        }
    }

    private get _isIphoneX(): boolean {
        return isIphoneXScreenSize(this._application.renderer.screen);
    }

    private _addClasses(): void {
        const { classList } = this._application.view;
        classList.add(roundedBorders);
    }

    private _removeClasses(): void {
        const { classList } = this._application.view;
        classList.remove(roundedBorders);
    }

    private _removeElements(): void {
        this._elements.forEach((el) => el.remove());
    }

    private _addElements(): void {
        this._addHomeIndicator();
        this._addNotch();
    }

    private _addHomeIndicator(): void {
        const homeIndicatorDiv = document.createElement('div');
        homeIndicatorDiv.classList.add(homeIndicator, lp(homeIndicatorL, homeIndicatorP));
        document.body.appendChild(homeIndicatorDiv);
        this._elements.push(homeIndicatorDiv);
    }

    private _addNotch(): void {
        lp(this._addNotchLeftRight, this._addNotchTop).call(this);
    }

    private _addNotchTop(): void {
        const notchDiv = document.createElement('div');
        notchDiv.classList.add(notch, notchTop);
        document.body.appendChild(notchDiv);
        this._elements.push(notchDiv);
    }

    private _addNotchLeftRight(): void {
        const notchDivLeft = document.createElement('div');
        const notchDivRight = document.createElement('div');
        notchDivLeft.classList.add(notch, notchLeft);
        notchDivRight.classList.add(notch, notchRight);
        document.body.appendChild(notchDivLeft);
        document.body.appendChild(notchDivRight);
        this._elements.push(notchDivLeft);
        this._elements.push(notchDivRight);
    }
}
