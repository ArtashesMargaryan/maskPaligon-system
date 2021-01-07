export enum AppModelEvent {
    stateUpdate = 'AppModelStateUpdate',
    resultUpdate = 'AppModelResultUpdate',
    pausedUpdate = 'AppModelPausedUpdate',
    mutedUpdate = 'AppModelMutedUpdate',
    retriesUpdate = 'AppModelRetriesUpdate',
}

export enum GameModelEvent {
    hintUpdate = 'GameModelHintUpdate',
}

export enum HintModelEvent {
    visibleUpdate = 'HintModelVisibleUpdate',
}

export enum ObservableModelEvent {
    uuidUpdate = 'ObservableModelUuidUpdate',
}

export enum ResultModelEvent {
    stateUpdate = 'ResultModelStateUpdate',
}

export enum StoreEvent {
    superAppUpdate = 'StoreSuperAppUpdate',
    appUpdate = 'StoreAppUpdate',
    gameUpdate = 'StoreGameUpdate',
}

export enum SuperAppModelEvent {
    pausedUpdate = 'SuperAppModelPausedUpdate',
    mutedUpdate = 'SuperAppModelMutedUpdate',
}
