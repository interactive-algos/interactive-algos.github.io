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

CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, size)
{
    this.beginPath();
    this.arc(x, y, size, 0, Math.PI*2, true);
    this.stroke();
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