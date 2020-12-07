function countTrees(right, down) {
    var slope = getInputLines();
    var trees = slope.filter(function() {
        if (slope.length == down) {
            return false;
        }
        slope = slope.slice(down);
        slope = slope.map(function(value) {
            return value.slice(right) + value.slice(0, right);
        });
        return slope[0].charAt(0) == '#';
    });
    return trees.length;
}

function solve_day3_part1() {
    return countTrees(3, 1);
}

addSolution(3, 1, solve_day3_part1);

function solve_day3_part2() {
    var solution = countTrees(1, 1);
    solution *= countTrees(3, 1);
    solution *= countTrees(5, 1);
    solution *= countTrees(7, 1);
    solution *= countTrees(1, 2);
    return solution;
}

addSolution(3, 2, solve_day3_part2);
