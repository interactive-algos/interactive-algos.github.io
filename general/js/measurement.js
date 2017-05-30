
function BeamModel(a1, sensorRadius, map, width, height)
{
	//Gaussian noise on hit
	this.a1 = a1;

	this.map = map;

	this.width = width;
	this.height = height;

	//Sensor radius
	this.sensorRadius = sensorRadius;
}

/*
	Probability of getting measurement z
	if the robot pose is 'state'. (Given map m)
 */
BeamModel.prototype.probability = function(z, state)
{
    // if(state.x < 0 || state.y < 0 || state.x >= this.width || state.y >= this.height)
    //     return 0;

	return Math.exp(this.prob_log(z, state));
};


BeamModel.prototype.prob_log = function(z, state)
{
    // if(state.x < 0 || state.y < 0 || state.x >= this.width || state.y >= this.height)
    //     return Number.NEGATIVE_INFINITY;

    const m = this.map;

    var z_true = new Array(z.length);

    var q = 0;

    //Obtain the true distances
    scan(state.x, state.y, this.sensorRadius, m, z_true);

    const nLasers = z.length;

    const dirOffset = Math.round(state.dir/(TWO_PI) * nLasers);

    //z will be an array of noised distances, obtained by robot's sensor
    var i = (dirOffset - nLasers/4);
    i += nLasers;

    for(var index = 0; index <= nLasers/2; index ++, i++)
    {
        i %= nLasers;
        q += Math.log(prob_gaussian(z[i] - z_true[i], this.a1*z_true[i]));
    }
    return q;
};