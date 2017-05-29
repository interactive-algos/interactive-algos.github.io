
function getMapForCanvas(canvas)
{
    map = 
    [
        new Line(0, 0, canvas.width, 0),
        new Line(canvas.width, 0, canvas.width, canvas.height),
        new Line(canvas.width, canvas.height, 0, canvas.height),
        new Line(0, canvas.height, 0, 0),
        new Line(0, 100, 300, 100),
        new Line(300, 70, 300, 0),
        new Line(0, 250, 400, 250),
        new Line(450, 250, canvas.width, 250),
        new Line(500, 0, 500, 100),
        new Line(500, 100, canvas.width, 100)
    ];
    return map;
}