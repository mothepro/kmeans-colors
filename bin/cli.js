// dependenices
const program = require('commander');
const KMeans = require('..');
const pkg = require('../package.json');
const Color = require('../lib/color');

// args
program
    .version(pkg.version)
    .option('-c, --colors <n>', 'Number of colors to generate', parseInt, 10)
    .option('-g, --groups <n>', 'Number of clusters to use', function (g) { return parseInt(g, 10); }, 3)
    .option('-t, --test-color <n>', 'A color to test against the clusters', function (val, colors) {
        colors.push(Color(val));
        return colors;
    }, [])
    .option('-z, --test-count <n>', 'Number of random colors to test against the clusters', function (g) { return parseInt(g, 10); }, 0)
    .option('--html', 'Output in html', false)
    .option('-v, --verbose', 'A value that can be increased', function (v, total) { return total + 1; }, 0)
    .parse(process.argv);

// add randoms
for(var i = 0; i < program.testCount; i++)
    program.testColor.push(Color().randomize());

// solve
var k = new KMeans(program.colors, program.groups);
k.solve(program.verbose);

// print to console
if(!program.html) {
    k.groups.forEach(function (c) { console.log(c.centroid()); });

    program.testColor.forEach(function (color) {
        console.log(color, k.test(color).centroid());
    });
}

// print as HTML
if(program.html) {
    console.log(`<style>
    div {
        display: inline-block;
    }
    .color {
        width: 1em;
        height: 1em;
        margin: .5em;
        margin-right: 1em;
        padding: 1em;
        border: thin solid black;
    }
    </style>`);

    // clusters
    k.groups.forEach(function (c) {
        console.log('<div><div class="color" style="background-color: %s"></div><br>%s</div>', c.centroid().toCSS(), c.name);
    });

    // tests
    program.testColor.forEach(function (color) {
        var cent = k.test(color);

        console.log('<hr><div class="color" style="background-color: %s"></div> <div class="color" style="background-color: %s"></div> %s',
            color.toCSS(),
            cent.centroid().toCSS(),
            cent.name
        );
    });
}