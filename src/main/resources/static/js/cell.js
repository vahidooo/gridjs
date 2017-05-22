function Cell(grid, position) {
    this.position = position;

    this.grid = grid;


    this.member = false;
    this.boundary = false;
    this.hub = false;


    this.right = function () {
        return this.grid.find(this.position.x + 1, this.position.y);
    };

    this.right_down = function () {
        return this.grid.find(this.position.x + 1, this.position.y + 1);
    };

    this.right_up = function () {
        return this.grid.find(this.position.x + 1, this.position.y - 1);
    };

    this.left = function () {
        return this.grid.find(this.position.x - 1, this.position.y);
    };
    this.left_up = function () {
        return this.grid.find(this.position.x - 1, this.position.y - 1);
    };
    this.left_down = function () {
        return this.grid.find(this.position.x - 1, this.position.y + 1);
    };


    this.up = function () {
        return this.grid.find(this.position.x, this.position.y - 1);
    };

    this.down = function () {
        return this.grid.find(this.position.x, this.position.y + 1);
    };


    this.adjacents = function () {
        return {
            'lu': this.left_up(), 'u': this.up(), 'ru': this.right_up(),
            'l': this.left(), 'r': this.right(),
            'ld': this.left_down(), 'd': this.down(), 'rd': this.right_down()
        };
    };

    this.degree = function (filter) {

        if (!this.member)
            return 0;

        if (filter == undefined) {
            filter = function (cell) {
                return true;
            };
        }

        var degree = 0;
        var adjs = this.adjacents();
        adjs = [adjs.r, adjs.l, adjs.u, adjs.d];
        for (var a in adjs) {
            var adj = adjs[a];
            if (adj != undefined && adj.member && filter(adj)) {
                degree++;
            }
        }
        return degree;
    };

};