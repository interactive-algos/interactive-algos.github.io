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

var filter;

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
    //Only scan if location changed
    if(!scanned)
    {
        scan(robotX, robotY, senseRadius, map, z);
        scanned = true;
    }
    filter.sensorUpdate(z);
    filter.resample();
    // senseCircle++;
    // senseCircle %= senseRadius;
}

function draw(ctx)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.drawRobot(robotX, robotY, robotDir, 20);

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
        var laserLen = senseCircle;

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
    filter.draw(ctx);
    requestAnimationFrame(frame);
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
        scanned = false;
    }
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
    bgCanvas.getContext('2d').drawMap(map);
    robotX = floor(random()*canvas.width);
    robotY = floor(random()*canvas.height);

    var sensorModel = new BeamModel(0.02, senseRadius, map, canvas.width, canvas.height);
    filter = new ParticleFilter(500, undefined, sensorModel);
    Particle.size = 5;

    //Listen to mouse click events
    bgCanvas.addEventListener('click', click);
    bgCanvas.onmousemove = mouseMotion;
    senseRadius = getValue('sensorRadius')/0.02;
    senseCircle = senseRadius;
    requestAnimationFrame(frame);
}