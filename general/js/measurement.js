
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

    const m = this.map;

    var z_true = new Array(z.length);

    //Initialization of the probability
    var q = 1;

    //Obtain the true distances
    scan(state.x, state.y, this.sensorRadius, m, z_true);

    //Number of lasers that robot use to sense
    const nLasers = z.length;

    //Adjust the direction of all lasers base on the (estimated?) rotation of the robot
    const dirOffset = Math.round(state.dir/(TWO_PI) * nLasers);

    var i = (dirOffset - nLasers/4);
    i += nLasers + nLasers;

    for(var index = 0; index <= nLasers/2; index ++, i++)
    {
        // if(z[i] > this.sensorRadius || z_true[i] > this.sensorRadius)
        //     continue;
        i %= nLasers;
        q *= (prob_gaussian(z[i] - z_true[i], this.a1*z_true[i]));
    }
    return q;
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
    i += nLasers + nLasers;

    for(var index = 0; index <= nLasers/2; index ++, i++)
    {
        // if(z[i] > this.senseRadius || z_true[i] > this.sensorRadius)
        //     continue;
        i %= nLasers;
        q += (prob_gaussian_log(z[i] - z_true[i], this.a1*z_true[i]));
    }
    return q;
};