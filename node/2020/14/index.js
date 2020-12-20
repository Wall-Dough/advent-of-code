const fs = require('fs');
const assert = require('assert');
const process = require('process');

const replaceAt = (string, i, char) => {
    return string.substr(0, i) + char + string.substr(i + 1);
};

const applyBitMask = (vals, mask, bit) => {
    const results = [];
    for (let val of vals) {
        if (bit == 0 || bit == undefined) {
            val &= ~mask;
            results.push(val);
        }
        if (bit == 1 || bit == undefined) {
            val |= mask;
            results.push(val);
        }
    }
    return results;
};

const replaceBit = (vals, i, bit) => {
    return applyBitMask(vals, BigInt(1) << BigInt(i), bit);
};

const getValueMask = (maskString) => {
    const mask = [];
    for (let i = 0; i < maskString.length; i++) {
        const char = maskString.charAt(i);
        if (char == 'X') {
            continue;
        }
        mask.push([i, char]);
    }
    return mask;
};

const numberToBinary = (number, length) => {
    if (!length) {
        length = 36;
    }
    let binary = number.toString(2);
    binary = '0'.repeat(length - binary.length) + binary;
    return binary;
};

const applyMaskToValue = (memory, mask, index, value) => {
    let binary = numberToBinary(value);
    for (let bit of mask) {
        binary = binary.substr(0, bit[0]) + bit[1] + binary.substr(bit[0] + 1);
    }
    const masked = parseInt(binary, 2);
    memory[index] = masked;
};

const getIndexMask = (maskString) => {
    const mask = [];
    for (let i = 0; i < maskString.length; i++) {
        const char = maskString.charAt(i);
        if (char == '0') {
            continue;
        }
        if (char == '1') {
            mask.push([35 - i, BigInt(1)]);
        } else {
            mask.push([35 - i]);
        }
    }
    return mask;
};

const applyMaskToIndex = (memory, mask, index, value) => {
    let indices = [index];
    for (let bit of mask) {
        indices = replaceBit(indices, bit[0], bit[1]);
    }
    for (let i of indices) {
        memory[i] = value;
    }
};

const execute = (lines, getMask, applyMask) => {
    const memory = {};
    let mask = undefined;
    for (let i = 0; i < lines.length; i++) {
        const mem = lines[i].match(/mem\[([0-9]+)\] = ([0-9]+)/);
        if (mem) {
            applyMask(memory, mask, BigInt(mem[1]), BigInt(mem[2]));
            continue;
        }
        const maskMatch = lines[i].match(/mask = (.+)/);
        if (maskMatch) {
            mask = getMask(maskMatch[1]);
            continue;
        }
        console.error('Encountered an invalid command');
    }
    return Number(Object.values(memory).reduce((acc, val) => {
        return BigInt(acc) + BigInt(val ? val : 0);
    }, 0));
};

const part1 = (text) => {
    const lines = text.trim().split(/r?\n/);
    return execute(lines, getValueMask, applyMaskToValue);
};

const part2 = (text) => {
    const lines = text.trim().split(/r?\n/);
    return execute(lines, getIndexMask, applyMaskToIndex);
};

const part2Small = (text, start, end) => {
    const lines = text.trim().split(/r?\n/);
    return execute(lines.slice(start, end), getIndexMask, applyMaskToIndex);
};

const example1Text = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`;

const test1Start = process.hrtime();
const test1Solution = part1(example1Text);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 165);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const example2Text = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`;

const test2Start = process.hrtime();
const test2Solution = part2(example2Text);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, 208);
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