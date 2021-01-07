export abstract class AbstractButton extends PIXI.Container {
    protected states: ButtonStates;

    public constructor({ states, input }: ButtonConfig) {
        super();

        this._createStates(states);
        this._createHitArea(input);

        this.switchEnable(true);
    }

    public get enabled(): boolean {
        return this.interactive;
    }

    public switchInput(value: boolean): void {
        this.interactive = value;
    }

    public switchEnable(value: boolean): void {
        this.switchInput(value);

        this._setState('up');
        if (value === false) {
            this._setState('disable');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onDown(e: PIXI.InteractionEvent): void {
        this._setState('down');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onUp(e: PIXI.InteractionEvent): void {
        this._setState('up');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onUpOutside(e: PIXI.InteractionEvent): void {
        this._setState('up');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onTap(e: PIXI.InteractionEvent): void {
        //
    }

    private _createStates({ up, down, disable }: ButtonStatesConfig = {}): void {
        this.states = {
            up: up && this.createState(up),
            down: down && this.createState(down),
            disable: disable && this.createState(disable),
        };
    }

    private _createHitArea(input: ButtonInputConfig = {}): void {
        const { area } = input;

        this.hitArea = area || new PIXI.Rectangle().copyFrom(this.getLocalBounds());

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointerupoutside', this.onUpOutside, this);
        this.on('pointertap', this.onTap, this);
    }

    private _setState(key: ButtonStateKey): void {
        if (!this.states[key]) {
            return;
        }

        for (const prop in this.states) {
            if (this.states.hasOwnProperty(prop) && this.states[prop as ButtonStateKey]) {
                this.states[prop as ButtonStateKey].visible = false;
            }
        }

        this.states[key].visible = true;
    }

    protected abstract createState(config: ButtonStateConfig): ButtonState;
}
