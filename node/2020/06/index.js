const fs = require('fs');

const form = fs.readFileSync('./input.txt', 'utf8')
                .trim().split(/\r?\n\r?\n/);

const part1 = (form) => {
    return form.map((group) => {
        return new Set(group.match(/[a-z]/g)).size;
    }).reduce((acc, val) => {
        return acc + val;
    });
};

const part2 = (form) => {
    return form.map((group) => {
        const people = group.split(/\r?\n/);
        return people.slice(1).reduce((acc, person) => {
            return acc.filter((letter) => {
                return person.match(/[a-z]/g).includes(letter);
            });
        }, people[0].match(/[a-z]/g)).length;
    }).reduce((acc, val) => {
        return acc + val;
    });
};

const example = `
abc

a
b
c

ab
ac

a
a
a
a

b`.trim().split(/\r?\n\r?\n/);

console.log("Example 1: " + part1(example));
console.log("Part 1: " + part1(form));
console.log("Example 2: " + part2(example));
console.log("Part 2: " + part2(form));
