const fs = require('fs');
const assert = require('assert');
const process = require('process');

console.log("Hello, world!");

const format = (text) => {

};

const part1 = (input) => {

};

const part2 = (input) => {

};

const exampleText = ``;

const exampleFormatStart = process.hrtime();
const example = format(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, undefined);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const test2Start = process.hrtime();
const test2Solution = part2(example);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, undefined);
    console.log("Test 2 passed!");
} else {
    console.log("Part 2 not yet implemented.");
}

const inputText = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const formatStart = process.hrtime();
const input = format(inputText);
const formatEnd = process.hrtime(formatStart);

const part1Start = process.hrtime();
const part1Solution = part1(input);
const part1End = process.hrtime(part1Start);
if (part1Solution) {
    console.log("Part 1:");
    console.log(part1Solution);
}

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