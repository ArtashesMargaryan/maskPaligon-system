import { difference } from './difference';

export function symmetricalDifference<T>(arrA: Array<T>, arrB: Array<T>): Array<T> {
    return difference(arrA, arrB).concat(difference(arrB, arrA));
}
