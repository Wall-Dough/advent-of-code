const fs = require('fs');
const assert = require('assert');


// Runs the program from the last spot in the history, until it loops or terminates
// Returns undefined if it loops, or the final value of acc if it terminates
const run = (program, history, acc) => {
    for (let i = history.pop(); i < program.length; i++) {
        if (history.includes(i)) {
            return;
        }
        history.push(i);
        const line = program[i].match(/([a-z]{3}) ((\+|\-)[0-9]+)?/);
        switch (line[1]) {
            case 'acc':
                acc += Number(line[2]);
                break;
            case 'jmp':
                i += Number(line[2]) - 1;
                break;
            case 'nop':
                break;
            default:
                console.error('Encountered an invalid command.');
        }
    }
    return acc;
};

const part2 = (input) => {
    const program = input.trim().split(/\r?\n/);
    const history = [];
    let acc = 0;
    for (let i = 0; i < program.length; i++) {
        if (history.includes(i)) {
            break;
        }
        history.push(i);
        const line = program[i].match(/([a-z]{3}) ((\+|\-)[0-9]+)?/);
        switch (line[1]) {
            case 'acc':
                acc += Number(line[2]);
                break;
            case 'jmp':
            case 'nop':
                const edited = [...program];
                edited[i] = edited[i].replace(/[a-z]{3}/, line[1] == 'jmp' ? 'nop' : 'jmp');
                const result = run(edited, [...history], acc);
                if (result != undefined) {
                    return result;
                }
                break;
            default:
                console.error('Encountered an invalid command.');
        }
        if (line[1] == 'jmp') {
            i += Number(line[2]) - 1;
        }
    }
    console.error("No solution was found.");
};

const input = fs.readFileSync('./input.txt', 'utf8');
console.log("Part 2:");
console.log(part2(input));
