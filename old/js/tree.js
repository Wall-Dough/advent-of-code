function buildTree() {
    var tree = document.getElementById("tree");
    var star = document.createElement("div");
    star.setAttribute("class", "star");
    star.appendChild(document.createElement("div"));
    tree.appendChild(star);
    var cur = 0;
    var keys = Object.keys(solutions);
    for (var i = 1; i <= 7; i++) {
        var leaves = document.createElement("div");
        leaves.setAttribute("class", "leaves");
        for (var j = 0; j < i; j++) {
            var leaf = document.createElement("div");
            if (i > 2) {
                var ornament = document.createElement("div");
                if (cur < keys.length) {
                    ornament.innerHTML = keys[cur];
                    cur++;
                }
                leaf.appendChild(ornament);
            }
            leaves.appendChild(leaf);
        }
        tree.appendChild(leaves);
    }
    var trunk = document.createElement("div");
    trunk.setAttribute("class", "trunk");
    trunk.appendChild(document.createElement("div"));
    tree.appendChild(trunk);
}

buildTree();
