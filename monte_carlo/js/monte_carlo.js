function start()
{
	if (animating)
		return;

	setPreview(false);
	if (bgCanvas)
	{
		clearCanvas(bgCanvas);
	}
	animating = true;
	var ctx = canvas.getContext('2d');
	var path = knownPath[pathSelect.value];

	var motionModel = new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise());

	var map = getMapForCanvas(canvas);

	// map.forEach(function(line)
	// {
	// 	line.s.x = toWorldX(line.s.x);
	// 	line.s.y = toWorldY(line.s.y);

	// 	line.t.x = toWorldX(line.t.x);
	// 	line.t.y = toWorldY(line.t.y);
	// });

	Robot.sensorRadius = getSensorRadius();
	var sensorModel = new BeamModel(getSensorNoise(), getSensorRadius(), map,
		getMapScreenSize(map).x * scale, getMapScreenSize(map).y * scale);
	var filter = new ParticleFilter(getParticleCount(), motionModel, sensorModel,
		new RobotState(path[0].x, path[0].y, 0),
		// undefined,
		getResampleRatio());

	robot = new Robot(filter, path, 19);
	robot.draw(ctx);

	animating = true;
	lastFrame = Date.now();
	requestAnimationFrame(frame);
}

function getSensorNoise()
{
	return getValue('robotSenseNoise');
}
