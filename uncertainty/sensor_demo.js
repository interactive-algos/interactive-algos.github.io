/**
 * Created by kelvinzhang on 6/26/17.
 */

function SensorDemo(id, sensorNoise)
{
	const scale = 50;
	this.view = new View(document.getElementById(id), scale);
	this.ctx = this.view.canvas.getContext('2d');
	this.robotSize = 0.2;
	this.nBuckets = 100;

	//create an 0 filled array of size this.nBuckets
	this.buckets = Array.apply(null, new Array(this.nBuckets)).map(Number.prototype.valueOf,0);
	this.maxCount = 0;

	//Demo parameters
	// this.sensorRadius = sensorRadius;
	this.sensorNoise = sensorNoise;

	this.actualDistance = this.view.width/2;

	this.draw();
}

SensorDemo.prototype.sample = function(n)
{
	//If there is animation going on, just return
	if(this.readingsLeft > 0){return;}

	this.readingsLeft = n;
	const self = this;
	this.intervalId = window.setInterval(function(){self.takeSingleReading();}, 1000/n);
};

SensorDemo.prototype.takeSingleReading = function()
{
	//We are done, stop the animation
	if(this.readingsLeft-- <= 0)
		window.clearInterval(this.intervalId);

	var reading = this.actualDistance + gaussian()*this.sensorNoise;
	this.draw();
	this.ctx.lineWidth *= 3;
	this.ctx.strokeStyle = 'green';
	this.ctx.strokeLine(reading, 0, reading, this.view.height);
	this.ctx.lineWidth /= 3;
	// if(reading > this.sensorRadius)reading = this.sensorRadius;
	var index = round(reading/this.view.width * this.nBuckets);
	this.buckets[index]++;
	this.maxCount = max(this.maxCount, this.buckets[index]);
};

SensorDemo.prototype.draw = function()
{
	const ctx = this.ctx;

	clearCanvas(this.view.canvas);

	//Draw the actual distance
	ctx.strokeStyle = 'red';
	ctx.strokeLine(this.actualDistance, 0, this.actualDistance, this.view.height);

	//Draw sensor readings
	ctx.strokeStyle = 'grey';
	var x = 0;
	const step =  1.0/this.buckets.length * this.view.width;
	for(var i = 0; i < this.buckets.length; i ++, x+=step)
	{
		var count = this.buckets[i];
		if(count > 0)
		{
			ctx.strokeLine(x + step / 2, 0, x + step / 2, count * 1.0 / this.maxCount * this.view.height);
		}
	}
};