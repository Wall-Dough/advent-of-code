const fs = require('fs');

const passwords = fs.readFileSync('./input.txt', 'utf8').trim().split(/\r?\n/);

const part1 = (input) => {
    return input.filter((value) => {
        const entry = value.match(/([0-9]+)-([0-9+]+) ([a-z]): ([a-z]+)/);
        const letter = entry[3];
        const password = entry[4];
        const chars = password.match(new RegExp(letter, "g"));
        const charCount = chars == null ? 0 : chars.length;
        return charCount >= entry[1] && charCount <= entry[2];
    }).length;
};

const part2 = (input) => {
    return input.filter((value) => {
        const entry = value.match(/([0-9]+)-([0-9+]+) ([a-z]): ([a-z]+)/);
        const letter = entry[3];
        const password = entry[4];
        return ((password.charAt(parseInt(entry[1]) - 1) == letter) +
                (password.charAt(parseInt(entry[2]) - 1) == letter)) == 1;
    }).length;
};

console.log("Part 1: " + part1(passwords));
console.log("Part 2: " + part2(passwords));
