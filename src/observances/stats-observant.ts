export class StatsObservant {
    private _application: PIXI.Application;
    private _visible = false;

    public constructor() {
        this._application = superApp.app;
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 's') {
                this._toggleStats();
            }
        });
        if (sessionStorage['__stats_visibility__'] === 'true') {
            this._showStats();
        }
        this._application.stats.showPanel(0);
    }

    private _toggleStats(): void {
        this._visible ? this._hideStats() : this._showStats();
        this._visible = !this._visible;
        sessionStorage['__stats_visibility__'] = this._visible;
    }

    private _hideStats(): void {
        document.body.removeChild(this._application.stats.dom);
        this._application.ticker.remove(this._updateStats, this);
    }

    private _showStats(): void {
        document.body.appendChild(this._application.stats.dom);
        this._application.ticker.add(this._updateStats, this);
    }

    private _updateStats(): void {
        this._application.stats.update();
    }
}
