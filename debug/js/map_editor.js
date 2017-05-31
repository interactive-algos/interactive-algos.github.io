/**
 * Created by kelvinzhang on 5/30/17.
 */

var canvas;
var bgCanvas;
var textbox;

//starting point of the line the user is drawing
var s;

//The lines the user has drawn
var lines = [];

function click(event)
{
    var pt = getClickLoc(event);
    var ctx = bgCanvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.strokeCircle(pt.x, pt.y, 3);

    if(typeof s === 'undefined')
    {
        s = pt;
    }else
    {
        lines.push({s:s, t:pt});
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        s = undefined;
    }
}

function mouseMotion(event)
{
    var pt = getClickLoc(event);
    if(typeof s !== 'undefined')
    {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
    }
}

function keyHandler(event)
{
    if(event.key === 's')
    {
        var str = 'map = \n[';
        var l = lines[0];
        str += 'new Line(' + l.s.x + ', ' + l.s.y + ', ' + l.t.x + ', ' + l.t.y + ')';

        for(var i = 1; i < lines.length; i ++)
        {
            l = lines[i];
            str += ',\nnew Line(' + l.s.x + ', ' + l.s.y + ', ' + l.t.x + ', ' + l.t.y + ')';
        }
        str += '\n];';
        textbox.value = str;
    }
}

function init()
{
    canvas = document.getElementById('canvas');
    bgCanvas = document.getElementById('background');
    textbox = document.getElementById('map_data_textarea');

    canvas.style.cursor = 'crosshair';
    canvas.onclick = click;
    canvas.onmousemove = mouseMotion;
    document.body.onkeydown = keyHandler;
}