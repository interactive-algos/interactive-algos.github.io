/**
 * Created by kelvinzhang on 5/29/17.
 */


function isNumber(event)
{
    return event.charCode >= 48 && event.charCode <= 57;
}

function isDecimal(event)
{
    return isNumber(event) || event.charCode === 46;
}

function getValue(id)
{
    return Number(document.getElementById(id).value);
}

CanvasRenderingContext2D.prototype.drawRobot = function (x, y, dir, size)
{
    //The robot's main circle
    this.strokeCircle(x, y, size);

    this.beginPath();
    //draw a line to show Robot's orientation
    this.moveTo(x, y);
    this.lineTo(x + cos(dir)*size, y + sin(dir)*size);

    this.stroke();
};

CanvasRenderingContext2D.prototype.circle = function(x, y, size)
{
    return this.arc(x, y, size, 0, Math.PI*2);
};

CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, size)
{
    this.beginPath();
    this.circle(x, y, size);
    this.stroke();
};

CanvasRenderingContext2D.prototype.drawMap = function(m)
{
    for (var i = m.length - 1; i >= 0; i--)
    {
        var l = m[i];
        this.strokeLine(l.s.x, l.s.y, l.t.x, l.t.y);
    }
};

CanvasRenderingContext2D.prototype.strokeLine = function(x1, y1, x2, y2)
{
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke();
};

CanvasRenderingContext2D.prototype.strokeTextWithColorFont = function(text, color, font)
{
	this.strokeStyle = color;
	this.font = font;
	this.textAlign = 'start';
	this.strokeText(text, 10, 20);
};

function getClickLoc(event)
{
    var element = event.target;

    var offsetX = 0, offsetY = 0;

    if (element.offsetParent) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    x = event.pageX - offsetX;
    y = event.pageY - offsetY;
    return {x:x, y:y};
}