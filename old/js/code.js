function getInput() {
    var selector = document.getElementById("solutionSelector");
    console.log(selector.value);
    var match = selector.value.match(/([0-9]+),[0-9]+/);
    return document.getElementById("input-" + match[1]).innerHTML;
}

function getInputLines() {
    var input = getInput();
    return input.split(/\r?\n/);
}

var solutions = {};

function addSolution(day, part, solution, selected) {
    var key = day.toString() + "," + part.toString();
    var option = document.createElement("option");
    option.value = key;
    option.innerHTML = "Day " + day.toString() + ", Part " + part.toString();
    if (selected) {
        option.selected = true;
    }
    document.getElementById("solutionSelector").appendChild(option);
    solutions[key] = solution;
}

function putSolution(num) {
    document.getElementById("output").value = num;
}

function solve() {
    document.getElementById("input").value = getInput();
    var selector = document.getElementById("solutionSelector");
    var value = selector.value;
    putSolution(solutions[value]());
}
