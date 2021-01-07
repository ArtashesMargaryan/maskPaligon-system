export enum MainViewEvent {
    curtainComplete = 'MainViewEventCurtainComplete',
}

export enum CloseViewEvent {
    closeBtnClick = 'CloseViewEventCloseBtnClick',
}

export enum WinViewEvent {
    screenClick = 'WinViewEventScreenClick',
    claimBtnClick = 'WinViewEventClaimBtnClick',
    idleTime = 'WinViewEventIdleTime',
}

export enum LoseViewEvent {
    hideComplete = 'LoseViewEventHideComplete',
    retryBtnClick = 'LoseViewEventRetryBtnClick',
}
