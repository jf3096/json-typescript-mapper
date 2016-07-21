export function isTargetType(val:any, type:"object" | "string"):boolean {
    return typeof val === type;
}

export function isPrimitiveOrPrimitiveClass(obj:any):boolean {
    return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || (obj instanceof String || obj === String ||
    obj instanceof Number || obj === Number ||
    obj instanceof Boolean || obj === Boolean));
}

export function isArrayOrArrayClass(clazz:Function):boolean {
    if (clazz === Array) {
        return true;
    }
    return Object.prototype.toString.call(clazz) === '[object Array]'
}
