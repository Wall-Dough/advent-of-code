const fs = require('fs');
const assert = require('assert');
const process = require('process');

const hasSum = (arr, val) => {
    for (let num of arr) {
        if (val == num * 2) {
            continue;
        }
        if (arr.includes(val - num)) {
            return true;
        }
    }
    return false;
};

const part1 = (input, n) => {
    const xmas = input.trim().split(/\r?\n/);
    let preamble = [];
    for (let line of xmas) {
        const val = Number(line);
        if (preamble.length == n) {
            if (!hasSum(preamble, val)) {
                return val;
            }
            preamble = preamble.slice(1);
        }
        preamble.push(val);
    }
    console.error("Could not find any invalid numbers");
};

const part2 = (input, val) => {
    const xmas = input.trim().split(/\r?\n/);
    for (let i = 0; i < xmas.length; i++) {
        let sum = Number(xmas[i]);
        let min = sum;
        let max = sum;
        for (let j = i + 1; j < xmas.length; j++) {
            if (sum > val) {
                break;
            }
            const num = Number(xmas[j]);
            sum += num;
            min = Math.min(min, num);
            max = Math.max(max, num);
            if (sum == val) {
                return min + max;
            }
        }
    }
    console.error("Could not find the sum");
};

const example = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

const hrstartTest1 = process.hrtime();
const test1Solution = part1(example, 5);
const hrendTest1 = process.hrtime(hrstartTest1);
assert.strictEqual(test1Solution, 127);

const hrstartTest2 = process.hrtime();
const test2Solution = part2(example, test1Solution);
const hrendTest2 = process.hrtime(hrstartTest2);
assert.strictEqual(test2Solution, 62);


const xmas = fs.readFileSync('./input.txt', 'utf8');

console.log("Part 1:");
const hrstartPart1 = process.hrtime();
const part1Solution = part1(xmas, 25);
const hrendPart1 = process.hrtime(hrstartPart1);
console.log(part1Solution);

console.log("Part 2:");
const hrstartPart2 = process.hrtime();
const part2Solution = part2(xmas, part1Solution);
const hrendPart2 = process.hrtime(hrstartPart2);
console.log(part2Solution);

console.info('Test 1: %ds %dms', hrendTest1[0], hrendTest1[1] / 1000000);
console.info('Test 2: %ds %dms', hrendTest2[0], hrendTest2[1] / 1000000);
console.info('Part 1: %ds %dms', hrendPart1[0], hrendPart1[1] / 1000000);
console.info('Part 2: %ds %dms', hrendPart2[0], hrendPart2[1] / 1000000);
