const fs = require('fs');
const assert = require('assert');
const process = require('process');

const part1 = (text) => {
    const lines = text.trim().replace(/x,/g, '').split(/\r?\n/);
    const depart = Number(lines[0]);
    const buses = lines[1].split(',').map(Number);
    let earliestBus = undefined;
    let earliestWait = undefined;
    buses.forEach((bus) => {
        const wait = bus - (depart % bus);
        if (!earliestBus || wait < earliestWait) {
            earliestBus = bus;
            earliestWait = wait;
        }
    });
    return earliestBus * earliestWait;
};

const part2 = (text) => {
    const lines = text.trim().replace(/x/g, '0').split(/\r?\n/);
    const buses = lines[1].split(',').map((bus, i) => {
        return [Number(bus), i];
    }).filter((bus) => {
        return bus[0] > 0;
    }).sort((a, b) => {
        return b[0] - a[0];
    });
    buses.forEach((a) => {
        a[1] = a[0] - a[1];
        while (a[1] < 0) {
            a[1] += a[0];
        }
        a[1] = a[1] % a[0];
    });
    console.log(buses);
    let t = buses[0][1];
    let toAdd = buses[0][0];
    console.log(t);
    for (let i = 1; i < buses.length; i++) {
        console.log("remainder");
        console.log(buses[i][1]);
        while ((t % buses[i][0]) != buses[i][1]) {
            t += toAdd;
        }
        toAdd *= buses[i][0];
        console.log("To add:");
        console.log(toAdd);
    }
    return t;
};

const exampleText = `939
7,13,x,x,59,x,31,19`;

const test1Start = process.hrtime();
const test1Solution = part1(exampleText);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 295);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const test2Start = process.hrtime();
const test2Solution = part2(exampleText);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, 1068781);
    console.log("Test 2 passed!");
} else {
    console.log("Part 2 not yet implemented.");
}

const inputText = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const part1Start = process.hrtime();
const part1Solution = part1(inputText);
const part1End = process.hrtime(part1Start);
if (part1Solution) {
    console.log("Part 1:");
    console.log(part1Solution);
}

const part2Start = process.hrtime();
const part2Solution = part2(inputText);
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