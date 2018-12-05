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
var chai_1 = require("chai");
var index_1 = require("../index");
var dateconverter_1 = require("./common/dateconverter");
describe('serialize', function () {
    it('should use the property name given in the meta data', function () {
        var ClassWithPrimitiveProp = /** @class */ (function () {
            function ClassWithPrimitiveProp() {
                this.name = undefined;
            }
            __decorate([
                index_1.JsonProperty('theName'),
                __metadata("design:type", String)
            ], ClassWithPrimitiveProp.prototype, "name", void 0);
            return ClassWithPrimitiveProp;
        }());
        var instance = new ClassWithPrimitiveProp();
        instance.name = 'Jim';
        var serializedInstance = index_1.serialize(instance);
        chai_1.expect(serializedInstance.theName).to.equal('Jim');
    });
    describe('primitive types', function () {
        var primitiveTypes = ['some-string', true, 25, new Number(25), new Boolean(true)];
        primitiveTypes.forEach(function (primitiveType) {
            it("should keep " + typeof primitiveType + " as is", function () {
                var PrimitiveProp = /** @class */ (function () {
                    function PrimitiveProp() {
                        this.someProp = primitiveType;
                    }
                    __decorate([
                        index_1.JsonProperty('someProp'),
                        __metadata("design:type", Object)
                    ], PrimitiveProp.prototype, "someProp", void 0);
                    return PrimitiveProp;
                }());
                var instance = new PrimitiveProp();
                // instance.someProp  = primitiveType;
                var serializedInstance = index_1.serialize(instance);
                chai_1.expect(serializedInstance.someProp).to.equal(primitiveType);
            });
        });
    });
    it('should keep unspecified objects as is', function () {
        var ClassWithUnspecObject = /** @class */ (function () {
            function ClassWithUnspecObject() {
                this.date = new Date();
            }
            __decorate([
                index_1.JsonProperty('date'),
                __metadata("design:type", Date)
            ], ClassWithUnspecObject.prototype, "date", void 0);
            return ClassWithUnspecObject;
        }());
        var instance = new ClassWithUnspecObject();
        var serializedInstance = index_1.serialize(instance);
        chai_1.expect(serializedInstance.date).to.equal(instance.date);
    });
    it('should use custom converter if available', function () {
        var ClassWithCustomConv = /** @class */ (function () {
            function ClassWithCustomConv() {
                this.date = new Date();
            }
            __decorate([
                index_1.JsonProperty({ name: 'date', customConverter: dateconverter_1.default }),
                __metadata("design:type", Date)
            ], ClassWithCustomConv.prototype, "date", void 0);
            return ClassWithCustomConv;
        }());
        var instance = new ClassWithCustomConv();
        var serializedInstance = index_1.serialize(instance);
        chai_1.expect(serializedInstance.date).to.equal('some-date');
    });
    it('should exclude properties if specified', function () {
        var ClassWithExcludedProp = /** @class */ (function () {
            function ClassWithExcludedProp() {
                this.name = 'John';
                this.lastName = 'Doe';
            }
            __decorate([
                index_1.JsonProperty('name'),
                __metadata("design:type", String)
            ], ClassWithExcludedProp.prototype, "name", void 0);
            __decorate([
                index_1.JsonProperty({ name: 'lastName', excludeToJson: true }),
                __metadata("design:type", String)
            ], ClassWithExcludedProp.prototype, "lastName", void 0);
            return ClassWithExcludedProp;
        }());
        var instance = new ClassWithExcludedProp();
        var serializedInstance = index_1.serialize(instance);
        chai_1.expect(serializedInstance.name).to.equal('John');
        chai_1.expect(serializedInstance.lastName).to.be.undefined;
    });
    it('should work recursively if clazz is specified in meta data', function () {
        var OtherClass = /** @class */ (function () {
            function OtherClass() {
                this.date = new Date();
            }
            __decorate([
                index_1.JsonProperty({ name: 'date', customConverter: dateconverter_1.default }),
                __metadata("design:type", Date)
            ], OtherClass.prototype, "date", void 0);
            return OtherClass;
        }());
        var ClassWithClassProp = /** @class */ (function () {
            function ClassWithClassProp() {
                this.other = new OtherClass();
            }
            __decorate([
                index_1.JsonProperty({ name: 'other', clazz: OtherClass }),
                __metadata("design:type", OtherClass)
            ], ClassWithClassProp.prototype, "other", void 0);
            return ClassWithClassProp;
        }());
        var instance = new ClassWithClassProp();
        var serializedInstance = index_1.serialize(instance);
        chai_1.expect(serializedInstance.other.date).to.equal('some-date');
    });
    describe('Arrays', function () {
        it('should keep as is if no clazz is specified', function () {
            var ClassWithArrayProp = /** @class */ (function () {
                function ClassWithArrayProp() {
                    this.items = [new Date(), new Date()];
                }
                __decorate([
                    index_1.JsonProperty('items'),
                    __metadata("design:type", Array)
                ], ClassWithArrayProp.prototype, "items", void 0);
                return ClassWithArrayProp;
            }());
            var instance = new ClassWithArrayProp();
            var serializedInstance = index_1.serialize(instance);
            chai_1.expect(serializedInstance.items).to.be.instanceof(Array);
            chai_1.expect(serializedInstance.items.length).to.equal(2);
            chai_1.expect(serializedInstance.items[0]).to.equal(instance.items[0]);
            chai_1.expect(serializedInstance.items[1]).to.equal(instance.items[1]);
        });
        it('should apply serialize for all array items if clazz is specified', function () {
            var OtherClass = /** @class */ (function () {
                function OtherClass() {
                    this.date = new Date();
                }
                __decorate([
                    index_1.JsonProperty({ name: 'date', customConverter: dateconverter_1.default }),
                    __metadata("design:type", Date)
                ], OtherClass.prototype, "date", void 0);
                return OtherClass;
            }());
            var ClassWithArrayProp = /** @class */ (function () {
                function ClassWithArrayProp() {
                    this.items = [new OtherClass(), new OtherClass()];
                }
                __decorate([
                    index_1.JsonProperty({ name: 'items', clazz: OtherClass }),
                    __metadata("design:type", Array)
                ], ClassWithArrayProp.prototype, "items", void 0);
                return ClassWithArrayProp;
            }());
            var instance = new ClassWithArrayProp();
            var serializedInstance = index_1.serialize(instance);
            chai_1.expect(serializedInstance.items).to.be.instanceof(Array);
            chai_1.expect(serializedInstance.items.length).to.equal(2);
            chai_1.expect(serializedInstance.items[0].date).to.equal('some-date');
            chai_1.expect(serializedInstance.items[1].date).to.equal('some-date');
        });
    });
});
//# sourceMappingURL=serialize.js.map