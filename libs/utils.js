"use strict";
function isTargetType(val, type) {
    return typeof val === type;
}
exports.isTargetType = isTargetType;
function isPrimitive(obj) {
    return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || (obj instanceof String || obj === String ||
        obj instanceof Number || obj === Number ||
        obj instanceof Boolean || obj === Boolean));
}
exports.isPrimitive = isPrimitive;
function isArray(arr) {
    if (arr === Array) {
        return true;
    }
    return Object.prototype.toString.call(arr) === '[object Array]';
}
exports.isArray = isArray;
//# sourceMappingURL=utils.js.map