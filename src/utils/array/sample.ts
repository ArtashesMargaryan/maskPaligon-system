import { randomInt } from '../number/random-int';

export function sample<T>(arr: Array<T>): T {
    return arr[randomInt(0, arr.length - 1)];
}
