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

	var motionModel = new OdometryModel(getValue('a1'), getValue('a2'), getValue('a3'), getValue('a4'));
	var filter = new ParticleFilter(getParticleCount(), motionModel, undefined, new RobotState(x, y, dir + TWO_PI / 2), 1);

	filter.particles.forEach(function(p)
	{
		p.x = x;
		p.y = y;
		p.dir = dir;
	});
	view.setScale(50);

	robot = new Robot(filter, path);
	robot.draw(ctx);

	lastFrame = Date.now();
	requestAnimationFrame(frame);
}
