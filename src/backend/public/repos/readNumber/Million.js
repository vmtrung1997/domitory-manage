"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Zerofill_1 = require("./Zerofill");
/**
 * A group three numbers, a component in million position of the input number
 */
class MillionNumber extends Zerofill_1.default {
    get unitName() {
        return 'triệu';
    }
}
exports.default = MillionNumber;
