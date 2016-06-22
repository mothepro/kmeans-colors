// dependencies
var Color = require('color-js');

/**
 * Finds the distance to another color
 * @param color {Color}
 * @returns {number}
 */
Color.prototype.distance = function (color) {
    // if(!(color instanceof Color))
    //     throw Error('Can only find distance to another color');

    return Math.sqrt(
        Math.square(this.getRed()   - color.getRed())  +
        Math.square(this.getBlue()  - color.getBlue()) +
        Math.square(this.getGreen() - color.getGreen())
    );
};

module.exports = Color;