function solve_day2_part1() {
    var input = getInputLines();
    var passwords = input.filter(function(value) {
        var entry = value.match(/([0-9]+)-([0-9+]+) ([a-z]): ([a-z]+)/);
        var letter = entry[3];
        var password = entry[4];
        var chars = password.match(new RegExp(letter, "g"));
        var charCount = chars == null ? 0 : chars.length;
        return charCount >= entry[1] && charCount <= entry[2];
    });
    return passwords.length;
}

addSolution(2, 1, solve_day2_part1);

function solve_day2_part2() {
    var input = getInputLines();
    var passwords = input.filter(function(value) {
        var entry = value.match(/([0-9]+)-([0-9+]+) ([a-z]): ([a-z]+)/);
        var letter = entry[3];
        var password = entry[4];
        return ((password.charAt(parseInt(entry[1]) - 1) == letter) +
                (password.charAt(parseInt(entry[2]) - 1) == letter)) == 1;
    });

    return passwords.length;
}

addSolution(2, 2, solve_day2_part2);
