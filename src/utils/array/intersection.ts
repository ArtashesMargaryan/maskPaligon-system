export function intersection<T>(arrA: Array<T>, arrB: Array<T>): Array<T> {
    return arrA.filter((x) => arrB.includes(x));
}
