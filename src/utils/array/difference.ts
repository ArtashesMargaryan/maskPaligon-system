export function difference<T>(arrA: Array<T>, arrB: Array<T>): Array<T> {
    return arrA.filter((x) => !arrB.includes(x));
}
