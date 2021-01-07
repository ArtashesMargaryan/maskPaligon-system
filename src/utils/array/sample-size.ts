import { shuffle } from './shuffle';

export function sampleSize<T>(arr: Array<T>, size: number): Array<T> {
    return shuffle([...arr]).slice(0, size);
}
