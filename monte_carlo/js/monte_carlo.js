
function start()
{
	if(animating)
		return;

	animating = true;
	var ctx = canvas.getContext('2d');
	var path = knownPath[pathSelect.value];

	var motionModel = new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise());

	var map = getMapForCanvas(canvas);

	map.forEach(function(line)
	{
		line.s.x = toWorldX(line.s.x);
		line.s.y = toWorldY(line.s.y);

		line.t.x = toWorldX(line.t.x);
		line.t.y = toWorldY(line.t.y);
	});

	var sensorModel = new BeamModel(getSensorNoise(), getSensorRadius(), map, width, height);
	var filter = new ParticleFilter(getParticleCount(), motionModel, sensorModel);

	robot = new Robot(filter, path);
	robot.draw(ctx);

	animating = true;
	lastFrame = Date.now();
	requestAnimationFrame(frame);
}

function getSensorNoise()
{
	return getValue('robotSenseNoise')*scale;
}