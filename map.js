"use strict";
require('reflect-metadata');
var utils_1 = require('./libs/utils');
var JSON_META_DATA_KEY = "JsonProperty";
function JsonProperty(metadata) {
    if (utils_1.isTargetType(metadata, 'string')) {
        return Reflect.metadata(JSON_META_DATA_KEY, {
            name: metadata,
            clazz: undefined
        });
    }
    else if (utils_1.isTargetType(metadata, 'object')) {
        var metadataObj = metadata;
        return Reflect.metadata(JSON_META_DATA_KEY, {
            name: metadataObj ? metadataObj.name : undefined,
            clazz: metadataObj ? metadataObj.clazz : undefined
        });
    }
    else {
        throw new Error("map.ts: meta data in Json property is undefined. meta data: " + metadata);
    }
}
function getClazz(target, propertyKey) {
    return Reflect.getMetadata("design:type", target, propertyKey);
}
function getJsonProperty(target, propertyKey) {
    return Reflect.getMetadata(JSON_META_DATA_KEY, target, propertyKey);
}
function hasAnyNullOrUndefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    args.some(function (arg) { return arg === null || arg === undefined; });
}
function propertyMetadataFn(decoratorMetadata, instance, json, key) {
    var decoratorName = decoratorMetadata.name || key;
    var innerJson = json ? json[decoratorName] : undefined;
    var Clazz = getClazz(instance, key);
    switch (Clazz) {
        case utils_1.isArray(Clazz):
            var metadata_1 = getJsonProperty(instance, key);
            if (metadata_1 && metadata_1.clazz || utils_1.isPrimitive(Clazz)) {
                if (innerJson && utils_1.isArray(innerJson)) {
                    return innerJson.map(function (item) { return deserialize(metadata_1.clazz, item); });
                }
                else {
                    return;
                }
            }
            else {
                return innerJson;
            }
        case !utils_1.isPrimitive(Clazz):
            return deserialize(Clazz, innerJson);
        default:
            return json ? json[decoratorName] : undefined;
    }
}
/**
 * deserialize
 *
 * @Function
 * @param {{new():T}} clazz, class type which is going to initialize and hold a mapping json
 * @param {Object} json, input json object which to be mapped
 *
 * @return {T} return mapped object
 */
function deserialize(Clazz, json) {
    /**
     * As it is a recursive function, ignore any arguments that are unset
     */
    if (hasAnyNullOrUndefined(Clazz, json)) {
        return;
    }
    /**
     * init root class to contain json
     */
    var instance = new Clazz();
    Object.keys(instance).forEach(function (key) {
        /**
         * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
         */
        var decoratorMetaData = getJsonProperty(instance, key);
        /**
         * pass value to instance
         */
        instance[key] = decoratorMetaData ? propertyMetadataFn(decoratorMetaData, instance, json, key) : json[key];
    });
    return instance;
}
exports.deserialize = deserialize;
//
// class Student {
//     @JsonProperty('name1')
//     fullName:string;
//
//     constructor() {
//         this.fullName = undefined;
//     }
// }
//
// class Address {
//     @JsonProperty('first-line')
//     firstLine:string;
//     @JsonProperty('second-line')
//     secondLine:string;
//     city:string;
//     @JsonProperty({clazz: Student})
//     student:Student;
//
//     constructor() {
//         this.firstLine = undefined;
//         this.secondLine = undefined;
//         this.city = undefined;
//         this.student = undefined
//     }
// }
//
//
// class Person {
//     @JsonProperty('Name')
//     name:string;
//     @JsonProperty('xing')
//     surname:string;
//     age:number;
//     @JsonProperty({clazz: Address, name: 'Address1'})
//     address:Address[];
//
//     constructor() {
//         this.name = undefined;
//         this.surname = undefined;
//         this.age = undefined;
//         this.address = undefined;
//     }
// }
//
// let example = {
//     "Name": "Mark",
//     "xing": "Galea",
//     "age": 30,
//     "Address1": [
//         {
//             "first-line": "Some where",
//             "second-line": "Over Here",
//             "city": "In This City",
//             "student": {
//                 name1: "Ailun"
//             }
//         },
//         {
//             "first-line": "Some where",
//             "second-line": "Over Here",
//             "city": "In This City",
//             "student": {
//                 name1: "Ailun"
//             }
//         }
//     ]
// };
//
// let person = deserialize(Person, example);
// debugger;
// console.log(
//     person
// );
//# sourceMappingURL=map.js.map