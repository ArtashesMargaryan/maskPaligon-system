import { Images } from '../assets';

export class BitmapText extends PIXI.Container {
    private _text: string;
    private _config: BitmapTextConfig;

    public constructor(text: string, config: BitmapTextConfig) {
        super();
        this._text = text;
        this._config = config;
        this._build();
    }

    private _build(): void {
        let w = 0;
        const { basepath, spacing } = this._config;
        for (let i = 0; i < this._text.length; ++i) {
            const sym = this._text[i];
            if (sym !== ' ' && sym !== '%') {
                const bitmap = this.addChild(PIXI.Sprite.from(Images[`${basepath}${sym}` as keyof typeof Images]));

                bitmap.anchor.set(0, 0.5);
                bitmap.x = w;
                w += bitmap.width;
            } else {
                w += spacing;
            }
        }
    }
}
