import 'reflect-metadata';
import {isTargetType, isPrimitiveOrPrimitiveClass, isArrayOrArrayClass} from './libs/utils';

/**
 * provide interface to indicate the object is allowed to be traversed
 *
 * @interface
 */
export interface IGenericObject {
    [key: string]: any;
}


/**
 * Decorator variable name
 *
 * @const
 */
const JSON_META_DATA_KEY = 'JsonProperty';

/**
 * When custom mapping of a property is required.
 *
 * @interface
 */
export interface ICustomConverter {
    fromJson(data: any): any;
    toJson(data: any): any;
}

/**
 * IDecoratorMetaData<T>
 * DecoratorConstraint
 *
 * @interface
 * @property {ICustomConverter} customConverter, will be used for mapping the property, if specified
 * @property {boolean} excludeToJson, will exclude the property for serialization, if true
 */
export interface IDecoratorMetaData<T> {
    name?: string,
    clazz?: {new(): T},
    customConverter?: ICustomConverter,
    excludeToJson?: boolean
}

/**
 * DecoratorMetaData
 * Model used for decoration parameters
 *
 * @class
 * @property {string} name, indicate which json property needed to map
 * @property {string} clazz, if the target is not primitive type, map it to corresponding class
 */
class DecoratorMetaData<T> {
    constructor(public name?: string, public clazz?: {new(): T}) {
    }
}

/**
 * JsonProperty
 *
 * @function
 * @property {IDecoratorMetaData<T>|string} metadata, encapsulate it to DecoratorMetaData for standard use
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export function JsonProperty<T>(metadata?: IDecoratorMetaData<T>|string): (target: Object, targetKey: string | symbol)=> void {
    let decoratorMetaData: IDecoratorMetaData<T>;

    if (isTargetType(metadata, 'string')) {
        decoratorMetaData = new DecoratorMetaData<T>(metadata as string);
    }
    else if (isTargetType(metadata, 'object')) {
        decoratorMetaData = metadata as IDecoratorMetaData<T>;
    }
    else {
        throw new Error('index.ts: meta data in Json property is undefined. meta data: ' + metadata)
    }

    return Reflect.metadata(JSON_META_DATA_KEY, decoratorMetaData);
}


/**
 * getClazz
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {Function} Function/Class indicate the target property type
 * @description Used for type checking, if it is not primitive type, loop inside recursively
 */
function getClazz<T>(target: T, propertyKey: string): {new(): T} {
    return Reflect.getMetadata('design:type', target, propertyKey)
}


/**
 * getJsonProperty
 *
 * @function
 * @property {any} target object
 * @property {string} propertyKey, used as target property
 * @return {IDecoratorMetaData<T>} Obtain target property decorator meta data
 */
function getJsonProperty<T>(target: any, propertyKey: string): IDecoratorMetaData<T> {
    return Reflect.getMetadata(JSON_META_DATA_KEY, target, propertyKey);
}

/**
 * hasAnyNullOrUndefined
 *
 * @function
 * @property {...args:any[]} any arguments
 * @return {IDecoratorMetaData<T>} check if any arguments is null or undefined
 */
function hasAnyNullOrUndefined(...args: any[]) {
    return args.some((arg: any) => arg === null || arg === undefined);
}


function mapFromJson<T>(decoratorMetadata: IDecoratorMetaData<any>, instance: T, json: IGenericObject, key: any): any {
    /**
     * if decorator name is not found, use target property key as decorator name. It means mapping it directly
     */
    let decoratorName = decoratorMetadata.name || key;
    let innerJson: any = json ? json[decoratorName] : undefined;
    let clazz = getClazz(instance, key);
    if (isArrayOrArrayClass(clazz)) {
        let metadata = getJsonProperty(instance, key);
        if (metadata && metadata.clazz || isPrimitiveOrPrimitiveClass(clazz)) {
            if (innerJson && isArrayOrArrayClass(innerJson)) {
                return innerJson.map(
                    (item: any) => deserialize(metadata.clazz, item)
                );
            }
            return;
        } else {
            return innerJson;
        }
    }

    if (!isPrimitiveOrPrimitiveClass(clazz)) {
        return deserialize(clazz, innerJson);
    }

    return json ? json[decoratorName] : undefined;
}

/**
 * deserialize
 *
 * @function
 * @param {{new():T}} clazz, class type which is going to initialize and hold a mapping json
 * @param {Object} json, input json object which to be mapped
 *
 * @return {T} return mapped object
 */
export function deserialize<T extends IGenericObject>(Clazz: {new(): T}, json: IGenericObject): T {
    /**
     * As it is a recursive function, ignore any arguments that are unset
     */
    if (hasAnyNullOrUndefined(Clazz, json)) {
        return void 0;
    }

    /**
     * Prevent non-json continue
     */
    if (!isTargetType(json, 'object')) {
        return void 0;
    }
    /**
     * init root class to contain json
     */
    let instance = new Clazz();

    Object.keys(instance).forEach((key: string) => {
        /**
         * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
         */
        let decoratorMetaData = getJsonProperty(instance, key);

        /**
         * pass value to instance
         */
        if (decoratorMetaData && decoratorMetaData.customConverter) {
            instance[key] =  decoratorMetaData.customConverter.fromJson(json[decoratorMetaData.name || key]);
        } else {
            instance[key] = decoratorMetaData ? mapFromJson(decoratorMetaData, instance, json, key) : json[key];
        }

    });

    return instance;
}

/**
 * Serialize: Creates a ready-for-json-serialization object from the provided model instance.
 * Only @JsonProperty decorated properties in the model instance are processed.
 *
 * @param instance an instance of a model class
 * @returns {any} an object ready to be serialized to JSON
 */
export function serialize(instance: any): any {

    if (!isTargetType(instance, 'object') || isArrayOrArrayClass(instance)) {
        return instance;
    }

    const obj: any = {};
    Object.keys(instance).forEach(key => {
        const metadata = getJsonProperty(instance, key);
        obj[metadata && metadata.name ? metadata.name : key] = serializeProperty(metadata, instance[key]);
    });
    return obj;
}

/**
 * Prepare a single property to be serialized to JSON.
 *
 * @param metadata
 * @param prop
 * @returns {any}
 */
function serializeProperty(metadata: IDecoratorMetaData<any>, prop: any): any {

    if (!metadata || metadata.excludeToJson === true) {
        return;
    }

    if (metadata.customConverter) {
        return metadata.customConverter.toJson(prop);
    }

    if (!metadata.clazz) {
        return prop;
    }

    if (isArrayOrArrayClass(prop)) {
        return prop.map((propItem: any) => serialize(propItem));
    }

    return serialize(prop);
}