function Grid(x, y) {
    this.x = x;
    this.y = y;

    this.cells = [];
    for (var i = 0; i < x; i++) {
        //var col = [];
        for (var j = 0; j < y; j++) {
            this.cells.push(new Cell(this, {x: i, y: j}));
        }
        //this.cells.push(col);
    }


    //this.cells = d3.cross(d3.range(0, this.y, 1), d3.range(0, this.x, 1), function (a, b) {
    //    return new Cell(grid,{x: a, y: b});
    //});


    var addCell = function (cell) {
        cells.push(new Cell(this, {x: a, y: b}));
    };

    this.addColumn = function () {
        for (var i = 0; i < this.y; i++) {
            addCell({x: this.x, y: i});
        }
        this.x++;
    };

    this.addRow = function () {
        for (var i = 0; i < this.x; i++) {
            addCell({x: i, y: this.y});
        }
        this.y++;
    };

    this.find = function (i, j) {
        return this.cells.find(function (item) {
            return (item.position.x == i) && (item.position.y == j);
        });


        //if( i < 0 || i >= this.x || j < 0 || j >= this.y )
        //    return undefined;
        //
        //return this.cells[i][j];
    };

    this.solve = function () {
        var b = 0;
        for (var c in this.cells) {
            var cell = this.cells[c];
            cell.boundary = false;
            cell.hub = false;
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


                if (cell.degree( ) == 1) {
                    cell.hub = true;
                }

                if (cell.degree(function(cell) { return cell.boundary;}) == 2) {
                    if ((this.isMember(cell.right())) && this.isMember(cell.left())
                        || (this.isMember(cell.down()) && this.isMember(cell.up()))) {
                        cell.hub = true;
                    }
                }

            }
        }
    };


    this.isMember = function (cell) {
        return (cell != undefined && cell.member);
    }

}