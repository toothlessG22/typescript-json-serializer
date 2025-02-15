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
exports.Metadata = metadata_1.Metadata;
var type_1 = require("./type");
var init_logger_1 = require("./init-logger");
var apiMap = 'api:map:';
var apiMapSerializable = apiMap + "serializable";
var designType = 'design:type';
var designParamtypes = 'design:paramtypes';
/**
 * Function to find the name of function parameters
 */
function getParamNames(ctor) {
    var params = ctor.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return params.replace(/\s/g, '').split(',');
}
/**
 * Decorator JsonProperty
 */
function JsonProperty(args) {
    return function (target, key, index) {
        if (key === undefined && target['prototype']) {
            var type = Reflect.getMetadata(designParamtypes, target, key)[index];
            var keys = getParamNames(target['prototype'].constructor);
            key = keys[index];
            target = target['prototype'];
            Reflect.defineMetadata(designType, type, target, key);
        }
        console.log("marking " + target.constructor.name + "[" + key + "] as serializable");
        var map = {};
        var targetName = target.constructor.name;
        var apiMapTargetName = "" + apiMap + targetName;
        var typeName = Reflect.getMetadata(designType, target, key).name;
        if (Reflect.hasMetadata(apiMapTargetName, target)) {
            map = Reflect.getMetadata(apiMapTargetName, target);
        }
        map[key] = getJsonPropertyValue(key, typeName, args);
        Reflect.defineMetadata(apiMapTargetName, map, target);
    };
}
exports.JsonProperty = JsonProperty;
/**
 * Decorator Serializable
 */
function Serializable(baseClassName) {
    return function (target) {
        console.log("marking " + target.constructor.name + " as serializable with baseclassname '" + baseClassName + "'");
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
        var name = instanceMap[key].name;
        if (instanceMap[key].nameDeserializationHandlers) {
            for (var _i = 0, _a = instanceMap[key].nameDeserializationHandlers; _i < _a.length; _i++) {
                var nameDeserializationHandler = _a[_i];
                name = nameDeserializationHandler(instance, instanceMap[key], Object.keys(json));
            }
        }
        if (json[name] !== undefined) {
            instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[name]);
        }
        else {
            init_logger_1.logger.warn("Could not find key " + key + " in", json);
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
            var name_1 = instanceMap[key].name;
            if (instanceMap[key].nameSerializationHandlers) {
                for (var _i = 0, _a = instanceMap[key].nameSerializationHandlers; _i < _a.length; _i++) {
                    var nameSerializationHandler = _a[_i];
                    name_1 = nameSerializationHandler(instance, instanceMap[key]);
                }
            }
            json[name_1] = data;
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
    var predicate = value.predicate;
    var dataHandlers = value.dataSerializationHandlers;
    var propertyType = value.type || type;
    var isSerializableProperty = isSerializable(propertyType);
    if (dataHandlers) {
        for (var _i = 0, dataHandlers_1 = dataHandlers; _i < dataHandlers_1.length; _i++) {
            var dataHandler = dataHandlers_1[_i];
            property = dataHandler(property);
        }
    }
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
    var predicate = value.predicate;
    var dataHandlers = value.dataDeserializationHandlers;
    var propertyType = value.type || type;
    if (dataHandlers) {
        for (var _i = 0, dataHandlers_2 = dataHandlers; _i < dataHandlers_2.length; _i++) {
            var dataHandler = dataHandlers_2[_i];
            data = dataHandler(data);
        }
    }
    if (isArray) {
        var array_2 = [];
        data.forEach(function (d) {
            if (predicate) {
                propertyType = predicate(d);
            }
            if (!isSerializable(propertyType)) {
                array_2.push(castSimpleData(propertyType.name, d));
            }
            else {
                array_2.push(deserialize(d, propertyType));
            }
        });
        return array_2;
    }
    // Apply predicate after we know that it is not an array.
    propertyType = predicate ? predicate(data) : propertyType;
    var isSerializableProperty = isSerializable(propertyType);
    if (!isSerializableProperty) {
        return castSimpleData(propertyType.name, data);
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
function getJsonPropertyValue(key, typeName, jsonPropertyInput) {
    var metadata = new metadata_1.Metadata();
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
