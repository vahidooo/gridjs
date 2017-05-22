function Cell(grid,cell) {
    this.x = x;
    this.y = y;

    this.cell = cell;
    this.grid = grid;
        //return {position: {x: a, y: b}, member: false, boundary: false, hub: false};

    this.right = function () {
        for (var i = 0; i < this.y; i++) {
            this.cells.push({position: {x: this.x, y: i}, member: false, boundary: false});
        }
        this.x++;
    }


}