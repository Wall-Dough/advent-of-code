const fs = require('fs');
const assert = require('assert');
const process = require('process');

console.log("Hello, world!");

// fields: {
//     field: [[min1, max1], [min2, max2]],
//     ...
// },
// ranges: [[min1, max1], ...],
// myTicket: [n1, ...],
// nearby: [[n1, ...], ...]
const format = (text) => {
    const info = text.trim().match(/((?:.|\r?\n)+)\r?\n\r?\nyour ticket:\r?\n((?:.|\r?\n)+)\r?\n\r?\nnearby tickets:\r?\n((?:.|\r?\n)+)/);
    const data = {};
    data.fields = {};
    data.ranges = [];
    info[1].split(/\r?\n/).forEach((line) => {
        const entry = line.match(/(.+): ([0-9]+)\-([0-9]+) or ([0-9]+)\-([0-9]+)/);
        const range1 = [Number(entry[2]), Number(entry[3]), entry[1]];
        const range2 = [Number(entry[4]), Number(entry[5]), entry[1]];
        data.fields[entry[1]] = [range1, range2];
        data.ranges.push(range1, range2);
    });
    data.myTicket = info[2].split(',').map(Number);
    data.nearby = info[3].split(/\r?\n/).map((line) => {
        return line.split(',').map(Number);
    });
    return data;
};

const part1 = (data) => {
    return data.nearby.reduce((errorRate, ticket) => {
        return errorRate + ticket.filter((value) => {
            return data.ranges.filter((range) => {
                return value >= range[0] && value <= range[1];
            }).length == 0;
        }).reduce((acc, value) => {
            return acc + value;
        }, 0);
    }, 0);
};

const allDefined = (arr) => {
    for (let value of arr) {
        if (value == undefined) {
            return false;
        }
    }
    return true;
}

const getFields = (data) => {
    // Map every nearby ticket to an array of valid fields for each ticket field
    const ranges = data.nearby.map((ticket) => {
        // Map every value to an array of valid fields for each ticket field
        return ticket.map((value) => {
            return data.ranges.filter((range) => {
                return value >= range[0] && value <= range[1];
            }).map((range) => {
                return range[2];
            });
        });
    }).filter((ticket) => {
        for (let ranges of ticket) {
            if (ranges.length == 0) {
                return false;
            }
        }
        return true;
    });
    const counts = [];
    ranges.forEach((ticket) => {
        ticket.forEach((fields, i) => {
            fields.forEach((field) => {
                if (counts[i] == undefined) {
                    counts[i] = {};
                }
                if (counts[i][field] == undefined) {
                    counts[i][field] = 0;
                }
                counts[i][field]++;
            });
        });
    });
    const possibles = [];
    counts.forEach((countMap, i) => {
        Object.keys(countMap).forEach((field) => {
            if (countMap[field] == ranges.length) {
                if (possibles[i] == undefined) {
                    possibles[i] = [];
                }
                possibles[i].push(field);
            }
        });
    });
    const uniques = Array(possibles.length);
    do {
        for (let i in possibles) {
            if (possibles[i].length != 1) {
                continue;
            }
            const field = possibles[i][0];
            uniques[i] = field;
            for (let j in possibles) {
                const indexOf = possibles[j].indexOf(field);
                if (indexOf > -1) {
                    possibles[j].splice(indexOf, 1);
                }
            }
        }
    } while (!allDefined(uniques));
    return uniques;
};

const part2 = (data) => {
    const fields = getFields(data);
    let multiple = 1;
    fields.forEach((field, i) => {
        if (field.startsWith('departure')) {
            multiple *= data.myTicket[i];
        }
    });
    return multiple;
};

const exampleText1 = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;

const exampleText2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`;

const exampleFormatStart = process.hrtime();
const example1 = format(exampleText1);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const exampleFormat2Start = process.hrtime();
const example2 = format(exampleText2);
const exampleFormat2End = process.hrtime(exampleFormat2Start);

const test1Start = process.hrtime();
const test1Solution = part1(example1);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 71);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const test2Start = process.hrtime();
const test2Solution = part2(example2);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, 1);
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