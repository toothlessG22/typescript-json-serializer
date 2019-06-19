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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("./../../src");
var gender_1 = require("./gender");
var Employee = /** @class */ (function () {
    function Employee(name, gender, birthDate) {
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
    }
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", Number)
    ], Employee.prototype, "id", void 0);
    __decorate([
        src_1.JsonProperty(),
        __metadata("design:type", String)
    ], Employee.prototype, "email", void 0);
    Employee = __decorate([
        src_1.Serializable(),
        __param(0, src_1.JsonProperty()),
        __param(1, src_1.JsonProperty()),
        __param(2, src_1.JsonProperty()),
        __metadata("design:paramtypes", [String, Number, Date])
    ], Employee);
    return Employee;
}());
exports.Employee = Employee;
