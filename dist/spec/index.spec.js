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
var data_1 = require("./../examples/json/data");
var party_1 = require("./../examples/models/party");
var chai_1 = require("chai");
require("reflect-metadata");
var rewire = require("rewire");
var index_1 = require("../src/index");
var dummy_1 = require("../examples/models/dummy");
var panther_1 = require("../examples/models/panther");
var zoo_1 = require("../examples/models/zoo");
var data_2 = require("../examples/json/data");
var tjs = rewire('../src/index');
describe('Serializable', function () {
    it('should return false', function () {
        var hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', dummy_1.Dummy);
        chai_1.expect(hasMetadata).to.equal(false);
    });
    it('should return true without value', function () {
        var hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', zoo_1.Zoo);
        var metadata = Reflect.getOwnMetadata('api:map:serializable', zoo_1.Zoo);
        chai_1.expect(hasMetadata).to.equal(true);
        chai_1.expect(metadata).to.equal(undefined);
    });
    it('should return true with value', function () {
        var hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', panther_1.Panther);
        var metadata = Reflect.getOwnMetadata('api:map:serializable', panther_1.Panther);
        chai_1.expect(hasMetadata).to.equal(true);
        chai_1.expect(metadata).to.equal('Animal');
    });
});
describe('serialize', function () {
    it('should return true', function () {
        chai_1.expect(index_1.serialize(data_2.deserializedData)).to.deep.equal(data_2.data);
        chai_1.expect(index_1.serialize(data_1.deserializedPartyData)).to.deep.equal(data_2.partyData);
    });
    it('should return 1 childrenIdentifiers', function () {
        var result = index_1.serialize(data_2.deserializedData, false);
        var count = result.Animals.filter(function (animal) {
            return (animal.hasOwnProperty('childrenIdentifiers'));
        }).length;
        chai_1.expect(count).to.equal(1);
    });
    it('empty zoo should return an empty object', function () {
        var zoo = new zoo_1.Zoo();
        chai_1.expect(index_1.serialize(zoo)).to.deep.equal({});
    });
    it('{} should return an empty object', function () {
        chai_1.expect(index_1.serialize({})).to.deep.equal({});
    });
    var zooWithUndefinedValue = new zoo_1.Zoo();
    zooWithUndefinedValue.id = 4;
    zooWithUndefinedValue.name = undefined;
    it('zooWithUndefinedValue should return an object with undefined value', function () {
        chai_1.expect(index_1.serialize(zooWithUndefinedValue, false)).to.deep.equal({ id: 4, name: undefined });
    });
    it('zooWithUndefinedValue should return an object without undefined value', function () {
        chai_1.expect(index_1.serialize(zooWithUndefinedValue)).to.deep.equal({ id: 4 });
    });
});
describe('deserialize', function () {
    it('should return true', function () {
        chai_1.expect(index_1.deserialize(data_2.data, zoo_1.Zoo)).to.deep.equal(data_2.deserializedData);
        chai_1.expect(index_1.deserialize(data_2.partyData, party_1.Party)).to.deep.equal(data_1.deserializedPartyData);
    });
    it('should return true even if there are fake data included', function () {
        var alteredData = __assign({}, data_2.data);
        alteredData['fake'] = 'fake';
        alteredData['Animals'][0]['fake'] = 'fake';
        chai_1.expect(index_1.deserialize(alteredData, zoo_1.Zoo)).to.deep.equal(data_2.deserializedData);
        var alteredPartyData = __assign({}, data_2.partyData);
        alteredData['fake'] = 'fake';
        alteredData['Animals'][0]['fake'] = 'fake';
        chai_1.expect(index_1.deserialize(alteredPartyData, party_1.Party)).to.deep.equal(data_1.deserializedPartyData);
    });
    it('should return an empty zoo (except for the isOpen property)', function () {
        var badData = {
            fake: 'fake'
        };
        chai_1.expect(index_1.deserialize(badData, zoo_1.Zoo)).to.deep.equal({ isOpen: true });
    });
});
describe('castSimpleData', function () {
    var castSimpleData = tjs.__get__('castSimpleData');
    it('should return hello', function () {
        chai_1.expect(castSimpleData('string', 'hello')).to.equal('hello');
    });
    it('should return 4', function () {
        chai_1.expect(castSimpleData('number', 4)).to.equal(4);
    });
    it('should return false', function () {
        chai_1.expect(castSimpleData('boolean', false)).to.equal(false);
    });
    it('should return 4 as string', function () {
        chai_1.expect(castSimpleData('string', 4)).to.equal('4');
    });
    it('should return true as string', function () {
        chai_1.expect(castSimpleData('string', true)).to.equal('true');
    });
    it('should return 4', function () {
        chai_1.expect(castSimpleData('number', '4')).to.equal(4);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('number', 'hello')).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('boolean', 'hello')).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('boolean', 4)).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('date', 'hello')).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('date', true)).to.equal(undefined);
    });
    it('should return a date', function () {
        chai_1.expect(castSimpleData('date', 4)).to.deep.equal(new Date(4));
    });
    it('should return 2018-05-01T12:50:59.534Z', function () {
        chai_1.expect(castSimpleData('date', '2018-05-01T12:50:59.534Z')).to.deep.equal(new Date('2018-05-01T12:50:59.534Z'));
    });
});
describe('isSerializable', function () {
    var isSerializable = tjs.__get__('isSerializable');
    it('should return true', function () {
        chai_1.expect(isSerializable(zoo_1.Zoo)).to.equal(true);
    });
    it('should return false', function () {
        chai_1.expect(isSerializable(dummy_1.Dummy)).to.equal(false);
    });
});
describe('getJsonPropertyValue', function () {
    var getJsonPropertyValue = tjs.__get__('getJsonPropertyValue');
    it('should return name equals to key and type equals undefined', function () {
        chai_1.expect(getJsonPropertyValue('hello', 'Hello', { name: 'hello', type: undefined }))
            .include({ 'name': 'hello', 'type': undefined, 'typeName': 'Hello' });
    });
    it('should return name equals to args and type equals undefined', function () {
        chai_1.expect(getJsonPropertyValue('hello', 'Hello', {}))
            .include({ 'name': 'hello', 'type': undefined, 'typeName': 'Hello' });
    });
    it('should return name equals to key and type equals args["type"]', function () {
        chai_1.expect(getJsonPropertyValue('zoo', 'Zoo', { type: zoo_1.Zoo }))
            .include({ 'name': 'zoo', 'type': zoo_1.Zoo });
    });
    it('should return name equals to args["name"] and type equals args["type"]', function () {
        chai_1.expect(getJsonPropertyValue('zoo', 'Zoo', { name: 'myZoo', type: zoo_1.Zoo }))
            .include({ 'name': 'myZoo', 'type': zoo_1.Zoo, 'typeName': 'Zoo' });
    });
});
