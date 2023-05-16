export function extractProperty<T extends object, K extends keyof T>(
    o: T,
    p: K,
): { [key in K]: T[K] } {
    const value = o[p];
    delete o[p];

    const extracted: any = {};
    extracted[p] = value;
    return extracted;
}

export function defineGetter<T, V>(target: T, propertyKey: PropertyKey, getter: () => V) {
    return Object.defineProperty(target, propertyKey, {
        get: getter,
        configurable: false,
    });
}
