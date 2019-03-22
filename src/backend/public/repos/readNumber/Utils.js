"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberMap = {
    '0': 'không',
    '1': 'một',
    '2': 'hai',
    '3': 'ba',
    '4': 'bốn',
    '5': 'năm',
    '6': 'sáu',
    '7': 'bảy',
    '8': 'tám',
    '9': 'chín'
};
class NotNumberError extends Error {
    constructor(wrongNumber) {
        const message = `Invalid number: ${wrongNumber}`;
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.NotNumberError = NotNumberError;
function getNumberFromMap(number) {
    if (NumberMap.hasOwnProperty(number)) {
        return NumberMap[number];
    }
    else {
        throw new NotNumberError(number);
    }
}
exports.getNumberFromMap = getNumberFromMap;
