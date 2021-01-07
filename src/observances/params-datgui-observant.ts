import { params } from '../params';
import { getValueOfKey, hasOwnProperty } from '../utils';

export class ParamsDatguiObservant {
    private _gui: dat.GUI;
    private _guiTarget: { [key: string]: number | string | boolean };
    private _visible = true;

    public constructor() {
        this._gui = new dat.GUI({ closeOnTop: true, hideable: false });
        this._initGuiTarget();
        this._addGuiControllers();
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'p') {
                this._toggleGui();
            }
        });
        if (sessionStorage['__paramsdatgui_visibility__'] !== 'true') {
            this._toggleGui();
        }
    }

    private _initGuiTarget(): void {
        this._guiTarget = Object.keys(params).reduce((obj: { [key: string]: number | string | boolean }, key) => {
            obj[key] = getValueOfKey(params, key as keyof typeof params).value;
            return obj;
        }, {});
        this._guiTarget['reload'] = this._reloadPage.bind(this);
    }

    private _addGuiControllers(): void {
        Object.keys(this._guiTarget).forEach((key) => {
            const guiController = this._gui.add(this._guiTarget, key);
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const param = getValueOfKey(params, key as keyof typeof params);
                const paramType = typeof param.value;
                switch (paramType) {
                    case 'number':
                        if (hasOwnProperty(param, 'range')) {
                            const range = param.range as number[];
                            guiController.min(range[0]).max(range[1]).step(1);
                        }
                        break;
                    case 'string':
                        if (hasOwnProperty(param, 'options')) {
                            const options = param.options;
                            guiController.options(options);
                        }
                        break;
                }
            }
        });
    }

    private _reloadPage(): void {
        const params = Object.keys(this._guiTarget)
            .filter((key) => {
                return typeof this._guiTarget[key] !== 'function';
            })
            .reduce((obj: { [key: string]: string }, key) => {
                obj[key] = this._guiTarget[key].toString();
                return obj;
            }, {});
        const urlSearchParams = new URLSearchParams(params).toString();
        window.location.search = urlSearchParams;
    }

    private _toggleGui(): void {
        this._visible ? this._gui.hide() : this._gui.show();
        this._visible = !this._visible;
        sessionStorage['__paramsdatgui_visibility__'] = this._visible;
    }
}
