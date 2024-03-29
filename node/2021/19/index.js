const fs = require('fs');
const assert = require('assert');
const process = require('process');

console.log("Hello, world!");

const format = (text) => {
    return text.trim().split('\n\n').map((scanner) => {
        return scanner.split('\n').slice(1).map((row) => {
            return row.split(',').map(Number);
        });
    });
};

const format_dict = (scanner) => {
    var scanner_dict = {};
    for (var j = 0; j < scanner.length; j++) {
        var beacon = scanner[j];
        var x = beacon[0];
        var y = beacon[1];
        var z = beacon[2];
        if (!scanner_dict[x]) {
            scanner_dict[x] = {};
        }
        if (!scanner_dict[x][y]) {
            scanner_dict[x][y] = {};
        }
        scanner_dict[x][y][z] = true;
    }
    return scanner_dict;
}

const rotate_beacon = (beacon, rotation) => {
    var new_beacon = beacon.slice();
    var x_rotation = rotation[0];
    while (x_rotation > 0) {
        var y = new_beacon[1];
        var z = new_beacon[2];
        new_beacon[1] = z; // z -> y
        new_beacon[2] = -y; // -y -> z
        x_rotation--;
    }
    var y_rotation = rotation[1];
    while (y_rotation > 0) {
        var x = new_beacon[0];
        var z = new_beacon[2];
        new_beacon[0] = z; // z -> x
        new_beacon[2] = -x; // -x -> z
        y_rotation--;
    }
    var z_rotation = rotation[2];
    while (z_rotation > 0) {
        var x = new_beacon[0];
        var y = new_beacon[1];
        new_beacon[0] = y; // y -> x
        new_beacon[1] = -x; // -x -> y
        z_rotation--;
    }
    return new_beacon;
};

const transform_beacon = (beacon, transformation) => {
    var new_beacon = rotate_beacon(beacon, transformation["rotation"]);
    for (var i = 0; i < 3; i++) {
        new_beacon[i] -= transformation["position"][i];
    }
    return new_beacon;
};

const transform_scanner = (scanner, transformation) => {
    for (var i = 0; i < scanner.length; i++) {
        scanner[i] = transform_beacon(scanner[i], transformation);
    }
    return scanner;
};

const match_rotation = (s1_beacon, s2_beacons, s1_dict, rotation) => {
    var rotated_first = rotate_beacon(s2_beacons[0], rotation);
    var position = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        position[i] = rotated_first[i] - s1_beacon[i];
    }
    var transformation = {};
    transformation["rotation"] = rotation;
    transformation["position"] = position;
    for (var b = 1; b < s2_beacons.length; b++) {
        var transformed = transform_beacon(s2_beacons[b], transformation);
        var x = transformed[0];
        var y = transformed[1];
        var z = transformed[2];
        if (!s1_dict[x]) {
            return null;
        }
        if (!s1_dict[x][y]) {
            return null;
        }
        if (!s1_dict[x][y][z]) {
            return null;
        }
    }
    return transformation;
};

const match_beacons = (s1_beacon, s2_beacons, s1_dict, transformation = null) => {
    if (transformation) {
        var new_transformation = match_rotation(s1_beacon, s2_beacons, s1_dict, transformation["rotation"]);
        if (!new_transformation) {
            return null;
        }
        var position = transformation["position"];
        var new_position = new_transformation["position"];
        for (var i = 0; i < 3; i++) {
            if (position[i] != new_position[i]) {
                return null;
            }
        }
        return transformation;
    }
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 4; j++) {
            if (i == 1 && j == 1) {
                continue;
            }
            for (var k = 0; k < 4; k++) {
                var transformation = match_rotation(s1_beacon, s2_beacons, s1_dict, [i, j, k]);
                if (transformation != null) {
                    return transformation;
                }
            }
        }
    }
    return null;
};

const compare_transformations = (transformation1, transformation2) => {
    for (var i = 0; i < 3; i++) {
        if (transformation1["orientation"][i] != transformation2["orientation"][i]) {
            return false;
        }
        if (transformation1["position"][i] != transformation2["position"][i]) {
            return false;
        }
    }
    return true;
};

const match_scanners = (scanner1, scanner2, s1_dict) => {
    var matches = [];
    var transformation = null;
    for (var k = 0; k < scanner2.length; k++) {
        for (var l = k + 1; l < scanner2.length; l++) {
            for (var i = 0; i < scanner1.length; i++) {
                var new_transformation = match_beacons(scanner1[i], [scanner2[k], scanner2[l]], s1_dict, transformation);
                if (new_transformation) {
                    transformation = new_transformation;
                    if (matches.indexOf(k) < 0) {
                        matches.push(k);
                    }
                    if (matches.indexOf(l) < 0) {
                        matches.push(l);
                    }
                    if (matches.length == 12) {
                        return transformation;
                    }
                }
            }
        }
    }
    return null;
};

const get_unique_beacons = (scanners) => {
    var beacons = {};
    var unique_beacons = [];
    for (var scanner of scanners) {
        for (var beacon of scanner) {
            var x = beacon[0];
            var y = beacon[1];
            var z = beacon[2];
            if (!beacons[x]) {
                beacons[x] = {};
            }
            if (!beacons[x][y]) {
                beacons[x][y] = {};
            }
            if (!beacons[x][y][z]) {
                beacons[x][y][z] = true;
                unique_beacons.push(beacon);
            }
        }
    }
    return unique_beacons;
};

const get_all_beacons = (scanners) => {
    var scanner_dicts = [];
    for (var i = 0; i < scanners.length; i++) {
        scanner_dicts.push(format_dict(scanners[i]));
    }
    var transformed = [0];
    while (transformed.length < scanners.length) {
        for (var i = 0; i < scanners.length; i++) {
            if (transformed.indexOf(i) < 0) {
                continue;
            }
            for (var j = 1; j < scanners.length; j++) {
                if (transformed.indexOf(j) > -1) {
                    continue;
                }
                var transformation = match_scanners(scanners[i], scanners[j], scanner_dicts[i]);
                if (transformation != null) {
                    transform_scanner(scanners[j], transformation);
                    scanner_dicts[j] = format_dict(scanners[j]);
                    transformed.push(j);
                    console.log("%d, %d", i, j);
                    console.log("%d/%d", transformed.length, scanners.length);
                }
            }
        }
    }
    return get_unique_beacons(scanners);
};

const get_all_positions = (scanners) => {
    var positions = [[0, 0, 0]];
    var scanner_dicts = [];
    for (var i = 0; i < scanners.length; i++) {
        scanner_dicts.push(format_dict(scanners[i]));
    }
    var transformed = [0];
    while (transformed.length < scanners.length) {
        for (var i = 0; i < scanners.length; i++) {
            if (transformed.indexOf(i) < 0) {
                continue;
            }
            for (var j = 1; j < scanners.length; j++) {
                if (transformed.indexOf(j) > -1) {
                    continue;
                }
                var transformation = match_scanners(scanners[i], scanners[j], scanner_dicts[i]);
                if (transformation != null) {
                    transform_scanner(scanners[j], transformation);
                    positions.push(transformation["position"]);
                    scanner_dicts[j] = format_dict(scanners[j]);
                    transformed.push(j);
                    console.log("%d, %d", i, j);
                    console.log("%d/%d", transformed.length, scanners.length);
                }
            }
        }
    }
    return positions;
};

const part1 = (scanners) => {
    var beacons = get_all_beacons(scanners);
    return beacons.length;
};

const part2 = (scanners) => {
    var positions = get_all_positions(scanners);
    var max_manhattan_distance = 0;
    for (var i = 0; i < positions.length; i++) {
        for (var j = i + 1; j < positions.length; j++) {
            var manhattan_distance = 0;
            for (var k = 0; k < 3; k++) {
                manhattan_distance += Math.abs(positions[i][k] - positions[j][k]);
            }
            max_manhattan_distance = Math.max(max_manhattan_distance, manhattan_distance);
        }
    };
    return max_manhattan_distance;
};

const exampleText = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;

const exampleFormatStart = process.hrtime();
const example = format(exampleText);
const exampleFormatEnd = process.hrtime(exampleFormatStart);

const test1Start = process.hrtime();
const test1Solution = part1(example);
const test1End = process.hrtime(test1Start);
if (test1Solution) {
    assert.strictEqual(test1Solution, 79);
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