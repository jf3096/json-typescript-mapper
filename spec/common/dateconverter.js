"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateConverter = {
    fromJson: function (data) {
        return new Date(data);
    },
    toJson: function (data) {
        return 'some-date';
    }
};
exports.default = dateConverter;
//# sourceMappingURL=dateconverter.js.map