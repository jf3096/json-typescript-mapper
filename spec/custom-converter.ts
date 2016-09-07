import {expect} from 'chai';
import {deserialize, serialize, JsonProperty, ICustomConverter} from '../index';


const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return data;
    }
};

class Student {

    @JsonProperty('Name')
    name: string = undefined;

    @JsonProperty({customConverter: dateConverter})
    dateOfBirth: Date = undefined;

    constructor() {}
}

describe('custom-converter', function () {

    it('simple json object', function () {
        const json = {
            "Name": "Mark",
            dateOfBirth: "1995-11-10"
        };
        const student = deserialize(Student, json);
        expect(student.name).to.be.equals('Mark');
        expect(student.dateOfBirth).to.be.instanceof(Date);
    });

});


describe('serialize', function () {

    it('simple json object', function () {
        const student = new Student();
        student.name  = 'Jim';
        student.dateOfBirth = new Date('1995-11-12');
        const studentSerialize = serialize(student);
        expect(studentSerialize.Name).to.be.equals('Jim');
        expect(studentSerialize.dateOfBirth).to.be.instanceof(Date);
    });

    //TODO test prop name conversion

    //TODO test custom converter

    //TODO test exclude

    //TODO test noConversion

    //TODO test deep serialization

});