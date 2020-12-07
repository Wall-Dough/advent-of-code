const fs = require('fs');
const assert = require('assert');

const calcFuel = (mass) => {
    return Math.floor(mass / 3) - 2;
};

const part1 = (masses) => {
    return masses.reduce((acc, mass) => {
        return acc + calcFuel(mass);
    }, 0);
};

const part2 = (masses) => {
    return masses.reduce((acc, mass) => {
        let cur = calcFuel(mass);
        let sum = cur;
        while ((cur = calcFuel(cur)) > 0) {
            sum += cur;
        }
        return acc + sum;
    }, 0);
}

const example = `12
14
1969
100756`.trim().split(/\r?\n/).map(Number);

console.log(example);

assert.strictEqual(part1(example), 2 + 2 + 654 + 33583);

const masses = fs.readFileSync('./input.txt', 'utf8').trim().split(/\r?\n/).map(Number);

console.log(`Part 1: ${part1(masses)}`);
console.log(`Part 2: ${part2(masses)}`);
