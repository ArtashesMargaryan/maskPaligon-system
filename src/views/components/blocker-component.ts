export class BlockerComponent extends PIXI.Graphics {
    public constructor(color: number, alpha: number) {
        super();

        const { x, y, width, height } = superApp.app.viewBounds;
        this.beginFill(color, alpha);
        this.drawRect(x, y, width, height);
        this.endFill();
    }
}
