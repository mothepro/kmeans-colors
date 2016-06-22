// dependenices
const program = require('commander');
const kmeans = require('..');
const pkg = require('../package.json');

// args
program
    .version(pkg.version)
    .option('-c, --colors <n>', 'Number of colors to generate', parseInt, 10)
    .option('-g, --groups <n>', 'Number of clusters to use', parseInt, 3)
    .option('-v, --verbose', 'A value that can be increased', function (v, total) { return total + 1; }, 0)
    .parse(process.argv);

// program
var k = new kmeans(program.colors, program.groups);
k.solve(program.verbose);