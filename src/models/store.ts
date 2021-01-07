import { AppModel } from './app-model';
import { GameModel } from './game-model';
import { ObservableModel } from './observable-model';
import { SuperAppModel } from './super-app-model';

class Store extends ObservableModel {
    private _app: AppModel = null;
    private _game: GameModel = null;
    private _superApp: SuperAppModel = null;

    public constructor() {
        super('Store');
        this.makeObservable();
    }

    public get superApp(): SuperAppModel {
        return this._superApp;
    }

    public get app(): AppModel {
        return this._app;
    }

    public get game(): GameModel {
        return this._game;
    }

    public initializeSuperAppModel(): void {
        this._superApp = new SuperAppModel();
        this._superApp.initialize();
    }

    public initializeAppModel(): void {
        this._app = new AppModel();
        this._app.initialize();
    }

    public initializeGameModel(): void {
        this._game = new GameModel();
        this._game.initialize();
    }

    public destroyGameModel(): void {
        this._game.destroy();
        this._game = null;
    }
}

export const store = new Store();
