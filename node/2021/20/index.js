const fs = require('fs');
const assert = require('assert');
const process = require('process');
const { isUint16Array } = require('util/types');

console.log("Hello, world!");

const format = (text) => {
    var parts = text.trim().split('\n\n');
    var image = {};
    image["algorithm"] = parts[0].split('');
    image["input"] = parts[1].split('\n').map((line) => {
        return line.split('');
    });
    return image;
};

const get_pixel = (image, x, y, iteration) => {
    var input_image = image["input"];
    if (x < 0 || y < 0 || x >= input_image.length || y >= input_image.length) {
        if (iteration % 2) {
            var nine_pixels = '.'.repeat(9);
            nine_pixels = nine_pixels.replaceAll('.', '0').replaceAll('#', '1');
            var algorithm_index = parseInt(nine_pixels, 2);
            return image["algorithm"][algorithm_index];
        }
        return '.';
    }
    var pixel = input_image[x][y];
    return pixel;
};

const get_nine_pixels = (image, x, y, iteration) => {
    var nine_pixels = '';
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            nine_pixels += get_pixel(image, x + i, y + j, iteration);
        }
    }
    return nine_pixels;
};

const get_algorithm_index = (image, x, y, iteration) => {
    var nine_pixels = get_nine_pixels(image, x, y, iteration);
    nine_pixels = nine_pixels.replaceAll('.', '0').replaceAll('#', '1');
    var algorithm_index = parseInt(nine_pixels, 2);
    return algorithm_index;
};

const get_new_pixel = (image, x, y, iteration) => {
    var algorithm_index = get_algorithm_index(image, x, y, iteration);
    return image["algorithm"][algorithm_index];
};

const apply_algorithm = (image, iteration) => {
    var input_image = image["input"];
    var new_image = [];
    var num_lit = 0;
    for (var x = -1; x < input_image.length + 1; x++) {
        var row = [];
        for (var y = -1; y < input_image[0].length + 1; y++) {
            var new_pixel = get_new_pixel(image, x, y, iteration);
            if (new_pixel == '#') {
                num_lit++;
            }
            row.push(new_pixel);
        }
        new_image.push(row);
    }
    image["input"] = new_image;
    return num_lit;
};

const part1 = (image) => {
    var NUM_TIMES = 2;
    var num_lit = 0;
    for (var i = 0; i < NUM_TIMES; i++) {
        num_lit = apply_algorithm(image, i);
    }
    return num_lit;
};

const part2 = (image) => {
    var NUM_TIMES = 50;
    var num_lit = 0;
    for (var i = 0; i < NUM_TIMES; i++) {
        num_lit = apply_algorithm(image, i);
    }
    console.log(num_lit);
    return num_lit;

};

const exampleText = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

const exampleFormatStart = process.hrtime();
var example = format(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 35);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

example = format(exampleText);

const test2Start = process.hrtime();
const test2Solution = part2(example);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, 3351);
    console.log("Test 2 passed!");
} else {
    console.log("Part 2 not yet implemented.");
}

const inputText = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const formatStart = process.hrtime();
var input = format(inputText);
const formatEnd = process.hrtime(formatStart);

const part1Start = process.hrtime();
const part1Solution = part1(input);
const part1End = process.hrtime(part1Start);
if (part1Solution) {
    console.log("Part 1:");
    console.log(part1Solution);
}

input = format(inputText);

const part2Start = process.hrtime();
const part2Solution = part2(input);
const part2End = process.hrtime(part2Start);
if (part2Solution) {
    console.log("Part 2:");
    console.log(part2Solution);
}

if (test1Solution) {
    console.info('Test 1: %ds %dms', test1End[0], test1End[1] / 1000000);
}
if (test2Solution) {
    console.info('Test 2: %ds %dms', test2End[0], test2End[1] / 1000000);
}
if (part1Solution) {
    console.info('Part 1: %ds %dms', part1End[0], part1End[1] / 1000000);
}
if (part2Solution) {
    console.info('Part 2: %ds %dms', part2End[0], part2End[1] / 1000000);
}