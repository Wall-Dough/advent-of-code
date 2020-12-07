function getSeatId(value) {
    return parseInt(value.replace(/[BR]/g, '1').replace(/[FL]/g, '0'), 2);
}

function getOccupiedSeats() {
    var input = getInputLines();
    return input.map(getSeatId);
}

function solve_day5_part1() {
    var occupied = getOccupiedSeats();
    return Math.max(...occupied);
}

addSolution(5, 1, solve_day5_part1);

function solve_day5_part2() {
    var occupied = getOccupiedSeats();
    var min = Math.min(...occupied);
    var max = Math.max(...occupied);
    var sum = occupied.reduce(function (acc, val) {
        return acc + val;
    });
    return ((min + max) / 2 * (occupied.length + 1)) - sum;
}

addSolution(5, 2, solve_day5_part2);
