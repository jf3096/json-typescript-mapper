"use strict";
function isTargetType(val, type) {
    return typeof val === type;
}
exports.isTargetType = isTargetType;
function isPrimitiveOrPrimitiveClass(obj) {
    return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || (obj instanceof String || obj === String ||
        obj instanceof Number || obj === Number ||
        obj instanceof Boolean || obj === Boolean));
}
exports.isPrimitiveOrPrimitiveClass = isPrimitiveOrPrimitiveClass;
function isArrayOrArrayClass(clazz) {
    if (clazz === Array) {
        return true;
    }
    return Object.prototype.toString.call(clazz) === '[object Array]';
}
exports.isArrayOrArrayClass = isArrayOrArrayClass;
//# sourceMappingURL=utils.js.map