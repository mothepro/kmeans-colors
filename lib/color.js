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

module.exports = Color;