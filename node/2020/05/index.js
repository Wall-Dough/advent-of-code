const fs = require('fs');
const assert = require('assert');

const part1 = (seatIds) => {
    return Math.max(...seatIds);
}

const part2 = (seatIds) => {
    var min = Math.min(...seatIds);
    var max = Math.max(...seatIds);
    var sum = seatIds.reduce((acc, val) => {
        return acc + val;
    });
    return ((min + max) / 2 * (seatIds.length + 1)) - sum;
}

const getAllSeatIds = (seats) => {
    return seats.map((value) => {
        return parseInt(value.replace(/[BR]/g, '1').replace(/[FL]/g, '0'), 2);
    });
};

const example = `BBFFBBFRRL
BBFFBBFRRR
BBFFBBBLLR
BBFFBBBLRL`.trim().split(/\r?\n/);

const exampleIds = getAllSeatIds(example);
assert.strictEqual(part1(exampleIds), 826);
assert.strictEqual(part2(exampleIds), 824);

const seats = fs.readFileSync('./input.txt', 'utf8').trim().split(/\r?\n/);
const seatIds = getAllSeatIds(seats);

console.log(`Part 1: ${part1(seatIds)}`);
console.log(`Part 2: ${part2(seatIds)}`);
