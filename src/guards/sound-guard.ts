import { Device } from '../core/device/device';

export function soundGuard(): boolean {
    return Device.sound;
}
