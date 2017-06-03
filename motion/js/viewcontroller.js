/**
 * Created by kelvinzhang on 5/30/17.
 */
var canvas; //The HTML Element of the canvas
var bgCanvas; //The HTML element of the background canvas
var robot;
var requestAnimationFrame;
//actual map data
var map;
var frameCount = 0;
var lastFrame;
var fps = 0;

//meter/pixel scale
var scale = 0.02;


//dimensions of the world, in meters
//Robots are using world coordinates internally
//positive y is up, positive x is right
//bottom left is the origin
var width;
var height;

function getSensorRadius()
{
    return getValue('fogOfWar');
}

function frame(timestamp)
{
    frameCount++;
    if(frameCount % 2 === 0)
    {
        fps = Math.round(1000.0/(timestamp-lastFrame));
        lastFrame = timestamp;


        var ctx = canvas.getContext('2d');
        /*
         ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '10px Menlo';
        ctx.fillText(fps + " FPS", 10, 20);
        robot.update();
        robot.draw(ctx);
    }
    requestAnimationFrame(frame);
}

function init()
{
    canvas = document.getElementById('canvas');
    width = canvas.width * scale;
    height = canvas.height * scale;

    bgCanvas = document.getElementById('background');
    map = getMapForCanvas(canvas);
    bgCanvas.getContext('2d').drawMap(map);

    Robot.sensorRadius = getSensorRadius();
    Robot.stride = getValue('goByOneStep');
}

function start()
{
    var ctx = canvas.getContext('2d');

    var x = random()*width;
    var y = random()*height;
    var dir = random()*Math.PI*2;

    var motionModel = new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise());
    var filter = new ParticleFilter(getParticleCount(), motionModel, undefined, new RobotState(x, y, dir));

    robot = new Robot(x, y, dir, filter);
    robot.draw(ctx);
    requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;
    lastFrame = Date.now();
    requestAnimationFrame(frame);
}

function parameterChanged(event)
{
    console.log(event);
    var target = event.target;
    var value = Number(event.target.value);
    if(target.id === 'robotForwardNoise')
    {
        robot.setStrideNoise(value/100.0);
    }else if(target.id === 'robotTurnNoise')
    {
        robot.setTurnNoise(value/100.0);
    }else if(target.id === 'goByOneStep')
    {
        Robot.stride = value;
    }
}

function getParticleCount()
{
    return getValue('nParticles');
}

function getStrideNoise()
{
    return getValue('robotForwardNoise') / 100.0;
}

function getTurnNoise()
{
    return getValue('robotTurnNoise') / 100.0;
}


//convert x coordinate in world to x coordinate on screen
function toScreenX(x)
{
    return round(x/scale);
}

//convert x coordinate on screen to x coordinate in world
function toWorldX(x)
{
    return round(x*scale);
}

//convert y coordinate in world to y coordinate on screen
function toScreenY(y)
{
    return round(canvas.height - y/scale);
}

//convert y coordinate on screen to y coordinate in world
function toWorldY(y)
{
    return round((canvas.height - y)*scale);
}

Robot.prototype.draw = function(ctx)
{
    ctx.strokeStyle = 'black';
    if(Date.now() - this.lastMove < 200)
        ctx.strokeStyle = 'red';

    var x = toScreenX(this.x);
    var y = toScreenY(this.y);

    ctx.drawRobot(x, y, -this.dir, Robot.size/scale);

    ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';

    //draw Robot's sensing circle
    ctx.strokeCircle(x, y, this.senseCircle/scale);

    this.filter.draw(ctx);
};

Particle.prototype.draw = function(ctx)
{
    var x = toScreenX(this.x);
    var y = toScreenY(this.y);

    ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.drawRobot(x, y, -this.dir, Particle.size/scale);
};