"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var metadata_1 = require("./metadata");
var type_1 = require("./type");
var apiMap = 'api:map:';
var apiMapSerializable = apiMap + "serializable";
var designType = 'design:type';
/**
 * Decorator JsonProperty
 */
function JsonProperty(args) {
    return function (target, key) {
        var map = {};
        var targetName = target.constructor.name;
        var ApiMapTargetName = "" + apiMap + targetName;
        if (Reflect.hasMetadata(ApiMapTargetName, target)) {
            map = Reflect.getMetadata(ApiMapTargetName, target);
        }
        map[key] = getJsonPropertyValue(key, args);
        Reflect.defineMetadata(ApiMapTargetName, map, target);
    };
}
exports.JsonProperty = JsonProperty;
/**
 * Decorator Serializable
 */
function Serializable(baseClassName) {
    return function (target) {
        Reflect.defineMetadata(apiMapSerializable, baseClassName, target);
    };
}
exports.Serializable = Serializable;
/**
 * Function to deserialize json into a class
 */
function deserialize(json, type) {
    var instance = new type();
    var instanceName = instance.constructor.name;
    var baseClassName = Reflect.getMetadata(apiMapSerializable, type);
    var apiMapInstanceName = "" + apiMap + instanceName;
    var hasMap = Reflect.hasMetadata(apiMapInstanceName, instance);
    var instanceMap = {};
    if (!hasMap && baseClassName === undefined) {
        return json;
    }
    else {
        instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);
    }
    if (baseClassName) {
        var baseClassMap = Reflect.getMetadata("" + apiMap + baseClassName, instance);
        instanceMap = __assign({}, instanceMap, baseClassMap);
    }
    var keys = Object.keys(instanceMap);
    keys.forEach(function (key) {
        if (json[instanceMap[key].name] !== undefined) {
            instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[instanceMap[key].name]);
        }
    });
    return instance;
}
exports.deserialize = deserialize;
/**
 * Function to serialize a class into json
 */
function serialize(instance, removeUndefined) {
    if (removeUndefined === void 0) { removeUndefined = true; }
    var json = {};
    var instanceName = instance.constructor.name;
    var baseClassName = Reflect.getMetadata(apiMapSerializable, instance.constructor);
    var apiMapInstanceName = "" + apiMap + instanceName;
    var hasMap = Reflect.hasMetadata(apiMapInstanceName, instance);
    var instanceMap = {};
    if (!hasMap && baseClassName === undefined) {
        return json;
    }
    else {
        instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);
    }
    if (baseClassName !== undefined) {
        var baseClassMap = Reflect.getMetadata("" + apiMap + baseClassName, instance);
        instanceMap = __assign({}, instanceMap, baseClassMap);
    }
    var instanceKeys = Object.keys(instance);
    Object.keys(instanceMap).forEach(function (key) {
        if (!instanceKeys.includes(key)) {
            return;
        }
        var data = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);
        if (!removeUndefined || removeUndefined && data !== undefined) {
            json[instanceMap[key].name] = data;
        }
    });
    return json;
}
exports.serialize = serialize;
/**
 * Function to convert json data to the class property
 */
function convertPropertyToData(instance, key, value, removeUndefined) {
    var property = instance[key];
    var type = Reflect.getMetadata(designType, instance, key);
    var isArray = type.name.toLocaleLowerCase() === type_1.default.Array;
    var predicate = value['predicate'];
    var propertyType = value['type'] || type;
    var isSerializableProperty = isSerializable(propertyType);
    if (isSerializableProperty || predicate) {
        if (isArray) {
            var array_1 = [];
            property.forEach(function (d) {
                array_1.push(serialize(d, removeUndefined));
            });
            return array_1;
        }
        return serialize(property, removeUndefined);
    }
    if (propertyType.name.toLocaleLowerCase() === type_1.default.Date) {
        return property.toISOString();
    }
    return property;
}
/**
 * Function to convert json data to the class property
 */
function convertDataToProperty(instance, key, value, data) {
    var type = Reflect.getMetadata(designType, instance, key);
    var isArray = type.name.toLowerCase() === type_1.default.Array;
    var predicate = value['predicate'];
    var dataPredicate = value['dataPredicate'];
    var propertyType = value['type'] || type;
    var isSerializableProperty = isSerializable(propertyType);
    if (!isSerializableProperty && !predicate && !dataPredicate) {
        return castSimpleData(propertyType.name, data);
    }
    if (isArray) {
        var array_2 = [];
        data.forEach(function (d) {
            if (predicate) {
                propertyType = predicate(d);
            }
            if (dataPredicate) {
                d = dataPredicate(d);
                if (isSerializable(propertyType)) {
                    return castSimpleData(propertyType.name, d);
                }
            }
            array_2.push(deserialize(d, propertyType));
        });
        return array_2;
    }
    propertyType = predicate ? predicate(data) : propertyType;
    if (dataPredicate) {
        data = dataPredicate(data);
        if (!isSerializable(propertyType)) {
            return castSimpleData(propertyType.name, data);
        }
    }
    return deserialize(data, propertyType);
}
/**
 * Function to test if a class has the serializable decorator (metadata)
 */
function isSerializable(type) {
    return Reflect.hasOwnMetadata(apiMapSerializable, type);
}
/**
 * Function to transform the JsonProperty value into an object like {name: string, type: Function}
 */
function getJsonPropertyValue(key, jsonPropertyInput) {
    var metadata = new metadata_1.default();
    if (!jsonPropertyInput) {
        metadata.name = key.toString();
        return metadata;
    }
    metadata.name = typeof jsonPropertyInput === type_1.default.String ? jsonPropertyInput : jsonPropertyInput['name'] ? jsonPropertyInput['name'] : key.toString();
    metadata.type = jsonPropertyInput['type'];
    metadata.predicate = jsonPropertyInput['predicate'];
    metadata.dataPredicate = jsonPropertyInput['dataPredicate'];
    return metadata;
}
/**
 * Function to cast simple type data into the real class property type
 */
function castSimpleData(type, data) {
    type = type.toLowerCase();
    if ((typeof data).toLowerCase() === type) {
        return data;
    }
    switch (type) {
        case type_1.default.String:
            return data.toString();
        case type_1.default.Number:
            var number = +data;
            if (isNaN(number)) {
                console.error(data + ": Type " + typeof data + " is not assignable to type " + type + ".");
                return undefined;
            }
            return number;
        case type_1.default.Boolean:
            console.error(data + ": Type " + typeof data + " is not assignable to type " + type + ".");
            return undefined;
        case type_1.default.Date:
            if (isNaN(Date.parse(data))) {
                console.error(data + ": Type " + typeof data + " is not assignable to type " + type + ".");
                return undefined;
            }
            return new Date(data);
        default:
            return data;
    }
}
