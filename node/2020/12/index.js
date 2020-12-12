const fs = require('fs');
const assert = require('assert');
const process = require('process');

// Instructions
const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;
const LEFT = 4;
const RIGHT = 5;
const FORWARD = 6;
const format = (text) => {
    return text.trim()
        .replace(/N/g, NORTH.toString())
        .replace(/S/g, SOUTH.toString())
        .replace(/E/g, EAST.toString())
        .replace(/W/g, WEST.toString())
        .replace(/L/g, LEFT.toString())
        .replace(/R/g, RIGHT.toString())
        .replace(/F/g, FORWARD.toString())
        .split(/\r?\n/)
        .map((line) => {
            const entry = line.match(/([0-9])([0-9]+)/);
            return [Number(entry[1]), Number(entry[2])];
        });
};

// Ship data
const X = 0;
const Y = 1;
const D = 2;
// Cardinal directions
const NORTH_D = [0, 1];
const EAST_D = [1, 0];
const SOUTH_D = [0, -1];
const WEST_D = [-1, 0];

const turnShip = (ship, degrees, left) => {
    for (let i = 0; i < (degrees / 90); i++) {
        if (left) {
            const dx = ship[D][X];
            ship[D][X] = -ship[D][Y];
            ship[D][Y] = dx;
        } else {
            const dx = ship[D][X];
            ship[D][X] = ship[D][Y];
            ship[D][Y] = -dx;
        }
    }
};

const moveShip1 = (ship, units, direction) => {
    if (direction == undefined) {
        direction = ship[D];
    }
    ship[X] += units * direction[X];
    ship[Y] += units * direction[Y];
};

// If a direction is provided, then move the waypoint.
// If a direction is not provided, move the ship to the waypoint
const moveShip2 = (ship, units, direction) => {
    if (direction == undefined) {
        ship[X] += units * ship[D][X];
        ship[Y] += units * ship[D][Y];
    } else {
        ship[D][X] += units * direction[X];
        ship[D][Y] += units * direction[Y];
    }
};

const getManhattanDistance = (ship) => {
    return Math.abs(ship[X]) + Math.abs(ship[Y]);
};

const readInstructions = (instructions, moveShip) => {
    const ship = [];
    ship[X] = 0;
    ship[Y] = 0;
    if (moveShip == moveShip1) {
        // In part 1 the ship starts facing east
        ship[D] = [...EAST_D];
    } else if (moveShip == moveShip2) {
        // In part 2 the waypoint starts 10 units east and 1 unit north
        ship[D] = [10, 1];
    }
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        switch (instruction[0]) {
            case NORTH:
                moveShip(ship, instruction[1], NORTH_D);
                break;
            case SOUTH:
                moveShip(ship, instruction[1], SOUTH_D);
                break;
            case EAST:
                moveShip(ship, instruction[1], EAST_D);
                break;
            case WEST:
                moveShip(ship, instruction[1], WEST_D);
                break;
            case LEFT:
                turnShip(ship, instruction[1], true);
                break;
            case RIGHT:
                turnShip(ship, instruction[1], false);
                break;
            case FORWARD:
                moveShip(ship, instruction[1]);
                break;
            default:
                console.error('Found an invalid instruction');
        }
    }
    return getManhattanDistance(ship);
};

const part1 = (instructions) => {
    return readInstructions(instructions, moveShip1);
};

const part2 = (instructions) => {
    return readInstructions(instructions, moveShip2);
};

const exampleText = `F10
N3
F7
R90
F11`;

const exampleFormatStart = process.hrtime();
const example = format(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 25);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const test2Start = process.hrtime();
const test2Solution = part2(example);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, 286);
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


console.info('Example format: %ds %dms', exampleFormatEnd[0], exampleFormatEnd[1] / 1000000);
console.info('Input format: %ds %dms', formatEnd[0], formatEnd[1] / 1000000);
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