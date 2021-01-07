import { lego } from '@armathai/lego';
import { Images } from '../../../src/assets';
import { CloseViewEvent } from '../../../src/events/view';
import { CloseBtnViewAbstract } from '../../base/close-btn-view-abstract';

const getCloseBtnBgUpSpriteConfig = (): SpriteConfig => ({
    texture: Images['constructor/btn-close-up'],
});

const getCloseBtnConfig = (): ButtonConfig => {
    return {
        states: {
            up: {
                bg: getCloseBtnBgUpSpriteConfig(),
            },
        },
    };
};

const getCloseBtnHideTweenConfig = (target: PIXI.DisplayObject): TweenConfig => {
    return {
        universal: true,
        pixi: { alpha: 0 },
        duration: 0.1,
        ease: PIXI.tween.easeLinearNone,
        onComplete: () => {
            target.visible = false;
        },
    };
};

export class CloseBtnView extends CloseBtnViewAbstract {
    public constructor() {
        super(getCloseBtnConfig());
    }

    protected hide(): void {
        PIXI.tween.to(this, getCloseBtnHideTweenConfig(this));
    }

    protected onTap(): void {
        lego.event.emit(CloseViewEvent.closeBtnClick);
    }
}
