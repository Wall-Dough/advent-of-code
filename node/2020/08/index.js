const fs = require('fs');
const assert = require('assert');

// Formats the text input into an easy-to-use list of objects
//   input - the full text input
const format = (input) => {
    return input.trim().split(/\r?\n/).map((line) => {
        const entry = line.match(/([a-z]{3}) ((\+|\-)[0-9]+)?/);
        return {
            // The command
            cmd: entry[1],
            // The parameter
            val: Number(entry[2]),
            // How many times the command has been run so far
            count: 0
        };
    });
};

// Info returned after the program runs
//   acc - The accumulator
//   term - Whether or not the program terminated
const info = (acc, term) => {
    return {
        // The accumulator
        acc: acc,
        // Whether or not the program terminated
        term: term
    };
};

// Deep copy of the program
//   program - The formatted program
const copy = (program) => {
    return program.map((line) => {
        return {...line};
    });
};

// Runs the program
//   original - A clean copy of the original formatted program
const run = (original) => {
    // Copy the program to keep the counts clean
    const program = copy(original);
    let acc = 0;
    for (let i = 0; i < program.length; i++) {
        const line = program[i];
        // If the line has been run before, exit. The program is looping!
        if (line.count > 0) {
            return info(acc, false);
        }
        switch (line.cmd) {
            case 'acc':
                acc += line.val;
                break;
            case 'jmp':
                // Subtract 1 because of i++
                i += line.val - 1;
                break;
            case 'nop':
                break
            default:
                console.error('Someone entered an invalid command!');
                return info(acc, false);
        }
        // Increase the count of times the line has been run
        line.count++;
    }
    return info(acc, true);
};

// Part 1
// Runs the program and returns the value in the accumulator before it
//   begins to loop
//   program - The formatted program
const part1 = (program) => {
    const result = run(program);
    if (result.term) {
        console.error("The program terminated, when it should have looped");
    }
    return result.acc;
};

// Part 2
// Changes every encountered nop into jmp and vice versa until the program
//   terminates
//   original - A clean copy of the original formatted program
const part2 = (original) => {
    // This is our copy, for keeping track of how many times we've attempted
    //   editing each line
    const program = copy(original);
    for (let i = 0; i < program.length; i++) {
        const line = program[i];
        // We already attempted editing this line before. We failed somehow!
        if (line.count > 0) {
            break;
        }
        line.count++;
        // Ignore acc commands
        if (line.cmd == 'acc') {
            continue;
        }
        // Copy the original (with its 0 counts) before editing
        const edited = copy(original);
        edited[i].cmd = line.cmd == 'nop' ? 'jmp' : 'nop';
        const result = run(edited);
        if (result.term) {
            return result.acc;
        }
        if (line.cmd == 'jmp') {
            i += line.val - 1;
        }
    }
    console.error("The program never terminated...");
};

const example = format(`nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`);

console.log("Tests:");
console.log("part1(example) == 5");
assert.strictEqual(part1(example), 5);
console.log("part2(example) == 8");
assert.strictEqual(part2(example), 8);
console.log("All tests passed!\n");

const program = format(fs.readFileSync('./input.txt', 'utf8'));

console.log('Part 1:');
console.log(part1(program));

console.log('Part 2:');
console.log(part2(program));
