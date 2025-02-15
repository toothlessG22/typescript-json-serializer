import 'reflect-metadata';

import {
    Metadata, DataHandler,
    NameDeserializationHandler, NameSerializationHandler
} from './metadata';
export {
    Metadata, DataHandler,
    NameDeserializationHandler, NameSerializationHandler
};
import Type from './type';
import { logger } from './init-logger';

const apiMap: string = 'api:map:';
const apiMapSerializable: string = `${apiMap}serializable`;
const designType: string = 'design:type';
const designParamtypes: string = 'design:paramtypes';

/**
 * Function to find the name of function parameters
 */
function getParamNames(ctor: object): Array<string> {
    const params: string = ctor.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return params.replace(/\s/g, '').split(',');
}

export interface JsonPropertyInput {
    name?: string;
    predicate?: Function;
    nameSerializationHandlers?: Array<NameSerializationHandler>;
    nameDeserializationHandlers?: Array<NameDeserializationHandler>;
    dataDeserializationHandlers?: Array<DataHandler>;
    dataSerializationHandlers?: Array<DataHandler>;
    type?: Function;
}

/**
 * Decorator JsonProperty
 */
export function JsonProperty(args?: JsonPropertyInput): Function {
    return (target: Object | Function, key: string, index: number): void => {
        if (key === undefined && target['prototype']) {
            const type: Function = Reflect.getMetadata(designParamtypes, target, key)[index];
            const keys: Array<string> = getParamNames(target['prototype'].constructor);
            key = keys[index];
            target = target['prototype'];
            Reflect.defineMetadata(designType, type, target, key);
        }

        console.log(`marking ${target.constructor.name}[${key}] as serializable`);
        let map: { [id: string]: Metadata; } = {};
        const targetName: string = target.constructor.name;
        const apiMapTargetName: string = `${apiMap}${targetName}`;
        const typeName: string = Reflect.getMetadata(designType, target, key).name;

        if (Reflect.hasMetadata(apiMapTargetName, target)) {
            map = Reflect.getMetadata(apiMapTargetName, target);
        }

        map[key] = getJsonPropertyValue(key, typeName, args);
        Reflect.defineMetadata(apiMapTargetName, map, target);
    };
}

/**
 * Decorator Serializable
 */
export function Serializable(baseClassName?: string): Function {
    return (target: Object): void => {
        console.log(`marking ${target.constructor.name} as serializable with baseclassname '${baseClassName}'`);
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

    if (!hasMap && baseClassName === undefined) {
        return json;
    } else {
        instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);
    }

    if (baseClassName) {
        const baseClassMap: { [id: string]: Metadata; } = Reflect.getMetadata(`${apiMap}${baseClassName}`, instance);
        instanceMap = { ...instanceMap, ...baseClassMap };
    }

    const keys: Array<string> = Object.keys(instanceMap);
    keys.forEach((key: string) => {
        let name: string = instanceMap[key].name;

        if (instanceMap[key].nameDeserializationHandlers) {
            for (const nameDeserializationHandler of instanceMap[key].nameDeserializationHandlers) {
                name = nameDeserializationHandler(instance, instanceMap[key], Object.keys(json));
            }
        }

        if (json[name] !== undefined) {
            instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[name]);
        } else {
            logger.warn(`Could not find key ${key} in`, json);
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

    if (!hasMap && baseClassName === undefined) {
        return json;
    } else {
        instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);
    }

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
            let name: any = instanceMap[key].name;
            if (instanceMap[key].nameSerializationHandlers) {
                for (const nameSerializationHandler of instanceMap[key].nameSerializationHandlers) {
                    name = nameSerializationHandler(instance, instanceMap[key]);
                }
            }
            json[name] = data;
        }
    });

    return json;
}

/**
 * Function to convert json data to the class property
 */
function convertPropertyToData(instance: Function, key: string, value: Metadata, removeUndefined: boolean): any {

    let property: any = instance[key];
    const type: Metadata = Reflect.getMetadata(designType, instance, key);
    const isArray: boolean = type.name.toLocaleLowerCase() === Type.Array;
    const predicate: Function = value.predicate;
    const dataHandlers: Array<Function> = value.dataSerializationHandlers;
    const propertyType: any = value.type || type;
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (dataHandlers) {
        for (const dataHandler of dataHandlers) {
            property = dataHandler(property);
        }
    }

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
    const predicate: Function = value.predicate;
    const dataHandlers: Array<Function> = value.dataDeserializationHandlers;
    let propertyType: any = value.type || type;

    if (dataHandlers) {
        for (const dataHandler of dataHandlers) {
            data = dataHandler(data);
        }
    }

    if (isArray) {
        const array: Array<any> = [];
        data.forEach((d: any) => {
            if (predicate) {
                propertyType = predicate(d);
            }
            if (!isSerializable(propertyType)) {
                array.push(castSimpleData(propertyType.name, d));
            } else {
                array.push(deserialize(d, propertyType));
            }
        });

        return array;
    }

    // Apply predicate after we know that it is not an array.
    propertyType = predicate ? predicate(data) : propertyType;
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (!isSerializableProperty) {
        return castSimpleData(propertyType.name, data);
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
function getJsonPropertyValue(key: string, typeName: string, jsonPropertyInput?: JsonPropertyInput): Metadata {
    const metadata: Metadata = new Metadata();
    if (!jsonPropertyInput) {
        metadata.name = key.toString();
        return metadata;
    }

    metadata.name = jsonPropertyInput.name ? jsonPropertyInput.name : key.toString();
    metadata.type = jsonPropertyInput.type;
    metadata.predicate = jsonPropertyInput.predicate;
    metadata.nameDeserializationHandlers = jsonPropertyInput.nameDeserializationHandlers;
    metadata.nameSerializationHandlers = jsonPropertyInput.nameSerializationHandlers;
    metadata.dataDeserializationHandlers = jsonPropertyInput.dataDeserializationHandlers;
    metadata.dataSerializationHandlers = jsonPropertyInput.dataSerializationHandlers;
    metadata.typeName = typeName;
    return metadata;
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

