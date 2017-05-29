/**
 * Created by kelvinzhang on 5/29/17.
 */


var canvas;
var bgCanvas;

var robotX;
var robotY;

var senseCircle = 0;
var senseRadius = 150;

var nLasers = 36;
var scanned = false;

//Results of laser scan
var z = new Array(nLasers);

function click()
{
    var coor = getClickLoc(event);
    robotX = coor.x;
    robotY = coor.y;
    senseCircle = 0;
    scanned = false;
}

function scan()
{
    //Radian between each laser
    var rad = Math.PI*2/nLasers;

    for(var i = 0; i < nLasers; i ++)
    {
        var dir = i * rad;
        var s1 = new Point(robotX, robotY);
        var t1 = new Point(robotX + cos(dir)*senseRadius, robotY + sin(dir)*senseRadius);
        z[i] = senseRadius + 100;
        for(var j = 0; j < map.length; j ++)
        {
            if(doIntersect(s1, t1, map[j].s, map[j].t))
            {
                // z[i] = senseRadius;
                var p = intersectionPoint(s1, t1, map[j].s, map[j].t);
                var dist = p.distanceTo(new Point(robotX, robotY));
                z[i] = min(z[i], dist);
            }
        }
    }
}

function update()
{
    if(!scanned)
    {
        scan();
        scanned = true;
    }
    senseCircle++;
    senseCircle %= senseRadius;
}

function draw(ctx)
{
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.drawRobot(robotX, robotY, 0, 20);

    //Radian between each laser
    var rad = Math.PI*2/nLasers;
    for(var i = 0; i < nLasers; i ++)
    {
        var dir = i * rad;
        var laserLen = senseCircle;
        if(z[i] > senseRadius)
        {
            ctx.strokeStyle = 'grey';
        }else
        {
            laserLen = min(laserLen, z[i]);
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(robotX + cos(dir)*z[i], robotY + sin(dir)*z[i], 5, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(robotX, robotY);
        ctx.lineTo(robotX + cos(dir)*laserLen, robotY + sin(dir)*laserLen);
        ctx.stroke();
    }
}

function frame()
{
    var ctx = canvas.getContext('2d');
    update();
    draw(ctx);
    requestAnimationFrame(frame);
}

function parameterChanged(event)
{
    senseRadius = Number(event.target.value)/0.02;
}

function init()
{
    canvas = document.getElementById('canvas');
    bgCanvas = document.getElementById('background');

    //Draw the map
    var map = getMapForCanvas(canvas);
    drawMap(map, bgCanvas.getContext('2d'));
    robotX = floor(random()*canvas.width);
    robotY = floor(random()*canvas.height);

    //Listen to mouse click events
    background.addEventListener('click', click);
    senseRadius = getValue('fogOfWar')/0.02;
    requestAnimationFrame(frame);
}