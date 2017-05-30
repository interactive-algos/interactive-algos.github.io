
function BeamModel(a1, a2, a3, a4)
{
	//Noise on rotational 1
	this.a1 = a1;
	//Noise on translational displacement
	this.a2 = a2;
	//Noise on rotational 2
	this.a3 = a3;
	//Final rotation
	this.a4 = a4;
}

/*
	Probability of getting measurement z
	if the robot pose is 'state'. (Given map m)
 */
BeamModel.prototype.probability = function(z, state, m)
{
	//Particle/Robot's state
	console.log("Robot is at (" + state.x, + ", " + state.y + ") direction: " + state.dir);

	//z will be an array of distanced, representing
	for(var i = 0; i < z.length; i ++)
	{
		console.log("Ray at angle " + i/z.length * Math.PI*2 + "detected distance: " + z[i]);
	}

	//m is the map
	for(var i = 0; i < m.length; i ++)
	{
		var line = m[i];
		console.log('Line Segment from' + l.s + " to " + l.t + " slope: " + (l.t.y-l.s.y)/(l.t.x-l.s.x));
	}
	return random();
};
