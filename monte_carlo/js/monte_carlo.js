// /**
//  * Created by kelvinzhang on 5/30/17.
//  */

function start()
{
	var ctx = canvas.getContext('2d');
	var path = knownPath[pathSelect.value];

	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y-path[0].y, path[1].x-path[0].x);	//orientation in radians

	var motionModel = new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise());
	var sensorModel = new BeamModel(getSensorNoise(), getSensorRadius(), map, width, height);
	var filter = new ParticleFilter(getParticleCount(), motionModel, sensorModel, new RobotState(x, y, dir));

	robot = new Robot(filter, path);
	robot.draw(ctx);
	requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;
	animating = true;
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
	}else if(target.id === 'robotSenseNoise')
	{
		Robot.filter.sensorModel.a1 = value/100.0;
	}
}

function getSensorNoise()
{
	return getValue('robotSenseNoise') / 100.0;
}