function draw_plane(svg, width, height, cellSize) {

    var dx = d3.range(0, width + 1, cellSize);
    var dy = d3.range(0, height + 1, cellSize);

    var vLines = svg.selectAll(".hline")
        .data(dx);

    vLines.enter().append("line")
        .attr("x1", function (d) {
            return d;
        })
        .attr("x2", function (d) {
            return d;
        })
        .attr("y1", 0)
        .attr("y2", height)
        .attr("class", "grid hline");


    var hLines = svg.selectAll(".vline")
        .data(dy);

    hLines.enter().append("line")
        .attr("y1", function (d) {
            return d;
        })
        .attr("y2", function (d) {
            return d;
        })
        .attr("x1", 0)
        .attr("x2", width)
        .attr("class", "grid vline");

    console.log(dx);
    console.log(width);
    console.log(height);
    console.log(dy);

}

function draw_cells(svg, width, height, cellSize, app) {


    var width = app.cellSize * app.x/*- margin.left - margin.right*/,
        height = app.cellSize * app.y /*- margin.top - margin.bottom*/;

    var gHeight = Math.floor(height / cellSize);
    var gWidth = Math.floor(width / cellSize);

    var ver = d3.range(0, gHeight, 1);
    var hor = d3.range(0, gWidth, 1);

    app.cells = d3.cross(ver, hor, function (a, b) {
        return {x: a, y: b, member: false};
    });

    var cells = app.cells;
    app.members = d3.set();
    //console.log(cells);


    var members = app.members;

    var m = svg.selectAll(".member-cell")
        .data(members);

    m.enter().append().append("rect")
        .attr("x", function (d) {
            return d.x * cellSize;
        })
        .attr("y", function (d) {
            return d.y * cellSize;
        })
        .attr("height", cellSize)
        .attr("width", cellSize)
        .attr('class', 'member-cell');

    var hLines = svg.selectAll(".cell")
        .data(cells)
        //.style("fill", function(d) {
        //    console.log(d);
        //    return d.member?'blue':'red';
        //});
        .style("fill", "red");

    hLines.enter().append("rect")
        .attr("x", function (d) {
            return d.x * cellSize;
        })
        .attr("y", function (d) {
            return d.y * cellSize;
        })
        .attr("height", cellSize)
        .attr("width", cellSize)
        .attr("class", "cell")
        //.style("fill-opacity", function(d) {return d.member?0.4:0.0})
        .on("mouseover", function (d) {
            if (d3.event.shiftKey) {
                d.member = true;
                $(this).css("fill", "yellow");
            }
        }).on("click", function (d) {
            if (d3.event.shiftKey) {
                d.member = !d.member;
                if (d.member) {
                    $(this).css("fill", "yellow");
                } else {
                    $(this).css("fill", "green");
                }
            }
        });


    hLines.transition()
        .duration(500)
        .styleTween("fill", function () {
            return d3.interpolateRgb("red", "blue");
        });
    ;

    hLines.exit().remove();


    console.log(d3.selectAll('.cell').data());


}

function addData(svg, cellSize, app) {
    app.cells.push({x: 3, y: 3, member: true});

    console.log(app.cells.length);

    draw_cells(svg, width, height, cellSize, app);
}