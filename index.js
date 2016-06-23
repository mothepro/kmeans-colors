module.exports = KMeans;

// dependencies
const Color = require('./lib/color');
const Cluster = require('./lib/cluster');

/**
 * Constructor
 * @param colors int
 * @param groups int
 */
function KMeans(colors, groups) {
    if(groups > colors && groups <= 1)
        throw Error('More groups than colors given');

    this.groups = new Array(groups);
    this.colors = new Array(colors);

    
    for(var i = 0; i < this.colors.length; i++)
        this.colors[i] = Color().randomize();

    // choose random start points for groups
    for(var i = 0; i < this.groups.length; i++) {
        this.groups[i] = new Cluster('Cluster ' + i);
        this.groups[i].add(this.colors[i]).centroid(); // save center
    }
}

/**
 * Places a color in the closest group
 */
KMeans.prototype.findGroups = function() {
    var centroids = [];

    // store last clusters & clear them
    this.groups.forEach(function(cluster) {
        cluster.colors.forEach(function (color) {
            color.lastGroup = cluster.name;
        });

        centroids.push({
            centroid: cluster.centroid(),
            cluster: cluster,
        });
        
        cluster.clear();
    });
    
    // find distance from each point to all groups
    this.colors.forEach(function (color) {
        var minDist, minIndex = 0, tmp;

        // find closest
        centroids.forEach(function (i) {
            tmp = color.eyeDistance( i.centroid );

            if(typeof minDist === 'undefined' || tmp < minDist) {
                minIndex = i.cluster;
                minDist = tmp;
            }
        });

        // update color info
        minIndex.add( color );
    }.bind(this));
};

/**
 * Check any color changed their previous cluster
 * @returns {boolean}
 */
KMeans.prototype.changed = function() {
    var ret = false;

    this.groups.some(function (cluster) {
        return cluster.colors.some(function (color) {
            if(color.lastGroup !== cluster.name ||typeof color.lastGroup === 'undefined') {
                ret = true;
                return true;
            }
        });
    });
    
    return ret;
};

/**
 * Keeps clustering until groups no longer change
 * @param verbosity
 */
KMeans.prototype.solve = function (verbosity) {
    verbosity = parseInt(verbosity) || 0;
    
    var i = 1;
    
    do {
        if(verbosity >= 1)
            console.log('Iteration %d', i++);
        
        this.findGroups();

        if(verbosity >= 2)
            this.groups.forEach(function(cluster) {
                console.log('%s has %d colors, its centroid is ',
                    cluster.name,
                    cluster.colors.length,
                    cluster.centroid()
                );
            });
    } while(this.changed());
};

/**
 * Returns all cluster centriods
 * @returns {Array}
 */
KMeans.prototype.getClusters = function() {
    var ret = [];
    this.groups.forEach(function (cluster) {
        ret.push(cluster.centroid());
    });
    return ret;
};

/**
 * Compares a color to the clusters and finds the nearest one
 * @param color
 * @returns {Cluster}
 */
KMeans.prototype.test = function (color) {
    var tmp, min = {};

    // find closest
    this.groups.forEach(function (cluster) {
        tmp = color.eyeDistance( cluster.centroid() );

        if(typeof min.dist === 'undefined' || tmp < min.dist) {
            min.cluster = cluster;
            min.dist = tmp;
        }
    });

    return min.cluster;
};