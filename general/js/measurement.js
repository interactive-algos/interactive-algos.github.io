/**
 * A simulation of Beam Model --
 * A representation of Measurement Model
 * @constructor
 * @param {float} a1 - The noise on beam when hit
 * @param {float} sensorRadius - The sensor Radius of the robot
 * @param {Line[]} map - An array of lines that represent the world
 * @param {int} width - The width of the map
 * @param {int} height - The height of the map
 */
function BeamModel(a1, sensorRadius, map, width, height){
	this.a1 = a1;
	this.map = map;
	this.width = width;
	this.height = height;
	this.sensorRadius = sensorRadius;
}

/**
 * The probability for the robot to get a sensor reading "z"
 * when it has a state "state"
 * @function
 * @param {float[]} z - The given reading of measurement sensor
 * @param {RobotState} state - The actual robot state
 * @returns {float} q - The probability of getting z
 */
BeamModel.prototype.probability = function(z, state)
{
    // if(state.x < 0 || state.y < 0 || state.x >= this.width || state.y >= this.height)
    //     return 0;

    const m = this.map;

    //Actual sensor data
    var z_true = new Array(z.length);

    //Initialization of the probability
    var q = 1;

    //Obtain the true distances
    scan(state.x, state.y, state.dir, this.sensorRadius, m, z_true);

    //Number of lasers that robot use to sense
    const nLasers = z.length;

    //Adjust the direction of all lasers base on the (estimated?) rotation of the robot
    const dirOffset = Math.round(state.dir/(TWO_PI) * nLasers);

    var i = (dirOffset - nLasers/4);
    i += nLasers + nLasers;

    for(var index = 0; index <= nLasers/2; index ++, i++)
    {
        if(z[i] >= this.sensorRadius || z_true[i] >= this.sensorRadius)
            continue;
        i %= nLasers;
        // q *= prob_gaussian(z[i] - z_true[i], this.a1*z_true[i]);
    }

    for (var j = 0; j < z.length; j++) {
        q *= 1 - Math.abs((z[j]-z_true[j])/(z[j]+z_true[j])/2);
    }
    return q;
};

/**
 * The log of probability for the robot to get a sensor reading "z"
 * when it has a state "state"
 * @function
 * @param {float[]} z - The given reading of measurement sensor
 * @param {RobotState} state - The actual robot state
 * @returns {float} q - The log of probability of getting z
 */
BeamModel.prototype.prob_log = function(z, state)
{
    // if(state.x < 0 || state.y < 0 || state.x >= this.width || state.y >= this.height)
    //     return Number.NEGATIVE_INFINITY;

    const m = this.map;

    var z_true = new Array(z.length);

    var q = 0;

    //Obtain the true distances
    scan(state.x, state.y, state.dir, this.sensorRadius, m, z_true);

    const nLasers = z.length;

    const dirOffset = Math.round(state.dir/(TWO_PI) * nLasers);

    //z will be an array of noised distances, obtained by robot's sensor
    var i = (dirOffset - nLasers/4);
    i += nLasers + nLasers;

    for(var index = 0; index <= nLasers/2; index ++, i++)
    {
        if(z[i] > this.senseRadius || z_true[i] > this.sensorRadius)
            continue;
        i %= nLasers;
        q += prob_gaussian_log(z[i] - z_true[i], this.a1*z_true[i]);
    }
    return q;
};

/**
 * Scans the map in (x,y); with direction of dir0;
 * with sensor radius of r; And assign the result into z.
 * @function
 * @param {int} x - X Coordinate
 * @param {int} y - Y Coordinate
 * @param {float} dir0 - The facing direction
 * @param {float} r - The sensor radius
 * @param {Line[]} map - An array of Lines that represents the world
 * @param {float[]} z - The array to store the sensor reading
 */
function scan(x, y, dir0, r, map, z)
{
    var nLasers = z.length;

    for(var i = 0; i < nLasers; i ++)
    {
        var dir = TWO_PI * i / nLasers;

        //End points of the laser line
        var s1 = new Point(x, y);
        var t1 = new Point(x + cos(dir)*r, y + sin(dir)*r);

        //If dir is 90 degrees
        //if i = 1/nLasers or i = (3/4) * nLasers
        //cos(dir) should be 0 in these cases,
        if(i * 4 === nLasers || i * 4 === nLasers * 3)
            t1.x = x;
        else if(i * 2 === nLasers)
            t1.y = y;


        z[i] = r;
        for(var j = 0; j < map.length; j ++)
        {
            if(doIntersect(s1, t1, map[j].s, map[j].t))
            {
                var p = intersectionPoint(s1, t1, map[j].s, map[j].t);
                var dist = p.distanceTo(new Point(x, y));
                z[i] = min(z[i], dist);
            }
        }
    }
}
