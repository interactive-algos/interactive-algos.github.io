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

var sensorNoise = 0.1;

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

function update()
{
    if(!scanned)
    {
        scan(robotX, robotY, senseRadius, map, z);
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
            //distance reported by the laser sensor
            var dist = z[i] + gaussian()*z[i]*sensorNoise;
            laserLen = min(laserLen, dist);
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.circle(robotX + cos(dir)*dist, robotY + sin(dir)*dist);
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
    var target = event.target || event.srcElement;

    if(target.id === 'sensorRadius')
        senseRadius = Number(target.value)/0.02;
    else if(target.id === 'sensorNoise')
        sensorNoise = Number(target.value)/100.0;
    else if(target.id === 'nLasers')
        nLasers = Number(target.value)*2;
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
    senseRadius = getValue('sensorRadius')/0.02;
    senseCircle = senseRadius;
    requestAnimationFrame(frame);
}