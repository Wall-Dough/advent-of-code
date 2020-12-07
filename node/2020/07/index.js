const fs = require('fs');
const assert = require('assert');


// Creates a dictionary of colors that each bag can contain e.g.:
// {
//   'red': {
//     'green': 2,
//     'blue': 1
//   }, 'blue': {
//     'green': 1
//   }, 'green': {}
// }
const createDict = (bags) => {
    const dict = {};
    bags.forEach((bag) => {
        const matches = bag.match(/(.+) bags contain (.+)\./);
        const color = matches[1];
        const contains = {};
        if (matches[2] != 'no other bags') {
            matches[2].split(', ').forEach((contain) => {
                const matches = contain.match(/([0-9]+) (.+) bags?/);
                const count = Number(matches[1]);
                const color = matches[2];
                contains[color] = count;
            });
        }
        dict[color] = contains;
    });
    return dict;
};

// Creates a reverse dictionary of colors that each color can be in e.g.:
// {
//   'red': [],
//   'green': ['red', 'blue'],
//   'blue': ['red']
// }
const reverseDict = (dict) => {
    const reverse = {};
    Object.keys(dict).forEach((color) => {
        Object.keys(dict[color]).forEach((color2) => {
            if (reverse[color2] == null) {
                reverse[color2] = [];
            }
            reverse[color2].push(color);
        });
    });
    return reverse;
};

// May return duplicates - will need to create a set for uniques
const getAllBags = (color, reverse) => {
    const results = reverse[color];
    if (results == null || results.length == 0) {
        return [];
    }
    const allBags = results;
    results.forEach((color2) => {
        allBags.push(...getAllBags(color2, reverse));
    });
    return allBags;
};

const countBags = (color, reverse) => {
    const results = getAllBags(color, reverse);
    return new Set(results).size;
};

const countInside = (color, dict) => {
    const results = dict[color];
    const keys = results == null ? [] : Object.keys(results);
    if (keys.length == 0) {
        return 1;
    }
    return keys.reduce((acc, color2) => {
        return acc + (results[color2] * countInside(color2, dict));
    }, 1);
};

const myBag = 'shiny gold';

const part1 = (bags) => {
    const dict = createDict(bags);
    const reverse = reverseDict(dict);
    return countBags(myBag, reverse);
};

const part2 = (bags) => {
    const dict = createDict(bags);
    return countInside(myBag, dict) - 1;
};

const example = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`
                .trim().split(/\r?\n/);

assert.strictEqual(part1(example), 4);

const example2 = `shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`
                .trim().split(/\r?\n/);;

assert.strictEqual(part2(example), 32);
assert.strictEqual(part2(example2), 126);

const bags = fs.readFileSync('./input.txt', 'utf8')
                .trim().split(/\r?\n/);

console.log(`Part 1: ${part1(bags)}`);
console.log(`Part 2: ${part2(bags)}`);
