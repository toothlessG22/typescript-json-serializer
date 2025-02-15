"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("./../../src");
var animal_1 = require("./animal");
var Panther = /** @class */ (function (_super) {
    __extends(Panther, _super);
    function Panther(isSpeckled, name) {
        var _this = _super.call(this, name) || this;
        _this.isSpeckled = isSpeckled;
        _this.name = name;
        return _this;
    }
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Panther.prototype, "color", void 0);
    Panther = __decorate([
        src_1.Serializable('Animal'),
        __param(0, src_1.JsonProperty()),
        __metadata("design:paramtypes", [Boolean, String])
    ], Panther);
    return Panther;
}(animal_1.Animal));
exports.Panther = Panther;
