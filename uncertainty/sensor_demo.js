/**
 * Created by kelvinzhang on 6/26/17.
 */

function SensorDemo(id, sensorRadius, sensorNoise)
{
	const scale = 50;
	this.view = new View(document.getElementById(id), scale);
	this.ctx = this.view.canvas.getContext('2d');
	this.robotSize = 0.2;

	//Demo parameters
	this.sensorRadius = sensorRadius;
	this.sensorNoise = sensorNoise;

	//Robot pose is fixed.
	this.x = this.view.width * 0.2;
	this.y = this.view.height/2;
	this.dir = 0;

	//Map is just a single line
	this.map = [new Line(this.view.width*0.7, this.view.height * 0.9,
		this.view.width*0.7, this.view.height*0.1)];

	this.draw();
}

SensorDemo.prototype.draw = function()
{
	this.ctx.drawMap(this.map);
	this.ctx.drawRobot(this.x, this.y, this.dir, this.robotSize);
};