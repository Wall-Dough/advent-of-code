const fs = require('fs');
const assert = require('assert');
const process = require('process');

console.log("Hello, world!");

const format = (text) => {
    return text.trim().split('\n').map((line) => {
        return Number(line.substring(line.indexOf(':') + 2)) - 1;
    });
};

const roll_die = (roll_num, sides) => {
    return roll_num + 1 % sides;
};

const roll_die_n = (roll_num, sides, n) => {
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += roll_die(roll_num + i, sides);
    }
    return sum;
};

const part1 = (starting_positions) => {
    var positions = starting_positions.slice();
    var die_sides = 100;
    var board_size = 10;
    var roll_num = 0;
    var scores = [0, 0];
    while (scores[0] < 1000 && scores[1] < 1000) {
        for (var i = 0; i < positions.length; i++) {
            var roll = roll_die_n(roll_num, die_sides, 3);
            roll_num += 3;
            positions[i] = (positions[i] + roll) % board_size;
            scores[i] += positions[i] + 1;
            if (scores[i] >= 1000) {
                return roll_num * scores[1 - i];
            }
        }
    }
    return 0;
};

const create_state = (old_state = null) => {
    if (old_state == null) {
        return {
            positions: [0, 0],
            scores: [0, 0],
            p1_rolled: false,
            roll_sum: 0,
            state_count: 1,
        };
    }
    return {
        positions: old_state.positions.slice(),
        scores: old_state.scores.slice(),
        p1_rolled: old_state.p1_rolled,
        roll_sum: old_state.roll_sum,
        state_count: old_state.state_count,
    };
};

const part2 = (starting_positions) => {
    var first_state = create_state();
    first_state.positions = starting_positions.slice();
    var states = [first_state];
    var roll_freq = {};
    var rolls = [1, 2, 3];
    var all_rolls = [];
    for (var a of rolls) {
        for (var b of rolls) {
            for (var c of rolls) {
                var roll = Number(a + b + c);
                if (!roll_freq[roll]) {
                    all_rolls.push(roll);
                    roll_freq[roll] = 0;
                }
                roll_freq[roll]++;
            }
        }
    }
    var wins = [0, 0];
    var board_size = 10;
    while (states.length > 0) {
        var state = states.pop();
        var p = state.p1_rolled ? 1 : 0;
        for (var roll of all_rolls) {
            var new_state = create_state(state);
            new_state.positions[p] = (new_state.positions[p] + roll) % board_size;
            new_state.state_count *= roll_freq[roll];
            new_state.scores[p] += new_state.positions[p] + 1;
            if (new_state.scores[p] >= 21) {
                wins[p] += new_state.state_count;
                if (wins[p] % 10000000 == 0) {
                    console.log(wins[p]);
                }
                continue;
            }
            new_state.p1_rolled = !new_state.p1_rolled;
            states.push(new_state);
        }
    }
    var winningest = Math.max(wins[0], wins[1]);
    console.log(winningest);
    return winningest;
};

const exampleText = `Player 1 starting position: 4
Player 2 starting position: 8`;

const exampleFormatStart = process.hrtime();
const example = format(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 739785);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const test2Start = process.hrtime();
const test2Solution = part2(example);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, 444356092776315);
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