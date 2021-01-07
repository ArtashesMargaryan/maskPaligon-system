import { getHandSpriteConfig } from '../../constants/configs/sprite-configs';
import { getHandTweenConfig } from '../../constants/configs/tween-configs';

export class HandComponent extends PIXI.Sprite {
    public constructor() {
        super(PIXI.Texture.from(getHandSpriteConfig().texture));
    }

    public play(): void {
        this.scale.set(1);
        PIXI.tween.to(this, getHandTweenConfig());
    }

    public stop(): void {
        PIXI.tween.killTweensOf(this);
        this.scale.set(1);
    }

    public destroy(options?: ContainerDestroyOptions): void {
        this.stop();
        super.destroy(options);
    }
}
