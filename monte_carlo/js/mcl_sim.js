function MCLDemo (
    lid, //Main Canvas id
    sid, //Mini Canvas id
    map,
    particleCount, sensorRadius, stride, sensorNoise,
    a1, a2, a3, a4,
    colorRes
) {
    const scale = 50;
    //the Large canvas elements
    this.lcanvas = document.getElementById(lid);
    this.lview = new View(this.lcanvas, scale);
    this.lview.setPreviewScale(map);
	this.lctx = this.lcanvas.getContext('2d');

    //The Small canvas elements
    this.scanvas = document.getElementById(sid);
    this.sview = new View(this.scanvas, scale);
    this.sview.setPreviewScale(map);
	this.sctx = this.scanvas.getContext('2d');

    this.pathSelect = document.getElementById('path');

    this.robotSize = 0.2;
    this.map = map;
    this.paths = {};
    smoothenPath(vanillaPath);
    this.paths['Vanilla'] = vanillaPath;
    this.currPathName = 'Vanilla';
    this.colorRes = colorRes;

    var path = this.paths[this.currPathName];
	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

    //Robot
    this.robot = new Robot(
        new ParticleFilter(
            getParticleCount(),
            new OdometryModel(a1,a2,a3,a4),
            new BeamModel(sensorNoise, sensorRadius, map),
            new RobotState(x, y, dir + TWO_PI / 2),
            getResampleRatio()
        ),
        this.paths[this.currPathName],
        undefined
    );

    //Other Properties
    Robot.sensorRadius = sensorRadius;
	Robot.stride = stride;
    this.animating = false;
    this.isPreview = true;
    this.shouldColorMap = false;

    this.tempPath = undefined;
    this.draw();
}

MCLDemo.prototype.start = function () {
    if (this.animating) return;

	this.animating = true;
    this.isPreview = false;

	this.lcanvas.onmousedown = function (event) {
        mclDemo.queryProbability(event);
    };

	this.lastFrame = Date.now();
	requestAnimationFrame(this.frame);
}

MCLDemo.prototype.frame = function (timestamp) {
    var fps = Math.round(1000.0 / (timestamp - this.lastFrame));
    this.lastFrame = timestamp;

    mclDemo.draw();

    mclDemo.lctx.strokeTextWithColorFont(fps + "\tFPS", 'black', '10px Menlo');
    if (mclDemo.animating) requestAnimationFrame(mclDemo.frame);
}

MCLDemo.prototype.stop = function () {
    if (this.animating) { //Pause
        this.animating = false;
    } else { //stop
    	this.lcanvas.onmousedown = undefined;
        init();
    }
}

MCLDemo.prototype.stepForward = function () {
	this.animating = false;
	requestAnimationFrame(this.frame);
}

MCLDemo.prototype.draw = function () {
    if (!this.isPreview){
        this.lview.setScale(50);
        this.robot.update();
        var x = this.lview.toScreenX(this.robot.x);
        var y = this.lview.toScreenY(this.robot.y);
        this.lview.adjustToPoint(x, y);
    } else {
        this.lview.setPreviewScale(this.map);
    }

    this.drawLCanvas();
    this.drawSCanvas();
    if (this.shouldColorMap) this.colorMap();
}

MCLDemo.prototype.colorMap = function () {
	this.lview.colorMap(this.colorRes, this.robot.filter.sensorModel,
		this.robot.getSensorReading(), this.robot.dir);
}

MCLDemo.prototype.drawLCanvas = function() {
    clearCanvas(this.lcanvas);
    this.lctx.strokeStyle = 'black';
    this.lctx.drawMap(this.map);
    this.lctx.strokeStyle = 'green';
    this.lctx.strokePath(this.paths[this.currPathName])
    this.lctx.strokeStyle = 'black';
    this.robot.draw(this.lctx);
}

MCLDemo.prototype.drawSCanvas = function() {
    clearCanvas(this.scanvas);
    this.sctx.strokeStyle = 'black';
    this.sctx.drawMap(this.map);
    this.sctx.strokeStyle = 'green';
    this.sctx.strokePath(this.paths[this.currPathName])
    this.sctx.strokeStyle = 'black';
    this.robot.draw(this.sctx);
    this.sctx.strokeStyle = 'black';
    this.sctx.drawRobot(this.robot.x, this.robot.y, this.robot.dir, 1);
}

//Setters
MCLDemo.prototype.setA = function(noise){
    this.robot.filter.mclModel = new OdometryModel(
        getValue('a1'),
        getValue('a2'),
        getValue('a3'),
        getValue('a4')
    );
};

MCLDemo.prototype.setParticleCount = function(n){
    this.particleCount = n;
    this.robot.filter = new ParticleFilter(
        n,
        new OdometryModel(getValue('a1'), getValue('a2'), getValue('a3'), getValue('a4')),
        new BeamModel(getValue('robotSenseNoise'), getSensorRadius(), this.map),
        new RobotState(this.robot.x, this.robot.y, this.robot.dir + TWO_PI / 2),
        getResampleRatio()
    );
};

MCLDemo.prototype.setSensorRadius = function(radius){
	Robot.sensorRadius = radius;
};

MCLDemo.prototype.setStride = function(stride){
	Robot.stride = stride;
};

MCLDemo.prototype.updateRobot = function () {

    var path = this.paths[this.currPathName];
	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

    //Robot
    this.robot = new Robot(
        new ParticleFilter(
            getParticleCount(),
            new OdometryModel(getValue('a1'), getValue('a2'), getValue('a3'), getValue('a4')),
            new BeamModel(getValue('robotSenseNoise'), getSensorRadius(), this.map),
            new RobotState(x, y, dir + TWO_PI / 2),
            getResampleRatio()
        ),
        this.paths[this.currPathName],
        undefined
    );
}

//Add Path
MCLDemo.prototype.startRecordingPath = function () {
    animating = false;

    clearCanvas(this.lcanvas);
    this.lview.setPreviewScale(this.map);
    this.lctx.drawMap(this.map);

    console.log("start recording...");
    this.lcanvas.onmousedown = function (event) {
        mclDemo.mouseDown(event);
    }
    this.tempPath = [];
}

MCLDemo.prototype.mouseDown = function (event) {
    var coor = getClickLoc(event);
	this.lview.toWorldCoor(coor);

	this.tempPath.push(coor);
	this.lcanvas.onmousemove = function (event) {
        mclDemo.mouseMotion(event);
    }
	this.lcanvas.onmouseup = function (event) {
        mclDemo.mouseUp(event);
    }
	this.lcanvas.onmouseout = function (event) {
        mclDemo.mouseUp(event);
    }
}

MCLDemo.prototype.mouseMotion = function (event) {
    var coor = getClickLoc(event);
    this.lview.toWorldCoor(coor);
    var lastPoint = this.tempPath[this.tempPath.length - 1];

    var curStep = new Line (lastPoint.x, lastPoint.y, coor.x, coor.y);
    for (var i = 0; i < this.map.length; i++) {
		if (doIntersect(
            this.map[i].s, this.map[i].t,
            curStep.s, curStep.t
        )) return;
	}

    this.lctx.strokeStyle = 'red';
    this.lctx.strokeLine(
        lastPoint.x,
        lastPoint.y,
        coor.x,
        coor.y
    );
    this.tempPath.push(coor);
}

MCLDemo.prototype.mouseUp = function (event) {
    this.lcanvas.onmousemove = undefined;
	this.lcanvas.onmouseup = undefined;
	this.lcanvas.onmouseout = undefined;
	this.lcanvas.onmousedown = undefined;

    var msg = "Enter a unique name for this path, alphanumeric please:";

    while (true)
	{
		pathName = prompt(msg, "Harry Potter");

		if (pathName === null)
		{
			this.selectedIndex = 0;
			refreshSelect();
			return;
		}

		//No duplicate name!
		if (pathName in this.paths)
		{
			msg = 'Name must be unique!';
			continue;
		}

		//Must be alphanumeric
		if (pathName.match(new RegExp('^[a-zA-Z0-9]+$')))
			break;
		msg = 'Name must be alphanumeric!';
	}
    smoothenPath(this.tempPath);
    this.paths[pathName] = this.tempPath;
    printPath(this.tempPath);
	var option = document.createElement("option");
	option.text = pathName;
	customPathGroup.append(pathName, option);
	this.pathSelect.selectedIndex = this.pathSelect.length - 1;
	refreshSelect();

    this.currPathName = pathName;
    this.updateRobot();
}

function printPath(path)
{
	var str = '{\n';
	str += "[x: " + path[0].x + ", y:" + path[0].y + "}";
	for (var i = 1; i < path.length; i++)
	{
		str += ",\n{x: " + path[i].x + ", y:" + path[i].y + "}";
	}

	str += '\n]';
	console.log(str);
}

MCLDemo.prototype.queryProbability = function (event)
{
	var coor = getClickLoc(event);
	var x = coor.x;
	var y = coor.y;

	if (event.altKey)
	{
		var probability = this.robot.filter.sensorModel.probability(
			this.robot.getSensorReading(),
			new RobotState(
                this.lview.toWorldX(x),
                this.lview.toWorldY(y),
                this.robot.dir
            )
        );

		document.getElementById('probability').innerHTML = "Probability: " + probability;
		console.log('(' + x + ', ' + y + '): ' + probability);
	}
}
