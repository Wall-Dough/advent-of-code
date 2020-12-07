function getReport() {
    return getInputLines().map(function (v) {
        return parseInt(v);
    });
}

function solve_day1_part1() {
    var report = getReport();
    console.log(report);
    var results = report.flatMap(function(v1, i) {
        return report.slice(i + 1).filter(function (v2) {
            return v1 + v2 == 2020;
        }).map(function (v2) {
            return [v1, v2];
        });
    });
    return results[0][0] * results[0][1];
}

addSolution(1, 1, solve_day1_part1);

function solve_day1_part2() {
    var report = getReport();
    var results = report.flatMap(function(v1, i) {
        return report.slice(i + 1).flatMap(function(v2, j) {
            return report.slice(j + 1).filter(function(v3) {
                return v1 + v2 + v3 == 2020;
            }).map(function(v3) {
                return [v1, v2, v3];
            });
        });
    });
    return results[0][0] * results[0][1] * results[0][2];
}

addSolution(1, 2, solve_day1_part2);
