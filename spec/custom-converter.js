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
var chai_1 = require('chai');
var index_1 = require('../index');
var dateConverter = {
    fromJson: function (data) {
        return new Date(data);
    },
    toJson: function (data) {
        return data;
    }
};
var Student = (function () {
    function Student() {
        this.name = undefined;
        this.dateOfBirth = undefined;
    }
    __decorate([
        index_1.JsonProperty('Name'), 
        __metadata('design:type', String)
    ], Student.prototype, "name", void 0);
    __decorate([
        index_1.JsonProperty({ customConverter: dateConverter }), 
        __metadata('design:type', Date)
    ], Student.prototype, "dateOfBirth", void 0);
    return Student;
}());
describe('custom-converter', function () {
    it('simple json object', function () {
        var json = {
            "Name": "Mark",
            dateOfBirth: "1995-11-10"
        };
        var student = index_1.deserialize(Student, json);
        chai_1.expect(student.name).to.be.equals('Mark');
        chai_1.expect(student.dateOfBirth).to.be.instanceof(Date);
    });
});
describe('serialize', function () {
    it('simple json object', function () {
        var student = new Student();
        student.name = 'Jim';
        student.dateOfBirth = new Date('1995-11-12');
        var studentSerialize = index_1.serialize(student);
        chai_1.expect(studentSerialize.Name).to.be.equals('Jim');
        chai_1.expect(studentSerialize.dateOfBirth).to.be.instanceof(Date);
    });
    //TODO test prop name conversion
    //TODO test custom converter
    //TODO test exclude
    //TODO test noConversion
    //TODO test deep serialization
});
//# sourceMappingURL=custom-converter.js.map