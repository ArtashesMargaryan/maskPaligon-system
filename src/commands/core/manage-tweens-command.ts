export const manageTweensCommand = (): void => {
    PIXI.tween.globalTimeline.getChildren().forEach((t) => {
        if (t.vars.universal === true || (t.parent && t.parent.vars.universal === true)) {
            return;
        }

        t.totalProgress(1);
    });
};
