import { DevicePerformance } from './device-performance';

export class Device {
    private static _performance: DevicePerformance = null;
    private static _osVersion: string;
    private static _rendererSizeCoefficient: [number, number] = null;

    public static get performance(): DevicePerformance {
        if (this._performance !== null) {
            return this._performance;
        }
        this._performance = this._detectPerformance();
        return this._performance;
    }

    public static get osVersion(): string {
        if (this._osVersion) {
            return this._osVersion;
        }
        this._osVersion = this._detectOsVersion();
        return this._osVersion;
    }

    public static get rendererSizeCoefficient(): [number, number] {
        if (this._rendererSizeCoefficient) {
            return this._rendererSizeCoefficient;
        }
        this._rendererSizeCoefficient = this._detectRendererSizeCoefficient();
        return this._rendererSizeCoefficient;
    }

    private static _detectPerformance(): DevicePerformance {
        switch (true) {
            case PIXI.utils.isMobile.android.device:
                return this._getAndroidPerformance();
            case PIXI.utils.isMobile.apple.device:
                return this._getIOSPerformance();
        }
        return DevicePerformance.high;
    }

    private static _detectOsVersion(): string {
        switch (true) {
            case PIXI.utils.isMobile.android.device:
                return this._getAndroidVersion();
            case PIXI.utils.isMobile.apple.device:
                return this._getIOSVersion();
        }
        return '0';
    }

    private static _detectRendererSizeCoefficient(): [number, number] {
        switch (true) {
            case PIXI.utils.isMobile.android.device:
                return this._getAndroidRendererSizeCoefficient();
            case PIXI.utils.isMobile.apple.device:
                return this._getIOSRendererSizeCoefficient();
        }
        return [1, 1];
    }

    private static _getAndroidVersion(): string {
        const ua = navigator.userAgent.toLowerCase();
        const match = ua.match(/android\s([0-9\.]*)/i);
        return match ? match[1] : '0';
    }

    private static _getIOSVersion(): string {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)].join('.');
        }
        return [0, 0, 0].join('.');
    }

    private static _getAndroidPerformance(): DevicePerformance {
        const androidVersion = this.osVersion;
        const v = parseFloat(androidVersion);
        if (v >= 4.2 && v <= 4.3) {
            return DevicePerformance.poor;
        }
        if (v === 4.4) {
            return DevicePerformance.low;
        }
        if (v >= 5 && v < 7) {
            return DevicePerformance.medium;
        }
        if (v >= 7 && v < 8) {
            return DevicePerformance.high;
        }
        return DevicePerformance.top;
    }

    private static _getIOSPerformance(): DevicePerformance {
        const iosVersion = this.osVersion;
        const v = parseFloat(iosVersion);
        if (v >= 10 && v < 12) {
            return DevicePerformance.medium;
        }
        if (v >= 12 && v < 13) {
            return DevicePerformance.high;
        }
        return DevicePerformance.top;
    }

    private static _getAndroidRendererSizeCoefficient(): [number, number] {
        switch (this.performance) {
            case DevicePerformance.poor:
                return [0.3, 0.3];
            case DevicePerformance.low:
                return [0.5, 0.5];
            case DevicePerformance.medium:
                return [0.8, 0.8];
            case DevicePerformance.high:
                return [0.9, 0.9];
            default:
                return [1, 1];
        }
    }

    private static _getIOSRendererSizeCoefficient(): [number, number] {
        switch (this.performance) {
            case DevicePerformance.medium:
                return [0.6, 0.6];
            case DevicePerformance.high:
                return [0.8, 0.8];
            default:
                return [1, 1];
        }
    }
}
