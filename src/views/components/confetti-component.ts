import { delayRunnable, loopRunnable, removeRunnable } from '../../utils';

type Particle = {
    x: number;
    y: number;
    r: number;
    d: number;
    colorOptions: { main: number; alt: number };
    tilt: number;
    tiltAngleIncremental: number;
    tiltAngle: number;
    color?: number;
};

export class ConfettiComponent extends PIXI.Graphics {
    private static readonly _colors = [
        { main: 0x1e90ff, alt: 0x4682b4 },
        { main: 0x6b8e23, alt: 0x556b2f },
        { main: 0xffd700, alt: 0xbdb76b },
        { main: 0xffc0cb, alt: 0xd87093 },
        { main: 0xadd8e6, alt: 0xb0c4de },
        { main: 0xee82ee, alt: 0xda70d6 },
        { main: 0x98fb98, alt: 0x9acd32 },
        { main: 0xf4a460, alt: 0xcd853f },
        { main: 0xd2691e, alt: 0xa0522d },
        { main: 0xdc143c, alt: 0xb22222 },
    ];

    private _w: number;
    private _h: number;

    private _mp = 55;
    private _particles: Particle[];
    private _angle = 0;
    private _confettiActive = true;
    private _animationComplete = true;
    private _reactivationTimerHandler: Runnable;
    private _loopRunnable: Runnable;

    public constructor(w: number, h: number) {
        super();
        this._w = w;
        this._h = h;

        this._mp = 55;
        this._angle = 0;
        this._confettiActive = true;
        this._animationComplete = true;
    }

    public onResize(w: number, h: number): void {
        this._w = w;
        this._h = h;
        this.parent.toLocal(new PIXI.Point(), null, this.position);
    }

    public initializeConfetti(): void {
        this._particles = [];
        this._animationComplete = false;
        for (let i = 0; i < this._mp; i++) {
            this._particles.push(this.createParticle(ConfettiComponent._colors[i % ConfettiComponent._colors.length]));
        }
    }

    public start(): void {
        this.initializeConfetti();

        if (!this._animationComplete) {
            loopRunnable(PIXI.Ticker.shared.deltaMS / 1000, this.update, this);
        }
    }

    public update(): void {
        if (this._animationComplete) {
            return;
        }

        let remainingFlakes = 0;

        this._angle += 0.01;

        this.clear();

        for (let i = 0; i < this._mp; i++) {
            const particle = this._particles[i];

            if (!this._confettiActive && particle.y < -15) {
                particle.y = this._h + 250;

                continue;
            }

            if (particle.y <= this._h) {
                remainingFlakes++;
            }

            this.stepParticle(particle, i);
            this.drawParticle(particle);

            this.checkForReposition(particle, i);
        }

        if (remainingFlakes === 0) {
            this.stopConfetti();
        }
    }

    public createParticle(colorOptions: { main: number; alt: number }): Particle {
        return {
            x: Math.random() * this._w,
            y: -(Math.random() * this._h),
            r: 10 + Math.random() * 15,
            d: Math.random() * this._mp + 10,
            colorOptions: colorOptions,
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0,
        };
    }

    public stepParticle(particle: Particle, particleIndex: number): void {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(this._angle + particle.d) + 10 + particle.r / 2) / 4;
        particle.x += Math.sin(this._angle) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 25;
        particle.color = particle.tilt > 0 ? particle.colorOptions.main : particle.colorOptions.alt;
    }

    public drawParticle(particle: Particle): void {
        this.lineStyle(particle.r / 2, particle.color);

        this.moveTo(particle.x + particle.tilt + particle.r / 4, particle.y);
        this.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.r / 4);
    }

    public checkForReposition(particle: Particle, index: number): void {
        if ((particle.x > this._w + 20 || particle.x < -20 || particle.y > this._h) && this._confettiActive) {
            if (index % 5 > 0 || index % 2 === 0) {
                //66.67% of the flakes
                this.repositionParticle(particle, Math.random() * this._w, -10, Math.floor(Math.random() * 10) - 10);
            } else {
                if (Math.sin(this._angle) > 0) {
                    //Enter from the left
                    this.repositionParticle(particle, -5, Math.random() * this._h, Math.floor(Math.random() * 10) - 10);
                } else {
                    //Enter from the right
                    this.repositionParticle(
                        particle,
                        this._w + 5,
                        Math.random() * this._h,
                        Math.floor(Math.random() * 10) - 10,
                    );
                }
            }
        }
    }

    public repositionParticle(particle: Particle, xCoordinate: number, yCoordinate: number, tilt: number): void {
        particle.x = xCoordinate;
        particle.y = yCoordinate;

        particle.tilt = tilt;
    }

    public clearTimers(): void {
        removeRunnable(this._reactivationTimerHandler);
        removeRunnable(this._loopRunnable);
    }

    public deactivateConfetti(): void {
        this._confettiActive = false;
    }

    public stopConfetti(): void {
        this._animationComplete = true;
        this.clear();
        this.clearTimers();
    }

    public restartConfetti(): void {
        this.stopConfetti();

        this._reactivationTimerHandler = delayRunnable(1, () => {
            this._confettiActive = true;
            this._animationComplete = false;
            this.initializeConfetti();
        });
    }
}
