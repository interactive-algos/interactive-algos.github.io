
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
	return Math.exp(this.prob_log(z, state));
};


BeamModel.prototype.prob_log = function(z, state)
{
    const m = this.map;

    var z_true = new Array(z.length);

    var q = 0;

    //Obtain the true distances
    scan(state.x, state.y, this.sensorRadius, m, z_true);

    //z will be an array of noised distances, obtained by robot's sensor
    for(var i = 0; i < z.length; i ++)
    {
        q += Math.log((prob_gaussian(z[i] - z_true[i], this.a1)));
    }
    return q;
};