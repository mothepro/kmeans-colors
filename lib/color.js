// dependencies
var Color = require('color-js');

/**
 * Finds the distance to another color
 * @param color {Color}
 * @returns {number}
 */
Color().__proto__.distance = function (color) {
    // if(!(color instanceof Color))
    //     throw Error('Can only find distance to another color');

    return Math.sqrt(
        (this.getRed()   - color.getRed())   * (this.getRed()   - color.getRed())   +
        (this.getBlue()  - color.getBlue())  * (this.getBlue()  - color.getBlue())  +
        (this.getGreen() - color.getGreen()) * (this.getGreen() - color.getGreen())
    );
};

/**
 * Eye Sensitive distance
 * @link http://stackoverflow.com/a/1720559
 * @param color {Color}
 * @returns {number}
 */
Color().__proto__.eyeDistance = function (color) {
    // if(!(color instanceof Color))
    //     throw Error('Can only find distance to another color');

    return Math.sqrt(
        Math.pow(.3*this.getRed()   - .3*color.getRed(), 2)   +
        Math.pow(.59*this.getBlue()  - .59*color.getBlue(), 2)  +
        Math.pow(.11*this.getGreen() - .11*color.getGreen(), 2)
    );
};

/**
 * Generates a random color
 * @returns {Color}
 */
Color().__proto__.randomize = function() {
    return this
        .setHue(Math.random() * 360)
        .setSaturation(Math.random())
        .setLightness(Math.random())
        .setAlpha(1);
};

module.exports = Color;