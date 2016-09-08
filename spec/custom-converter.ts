import {expect} from 'chai';
import {deserialize, serialize, JsonProperty, ICustomConverter} from '../index';


const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return 'some-date';
    }
};

class Student {

    @JsonProperty('Name')
    name: string = undefined;

    @JsonProperty({customConverter: dateConverter})
    dateOfBirth: Date = undefined;

    constructor() {}
}


//TODO put in main test file where serialization is tested
describe('custom-converter', function () {

    it('should use the custom converter if available for deserialization', function () {
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

    it('should use the property name given in the meta data', function () {
        class ClassWithPrimitiveProp {
            @JsonProperty('theName')
            name: string = undefined;
        }
        const instance = new ClassWithPrimitiveProp();
        instance.name  = 'Jim';
        const serializedInstance = serialize(instance);
        expect(serializedInstance.theName).to.equal('Jim');
    });

    describe('primitive types', function () {

        const primitiveTypes = ['some-string', true, 25, new Number(25), new Boolean(true)];

        primitiveTypes.forEach((primitiveType) => {
            it(`should keep ${typeof primitiveType} as is`, function () {
                class PrimitiveProp {
                    @JsonProperty('someProp')
                    someProp = primitiveType;
                }
                const instance = new PrimitiveProp();
                // instance.someProp  = primitiveType;
                const serializedInstance = serialize(instance);
                expect(serializedInstance.someProp).to.equal(primitiveType);
            });
        });

    });

    it('should keep unspecified objects as is', function () {
        class ClassWithUnspecObject {
            @JsonProperty('date')
            date: Date = new Date();
        }
        const instance = new ClassWithUnspecObject();
        const serializedInstance = serialize(instance);
        expect(serializedInstance.date).to.equal(instance.date);
    });

    it('should use custom converter if available', function () {
        class ClassWithCustomConv {
            @JsonProperty({name: 'date', customConverter: dateConverter})
            date: Date = new Date();
        }
        const instance = new ClassWithCustomConv();
        const serializedInstance = serialize(instance);
        expect(serializedInstance.date).to.equal('some-date');
    });

    it('should exclude properties if specified', function () {
        class ClassWithExcludedProp {
            @JsonProperty('name')
            name: string = 'John';

            @JsonProperty({ name: 'lastName', excludeToJson: true})
            lastName: string = 'Doe';
        }
        const instance = new ClassWithExcludedProp();
        const serializedInstance = serialize(instance);
        expect(serializedInstance.name).to.equal('John');
        expect(serializedInstance.lastName).to.be.undefined;
    });

    it('should work recursively if clazz is specified in meta data', function () {
        class OtherClass {
            @JsonProperty({name: 'date', customConverter: dateConverter})
            date: Date = new Date();
        }
        class ClassWithClassProp {
            @JsonProperty({ name: 'other', clazz: OtherClass})
            other: OtherClass = new OtherClass();
        }
        const instance = new ClassWithClassProp();
        const serializedInstance = serialize(instance);
        expect(serializedInstance.other.date).to.equal('some-date');
    });

    //TODO test with Arrays

});