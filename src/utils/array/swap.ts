export function swap<T>(arr: Array<T>, i1: number, i2: number): Array<T> {
    const tmp = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = tmp;
    return arr;
}
