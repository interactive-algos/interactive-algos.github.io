/**
 * Created by kelvinzhang on 5/29/17.
 */


//meter/pixel scale
var scale = 0.02;


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

//convert x coordinate in world to x coordinate on screen
function convertX(x)
{
    return floor(x/scale);
}

//convert y coordinate in world to y coordinate on screen
function convertY(y)
{
    return floor(canvas.height - y/scale);
}