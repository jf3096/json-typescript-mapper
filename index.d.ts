import 'reflect-metadata';
import { IDecoratorMetaData } from './';
/**
 * provide interface to indicate the object is allowed to be traversed
 *
 * @interface
 */
export interface IGenericObject {
    [key: string]: any;
}
/**
 * IDecoratorMetaData<T>
 * DecoratorConstraint
 *
 * @interface
 */
export interface IDecoratorMetaData<T> {
    name?: string;
    clazz?: {
        new (): T;
    };
}
/**
 * JsonProperty
 *
 * @function
 * @property {IDecoratorMetaData<T>|string} metadata, encapsulate it to DecoratorMetaData for standard use
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export declare function JsonProperty<T>(metadata?: IDecoratorMetaData<T> | string): (target: Object, targetKey: string | symbol) => void;
/**
 * deserialize
 *
 * @function
 * @param {{new():T}} clazz, class type which is going to initialize and hold a mapping json
 * @param {Object} json, input json object which to be mapped
 *
 * @return {T} return mapped object
 */
export declare function deserialize<T extends IGenericObject>(Clazz: {
    new (): T;
}, json: IGenericObject): T;
