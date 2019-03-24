"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numbers_1 = require("./Numbers");
/**
 * A group three numbers, a component in billion position of the input number
 */
class Billion extends Numbers_1.default {
    read(firstNumber, beforeBillion) {
        return `${super.read(firstNumber)} tỷ`.trim();
    }
}
exports.default = Billion;
