function getMapForCanvas(canvas)
{
    var map =
    [
        new Line(30, 0, 110, 130),
        new Line(110, 130, 220, 60),
        new Line(270, 0, 370, 130),
        new Line(370, 130, 460, 60),
        new Line(700, 200, 550, 230),
        new Line(520, 250, 450, 270),
        new Line(450, 270, 450, 400),
        new Line(540, 0, 540, 130),
        new Line(540, 130, 585, 130),
        new Line(610, 130, 700, 130),
        new Line(0, 340, 220, 270),
        new Line(220, 270, 220, 400),
        new Line(220, 270, 290, 270),
        new Line(370, 270, 450, 270)
    ];

	map.push(new Line(0, 0, canvas.width, 0));
	map.push(new Line(canvas.width, 0, canvas.width, canvas.height));
	map.push(new Line(canvas.width, canvas.height, 0, canvas.height));
	map.push(new Line(0, canvas.height, 0, 0));

    convertToWorld(map);
    return map;
}

function convertToWorld(map) {
    for (i = 0; i < map.length; i++) {
        map[i] = getWorldLine(map[i]);
    }
}