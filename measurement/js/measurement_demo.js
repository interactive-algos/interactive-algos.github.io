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

var robotDir = 0;
var dirOffset = 0;

//Results of laser scan
var z = new Array(nLasers);

function click()
{
    var coor = getClickLoc(event);
    robotX = coor.x;
    robotY = coor.y;
    // senseCircle = 0;
    scanned = false;
    update();
    draw(canvas.getContext('2d'));
}

function scan()
{
    //Radian between each laser
    for(var i = 0; i < nLasers; i ++)
    {
        var dir = Math.PI*2 * i / nLasers;

        var s1 = new Point(robotX, robotY);
        var t1 = new Point(robotX + cos(dir)*senseRadius, robotY + sin(dir)*senseRadius);

        //If dir is 90 degrees
        //if i = 1/nLasers or i = (3/4) * nLasers
        //cos(dir) should be 0 in these cases,
        if(i * 4 === nLasers || i * 4 === nLasers * 3)
            t1.x = robotX;
        else if(i * 2 === nLasers)
            t1.y = robotY;


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
    // senseCircle++;
    // senseCircle %= senseRadius;
}

function draw(ctx)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.drawRobot(robotX, robotY, robotDir, 20);

    //Radian between each laser
    var rad = Math.PI*2/nLasers;
    for(var index = 0; index < nLasers/2; index ++)
    {
        //dirOffset is the direction the user's mouse
        //is point at, -nLasers/4 to offset it by 90 degrees,
        //so that laser scan is centered at where the user
        //points to
        var i = (index + dirOffset - nLasers/4);

        //get i stay in bound
        i = (i + nLasers) % nLasers;

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

function mouseMotion(event)
{
    var coor = getClickLoc(event);
    var x = coor.x;
    var y = coor.y;

    robotDir = atan2(y-robotY, x-robotX);
    dirOffset = round(robotDir/Math.PI/2 * nLasers);
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
    background.onmousemove = mouseMotion;
    senseRadius = getValue('fogOfWar')/0.02;
    senseCircle = senseRadius;
    requestAnimationFrame(frame);
}