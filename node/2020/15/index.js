const fs = require('fs');
const assert = require('assert');
const process = require('process');

const format = (text) => {
    return text.trim().split(',').map(Number);
};

const getNumberN = (starting, n) => {
    const history = {};
    let lastSpoken = -1;
    let percent = -1;
    for (let i = 0; i < n; i++) {
        const newPercent = Math.floor(100 * i / n);
        if (newPercent > percent) {
            percent = newPercent;
            console.log(percent.toString() + "%");
        }
        let num = 0;
        if (i < starting.length) {
            // Speak starting numbers until all have been spoken
            num = starting[i];
        } else if (history[lastSpoken].length > 1) {
            // If the last spoken number has been spoken more than once,
            //   speak the difference between those times
            num = history[lastSpoken][1] - history[lastSpoken][0];
        } // Otherwise the number has been spoken once or never, so leave at 0

        lastSpoken = num;
        // Initialize history for never-spoken number
        if (history[num] == undefined) {
            history[num] = [];
        }
        
        if (history[num].length == 2) {
            history[num][0] = history[num][1];
            history[num][1] = i;
        } else {
            history[num][history[num].length] = i;
        }
    }
    return lastSpoken;
};

const part1 = (input) => {
    return getNumberN(input, 2020);
};

const part2 = (input) => {
    return getNumberN(input, 30000000);
};

assert.strictEqual(part1(format('0,3,6')), 436);
assert.strictEqual(part1(format('1,3,2')), 1);
assert.strictEqual(part1(format('2,1,3')), 10);
assert.strictEqual(part1(format('1,2,3')), 27);
assert.strictEqual(part1(format('2,3,1')), 78);
assert.strictEqual(part1(format('3,2,1')), 438);
assert.strictEqual(part1(format('3,1,2')), 1836);

// assert.strictEqual(part2(format('0,3,6')), undefined);
// assert.strictEqual(part2(format('1,3,2')), undefined);
// assert.strictEqual(part2(format('2,1,3')), undefined);
// assert.strictEqual(part2(format('1,2,3')), undefined);
// assert.strictEqual(part2(format('2,3,1')), undefined);
// assert.strictEqual(part2(format('3,2,1')), undefined);
// assert.strictEqual(part2(format('3,1,2')), undefined);

// const test2Start = process.hrtime();
// const test2Solution = part2(example);
// const test2End = process.hrtime(test2Start);
// if (test2Solution) {
//     assert.strictEqual(test2Solution, undefined);
//     console.log("Test 2 passed!");
// } else {
//     console.log("Part 2 not yet implemented.");
// }

const inputText = `9,12,1,4,17,0,18`;

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

if (part1Solution) {
    console.info('Part 1: %ds %dms', part1End[0], part1End[1] / 1000000);
}
if (part2Solution) {
    console.info('Part 2: %ds %dms', part2End[0], part2End[1] / 1000000);
}