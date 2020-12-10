const fs = require('fs');
const assert = require('assert');
const process = require('process');

const addDiff = (diffs, diff) => {
    if (!diffs[diff]) {
        diffs[diff] = 0;
    }
    diffs[diff]++;
}

const part1 = (adapters) => {
    const diffs = [undefined, 0, undefined, 0];
    for (let i = 0; i < adapters.length - 1; i++) {
        let diff = adapters[i + 1] - adapters[i];
        addDiff(diffs, diff);
    }
    return diffs[1] * diffs[3];
};

const part2 = (adapters) => {
    const nextsList = adapters.map((adapter, i) => {
        const nexts = [];
        for (i++; i < adapters.length; i++) {
            if (adapters[i] - adapter > 3) {
                break;
            }
            nexts.push(i);
        }
        return nexts;
    });
    const counts = [];
    for (let i = nextsList.length - 2; i >= 0; i--) {
        const nexts = nextsList[i];
        counts[i] = 0;
        for (let j of nexts) {
            counts[i] += counts[j] ? counts[j] : 1;
        }
    }
    return counts[0];
};

const format = (input) => {
    const formatted = input.trim().split(/\r?\n/).map((line) => {
        return Number(line);
    }).sort((a, b) => {
        return a - b;
    });
    formatted.unshift(0);
    formatted.push(formatted[formatted.length - 1] + 3);
    return formatted;
};

const exampleInput1 = `16
10
15
5
1
11
7
19
6
12
4`;

const exampleInput2 = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;

const example1FormatStart = process.hrtime();
const example1 = format(exampleInput1);
const example1FormatEnd = process.hrtime(example1FormatStart);

const example2FormatStart = process.hrtime();
const example2 = format(exampleInput2);
const example2FormatEnd = process.hrtime(example2FormatStart);

const test1_1Start = process.hrtime();
const test1_1Solution = part1(example1);
const test1_1End = process.hrtime(test1_1Start);
assert.strictEqual(test1_1Solution, 7 * 5);
console.log("Test 1-1 passed!");


const test1_2Start = process.hrtime();
const test1_2Solution = part1(example2);
const test1_2End = process.hrtime(test1_2Start);
assert.strictEqual(test1_2Solution, 22 * 10);
console.log("Test 1-2 passed!");

const test2_1Start = process.hrtime();
const test2_1Solution = part2(example1);
const test2_1End = process.hrtime(test2_1Start);
assert.strictEqual(test2_1Solution, 8);
console.log("Test 2-1 passed!");

const test2_2Start = process.hrtime();
const test2_2Solution = part2(example2);
const test2_2End = process.hrtime(test2_2Start);
assert.strictEqual(test2_2Solution, 19208);
console.log("Test 2-2 passed!");

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const formatStart = process.hrtime();
const adapters = format(input);
const formatEnd = process.hrtime(formatStart);

const part1Start = process.hrtime();
const part1Solution = part1(adapters);
const part1End = process.hrtime(part1Start);
console.log("Part 1:");
console.log(part1Solution);
assert.strictEqual(part1Solution, 2277);

const part2Start = process.hrtime();
const part2Solution = part2(adapters);
const part2End = process.hrtime(part2Start);
console.log("Part 2:");
console.log(part2Solution);
assert.strictEqual(part2Solution, 37024595836928);

console.info('Format Example 1: %ds %dms', example1FormatEnd[0], example1FormatEnd[1] / 1000000);
console.info('Format Example 2: %ds %dms', example2FormatEnd[0], example2FormatEnd[1] / 1000000);
console.info('Format Input    : %ds %dms', formatEnd[0], formatEnd[1] / 1000000);
console.info('Test 1-1        : %ds %dms', test1_1End[0], test1_1End[1] / 1000000);
console.info('Test 1-2        : %ds %dms', test1_2End[0], test1_2End[1] / 1000000);
console.info('Test 2-1        : %ds %dms', test2_1End[0], test2_1End[1] / 1000000);
console.info('Test 2-2        : %ds %dms', test2_2End[0], test2_2End[1] / 1000000);
console.info('Part 1          : %ds %dms', part1End[0], part1End[1] / 1000000);
console.info('Part 2          : %ds %dms', part2End[0], part2End[1] / 1000000);
console.info('Part 1 Total    : %ds %dms', formatEnd[0] + part1End[0], (formatEnd[1] + part1End[1]) / 1000000);
console.info('Part 2 Total    : %ds %dms', formatEnd[0] + part2End[0], (formatEnd[1] + part2End[1]) / 1000000);