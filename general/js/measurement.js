
function BeamModel(a1, sensorRadius, map)
{
	//Gaussian noise on hit
	this.a1 = a1;

	this.map = map;

	//Sensor radius
	this.sensorRadius = sensorRadius;
}

/*
	Probability of getting measurement z
	if the robot pose is 'state'. (Given map m)
 */
BeamModel.prototype.probability = function(z, state)
{
	const m = this.map;

	var z_true = new Array(z.length);

	q = 1;
	
	//Obtain the true distances
	scan(state.x, state.y, this.sensorRadius, map, z_true);

	//Particle/Robot's state
	console.log("Robot is at (" + state.x, + ", " + state.y + ") direction: " + state.dir);

	//z will be an array of noised distances, obtained by robot's sensor
	for(var i = 0; i < z.length; i ++)
	{
		var g = gaussian();
		q = q * (z[i] * prob_gaussian(z[i], g) + randInt(0, this.sensorRadius)/this.sensorRadius);
		console.log("Ray at angle " + i/z.length * Math.PI*2 + "detected distance: " + z[i]);
	}

	//m is the map
	for(var i = 0; i < m.length; i ++)
	{
		var line = m[i];
		console.log('Line Segment from' + l.s + " to " + l.t + " slope: " + (l.t.y-l.s.y)/(l.t.x-l.s.x));
	}
	return q;
};
