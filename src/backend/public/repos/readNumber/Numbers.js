"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
/**
 * A group of three numbers, a component in the input number to read
 */
class Numbers {
    constructor(s) {
        this.first = '';
        this.second = '';
        this.last = '';
        if (s.length > 0) {
            this.last = s[s.length - 1];
        }
        if (s.length > 1) {
            this.second = s[s.length - 2];
        }
        if (s.length > 2) {
            this.first = s[s.length - 3];
        }
    }
    /**
     * If the current {@link Numbers} is the first and before a {@link Billion} number, "nghìn" will be suffixed.
     * @param s the current string of the {@link Numbers}
     * @param firstNumber indicate that this is the first {@link Numbers}
     * @param beforeBillion indicate that this {@link Numbers} is before a {@link Billion} number
     * @return the string after suffixing "nghìn"
     */
    static suffixFirstAndBeforeBillion(s, firstNumber, beforeBillion) {
        if (firstNumber && beforeBillion) {
            s += ' nghìn';
        }
        return s;
    }
    /**
     * Read three digits of {@link Numbers}
     * @param firstNumber indicate that this is the first {@link Numbers} or not
     * @param beforeBillion indicate that this group number stands before a {@link Billion} group or not
     * @return the number in string in Vietnamese way
     */
    read(firstNumber, beforeBillion) {
        let s = '';
        if (this.isThreeZero()) {
            if (firstNumber) {
                return 'không';
            }
            return '';
        }
        s = this.readFirstNumber(s, firstNumber);
        if (!this.isLastTwoZero()) {
            s = this.readSecondNumber(s);
            s = this.readLastNumber(s);
        }
        s = Numbers.suffixFirstAndBeforeBillion(s, firstNumber, beforeBillion);
        return s.trim();
    }
    /**
     * Indicate that whether the last two digits ({@link second) and {@link last}} of the {@link Numbers} are zero or not
     */
    isLastTwoZero() {
        return this.second === '0' && this.last === '0';
    }
    /**
     * Indicate that whether all three digits of the {@link Numbers} are zero or not
     */
    isThreeZero() {
        return this.first === '0' && this.second === '0' && this.last === '0';
    }
    /**
     * Read the first number of three digits of the {@link Numbers}
     * @param s the input number in string after read second number
     * @return the result after adding last number
     */
    readLastNumber(s) {
        if (this.second) {
            s = this.readLastAfterSecond(s);
        }
        else {
            s += ` ${Utils_1.getNumberFromMap(this.last)}`;
        }
        return s;
    }
    /**
     * Read the last number when second number is existed
     * @param s the number to read
     * @return the last number in string
     */
    readLastAfterSecond(s) {
        if (this.last === '1' && this.second !== '0' && this.second !== '1') {
            s += ' mốt';
        }
        else if (this.last === '5') {
            s += ' lăm';
        }
        else if (this.last !== '0') {
            s += ` ${Utils_1.getNumberFromMap(this.last)}`;
        }
        return s;
    }
    /**
     * Read the second number of three digits of the {@link Numbers}
     * @param s the input number in string after read first number
     * @return the result after adding second number
     */
    readSecondNumber(s) {
        if (this.second === '0') {
            s += ' lẻ';
        }
        else if (this.second === '1') {
            s += ' mười';
        }
        else if (this.second) {
            s += ` ${Utils_1.getNumberFromMap(this.second)} mươi`;
        }
        return s;
    }
    /**
     * Read the last number of three digits of the {@link Numbers}
     * @param s the input number in string
     * @param firstNumber indicate that whether this is the first {@link Numbers} or not
     * @return the result after adding first number
     */
    readFirstNumber(s, firstNumber) {
        if (this.first) {
            s = `${Utils_1.getNumberFromMap(this.first)} trăm`;
        }
        return s;
    }
}
exports.default = Numbers;
