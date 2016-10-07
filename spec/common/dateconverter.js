"use strict";
var dateConverter = {
    fromJson: function (data) {
        return new Date(data);
    },
    toJson: function (data) {
        return 'some-date';
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dateConverter;
//# sourceMappingURL=dateconverter.js.map