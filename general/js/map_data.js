
function getMapForCanvas(canvas)
{
    map = 
    [
        new Line(0, 0, canvas.width, 0),
        new Line(canvas.width, 0, canvas.width, canvas.height),
        new Line(canvas.width, canvas.height, 0, canvas.height),
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
        // new Line(0, canvas.height, 0, 0),
        // new Line(0, 100, 300, 100),
        // new Line(300, 70, 300, 0),
        // new Line(0, 250, 400, 250),
        // new Line(450, 250, canvas.width, 250),
        // new Line(500, 0, 500, 100),
        // new Line(500, 100, canvas.width, 100)
    ];
    return map;
}