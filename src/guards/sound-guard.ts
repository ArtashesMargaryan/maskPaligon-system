import { soundAvailable } from '../utils';

export function soundGuard(): boolean {
    return soundAvailable();
}
