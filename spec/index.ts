import {expect} from 'chai';
import {deserialize, JsonProperty} from '../index';

class Student {
    @JsonProperty('name')
    fullName:string;

    constructor() {
        this.fullName = undefined;
    }
}

class Address {
    @JsonProperty('first-line')
    firstLine:string;
    @JsonProperty('second-line')
    secondLine:string;
    @JsonProperty({clazz: Student})
    student:Student;
    city:string;

    constructor() {
        this.firstLine = undefined;
        this.secondLine = undefined;
        this.city = undefined;
        this.student = undefined
    }
}


class Person {
    @JsonProperty('Name')
    name:string;
    @JsonProperty('xing')
    surname:string;
    age:number;
    @JsonProperty({clazz: Address, name: 'AddressArr'})
    addressArr:Address[];
    @JsonProperty({clazz: Address, name: 'Address'})
    address:Address;

    constructor() {
        this.name = undefined;
        this.surname = undefined;
        this.age = undefined;
        this.addressArr = undefined;
        this.address = undefined;
    }
}

describe('index()', function () {
    it('simple json object #1', function () {
        let json = {
            "Name": "Mark",
            "xing": "Galea",
            "age": 30,
            "AddressArr": [],
            "Address": null
        };
        const person = deserialize(Person, json);
        expect(person.address).to.be.equals(null);
        expect(person.name).to.be.equal("Mark");
        expect(person.surname).to.be.equal("Galea");
        expect(person.addressArr).to.be.empty;
    });

    it('simple json object #2', function () {
        let addressjson = {
            "first-line": "Some where",
            "second-line": "Over Here",
            "city": "In This City",
            "student": {
                name: "Ailun"
            }
        };
        const address = deserialize(Address, addressjson);
        expect(address.firstLine).to.be.equal("Some where");
        expect(address.secondLine).to.be.equal("Over Here");
        expect(address.city).to.be.equal("In This City");
        expect(address.student).to.be.an('object');
        expect(address.student.fullName).to.be.equal('Ailun');
    });

    it('complex json object #1', function () {
        let json = {
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
        const person = deserialize(Person, json);
        expect(person.address).to.be.an.instanceOf(Address);
        expect(person.age).to.be.a('number');
        expect(person.name).to.be.a('string');
        expect(person.address).to.be.an('object');
        expect(person.addressArr.length).to.be.equals(2);
        expect(person.address.student.fullName).to.be.equals('Ailun');
    });

    it('empty json object #1', function () {
        let json = {};
        const person = deserialize(Person, json);
        console.log(person);
        expect(person.address).to.be.equal(undefined);
        expect(person.name).to.be.equal(undefined);
        expect(person.surname).to.be.equal(undefined);
        expect(person.addressArr).to.be.equal(undefined);
    });

    it('empty json object #2', function () {
        let json = null;
        const person = deserialize(Person, json);
        expect(person).to.be.equals(null);
    });

    it('empty json object #3', function () {
        let json = undefined;
        const person = deserialize(Person, json);
        expect(person).to.be.equals(null);
    });

    it('invalid primitive value #1', function () {
        let json = 123;
        const person = deserialize(Person, json);
        console.log(person);
        expect(person).to.be.equals(null);
    });

    it('invalid primitive value #2', function () {
        let json = '';
        const person = deserialize(Person, json);
        expect(person).to.be.equals(null);
    });

    it('invalid primitive value #3', function () {
        let json = NaN;
        const person = deserialize(Person, json);
        expect(person).to.be.equals(null);
    });

    it('invalid json object #1', function () {
        let json = {
            "NameTest": "Mark",
        };
        const person = deserialize(Person, json);
        expect(person.name).to.be.equals(undefined);
    });
});
