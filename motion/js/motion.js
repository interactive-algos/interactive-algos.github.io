function start()
{
	if (animating)
		return;

	animating = true;
	var ctx = canvas.getContext('2d');
	var path = knownPath[pathSelect.value];

	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

	var motionModel = new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise());
	var filter = new ParticleFilter(getParticleCount(), motionModel, undefined, new RobotState(x, y, dir + TWO_PI / 2), 1);

	robot = new Robot(filter, path);
	robot.draw(ctx);

	console.log(view.toScreenX(robot.x) + ", " + view.toScreenY(robot.y));
	lastFrame = Date.now();
	requestAnimationFrame(frame);
}
