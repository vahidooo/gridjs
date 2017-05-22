function Grid(x, y) {
    this.x = x;
    this.y = y;

    this.cells = d3.cross(d3.range(0, this.y, 1), d3.range(0, this.x, 1), function (a, b) {
        return {position: {x: a, y: b}, member: false, boundary: false, hub: false};
    });


    this.addColumn = function () {
        for (var i = 0; i < this.y; i++) {
            this.cells.push({position: {x: this.x, y: i}, member: false, boundary: false});
        }
        this.x++;
    }

    this.addRow = function () {
        for (var i = 0; i < this.x; i++) {
            this.cells.push({position: {x: i, y: this.y}, member: false, boundary: false});
        }
        this.y++;
    }

    this.find = function (i, j) {
        var cell = this.cells.find(function (item) {
            return (item.position.x == i) && (item.position.y == j);
        });
        if (cell != undefined) {
            return cell;
        }
        return undefined;
    };

    this.solve = function () {
        var b = 0;
        for (var c in this.cells) {
            var cell = this.cells[c];
            cell.boundary = false;
            if (!cell.member)
                continue;

            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (j == 0 && i == 0)
                        continue;

                    var adj = this.cells.find(function (item) {
                        return (item.position.x == cell.position.x + i) && (item.position.y == cell.position.y + j);
                    });

                    if ((adj == undefined || !adj.member) && (!cell.boundary)) {
                        cell.boundary = true;
                    }
                }
            }
        }
    };


    this.hub = function () {
        var b = 0;

        var conditions = [
            {direction: {x: -1, y: 0}, adjs: [{x: -1, y: -1}, {x: -1, y: 1}]},
            {direction: {x: 1, y: 0}, adjs: [{x: 1, y: -1}, {x: 1, y: 1}]},
            {direction: {x: 0, y: -1}, adjs: [{x: -1, y: -1}, {x: 1, y: -1}]},
            {direction: {x: 0, y: 1}, adjs: [{x: -1, y: 1}, {x: 1, y: 1}]}
        ];

        for (var c in this.cells) {
            var cell = this.cells[c];
            var adj = [];

            cell.hub = false;
            if (!cell.boundary)
                continue;

            for (var i in conditions) {
                var condition = conditions[i];

                var dirCell = this.find(cell.position.x + condition.direction.x, cell.position.y + condition.direction.y);
                var adjCell0 = this.find(cell.position.x + condition.adjs[0].x, cell.position.y + condition.adjs[0].y);
                var adjCell1 = this.find(cell.position.x + condition.adjs[1].x, cell.position.y + condition.adjs[1].y);

                if (dirCell == undefined || adjCell0 == undefined || adjCell1 == undefined) {
                    continue;
                }

                if (dirCell.member && !adjCell0.member && !adjCell1.member) {
                    cell.hub = true;
                }
            }
        }


        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (j == 0 && i == 0)
                    continue;

                var adj = this.cells.find(function (item) {
                    return (item.position.x == cell.position.x + i) && (item.position.y == cell.position.y + j);
                });

                if ((adj == undefined || !adj.member) && (!cell.boundary)) {
                    cell.boundary = true;
                }
            }
        }


    };
}

function Plane(grid, svg, cellSize) {
    this.svg = svg;
    this.cellSize = cellSize;

    this.width = function () {
        return cellSize * grid.x * 2;
    };

    this.height = function () {
        return cellSize * grid.y * 2;
    };


    this.draw = function () {

        d3.selectAll("svg > *").remove();

        svg.attr("width", this.width())
            .attr("height", this.height());

        var view = this.svg.selectAll(".cell")
            .data(grid.cells);

        view.enter().append("rect")
            .attr("x", function (d) {
                return d.position.x * cellSize;
            })
            .attr("y", function (d) {
                return d.position.y * cellSize;
            })
            .attr('id', function (d) {
                return d.position.x + '-' + d.position.y;
            })
            .attr("height", cellSize)
            .attr("width", cellSize)
            .classed("cell", true)
            .classed('boundary-cell', function (d, i) {
                return d.boundary;
            })
            .classed('member-cell', function (d, i) {
                return d.member;
            })
            .classed('hub-cell', function (d, i) {
                return d.hub;
            })
            .on("mouseover", function (d) {
                if (d3.event.shiftKey) {
                    d.member = true;
                    d3.select(this).classed("member-cell", true);

                }
            }).on("click", function (d) {
                if (d3.event.shiftKey) {
                    d.member = !d.member;
                    if (!d.member) {
                        d.boundary = false;
                    }
                    if (d.member) {
                        d3.select(this).classed("member-cell", true);
                    } else {
                        d3.select(this).classed("member-cell", false);
                        d3.select(this).classed("boundary-cell", false);
                    }
                }
            });

        view.exit().remove();
    };

    this.addColumn = function () {
        grid.addColumn();
        this.draw();
    }

    this.addRow = function () {
        grid.addRow();
        this.draw();
    }
}