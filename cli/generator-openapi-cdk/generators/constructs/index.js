const Generator = require('yeoman-generator');

/**
 * @type {OpenAPICDKGenerator}
 * @extends {Generator}
 */
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    hello() {
        this.log('Hello!')
    }
};