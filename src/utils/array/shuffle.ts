import { randomInt } from '../number/random-int';

export function shuffle<T>(arr: Array<T>): Array<T> {
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = randomInt(0, i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
}
