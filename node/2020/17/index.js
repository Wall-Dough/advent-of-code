const fs = require('fs');
const assert = require('assert');
const process = require('process');

console.log("Hello, world!");

const setCube1 = (state, i, j, k, active) => {
    if (state[i] == undefined) {
        state[i] = {};
    }
    if (state[i][j] == undefined) {
        state[i][j] = {};
    }
    if (state[i][j][k]) {
        return;
    }
    state[i][j][k] = active;
    if (!active) {
        return;
    }
    for (let io = -1; io <= 1; io++) {
        for (let jo = -1; jo <= 1; jo++) {
            for (let ko = -1; ko <= 1; ko++) {
                if (io == 0 && jo == 0 && ko == 0) {
                    continue;
                }
                setCube1(state, Number(i) + io, Number(j) + jo, Number(k) + ko, false);
            }
        }
    }
};

const setCube2 = (state, i, j, k, l, active) => {
    if (state[i] == undefined) {
        state[i] = {};
    }
    if (state[i][j] == undefined) {
        state[i][j] = {};
    }
    if (state[i][j][k] == undefined) {
        state[i][j][k] = {};
    }
    if (state[i][j][k][l]) {
        return;
    }
    state[i][j][k][l] = active;
    if (!active) {
        return;
    }
    for (let io = -1; io <= 1; io++) {
        for (let jo = -1; jo <= 1; jo++) {
            for (let ko = -1; ko <= 1; ko++) {
                for (let lo = -1; lo <= 1; lo++) {
                    if (io == 0 && jo == 0 && ko == 0 && lo == 0) {
                        continue;
                    }
                    setCube2(state, Number(i) + io, Number(j) + jo, Number(k) + ko, Number(l) + lo, false);
                }
            }
        }
    }
};

const format1 = (text) => {
    const state = {};
    text.trim().split(/\r?\n/).forEach((line, j) => {
        for (let k = 0; k < line.length; k++) {
            if (line.charAt(k) == '#') {
                setCube1(state, 0, j, k, true);
            }
        }
    });
    return state;
};

const format2 = (text) => {
    const state = {};
    text.trim().split(/\r?\n/).forEach((line, k) => {
        for (let l = 0; l < line.length; l++) {
            if (line.charAt(l) == '#') {
                setCube2(state, 0, 0, k, l, true);
            }
        }
    });
    return state;
};

const countActiveNeighbors1 = (state, i, j, k) => {
    let neighbors = 0;
    for (let io = -1; io <= 1; io++) {
        for (let jo = -1; jo <= 1; jo++) {
            for (let ko = -1; ko <= 1; ko++) {
                if (io == 0 && jo == 0 && ko == 0) {
                    continue;
                }
                let ii = Number(i) + io;
                if (state[ii] == undefined) {
                    continue;
                }
                let jj = Number(j) + jo;
                if (state[ii][jj] == undefined) {
                    continue;
                }
                if (state[ii][jj][Number(k) + ko]) {
                    neighbors++;
                }
            }
        }
    }
    return neighbors;
};

const countActiveNeighbors2 = (state, i, j, k, l) => {
    let neighbors = 0;
    for (let io = -1; io <= 1; io++) {
        for (let jo = -1; jo <= 1; jo++) {
            for (let ko = -1; ko <= 1; ko++) {
                for (let lo = -1; lo <= 1; lo++) {
                    if (io == 0 && jo == 0 && ko == 0 && lo == 0) {
                        continue;
                    }
                    const ii = Number(i) + io;
                    if (state[ii] == undefined) {
                        continue;
                    }
                    const jj = Number(j) + jo;
                    if (state[ii][jj] == undefined) {
                        continue;
                    }
                    const kk = Number(k) + ko;
                    if (state[ii][jj][kk] == undefined) {
                        continue;
                    }
                    if (state[ii][jj][kk][Number(l) + lo]) {
                        neighbors++;
                    }
                }
            }
        }
    }
    return neighbors;
};

const iterate1 = (state) => {
    const newState = {};
    for (let i in state) {
        for (let j in state[i]) {
            for (let k in state[i][j]) {
                const neighborCount = countActiveNeighbors1(state, i, j, k);
                if (state[i][j][k]) {
                    setCube1(newState, i, j, k, neighborCount == 2 || neighborCount == 3);
                } else {
                    setCube1(newState, i, j, k, neighborCount == 3);
                }
            }
        }
    }
    return newState;
};

const iterate2 = (state) => {
    const newState = {};
    for (let i in state) {
        for (let j in state[i]) {
            for (let k in state[i][j]) {
                for (let l in state[i][j][k]) {
                    const neighborCount = countActiveNeighbors2(state, i, j, k, l);
                    if (state[i][j][k][l]) {
                        setCube2(newState, i, j, k, l, neighborCount == 2 || neighborCount == 3);
                    } else {
                        setCube2(newState, i, j, k, l, neighborCount == 3);
                    }
                }
            }
        }
    }
    return newState;
};

const countAllActive1 = (state) => {
    let count = 0;
    for (let i in state) {
        for (let j in state[i]) {
            for (let k in state[i][j]) {
                if (state[i][j][k]) {
                    count++;
                }
            }
        }
    }
    return count;
}

const countAllActive2 = (state) => {
    let count = 0;
    for (let i in state) {
        for (let j in state[i]) {
            for (let k in state[i][j]) {
                for (let l in state[i][j][k]) {
                    if (state[i][j][k][l]) {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

const run = (state, iterate, countAllActive) => {
    for (let i = 0; i < 6; i++) {
        state = iterate(state);
    }
    return countAllActive(state);
};

const part1 = (state) => {
    return run(state, iterate1, countAllActive1);
};

const part2 = (state) => {
    return run(state, iterate2, countAllActive2);
};

const exampleText = `.#.
..#
###`;

const exampleFormatStart = process.hrtime();
const example1 = format1(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example1);
const test1End = process.hrtime(test1Start);
if (test1Solution != undefined) {
    assert.strictEqual(test1Solution, 112);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const example2 = format2(exampleText);

const test2Start = process.hrtime();
const test2Solution = part2(example2);
const test2End = process.hrtime(test2Start);
if (test2Solution != undefined) {
    assert.strictEqual(test2Solution, 848);
    console.log("Test 2 passed!");
} else {
    console.log("Part 2 not yet implemented.");
}

const inputText = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const formatStart = process.hrtime();
const input1 = format1(inputText);
const formatEnd = process.hrtime(formatStart);

const part1Start = process.hrtime();
const part1Solution = part1(input1);
const part1End = process.hrtime(part1Start);
if (part1Solution) {
    console.log("Part 1:");
    console.log(part1Solution);
}

const input2 = format2(inputText);

const part2Start = process.hrtime();
const part2Solution = part2(input2);
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