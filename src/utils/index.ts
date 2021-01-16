export const lp = <L, P>(l: L, p: P): L | P => {
    if (window.matchMedia('(orientation: portrait)').matches) {
        // you're in PORTRAIT mode
        return p;
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
        // you're in LANDSCAPE mode
        return l;
    }
};

export const fitDimension = (
    dim: { width: number; height: number },
    minRatio: number,
    maxRatio: number,
): ScreenSize => {
    const ratioW = dim.width / dim.height;
    const ratioH = dim.height / dim.width;

    if (ratioW < ratioH) {
        if (ratioW > maxRatio) {
            dim.width = dim.width * (maxRatio / ratioW);
        } else if (ratioW < minRatio) {
            dim.height = dim.height * (ratioW / minRatio);
        }
    } else {
        if (ratioH > maxRatio) {
            dim.height = dim.height * (maxRatio / ratioH);
        } else if (ratioH < minRatio) {
            dim.width = dim.width * (ratioH / minRatio);
        }
    }

    return dim;
};

export const waitSync = (delay: number): Promise<void> => {
    return new Promise(async (resolve) => {
        delayRunnable(delay, resolve);
    });
};

export const delayRunnable = (
    delay: number,
    runnable: (...args: unknown[]) => unknown,
    context?: unknown,
    ...args: unknown[]
): Runnable => {
    let delayMS = delay * 1000;
    const delayWrapper = (): void => {
        delayMS -= PIXI.Ticker.shared.deltaMS;
        if (delayMS <= 0) {
            runnable.call(context, ...args);
            PIXI.Ticker.shared.remove(delayWrapper);
        }
    };
    PIXI.Ticker.shared.add(delayWrapper);
    return delayWrapper;
};

export const removeRunnable = (runnable: Runnable): void => {
    PIXI.Ticker.shared.remove(runnable);
};

export const loopRunnable = (
    delay: number,
    runnable: (...args: unknown[]) => unknown,
    context?: unknown,
    ...args: unknown[]
): Runnable => {
    let delayMS = delay * 1000;
    const delayWrapper = (): void => {
        delayMS -= PIXI.Ticker.shared.deltaMS;
        if (delayMS <= 0) {
            runnable.call(context, ...args);
            delayMS = delay * 1000;
        }
    };
    PIXI.Ticker.shared.add(delayWrapper);
    return delayWrapper;
};

export const postRunnable = (
    runnable: (...args: unknown[]) => unknown,
    context?: unknown,
    ...args: unknown[]
): void => {
    delayRunnable(PIXI.Ticker.shared.deltaMS / 1000, runnable, context, ...args);
};

export const getDisplayObjectByProperty = (
    prop: string,
    value: string,
    parent?: PIXI.Container,
): PIXI.DisplayObject => {
    const application = superApp.app;

    const { children } = parent || application.stage;

    if (!children || children.length === 0) {
        return null;
    }

    for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        if (((child as unknown) as Record<string, unknown>)[prop] === value) {
            return child;
        }
        if (child instanceof PIXI.Container) {
            const displayObject = getDisplayObjectByProperty(prop, value, child);
            if (displayObject) {
                return displayObject;
            }
        }
    }

    return null;
};

export const makeSprite = (config: SpriteConfig): PIXI.Sprite => {
    const {
        texture,
        tint = 0,
        position = new PIXI.Point(0, 0),
        scale = new PIXI.Point(1, 1),
        anchor = new PIXI.Point(0.5, 0.5),
    } = config;

    const img = PIXI.Sprite.from(texture);

    img.scale.copyFrom(scale);
    img.anchor.copyFrom(anchor);
    img.position.copyFrom(position);

    if (tint) img.tint = tint;

    return img;
};

export const makeNineSlice = (config: NineSliceConfig): PIXI.NineSlicePlane => {
    const {
        texture,
        data,
        width,
        height,
        tint,
        scale = new PIXI.Point(1, 1),
        position = new PIXI.Point(0, 0),
        pivot = new PIXI.Point(config.width / 2, config.height / 2),
    } = config;

    const img = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), ...data);
    img.width = width;
    img.height = height;

    img.scale.copyFrom(scale);
    img.position.copyFrom(position);
    img.pivot.copyFrom(pivot);

    if (tint) img.tint = tint;

    return img;
};

export function makeParticleEffect(config: ParticleConfig): PIXI.particles.core.ParticleEffect {
    return new (class extends PIXI.particles.core.ParticleEffect {
        public constructor(config: ParticleConfig) {
            const { data, position = new PIXI.Point(0, 0), scale = new PIXI.Point(1, 1) } = config;
            super(data);

            this.position.copyFrom(position);
            this.scale.copyFrom(scale);
        }

        public start(): void {
            super.start();
            PIXI.Ticker.shared.add(this.update, this);
        }

        public update(): void {
            super.update(PIXI.Ticker.shared.deltaMS);
        }

        public destroy(): void {
            PIXI.Ticker.shared.remove(this.update, this);
            super.destroy();
        }
    })(config);
}

export function makeAnimation(config: AnimationConfig): PIXI.AnimatedSprite {
    const {
        frames = [],
        speed = 1,
        loop = false,
        position = new PIXI.Point(0, 0),
        scale = new PIXI.Point(1, 1),
        anchor = new PIXI.Point(0, 0),
    } = config;

    const anim = PIXI.AnimatedSprite.fromFrames(frames);
    anim.animationSpeed = speed;
    anim.loop = loop;

    anim.anchor.copyFrom(anchor);
    anim.scale.copyFrom(scale);
    anim.position.copyFrom(position);

    return anim;
}

export function makeSpine(config: SpineConfig): PIXI.spine.Spine {
    const { skeleton, position = new PIXI.Point(0, 0), scale = new PIXI.Point(1, 1), speed = 1 } =
        config instanceof PIXI.spine.core.SkeletonData ? { skeleton: config } : config;

    const spine = new PIXI.spine.Spine(skeleton);
    spine.state.timeScale = speed;

    spine.scale.copyFrom(scale);
    spine.position.copyFrom(position);

    return spine;
}

export const getGridPadding = (): { x?: number; y?: number; width?: number; height?: number } => {
    const { clientWidth, clientHeight } = document.body;
    const ratioW = clientWidth / clientHeight;

    const screenPadding = ratioW < 0.55 || ratioW > 1.8 ? 0.05 : 0;

    return lp({ x: screenPadding, width: 1 - 2 * screenPadding }, { y: screenPadding, height: 1 - 2 * screenPadding });
};

export const hasOwnProperty = <X extends Record<string, unknown>, Y extends PropertyKey>(
    obj: X,
    prop: Y,
): obj is X & Record<Y, unknown> => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const getValueOfKey = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

export const upperPowerOfTwo = (v: number): number => {
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};
