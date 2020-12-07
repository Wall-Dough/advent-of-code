const fs = require('fs');

const report = fs.readFileSync('./input.txt', 'utf8')
                .trim().split(/\r?\n/).map(Number);

const part1 = (report) => {
    const results = report.flatMap((v1, i) => {
        return report.slice(i + 1).filter((v2) => {
            return v1 + v2 == 2020;
        }).map((v2) => {
            return [v1, v2];
        });
    });
    return results[0][0] * results[0][1];
};

const part2 = (report) => {
    const results = report.flatMap((v1, i) => {
        return report.slice(i + 1).flatMap((v2, j) => {
            return report.slice(j + 1).filter((v3) => {
                return v1 + v2 + v3 == 2020;
            }).map((v3) => {
                return [v1, v2, v3];
            });
        });
    });
    return results[0][0] * results[0][1] * results[0][2];
};

console.log("= Advent of Code Day 1 =");
console.log("Part 1: " + part1(report));
console.log("Part 2: " + part2(report));
