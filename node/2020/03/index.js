const fs = require('fs');
const assert = require('assert');


const countTrees = (slope, route) => {
    return slope.filter(() => {
        if (slope.length <= route[1]) {
            return false;
        }
        slope = slope.slice(route[1]).map((value) => {
            return value.slice(route[0]) + value.slice(0, route[0]);
        });
        return slope[0].charAt(0) == '#';
    }).length;
};

const part1 = countTrees;

const part2 = (slope, routes) => {
    return routes.reduce((acc, route) => {
        return acc * countTrees(slope, route);
    }, 1);
};

const route = [3, 1];
const routes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];

// Tests

const example = `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`.trim().split(/\r?\n/);

assert.strictEqual(part1(example, route), 7);
assert.strictEqual(part2(example, routes), 336);

// Solutions

const slope = fs.readFileSync('./input.txt', 'utf8').trim().split(/\r?\n/);

console.log(`Part 1: ${part1(slope, route)}`);
console.log(`Part 2: ${part2(slope, routes)}`);
