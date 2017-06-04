/**
 * Created by kelvinzhang on 5/29/17.
 */


var canvas;
var bgCanvas;

var robotX;
var robotY;

var senseRadius = 150;

var nLasers = 36;

var robotDir = 0;
var dirOffset = 0;

var sensorNoise = 0.1;

//Results of laser scan
var z = new Array(nLasers);

function update()
{
    //Only scan if location changed
    scan(robotX, robotY, senseRadius, map, z);
}

function drawLaserLines(ctx)
{
    //Angle between each laser, in radians
    var rad = Math.PI*2/nLasers;

    //index of corresponding entry in z
    var i = (dirOffset - nLasers/4);
    i = (i+nLasers+nLasers);

    for(var index = 0; index <= nLasers/2; index ++, i++)
    {
        //dirOffset is the direction the user's mouse
        //is point at, -nLasers/4 to offset it by 90 degrees,
        //so that laser scan is centered at where the user
        //points to

        //get i stay in bound
        i %= nLasers;

        var dir = i * rad;
        var laserLen = senseRadius;

        //Grey color for a miss
        if(z[i] > senseRadius)
        {
            ctx.strokeStyle = 'grey';
        }else
        {
            //distance reported by the laser sensor
            var dist = z[i] + gaussian()*z[i]*sensorNoise;
            laserLen = min(laserLen, dist);

            //red for a hit
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.circle(robotX + cos(dir)*dist, robotY + sin(dir)*dist, 5);
            ctx.fill();
        }
        ctx.strokeLine(robotX, robotY, robotX + cos(dir)*laserLen, robotY + sin(dir)*laserLen)
    }
}

function drawRobot(ctx)
{
    ctx.strokeStyle = 'black';
    ctx.drawRobot(robotX, robotY, robotDir, 20);
}

function parameterChanged(event)
{
    var target = event.target || event.srcElement;

    if(target.id === 'sensorRadius')
    {
        senseRadius = Number(target.value) / 0.02;
    }
    else if(target.id === 'sensorNoise')
    {
        sensorNoise = Number(target.value) / 100.0;
    }
    else if(target.id === 'nLasers')
    {
        nLasers = Number(target.value) * 2;
        z = new Array(nLasers);
    }
}

function trackRobotDir(event)
{
    var coor = getClickLoc(event);
    var x = coor.x;
    var y = coor.y;

    robotDir = atan2(y-robotY, x-robotX);
    dirOffset = round(robotDir/Math.PI/2 * nLasers);
    clearCanvas(canvas);
    canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, 20);
}

function mouseDown(event)
{
	//Do nothing if it is not a left button event
    if(event.button !== 0)
    	return;

    var coor = getClickLoc(event);
    var x = coor.x;
    var y = coor.y;

    robotX = x;
    robotY = y;
    clearCanvas(canvas);
    drawRobot(canvas.getContext('2d'));
    bgCanvas.onmousemove = trackRobotDir;
    bgCanvas.onmouseout = mouseUp;
	bgCanvas.onmouseup = mouseUp;
}

function mouseUp()
{
    bgCanvas.onmousemove = undefined;
    bgCanvas.onmouseout = undefined;
    bgCanvas.onmouseup = undefined;
    update();
    drawLaserLines(canvas.getContext('2d'));
}

function init()
{
    canvas = document.getElementById('canvas');
    bgCanvas = document.getElementById('background');

    //Draw the map
    var map = getMapForCanvas(canvas);
    bgCanvas.getContext('2d').drawMap(map);
    robotX = floor(random()*canvas.width);
    robotY = floor(random()*canvas.height);

    Particle.size = 5;

    //Listen to mouse click events
    bgCanvas.onmousedown = mouseDown;
    senseRadius = getValue('sensorRadius')/0.02;
}