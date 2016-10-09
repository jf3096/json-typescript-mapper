import {expect} from 'chai';
import {deserialize, JsonProperty} from '../index';
import dateConverter from './common/dateconverter'

class Student {
    @JsonProperty('name')
    fullName: string;

    @JsonProperty({name: 'dob', customConverter: dateConverter})
    dateOfBirth: Date = undefined;

    constructor() {
        this.fullName = void 0;
    }
}

class Address {
    @JsonProperty('first-line')
    firstLine: string;
    @JsonProperty('second-line')
    secondLine: string;
    @JsonProperty({clazz: Student})
    student: Student;
    city: string;

    constructor() {
        this.firstLine = void 0;
        this.secondLine = void 0;
        this.city = void 0;
        this.student = void 0
    }
}


class Person {
    @JsonProperty('Name')
    name: string;
    @JsonProperty('xing')
    surname: string;
    age: number;
    @JsonProperty({clazz: Address, name: 'AddressArr'})
    addressArr: Address[];
    @JsonProperty({clazz: Address, name: 'Address'})
    address: Address;

    constructor() {
        this.name = void 0;
        this.surname = void 0;
        this.age = void 0;
        this.addressArr = void 0;
        this.address = void 0;
    }
}

describe('index()', function () {
    it('simple json object #1', function () {
        let json = {
            "Name": "Mark",
            "xing": "Galea",
            "age": 30,
            "AddressArr": [] as Array<any>,
            "Address": null as any
        };
        const person = deserialize(Person, json);
        expect(person.address).to.be.equals(void 0);
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
        expect(person.address).to.be.equal(void 0);
        expect(person.name).to.be.equal(void 0);
        expect(person.surname).to.be.equal(void 0);
        expect(person.addressArr).to.be.equal(void 0);
    });

    it('empty json object #2', function () {
        let json: any = null;
        const person = deserialize(Person, json);
        expect(person).to.be.equals(void 0);
    });

    it('empty json object #3', function () {
        let json: any = void 0;
        const person = deserialize(Person, json);
        expect(person).to.be.equals(void 0);
    });

    it('invalid primitive value #1', function () {
        let json = 123;
        const person = deserialize(Person, json as any);
        expect(person).to.be.equals(void 0);
    });

    it('invalid primitive value #2', function () {
        let json = '';
        const person = deserialize(Person, json as any);
        expect(person).to.be.equals(void 0);
    });

    it('invalid primitive value #3', function () {
        let json = NaN;
        const person = deserialize(Person, json as any);
        expect(person).to.be.equals(void 0);
    });

    it('invalid json object #1', function () {
        let json = {
            "NameTest": "Mark",
        };
        const person = deserialize(Person, json);
        expect(person.name).to.be.equals(void 0);
    });

    it('should use a custom converter if available', function () {
        const json = {
            "name": "John Doe",
            dob: "1995-11-10"
        };
        const student = deserialize(Student, json);
        expect(student.fullName).to.be.equals('John Doe');
        expect(student.dateOfBirth).to.be.instanceof(Date);
        expect(student.dateOfBirth.toString()).to.equal(new Date("1995-11-10").toString());
    });
});
