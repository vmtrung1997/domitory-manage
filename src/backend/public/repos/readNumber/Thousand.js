"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Zerofill_1 = require("./Zerofill");
/**
 * A group three numbers, a component in thousand position of the input number
 */
class Thousand extends Zerofill_1.default {
    get unitName() {
        return 'nghìn';
    }
}
exports.default = Thousand;
