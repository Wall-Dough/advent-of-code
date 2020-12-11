const fs = require('fs');
const assert = require('assert');
const process = require('process');


const FLOOR = 0;
const EMPTY = 1;
const FILLED = 2;

const format = (input) => {
    const lines = input.trim().replace(/L/g, EMPTY.toString()).replace(/\./g, FLOOR.toString()).split(/\r?\n/);
    const rows = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const row = [];
        for (let j = 0; j < line.length; j++) {
            const val = Number(line.charAt(j));
            // [current state, memory]
            row[j] = [val, val];
        }
        rows[i] = row;
    }
    return rows;
};

const countAdjacents1 = (rows, i, j) => {
    let adjacents = 0;
    for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
            // Skip the current seat
            if (a == 0 && b == 0) {
                continue;
            }
            // Check if the spot exists
            if (!rows[i + a] || !rows[i + a][j + b]) {
                continue;
            }
            if (rows[i + a][j + b][1] == FILLED) {
                adjacents++;
            }
        }
    }
    return adjacents;
};

const shouldSit1 = (rows, i, j) => {
    const adjacents = countAdjacents1(rows, i, j);
    if (rows[i][j][1] == EMPTY) {
        return adjacents == 0;
    }
    // rows[i][j][0] == FILLED
    return adjacents < 4;
}

const countAdjacents2 = (rows, i, j) => {
    let adjacents = 0;
    for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
            // Skip the current seat
            if (a == 0 && b == 0) {
                continue;
            }
            let a2 = a;
            let b2 = b;
            // Continue in direction a,b until you hit an edge
            while (rows[i + a2] && rows[i + a2][j + b2]) {
                // Saw a seat
                if (rows[i + a2][j + b2][1] > 0) {
                    if (rows[i + a2][j + b2][1] == FILLED) {
                        adjacents++;
                    }
                    break;
                }
                a2 += a;
                b2 += b;
            }
        }
    }
    return adjacents;
};

const shouldSit2 = (rows, i, j) => {
    const adjacents = countAdjacents2(rows, i, j);
    if (rows[i][j][1] == EMPTY) {
        return adjacents == 0;
    }
    // rows[i][j][0] == FILLED
    return adjacents < 5;
}

const seatEveryone = (rows, shouldSit) => {
    let changed;
    let sitters;
    do {
        changed = 0;
        sitters = 0;
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                // Floor... floor never changes...
                if (rows[i][j][1] == FLOOR) {
                    continue;
                }
                if (shouldSit(rows, i, j)) {
                    rows[i][j][0] = FILLED;
                    sitters++;
                } else {
                    rows[i][j][0] = EMPTY;
                }
            }
        }
        // Count how many seat states changed and update the memory
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                if (rows[i][j][0] != rows[i][j][1]) {
                    rows[i][j][1] = rows[i][j][0];
                    changed++;
                }
            }
        }
    } while (changed != 0);
    return sitters;
};

const part1 = (rows) => {
    return seatEveryone(rows, shouldSit1);
};

const part2 = (rows) => {
    return seatEveryone(rows, shouldSit2);
}

const exampleInput = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

const test1Start = process.hrtime();
const example1 = format(exampleInput);
const test1Solution = part1(example1);
const test1End = process.hrtime(test1Start);
assert.strictEqual(test1Solution, 37);
console.log("Test 1 passed!");

const test2Start = process.hrtime();
const example2 = format(exampleInput);
const test2Solution = part2(example2);
const test2End = process.hrtime(test2Start);
assert.strictEqual(test2Solution, 26);
console.log("Test 2 passed!");

console.log();

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const part1Start = process.hrtime();
const seats1 = format(input);
const part1Solution = part1(seats1);
const part1End = process.hrtime(part1Start);
console.log("Part 1:");
console.log(part1Solution);

console.log();

const part2Start = process.hrtime();
const seats2 = format(input);
const part2Solution = part2(seats2);
const part2End = process.hrtime(part2Start);
console.log("Part 2:");
console.log(part2Solution);

console.log();

console.info('Test 1          : %ds %dms', test1End[0], test1End[1] / 1000000);
console.info('Test 2          : %ds %dms', test2End[0], test2End[1] / 1000000);
console.info('Part 1          : %ds %dms', part1End[0], part1End[1] / 1000000);
console.info('Part 2          : %ds %dms', part2End[0], part2End[1] / 1000000);