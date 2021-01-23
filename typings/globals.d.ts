/* eslint-disable @typescript-eslint/naming-convention */

declare let __PIXI_VERSION__: string;
declare const superApp: import('../src/core/app/super-app').SuperApp;
declare const appconfig: AppConfig;

interface NativeInterface {
    postMessage: (msg: string) => void;
}

interface Window {
    superApp: import('../src/core/app/super-app').SuperApp;
    appconfig: AppConfig;
    nativeInterface?: NativeInterface;
    webkit?: { messageHandlers: { nativeInterface: NativeInterface } };
}

interface Document {
    msHidden?: string;
    webkitHidden?: string;
}

type AppConfig = {
    size: {
        design: {
            landscape: { width: number; height: number };
            portrait: { width: number; height: number };
        };
        game: {
            landscape: { width: number; height: number };
            portrait: { width: number; height: number };
        };
        ratio: { min: number; max: number };
    };
};

type ScreenSize = {
    width: number;
    height: number;
};

type ContainerDestroyOptions = { children?: boolean; texture?: boolean; baseTexture?: boolean };
