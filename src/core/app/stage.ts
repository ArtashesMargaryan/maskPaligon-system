export enum Layers {
    main,
    game,
    vignette,
    result,
    foreground,
}

export class Stage extends PIXI.display.Stage {
    public readonly main: PIXI.display.Group;
    public readonly game: PIXI.display.Group;
    public readonly vignette: PIXI.display.Group;
    public readonly result: PIXI.display.Group;
    public readonly foreground: PIXI.display.Group;

    public constructor() {
        super();

        this.addChild(new PIXI.display.Layer((this.main = new PIXI.display.Group(Layers.main, false))));
        this.addChild(new PIXI.display.Layer((this.game = new PIXI.display.Group(Layers.game, false))));
        this.addChild(new PIXI.display.Layer((this.vignette = new PIXI.display.Group(Layers.vignette, false))));
        this.addChild(new PIXI.display.Layer((this.result = new PIXI.display.Group(Layers.result, false))));
        this.addChild(new PIXI.display.Layer((this.foreground = new PIXI.display.Group(Layers.foreground, false))));
    }
}
