"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var panther_1 = require("./panther");
var src_1 = require("./../../src");
var gender_1 = require("./gender");
var status_1 = require("./status");
var nameDeserializationHandler = function (parent, metadata, keyOptions) {
    if (parent instanceof panther_1.Panther) {
        if (keyOptions.includes('5StarRating')) {
            return '5StarRating';
        }
    }
    return metadata.name;
};
var nameSerializationHandler = function (parent, metadata) {
    if (parent instanceof panther_1.Panther) {
        return '5StarRating';
    }
    return metadata.name;
};
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
    }
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Animal.prototype, "id", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Animal.prototype, "name", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Date)
    ], Animal.prototype, "birthDate", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Animal.prototype, "numberOfPaws", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Animal.prototype, "gender", void 0);
    __decorate([
        src_1.JsonProperty({ name: 'childrenIdentifiers' }),
        __metadata("design:type", Array)
    ], Animal.prototype, "childrenIds", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Animal.prototype, "status", void 0);
    __decorate([
        src_1.JsonProperty({
            name: 'rating',
            dataDeserializationHandlers: [
                function (data) { return data * 2; },
                function (data) { return data + 1; }
            ],
            dataSerializationHandlers: [
                function (data) { return data - 1; },
                function (data) { return data / 2; }
            ],
            nameDeserializationHandlers: [nameDeserializationHandler],
            nameSerializationHandlers: [nameSerializationHandler]
        }),
        __metadata("design:type", Number)
    ], Animal.prototype, "rating", void 0);
    Animal = __decorate([
        src_1.Serializable(),
        __metadata("design:paramtypes", [String])
    ], Animal);
    return Animal;
}());
exports.Animal = Animal;
