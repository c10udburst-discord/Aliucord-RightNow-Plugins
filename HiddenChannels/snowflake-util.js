// source: https://github.com/CesiumLabs/node-snowflake-util/blob/master/index.js

/**
 * A Twitter like snowflake
 * ```
 * If we have a snowflake '266241948824764416' we can represent it as binary:
 *
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *       number of ms since epoch               worker  pid    increment
 * ```
 * @typedef {string} Snowflake
 */

/**
 * A deconstructed snowflake.
 * @typedef {Object} DeconstructedSnowflake
 * @property {number} timestamp Timestamp the snowflake was created
 * @property {Date} date Date the snowflake was created
 * @property {number} workerID Worker ID in the snowflake
 * @property {number} processID Process ID in the snowflake
 * @property {number} increment Increment in the snowflake
 * @property {string} binary Binary representation of the snowflake
 * @property {Snowflake} snowflake Snowflake
 */

/**
 * Snowflake Utility Class
 */
export class SnowflakeUtil {

    /**
     * Snowflake Util Constructor
     * @param {object} options Constructor options
     * @param {Date|number} [options.epoch] Epoch timestamp
     * @param {number} [options.increment] Number of increment
     * @example const Snowflake = require("snowflake-util");
     * const snowflake = new Snowflake();
     * 
     * const generated = snowflake.generate();
     * const deconstructed = snowflake.deconstruct(generated);
     * 
     * console.log(generated);
     * console.log(deconstructed);
     */
    constructor({ epoch, increment } = {}) {
        /**
         * Epoch timestamp
         * @type {number}
         */
        this.EPOCH = !epoch ? 1420070400000 : epoch instanceof Date ? epoch.getTime() : 1420070400000;

        /**
         * Increment
         * @type {number}
         */
        this.INCREMENT = increment && typeof increment === "number" ? increment : 0;
    }

    /**
     * Generates random Snowflake.
     * **This hardcodes the worker ID as 1 and the process ID as 0.**
     * @param {number|Date} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
     * @returns {Snowflake} The generated snowflake
     */
    generate(timestamp = Date.now()) {
        if (timestamp instanceof Date) timestamp = timestamp.getTime();
        if (typeof timestamp !== "number" || isNaN(timestamp)) {
            throw new TypeError(`"timestamp" argument must be a number (received ${isNaN(timestamp) ? "NaN" : typeof timestamp})`);
        }
        if (this.INCREMENT >= 4095) this.INCREMENT = 0;
        const BINARY = `${(timestamp - this.EPOCH).toString(2).padStart(42, "0")}0000100000${(this.INCREMENT++)
            .toString(2)
            .padStart(12, "0")}`;
        return this.fromBinary(BINARY);
    }

    /**
     * Deconstructs a Discord snowflake.
     * @param {Snowflake} snowflake Snowflake to deconstruct
     * @returns {DeconstructedSnowflake} Deconstructed snowflake
     */
    deconstruct(snowflake) {
        if (snowflake === "0") return {
            epoch: this.EPOCH,
            timestamp: this.EPOCH,
            workerID: 0,
            processID: 0,
            increment: 0,
            binary: "0".repeat(64),
            date: new Date(this.EPOCH),
            snowflake: snowflake
        };

        const BINARY = this.toBinary(snowflake).toString(2).padStart(64, "0");
        const res = {
            epoch: this.EPOCH,
            timestamp: parseInt(BINARY.substring(0, 42), 2) + this.EPOCH,
            workerID: parseInt(BINARY.substring(42, 47), 2),
            processID: parseInt(BINARY.substring(47, 52), 2),
            increment: parseInt(BINARY.substring(52, 64), 2),
            binary: BINARY
        };

        return {
            ...res,
            date: new Date(res.timestamp),
            snowflake: snowflake
        };
    }

    /**
     * Transforms a snowflake from a decimal string to a bit string.
     * @param {string} num Snowflake to be transformed
     * @returns {Snowflake}
     * @private
     */
    fromBinary(num) {
        let dec = "";

        while (num.length > 50) {
            const high = parseInt(num.slice(0, -32), 2);
            const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

            dec = (low % 10).toString() + dec;
            num =
                Math.floor(high / 10).toString(2) +
                Math.floor(low / 10)
                .toString(2)
                .padStart(32, "0");
        }

        num = parseInt(num, 2);
        while (num > 0) {
            dec = (num % 10).toString() + dec;
            num = Math.floor(num / 10);
        }

        if (!dec) throw new Error("Invalid Snowflake");

        return dec;
    }

    /**
     * Transforms a snowflake from a bit string to a decimal string.
     * @param  {string} num Bit string to be transformed
     * @returns {Snowflake}
     * @private
     */
    toBinary(num) {
        let bin = "";
        let high = parseInt(num.slice(0, -10)) || 0;
        let low = parseInt(num.slice(-10));
        while (low > 0 || high > 0) {
        bin = String(low & 1) + bin;
        low = Math.floor(low / 2);
            if (high > 0) {
                low += 5000000000 * (high % 2);
                high = Math.floor(high / 2);
            }
        }

        if (!bin) throw new Error("Invalid snowflake");

        return bin;
    }

    /**
     * Converts a snowflake into **Base64** 
     * @param {Snowflake} snowflake a Snowflake
     * @returns {string}
     */
    toBase64(snowflake) {
        if (!snowflake || typeof snowflake !== "string") throw new Error(`The parameter "snowflake" must be a string, received ${typeof snowflake}!`);
        
        // validate snowflake
        this.deconstruct(snowflake);

        return Buffer.from(snowflake).toString("base64");
    }

    /**
     * Converts Base64 encoded Snowflake to deconstructed snowflake object
     * @param {string} base64Snowflake Base64 encoded Snowflake
     * @returns {DeconstructedSnowflake}
     */
    fromBase64(base64Snowflake) {
        if (!base64Snowflake || typeof base64Snowflake !== "string") throw new Error(`The parameter "base64Snowflake" must be a string, received ${typeof base64Snowflake}!`);
        const des = Buffer.from(base64Snowflake, "base64").toString();
        const deconstructed = this.deconstruct(des);
        
        return {
            ...deconstructed,
            snowflake: des
        };
    }

}
