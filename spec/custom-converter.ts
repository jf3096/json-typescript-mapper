import {expect} from 'chai';
import {deserialize, JsonProperty} from '../index';

const dateConverter = function (date: any): any {
    return new Date(date);
};

class Student {
    @JsonProperty
    name: string = undefined;

    @JsonProperty({fromJson: dateConverter})
    dateOfBirth: Date = undefined;

    constructor() {}
}

describe('custom-converter', function () {
    it('simple json object', function () {
        let json = {
            "name": "Mark",
            "xing": "Galea",
            "age": 30,
            "AddressArr": [],
            "Address": null,
            dateOfBirth: "1995-11-10"
        };
        const student = deserialize(Student, json);
        expect(student.name).to.be.equals('Mark');
        expect(student.dateOfBirth).to.be.instanceof(Date);
    });


});
