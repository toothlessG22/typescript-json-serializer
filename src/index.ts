import 'reflect-metadata';

import Metadata from './metadata';
import Type from './type';

const apiMap: string = 'api:map:';
const apiMapSerializable: string = `${apiMap}serializable`;
const designType: string = 'design:type';

/**
 * Decorator JsonProperty
 */
export function JsonProperty(args?: string | { name?: string, type: Function } | { name?: string, predicate: Function } | { name?: string, dataPredicate: Function }): Function {
    return (target: Object, key: string): void => {

        let map: { [id: string]: Metadata; } = {};
        const targetName: string = target.constructor.name;
        const ApiMapTargetName: string = `${apiMap}${targetName}`;

        if (Reflect.hasMetadata(ApiMapTargetName, target)) {
            map = Reflect.getMetadata(ApiMapTargetName, target);
        }

        map[key] = getJsonPropertyValue(key, args);
        Reflect.defineMetadata(ApiMapTargetName, map, target);
    };
}

/**
 * Decorator Serializable
 */
export function Serializable(baseClassName?: string): Function {
    return (target: Object): void => {
        Reflect.defineMetadata(apiMapSerializable, baseClassName, target);
    };
}

/**
 * Function to deserialize json into a class
 */
export function deserialize(json: any, type: any): any {
    const instance: any = new type();
    const instanceName: string = instance.constructor.name;
    const baseClassName: string = Reflect.getMetadata(apiMapSerializable, type);
    const apiMapInstanceName: string = `${apiMap}${instanceName}`;
    const hasMap: boolean = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: { [id: string]: Metadata; } = {};

    if (!hasMap) {
        return instance;
    }

    instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);

    if (baseClassName) {
        const baseClassMap: { [id: string]: Metadata; } = Reflect.getMetadata(`${apiMap}${baseClassName}`, instance);
        instanceMap = { ...instanceMap, ...baseClassMap };
    }

    const keys: Array<string> = Object.keys(instanceMap);
    keys.forEach((key: string) => {
        if (json[instanceMap[key].name] !== undefined) {
            instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[instanceMap[key].name]);
        }
    });

    return instance;
}

/**
 * Function to serialize a class into json
 */
export function serialize(instance: any, removeUndefined: boolean = true): any {

    const json: any = {};
    const instanceName: string = instance.constructor.name;
    const baseClassName: string = Reflect.getMetadata(apiMapSerializable, instance.constructor);
    const apiMapInstanceName: string = `${apiMap}${instanceName}`;
    const hasMap: boolean = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: { [id: string]: Metadata } = {};

    if (!hasMap) {
        return json;
    }

    instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);

    if (baseClassName !== undefined) {
        const baseClassMap: { [id: string]: any; } = Reflect.getMetadata(`${apiMap}${baseClassName}`, instance);
        instanceMap = { ...instanceMap, ...baseClassMap };
    }

    const instanceKeys: Array<string> = Object.keys(instance);
    Object.keys(instanceMap).forEach((key: string) => {
        if (!instanceKeys.includes(key)) {
            return;
        }
        const data: any = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);
        if (!removeUndefined || removeUndefined && data !== undefined) {
            json[instanceMap[key].name] = data;
        }
    });

    return json;
}

/**
 * Function to convert json data to the class property
 */
function convertPropertyToData(instance: Function, key: string, value: Metadata, removeUndefined: boolean): any {

    const property: any = instance[key];
    const type: Metadata = Reflect.getMetadata(designType, instance, key);
    const isArray: boolean = type.name.toLocaleLowerCase() === Type.Array;
    const predicate: Function = value['predicate'];
    const propertyType: any = value['type'] || type;
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (isSerializableProperty || predicate) {
        if (isArray) {
            const array: Array<any> = [];
            property.forEach((d: any) => {
                array.push(serialize(d, removeUndefined));
            });

            return array;
        }

        return serialize(property, removeUndefined);
    }

    if (propertyType.name.toLocaleLowerCase() === Type.Date) {
        return property.toISOString();
    }

    return property;
}

/**
 * Function to convert json data to the class property
 */
function convertDataToProperty(instance: Function, key: string, value: Metadata, data: any): any {

    const type: Metadata = Reflect.getMetadata(designType, instance, key);
    const isArray: boolean = type.name.toLowerCase() === Type.Array;
    const predicate: Function = value['predicate'];
    const dataPredicate: Function = value['dataPredicate'];
    let propertyType: any = value['type'] || type;
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (!isSerializableProperty && !predicate && !dataPredicate) {
        return castSimpleData(propertyType.name, data);
    }

    if (isArray) {
        const array: Array<any> = [];
        data.forEach((d: any) => {
            if (predicate) {
                propertyType = predicate(d);
            }
            if (dataPredicate) {
                d = dataPredicate(d);
                if (isSerializable(propertyType)) {
                    return castSimpleData(propertyType.name, d);
                }
            }
            array.push(deserialize(d, propertyType));
        });

        return array;
    }

    propertyType = predicate ? predicate(data) : propertyType;
    if (dataPredicate) {
        data = dataPredicate(data);
        if (isSerializable(propertyType)) {
            return castSimpleData(propertyType.name, data);
        }
    }
    return deserialize(data, propertyType);
}

/**
 * Function to test if a class has the serializable decorator (metadata)
 */
function isSerializable(type: any): boolean {
    return Reflect.hasOwnMetadata(apiMapSerializable, type);
}

/**
 * Function to transform the JsonProperty value into an object like {name: string, type: Function}
 */
function getJsonPropertyValue(key: string, args: string | { name?: string, type: Function } | { name?: string, predicate: Function } | { name?: string, dataPredicate: Function }): Metadata {
    if (!args) {
        return {
            name: key.toString(),
            type: undefined
        };
    }

    const name: string = typeof args === Type.String ? args : args['name'] ? args['name'] : key.toString();
    return args['predicate'] ? { name, predicate: args['predicate'] } : args['dataPredicate'] ? { name, dataPredicate: args['dataPredicate'] } : { name, type: args['type'] };
}

/**
 * Function to cast simple type data into the real class property type
 */
function castSimpleData(type: string, data: any): any {
    type = type.toLowerCase();

    if ((typeof data).toLowerCase() === type) {
        return data;
    }

    switch (type) {
        case Type.String:
            return data.toString();
        case Type.Number:
            const number: number = +data;
            if (isNaN(number)) {
                console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
                return undefined;
            }
            return number;
        case Type.Boolean:
            console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
            return undefined;
        case Type.Date:
            if (isNaN(Date.parse(data))) {
                console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
                return undefined;
            }
            return new Date(data);
        default:
            return data;
    }
}

