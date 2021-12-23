const fs = require('fs');
const assert = require('assert');
const process = require('process');
const { getDefaultSettings } = require('http2');

console.log("Hello, world!");

const format = (text) => {
    return text.trim().split('\n').map((line) => {
        var instruction = {};
        var parts = line.split(' ');
        instruction.on = parts[0] == 'on';
        instruction.region = parts[1].split(',').map((coord) => {
            return coord.split('=')[1].split('..').map(Number);
        });
        return instruction;
    });
};

const get_overlapping_cuboid = (cube1, cube2) => {
    if (cube1[0][1] < cube2[0][0] || cube1[0][0] > cube2[0][1]) {
        return null;
    }
    if (cube1[1][1] < cube2[1][0] || cube1[1][0] > cube2[1][1]) {
        return null;
    }
    if (cube1[2][1] < cube2[2][0] || cube1[2][0] > cube2[2][1]) {
        return null;
    }
    var overlap = [];
    overlap.push([Math.max(cube1[0][0], cube2[0][0]), Math.min(cube1[0][1], cube2[0][1])]);
    overlap.push([Math.max(cube1[1][0], cube2[1][0]), Math.min(cube1[1][1], cube2[1][1])]);
    overlap.push([Math.max(cube1[2][0], cube2[2][0]), Math.min(cube1[2][1], cube2[2][1])]);
    return overlap;
};

// return cuboids that exist in cuboid1 but not in cuboid2
const get_non_overlapping_cuboids = (cuboid1, cuboid2) => {
    if (cuboid1[0][1] < cuboid2[0][0] || cuboid1[0][0] > cuboid2[0][1]) {
        return [cuboid1];
    }
    if (cuboid1[1][1] < cuboid2[1][0] || cuboid1[1][0] > cuboid2[1][1]) {
        return [cuboid1];
    }
    if (cuboid1[2][1] < cuboid2[2][0] || cuboid1[2][0] > cuboid2[2][1]) {
        return [cuboid1];
    }
    if (cuboid1[0][0] < cuboid2[0][0]) {
        var new_cuboid1 = [];
        new_cuboid1.push([cuboid2[0][0], cuboid1[0][1]]);
        new_cuboid1.push(cuboid1[1].slice());
        new_cuboid1.push(cuboid1[2].slice());
        var cuboids = get_non_overlapping_cuboids(new_cuboid1, cuboid2);
        var new_cuboid2 = [];
        new_cuboid2.push([cuboid1[0][0], cuboid2[0][0] - 1]);
        new_cuboid2.push(cuboid1[1].slice());
        new_cuboid2.push(cuboid1[2].slice());
        if (cuboids) {
            cuboids.push(new_cuboid2);
            return cuboids;
        } else {
            return [new_cuboid2];
        }
    }
    if (cuboid1[1][0] < cuboid2[1][0]) {
        var new_cuboid1 = [];
        new_cuboid1.push(cuboid1[0].slice());
        new_cuboid1.push([cuboid2[1][0], cuboid1[1][1]]);
        new_cuboid1.push(cuboid1[2].slice());
        var cuboids = get_non_overlapping_cuboids(new_cuboid1, cuboid2);
        var new_cuboid2 = [];
        new_cuboid2.push(cuboid1[0].slice());
        new_cuboid2.push([cuboid1[1][0], cuboid2[1][0] - 1]);
        new_cuboid2.push(cuboid1[2].slice());
        if (cuboids) {
            cuboids.push(new_cuboid2);
            return cuboids;
        } else {
            return [new_cuboid2];
        }
    }
    if (cuboid1[2][0] < cuboid2[2][0]) {
        var new_cuboid1 = [];
        new_cuboid1.push(cuboid1[0].slice());
        new_cuboid1.push(cuboid1[1].slice());
        new_cuboid1.push([cuboid2[2][0], cuboid1[2][1]]);
        var cuboids = get_non_overlapping_cuboids(new_cuboid1, cuboid2);
        var new_cuboid2 = [];
        new_cuboid2.push(cuboid1[0].slice());
        new_cuboid2.push(cuboid1[1].slice());
        new_cuboid2.push([cuboid1[2][0], cuboid2[2][0] - 1]);
        if (cuboids) {
            cuboids.push(new_cuboid2);
            return cuboids;
        } else {
            return [new_cuboid2];
        }
    }
    if (cuboid1[0][1] > cuboid2[0][1]) {
        var new_cuboid1 = [];
        new_cuboid1.push([cuboid1[0][0], cuboid2[0][1]]);
        new_cuboid1.push(cuboid1[1].slice());
        new_cuboid1.push(cuboid1[2].slice());
        var cuboids = get_non_overlapping_cuboids(new_cuboid1, cuboid2);
        var new_cuboid2 = [];
        new_cuboid2.push([cuboid2[0][1] + 1, cuboid1[0][1]]);
        new_cuboid2.push(cuboid1[1].slice());
        new_cuboid2.push(cuboid1[2].slice());
        if (cuboids) {
            cuboids.push(new_cuboid2);
            return cuboids;
        } else {
            return [new_cuboid2];
        }
    }
    if (cuboid1[1][1] > cuboid2[1][1]) {
        var new_cuboid1 = [];
        new_cuboid1.push(cuboid1[0].slice());
        new_cuboid1.push([cuboid1[1][0], cuboid2[1][1]]);
        new_cuboid1.push(cuboid1[2].slice());
        var cuboids = get_non_overlapping_cuboids(new_cuboid1, cuboid2);
        var new_cuboid2 = [];
        new_cuboid2.push(cuboid1[0].slice());
        new_cuboid2.push([cuboid2[1][1] + 1, cuboid1[1][1]]);
        new_cuboid2.push(cuboid1[2].slice());
        if (cuboids) {
            cuboids.push(new_cuboid2);
            return cuboids;
        } else {
            return [new_cuboid2];
        }
    }
    if (cuboid1[2][1] > cuboid2[2][1]) {
        var new_cuboid1 = [];
        new_cuboid1.push(cuboid1[0].slice());
        new_cuboid1.push(cuboid1[1].slice());
        new_cuboid1.push([cuboid1[2][0], cuboid2[2][1]]);
        var cuboids = get_non_overlapping_cuboids(new_cuboid1, cuboid2);
        var new_cuboid2 = [];
        new_cuboid2.push(cuboid1[0].slice());
        new_cuboid2.push(cuboid1[1].slice());
        new_cuboid2.push([cuboid2[2][1] + 1, cuboid1[2][1]]);
        if (cuboids) {
            cuboids.push(new_cuboid2);
            return cuboids;
        } else {
            return [new_cuboid2];
        }
    }
    return null;
};

// return true if cuboids changed
const check_cuboids = (cuboids, instruction_cuboids, on) => {
    if (instruction_cuboids.length == 0) {
        return false;
    }
    for (var i = 0; i < cuboids.length; i++) {
        var cuboid = cuboids[i];
        for (var j = 0; j < instruction_cuboids.length; j++) {
            var instruction_cuboid = instruction_cuboids[j];
            // overlapping cuboid
            var overlapping_cuboid = get_overlapping_cuboid(cuboid, instruction_cuboid);
            if (overlapping_cuboid) {
                var non_overlapping_instruction_cuboids = get_non_overlapping_cuboids(instruction_cuboid, cuboid);
                var non_overlapping_cuboids = get_non_overlapping_cuboids(cuboid, instruction_cuboid);
                if (non_overlapping_instruction_cuboids) {
                    for (var non_overlapping_instruction_cuboid of non_overlapping_instruction_cuboids) {
                        instruction_cuboids.push(non_overlapping_instruction_cuboid);
                    }
                }
                if (non_overlapping_cuboids) {
                    for (var non_overlapping_cuboid of non_overlapping_cuboids) {
                        cuboids.push(non_overlapping_cuboid);
                    }
                }
                if (on) {
                    cuboids.splice(i, 1, overlapping_cuboid);
                } else {
                    cuboids.splice(i, 1);
                }
                instruction_cuboids.splice(j, 1);
                return true;
            }
        }
    }
    if (on && instruction_cuboids.length) {
        for (var instruction_cuboid of instruction_cuboids) {
            cuboids.push(instruction_cuboid);
        }
    }
    return false;
};

const part1 = (instructions) => {
    var cuboids = [];
    instructions.forEach((instruction, i) => {
        for (var coord of instruction.region) {
            if (Math.abs(coord[0]) > 50 || Math.abs(coord[1]) > 50) {
                return;
            }
        }
        var instruction_cuboids = [instruction.region];
        while (check_cuboids(cuboids, instruction_cuboids, instruction.on)) {
            // do nothing!
        }
        console.log("%i/%i", i, instructions.length);
    });
    var total_volume = 0;
    for (var cuboid of cuboids) {
        var volume = 1;
        for (range of cuboid) {
            volume *= range[1] - range[0] + 1;
        }
        total_volume += volume;
    }
    return total_volume;
};

const part2 = (input) => {

};

const exampleText = `on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10`;

const exampleText2 = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`;

const exampleFormatStart = process.hrtime();
const example = format(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 39);
    console.log("Test 1 passed!");
} else {
    console.log("Part 1 not yet implemented.");
}

const test2Start = process.hrtime();
const test2Solution = part2(example);
const test2End = process.hrtime(test2Start);
if (test2Solution) {
    assert.strictEqual(test2Solution, undefined);
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