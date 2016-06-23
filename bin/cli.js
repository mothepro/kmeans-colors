// dependenices
const program = require('commander');
const KMeans = require('..');
const pkg = require('../package.json');
const Color = require('../lib/color');
var echo;

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
    .option('--html', 'Output in html format', false)
    .option('-o, --output <file>', 'Output to a file')
    .option('-v, --verbose', 'A value that can be increased', function (v, total) { return total + 1; }, 0)
    .parse(process.argv);

// outputting to a file
if(program.output) {
    const util = require('util'),
        fs = require('fs');
    
    // if(fs.existSync(program.output))
    fs.unlinkSync(program.output);

    echo = function () {
        fs.appendFileSync(program.output, util.format.apply(util, Array.from(arguments)) + '\n');
    };
} else // console
    echo = console.log;

// add randoms
for(var i = 0; i < program.testCount; i++)
    program.testColor.push(Color().randomize());

// solve
var k = new KMeans(program.colors, program.groups);
k.solve(program.verbose);

// print to console
if(!program.html) {
    k.groups.forEach(function (c) { echo(c.centroid()); });

    program.testColor.forEach(function (color) {
        echo(color, k.test(color).centroid());
    });
}

// print as HTML
if(program.html) {
    echo(`<style>
    div {
        display: inline-block;
        text-align: center;
    }
    .test {
        border: thin dashed #888;
        margin: 1em;
    }
    .cluster {
        margin-right: 2em;
    }
    .color {
        width: 1em;
        height: 1em;
        margin: .5em;
        padding: 1em;
        border: thin solid black;
    }
    </style>`);

    // clusters
    k.groups.forEach(function (c) {
        echo(`<div class="cluster">
                <div class="color" style="background-color: %s"></div>
                <br> %s
              </div>`, c.centroid().toCSS(), c.name);
    });

    echo('<hr>');
    
    // tests
    program.testColor.forEach(function (color) {
        var cent = k.test(color);

        echo(`<div class="test">
                <div class="color" style="background-color: %s"></div>
                <div class="color" style="background-color: %s"></div>
                <br> %s
              </div>`,
            color.toCSS(),
            cent.centroid().toCSS(),
            cent.name
        );
    });
}