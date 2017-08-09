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
	//Sum of all readings
	this.readingSum = 0;
	//Total number of readings done
	this.nReadings = 0;

	//create an 0 filled array of size this.nBuckets
	this.buckets = Array.apply(null, new Array(this.nBuckets)).map(Number.prototype.valueOf, 0);
	this.maxCount = 0;

	//Demo parameters
	// this.sensorRadius = sensorRadius;
	this.sensorNoise = sensorNoise;

	this.actualDistance = this.view.width / 2;

	this.draw();
}

SensorDemo.prototype.sample = function (n)
{
	//If there is animation going on, just return
	if (this.readingsLeft > 0)
	{
		return;
	}

	this.readingsLeft = n;
	if (n < 500)
	{
		const self = this;
		this.intervalId = window.setInterval(function ()
		{
			self.takeSingleReading();
		}, 1000 / n);
	} else
	{
		for (var i = 0; i < n; i++)
		{
			this.takeSingleReading(false);
		}
		this.draw();
	}
};

SensorDemo.prototype.takeSingleReading = function (redraw = true)
{
	//We are done, stop the animation
	if (this.readingsLeft-- <= 0)
		window.clearInterval(this.intervalId);

	var reading = gaussian(this.actualDistance, this.sensorNoise);

	//Skip readings that are out of screen
	if (reading < 0 || reading >= this.view.width)return;

	var index = Math.floor(reading / this.view.width * this.nBuckets);
	this.buckets[index]++;
	this.maxCount = max(this.maxCount, this.buckets[index]);
	this.readingSum += reading;
	this.nReadings++;

	if (redraw)
	{
		this.draw();
		const ctx = this.ctx;
		ctx.lineWidth *= 3;
		ctx.strokeStyle = 'green';
		ctx.strokeLine(reading, 0, reading, this.view.height);
		ctx.lineWidth /= 3;
	}
};

SensorDemo.prototype.draw = function ()
{
	const ctx = this.ctx;

	clearCanvas(this.view.canvas);
	//Draw sensor readings
	ctx.strokeStyle = 'grey';
	var x = 0;
	const step = 1.0 / this.buckets.length * this.view.width;
	for (var i = 0; i < this.buckets.length; i++, x += step)
	{
		var count = this.buckets[i];
		if (count > 0)
		{
			ctx.strokeLine(x + step / 2, 0, x + step / 2, count * 1.0 / this.maxCount * this.view.height);
		}
	}

	//Draw the actual distance
	ctx.strokeStyle = 'red';
	ctx.strokeLine(this.actualDistance, 0, this.actualDistance, this.view.height);

	ctx.fillTextWithColorFont('Actual Distance: ' + this.actualDistance,
		'black', '20px Menlo Regular',
		10, 20);
	ctx.fillTextWithColorFont('Average Sensor Readings: ' +
		this.readingSum / this.nReadings, 'black', '20px Menlo Regular', 10, 40);
};

SensorDemo.prototype.setSensorNoise = function (noise)
{
	if (noise === this.sensorNoise)
		return;

	this.sensorNoise = noise;
	this.clearBuckets();
	this.draw();
};

SensorDemo.prototype.clearBuckets = function ()
{
	this.buckets.fill(0);
	this.maxCount = 0;
	this.readingSum = 0;
	this.nReadings = 0;
};
