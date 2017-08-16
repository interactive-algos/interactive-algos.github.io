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

	if (n < 500)
	{
		this.readingsLeft = n;
		let func = () => {
			if(this.readingsLeft-- <= 0)
				return;
			this.takeSingleReading(); 
			this.frameId = requestAnimationFrame(func);
		};
		this.frameId = requestAnimationFrame(func);
	} else
	{
		for (let i = 0; i < n; i++)
		{
			this.takeSingleReading(false);
		}
		this.draw();
	}
};

SensorDemo.prototype.takeSingleReading = function (redraw = true)
{
	let reading = gaussian(this.actualDistance, this.sensorNoise);

	//Skip readings that are out of screen
	if (reading < 0 || reading >= this.view.width)return;

	let index = Math.floor(reading / this.view.width * this.nBuckets);
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

SensorDemo.prototype.getAverageReadings = function()
{
	//Scale average relative to 10
	return (this.readingSum / this.nReadings)-this.actualDistance+10;
};

SensorDemo.prototype.draw = function ()
{
	const ctx = this.ctx;

	clearCanvas(this.view.canvas);
	//Draw sensor readings
	ctx.strokeStyle = 'grey';
	let x = 0;
	const step = 1.0 / this.buckets.length * this.view.width;
	for (let i = 0; i < this.buckets.length; i++, x += step)
	{
		let count = this.buckets[i];
		if (count > 0)
		{
			ctx.strokeLine(x + step/2, 0, x + step/2, count / this.maxCount * this.view.height);
		}
	}

	//Draw the actual distance
	ctx.strokeStyle = 'red';
	ctx.strokeLine(this.actualDistance, 0, this.actualDistance, this.view.height);

	ctx.fillTextWithColorFont('Actual Distance: ' + 10,
		'black', '20px Menlo Regular',
		10, 20);
	ctx.fillTextWithColorFont('Average Sensor Readings: ' +
		this.getAverageReadings(), 'black', '20px Menlo Regular', 10, 40);
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
