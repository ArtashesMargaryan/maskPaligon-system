const MAX_WIDTH = 2048;
const MAX_HEIGHT = 2048;

const getRenderTexture = (texture: PIXI.Texture, width: number, height: number): PIXI.RenderTexture => {
    const widthFactor = Math.max(Math.floor(Math.min(MAX_WIDTH, width) / texture.width), 1);
    const heightFactor = Math.max(Math.floor(Math.min(MAX_HEIGHT, height) / texture.height), 1);

    width = texture.width * widthFactor;
    height = texture.height * heightFactor;

    const renderer = superApp.app.renderer;
    const renderTexture = PIXI.RenderTexture.create({ width, height });
    const sprite = new PIXI.Sprite(texture);

    while (sprite.y < height) {
        while (sprite.x < width) {
            renderer.render(sprite, renderTexture, false);
            sprite.x += sprite.width;
        }

        sprite.x = 0;
        sprite.y += sprite.height;
    }

    return renderTexture;
};

export class TilingSprite extends PIXI.Sprite {
    public constructor(texture: PIXI.Texture, width: number, height: number) {
        super(PIXI.Texture.EMPTY);
        const rt = getRenderTexture(texture, width, height);

        const fw = width / rt.width;
        const fh = height / rt.height;
        const W = Math.ceil(fw);
        const H = Math.ceil(fh);
        const w = fw % 1;
        const h = fh % 1;

        let tx = 0;
        let ty = 0;
        let tw = 0;
        let th = 0;

        for (let i = 0; i < H; i++) {
            th = H - i === 1 && h !== 0 ? rt.height * h : rt.height;

            for (let j = 0; j < W; j++) {
                tw = W - j === 1 && w !== 0 ? rt.width * w : rt.width;

                const sprite = new PIXI.Sprite(rt.clone());
                sprite.position.set(tx, ty);
                sprite.texture.frame.width = tw;
                sprite.texture.frame.height = th;
                sprite.texture.updateUvs();
                this.addChild(sprite);

                tx += rt.width - 1;
            }

            tx = 0;
            ty += rt.height - 1;
        }

        PIXI.Texture.removeFromCache(rt);
        rt.destroy();
    }

    public setAnchor(point: PIXI.Point): void {
        const lastChild = this.children[this.children.length - 1] as PIXI.Sprite;
        const width = lastChild.x + lastChild.width;
        const height = lastChild.y + lastChild.height;
        this.pivot.set(width * point.x, height * point.y);
    }
}
