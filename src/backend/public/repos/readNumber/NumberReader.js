"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Billion_1 = require("./Billion");
const Million_1 = require("./Million");
const Numbers_1 = require("./Numbers");
const Thousand_1 = require("./Thousand");
/**
 * A number reader in Vietnamese language helper
 */
class NumberReader {
    /**
     * Read a number in Vietnamese language
     * @param number the number to read
     * @return a string of the number is read in vietnamese
     */
    static read(number) {
        let s = '';
        if (typeof number === 'number') {
            s = number.toString();
        }
        else if (typeof number === 'string') {
            s = number;
        }
        const numberGroups = this.getGroupNumbers(s);
        const numbers = this.mapToNumbers(numberGroups);
        return this.readNumbers(numbers);
    }
    /**
     * Convert all {@link Numbers} objects to a string
     * @param numbers an array of {@link Numbers} objects
     * @return a {@link string} of the number is read in vietnamese
     */
    static readNumbers(numbers) {
        return numbers
            .reduce(function (result, group, index) {
            const beforeBillion = index + 1 < numbers.length && numbers[index + 1] instanceof Billion_1.default;
            return result.trim() + ' ' + group.read(index === 0, beforeBillion);
        }, '')
            .trim();
    }
    /**
     * Map all group numbers in {@link string} to {@link Numbers} objects
     * @param numberGroups group of numbers in string
     * @return an array of {@link Numbers}
     */
    static mapToNumbers(numberGroups) {
        const numbers = [];
        for (let i = numberGroups.length - 1, currentType = 0; i >= 0; i--) {
            numbers.unshift(this.getNumber(numberGroups[i], currentType++));
            currentType = currentType === 4 ? 1 : currentType;
        }
        return numbers;
    }
    /**
     * Generate a group of numbers from a string of number
     * @param s input string of number
     */
    static getGroupNumbers(s) {
        const numberGroups = [];
        const nGroup = Math.floor(s.length / 3);
        for (let i = 0; i < nGroup; i++) {
            numberGroups.unshift(s.substr(s.length - 3 - i * 3, 3));
        }
        if (s.length % 3 !== 0) {
            numberGroups.unshift(s.substr(0, s.length % 3));
        }
        return numberGroups;
    }
    /**
     * Map a number in string to a {@link Numbers} object
     * @param s input string to map
     * @param type type number of the {@link Numbers} object
     */
    static getNumber(s, type) {
        let number;
        switch (type) {
            case 0:
                number = new Numbers_1.default(s);
                break;
            case 1:
                number = new Thousand_1.default(s);
                break;
            case 2:
                number = new Million_1.default(s);
                break;
            case 3:
                number = new Billion_1.default(s);
                break;
        }
        return number;
    }
}
exports.default = NumberReader;
