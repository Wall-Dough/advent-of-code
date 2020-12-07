const fs = require('fs');
const assert = require('assert');

const part1 = (original) => {
    const program = [...original];
    for (let i = 0; i < program.length; i += 4) {
        switch (program[i]) {
            case 1:
                program[program[i + 3]] = program[program[i + 1]] + program[program[i + 2]];
                break;
            case 2:
                program[program[i + 3]] = program[program[i + 1]] * program[program[i + 2]];
                break;
            case 99:
                return program[0];
        }
    }
    console.log("ERROR: Program didn't properly terminate.");
    return program[0];
};

const part2 = (original) => {
    const expected = 19690720;
    const program = [...original];
    for (let noun = 0; noun < program.length; noun++) {
        for (let verb = 0; verb < program.length; verb++) {
            program[1] = noun;
            program[2] = verb;
            if (part1(program) == expected) {
                return (100 * noun) + verb;
            }
        }
    }
    console.log("ERROR: Could not find a solution.")
    return undefined;
};

const example1 = '1,0,0,0,99'.trim().split(',').map(Number);
const example2 = '2,3,0,3,99'.trim().split(',').map(Number);
const example3 = '2,4,4,5,99,0'.trim().split(',').map(Number);
const example4 = '1,1,1,4,99,5,6,0,99'.trim().split(',').map(Number);

assert.strictEqual(part1(example1), 2);
assert.strictEqual(part1(example2), 2);
assert.strictEqual(part1(example3), 2);
assert.strictEqual(part1(example4), 30);

const program = fs.readFileSync('./input.txt', 'utf8').trim().split(',').map(Number);
program[1] = 12;
program[2] = 2;

console.log(`Part 1: ${part1(program)}`);
console.log(`Part 2: ${part2(program)}`);
