"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numbers_1 = require("./Numbers");
/**
 * A group three numbers, this component will deal with three zero numbers
 */
class Zerofill extends Numbers_1.default {
    read(firstNumber, beforeBillion) {
        if (this.first !== '0' || this.second !== '0' || this.last !== '0') {
            return `${super.read(firstNumber)} ${this.unitName}`;
        }
        else {
            return '';
        }
    }
}
exports.default = Zerofill;
