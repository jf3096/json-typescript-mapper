import 'reflect-metadata';
import {isTargetType, isPrimitive, isArray} from './libs/utils';

const JSON_META_DATA_KEY = "JsonProperty";

export interface IDecoratorMetaData<T> {
    name?:string,
    clazz?:{new():T}
}

function JsonProperty<T>(metadata?:IDecoratorMetaData<T>|string):any {
    if (isTargetType(metadata, 'string')) {
        return Reflect.metadata(JSON_META_DATA_KEY, {
            name: metadata,
            clazz: undefined
        });
    } else if (isTargetType(metadata, 'object')) {
        let metadataObj = <IDecoratorMetaData<T>>metadata;
        return Reflect.metadata(JSON_META_DATA_KEY, {
            name: metadataObj ? metadataObj.name : undefined,
            clazz: metadataObj ? metadataObj.clazz : undefined
        });
    } else {
        throw new Error("map.ts: meta data in Json property is undefined. meta data: " + metadata)
    }
}

function getClazz(target:any, propertyKey:string):any {
    return Reflect.getMetadata("design:type", target, propertyKey)
}

function getJsonProperty<T>(target:any, propertyKey:string):IDecoratorMetaData<T> {
    return Reflect.getMetadata(JSON_META_DATA_KEY, target, propertyKey);
}

function hasAnyNullOrUndefined(...args:any[]) {
    args.some((arg:any)=>arg === null || arg === undefined);
}

function propertyMetadataFn<T>(decoratorMetadata:IDecoratorMetaData<any>, instance:T, json:Object, key:any):(IJsonMetaData) => any {
    let decoratorName = decoratorMetadata.name || key;
    let innerJson = json ? json[decoratorName] : undefined;
    let Clazz = getClazz(instance, key);


    switch (Clazz) {
        case isArray(Clazz):
            let metadata = getJsonProperty(instance, key);
            if (metadata && metadata.clazz || isPrimitive(Clazz)) {
                if (innerJson && isArray(innerJson)) {
                    return innerJson.map(
                        (item)=> deserialize(metadata.clazz, item)
                    );
                } else {
                    return;
                }
            } else {
                return innerJson;
            }
        case !isPrimitive(Clazz):
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
export function deserialize<T>(Clazz:{new():T}, json:Object):T {
    /**
     * As it is a recursive function, ignore any arguments that are unset
     */
    if (hasAnyNullOrUndefined(Clazz, json)) {
        return;
    }
    /**
     * init root class to contain json
     */
    let instance = new Clazz();

    Object.keys(instance).forEach((key:any) => {
        /**
         * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
         */
        let decoratorMetaData = getJsonProperty(instance, key);
        /**
         * pass value to instance
         */
        instance[key] = decoratorMetaData ? propertyMetadataFn(decoratorMetaData, instance, json, key) : json[key];
    });

    return instance;
}
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
