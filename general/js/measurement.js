
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
	scan(state.x, state.y, this.sensorRadius, m, z_true);

	//z will be an array of noised distances, obtained by robot's sensor
	for(var i = 0; i < z.length; i ++)
	{
		q = q * (z[i] * prob_gaussian(z[i] - z_true[i], this.a1));
	}
	return q;
};
