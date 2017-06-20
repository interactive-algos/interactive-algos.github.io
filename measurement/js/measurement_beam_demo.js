var canvas;
var bgCanvas;

var robotX;
var robotY;

var robotSize = 10*scale;
var senseRadius = 3;

var nLasers = 36;

var robotDir = 0;
var dirOffset = 0;

var sensorNoise = 0.0;

//Results of laser scan
var z = new Array(nLasers);

var sensorModel;

var map;

function update()
{
    //Only scan if location changed
    console.log(senseRadius);
    scan(robotX, robotY, robotDir, senseRadius, map, z);
    var checkbox = document.getElementById('shouldColor');
    checkbox.checked = false;
    clearColor();
}

// function drawLaserLines(ctx)
// {
//     //Angle between each laser, in radians
//     var rad = Math.PI*2/nLasers;
//
//     //index of corresponding entry in z
//     var i = (dirOffset - nLasers/4);
//     i = (i+nLasers+nLasers);
//
//     for(var index = 0; index <= nLasers/2; index ++, i++)
//     {
//         //dirOffset is the direction the user's mouse
//         //is point at, -nLasers/4 to offset it by 90 degrees,
//         //so that laser scan is centered at where the user
//         //points to
//
//         //get i stay in bound
//         i %= nLasers;
//
//         var dir = i * rad;
//         var laserLen = senseRadius;
//
//         //Grey color for a miss
//         if(z[i] >= senseRadius)
//         {
//             ctx.strokeStyle = 'grey';
//         }else
//         {
//             //distance reported by the laser sensor
//             var dist = z[i] + gaussian()*sensorNoise;
//             laserLen = min(laserLen, dist);
//
//             //red for a hit
//             ctx.strokeStyle = 'red';
//             ctx.fillStyle = 'red';
//             ctx.beginPath();
//             ctx.circle(robotX + cos(dir)*dist, robotY + sin(dir)*dist, 5);
//             ctx.fill();
//         }
//         ctx.strokeLine(robotX, robotY, robotX + cos(dir)*laserLen, robotY + sin(dir)*laserLen)
//     }
// }

function drawRobot(ctx)
{
    ctx.strokeStyle = 'black';
    ctx.drawRobot(robotX, robotY, robotDir, robotSize);
}

function parameterChanged(event)
{
    var target = event.target || event.srcElement;

    if(target.id === 'sensorRadius')
    {
        senseRadius = Number(target.value);
    }
    else if(target.id === 'sensorNoise')
    {
        sensorNoise = Number(target.value);
        sensorModel.a1 = sensorNoise;
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
    var x = toWorldX(coor.x);
    var y = toWorldY(coor.y);

    robotDir = -atan2(y-robotY, x-robotX);
    dirOffset = round(robotDir/Math.PI/2 * nLasers);
    clearCanvas(canvas);
    canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, robotSize);
}

function mouseDown(event)
{
	var coor = getClickLoc(event);
    var x = toWorldX(coor.x);
    var y = toWorldY(coor.y);

	//Do nothing if it is not a left button event
	if(event.altKey)
    {
    	clearCanvas(canvas);
		var ctx = canvas.getContext('2d');
        ctx.drawLaserLines(nLasers, robotX, robotY, -dirOffset);
        ctx.drawRobot(robotX, robotY, robotDir, robotSize);
		ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
		ctx.drawRobot(x, y, robotDir, 5);
		var probability = sensorModel.probability(z, new RobotState(x, y, robotDir));
		document.getElementById('probability').innerHTML = "Probability: " + probability;
		return;
	}

    robotX = x;
    robotY = y;
    clearCanvas(canvas);
    canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, robotSize);
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
    canvas.getContext('2d').drawLaserLines(nLasers, robotX, robotY, -dirOffset);
}

function init()
{
    canvas = document.getElementById('canvas');
    bgCanvas = document.getElementById('background');

    //Draw the map
	map = getMapForCanvas(canvas);
    setPreview(true);
    width = canvas.width * scale;
    height = canvas.height * scale;
    rcOffsetX = width/2;
    rcOffsetY = height/2;
    bgCanvas.getContext('2d').drawMap(map);
    robotX = floor(random()*canvas.width);
    robotY = floor(random()*canvas.height);
    robotDir = random()*TWO_PI;
    dirOffset = round(robotDir/Math.PI/2 * nLasers);

    update();

	sensorModel = new BeamModel(getSensorNoise(), getSensorRadius(), map,
		getMapScreenSize(map).x, getMapScreenSize(map).y);

    Particle.size = 0.2/scale;

    //Listen to mouse click events
    bgCanvas.onmousedown = mouseDown;
    senseRadius = getSensorRadius();
    sensorNoise = getSensorNoise();
}

function getSensorNoise()
{
	return getValue('sensorNoise');
}

function getSensorRadius()
{
	return getValue('sensorRadius');
}

function toggleColoring(event)
{
	var target = event.target || event.srcElement;
	if(target.checked)
	{
		colorMap();
	}else
	{
		clearColor();
	}
}

function colorMap()
{
	var ctx = bgCanvas.getContext('2d');
	var resolution = getValue('colorRes');
	var probabilityGrid = sensorModel.calcProbGrid(resolution, robotDir, z);

	for(var i = 0; i < probabilityGrid.length; i ++)
	{
		for(var j = 0; j < probabilityGrid[i].length; j ++)
		{
			var p = probabilityGrid[i][j];
			ctx.fillStyle = 'rgba(' + round(p*255) + ', 0, ' + (255-round(p*255)) + ', 0.5)';
			ctx.fillRect(j*resolution, i*resolution, resolution, resolution);
		}
	}
}

function clearColor()
{
	clearCanvas(bgCanvas);
	bgCanvas.getContext('2d').drawMap(map);
}
