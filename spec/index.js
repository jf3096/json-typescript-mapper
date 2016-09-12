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
var dateconverter_1 = require('./common/dateconverter');
var Student = (function () {
    function Student() {
        this.dateOfBirth = undefined;
        this.fullName = void 0;
    }
    __decorate([
        index_1.JsonProperty('name'), 
        __metadata('design:type', String)
    ], Student.prototype, "fullName", void 0);
    __decorate([
        index_1.JsonProperty({ name: 'dob', customConverter: dateconverter_1.default }), 
        __metadata('design:type', Date)
    ], Student.prototype, "dateOfBirth", void 0);
    return Student;
}());
var Address = (function () {
    function Address() {
        this.firstLine = void 0;
        this.secondLine = void 0;
        this.city = void 0;
        this.student = void 0;
    }
    __decorate([
        index_1.JsonProperty('first-line'), 
        __metadata('design:type', String)
    ], Address.prototype, "firstLine", void 0);
    __decorate([
        index_1.JsonProperty('second-line'), 
        __metadata('design:type', String)
    ], Address.prototype, "secondLine", void 0);
    __decorate([
        index_1.JsonProperty({ clazz: Student }), 
        __metadata('design:type', Student)
    ], Address.prototype, "student", void 0);
    return Address;
}());
var Person = (function () {
    function Person() {
        this.name = void 0;
        this.surname = void 0;
        this.age = void 0;
        this.addressArr = void 0;
        this.address = void 0;
    }
    __decorate([
        index_1.JsonProperty('Name'), 
        __metadata('design:type', String)
    ], Person.prototype, "name", void 0);
    __decorate([
        index_1.JsonProperty('xing'), 
        __metadata('design:type', String)
    ], Person.prototype, "surname", void 0);
    __decorate([
        index_1.JsonProperty({ clazz: Address, name: 'AddressArr' }), 
        __metadata('design:type', Array)
    ], Person.prototype, "addressArr", void 0);
    __decorate([
        index_1.JsonProperty({ clazz: Address, name: 'Address' }), 
        __metadata('design:type', Address)
    ], Person.prototype, "address", void 0);
    return Person;
}());
describe('index()', function () {
    it('simple json object #1', function () {
        var json = {
            "Name": "Mark",
            "xing": "Galea",
            "age": 30,
            "AddressArr": [],
            "Address": null
        };
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person.address).to.be.equals(void 0);
        chai_1.expect(person.name).to.be.equal("Mark");
        chai_1.expect(person.surname).to.be.equal("Galea");
        chai_1.expect(person.addressArr).to.be.empty;
    });
    it('simple json object #2', function () {
        var addressjson = {
            "first-line": "Some where",
            "second-line": "Over Here",
            "city": "In This City",
            "student": {
                name: "Ailun"
            }
        };
        var address = index_1.deserialize(Address, addressjson);
        chai_1.expect(address.firstLine).to.be.equal("Some where");
        chai_1.expect(address.secondLine).to.be.equal("Over Here");
        chai_1.expect(address.city).to.be.equal("In This City");
        chai_1.expect(address.student).to.be.an('object');
        chai_1.expect(address.student.fullName).to.be.equal('Ailun');
    });
    it('complex json object #1', function () {
        var json = {
            "Name": "Mark",
            "xing": "Galea",
            "age": 30,
            "AddressArr": [
                {
                    "first-line": "Some where",
                    "second-line": "Over Here",
                    "city": "In This City",
                    "student": {
                        name1: "Ailun"
                    }
                },
                {
                    "first-line": "Some where",
                    "second-line": "Over Here",
                    "city": "In This City",
                    "student": {
                        name1: "Ailun"
                    }
                }
            ],
            "Address": {
                "first-line": "Some where",
                "second-line": "Over Here",
                "city": "In This City",
                "student": {
                    name: "Ailun"
                }
            }
        };
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person.address).to.be.an.instanceOf(Address);
        chai_1.expect(person.age).to.be.a('number');
        chai_1.expect(person.name).to.be.a('string');
        chai_1.expect(person.address).to.be.an('object');
        chai_1.expect(person.addressArr.length).to.be.equals(2);
        chai_1.expect(person.address.student.fullName).to.be.equals('Ailun');
    });
    it('empty json object #1', function () {
        var json = {};
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person.address).to.be.equal(void 0);
        chai_1.expect(person.name).to.be.equal(void 0);
        chai_1.expect(person.surname).to.be.equal(void 0);
        chai_1.expect(person.addressArr).to.be.equal(void 0);
    });
    it('empty json object #2', function () {
        var json = null;
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person).to.be.equals(void 0);
    });
    it('empty json object #3', function () {
        var json = void 0;
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person).to.be.equals(void 0);
    });
    it('invalid primitive value #1', function () {
        var json = 123;
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person).to.be.equals(void 0);
    });
    it('invalid primitive value #2', function () {
        var json = '';
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person).to.be.equals(void 0);
    });
    it('invalid primitive value #3', function () {
        var json = NaN;
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person).to.be.equals(void 0);
    });
    it('invalid json object #1', function () {
        var json = {
            "NameTest": "Mark",
        };
        var person = index_1.deserialize(Person, json);
        chai_1.expect(person.name).to.be.equals(void 0);
    });
    it('should use a custom converter if available', function () {
        var json = {
            "name": "John Doe",
            dob: "1995-11-10"
        };
        var student = index_1.deserialize(Student, json);
        chai_1.expect(student.fullName).to.be.equals('John Doe');
        chai_1.expect(student.dateOfBirth).to.be.instanceof(Date);
        chai_1.expect(student.dateOfBirth.toString()).to.equal(new Date("1995-11-10").toString());
    });
});
//# sourceMappingURL=index.js.map