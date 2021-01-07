import { lego } from '@armathai/lego';
import { WindowEvent } from '../events/window';
import { getValueOfKey } from '../utils';

export class WindowObservant {
    public constructor() {
        //
        this._setResizeCallback();
        this._setVisibleChangeCallback();
    }

    private _setVisibleChangeCallback(): void {
        let hidden: string;
        let visibilityChange: string;
        if (typeof document.hidden !== 'undefined') {
            hidden = 'hidden';
            visibilityChange = 'visibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            hidden = 'msHidden';
            visibilityChange = 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            hidden = 'webkitHidden';
            visibilityChange = 'webkitvisibilitychange';
        }

        const getVisibility = (): boolean => {
            return !!!getValueOfKey(document, hidden as keyof typeof document);
        };
        document.addEventListener(visibilityChange, () => this._onVisibilityChange(getVisibility()), false);

        if (process.env.NODE_ENV === 'production') {
            window.addEventListener('focus', () => this._onVisibilityChange(true));
            window.addEventListener('blur', () => this._onVisibilityChange(false));
        }
    }

    private _setResizeCallback(): void {
        window.addEventListener('resize', () => this._onResize());
        window.addEventListener('orientationchange', () => this._onResize());
    }

    private _onResize(): void {
        lego.event.emit(WindowEvent.resize);
    }

    private _onVisibilityChange(visible: boolean): void {
        lego.event.emit(WindowEvent.visibilityChange, visible);
    }
}
