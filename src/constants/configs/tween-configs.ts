export const getHandTweenConfig = (): TweenConfig => {
    return {
        universal: true,
        pixi: { scale: 0.85 },
        duration: 0.8,
        ease: PIXI.tween.easeSineInOut,
        repeat: -1,
        yoyo: true,
    };
};
