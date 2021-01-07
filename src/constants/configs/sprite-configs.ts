import { Images } from '../../assets';

export const getBgSpriteConfig = (): SpriteConfig => ({
    texture: Images['bg'],
});

export const getHandSpriteConfig = (): SpriteConfig => ({
    texture: Images['constructor/hand'],
});

export const getVignetteSpriteConfig = (): SpriteConfig => ({
    texture: Images['vignette'],
});
