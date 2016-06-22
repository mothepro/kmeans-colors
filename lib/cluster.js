module.exports = Cluster;

// dependencies
const Color = require('./color');

/**
 * Stores a group of colors
 * @constructor
 */
function Cluster(name) {
    this.name = name;
    this.colors = [];
    this.center = null;
}

/**
 * Add a color to a cluster
 * remove center
 * @param color {Color} color to add
 * @returns {Cluster}
 */
Cluster.prototype.add = function (color) {
    // if(!(color instanceof Color))
    //     throw Error('Must add a color to the cluster');
    
    this.colors.push(color);
    this.center = null;
    return this;
};

/**
 * Clears all colors stored
 * @returns {Cluster}
 */
Cluster.prototype.clear = function () {
    this.colors = [];
    return this;
};

/**
 * Finds the center of the cluster
 * @returns Color
 */
Cluster.prototype.centroid = function () {
    if (this.center === null) {
        var sum = {
            red: 0,
            green: 0,
            blue: 0,
        };
    
        this.colors.forEach(function (color) {
            sum.red += color.getRed();
            sum.green += color.getGreen();
            sum.blue += color.getBlue();
        });
    
        this.center = Color({
            red: sum.red / this.colors.length,
            green: sum.green / this.colors.length,
            blue: sum.blue / this.colors.length,
        });
    }
    
    return this.center;
};