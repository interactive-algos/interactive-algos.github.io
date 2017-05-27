
//Odometry reading, represents x_t-1 and x_t. Both are estimates
function Odometry(lastState, state)
{
	this.lastX = lastState.x;
	this.lastY = lastState.y;
	this.lastDir = lastState.dir;
	
	this.x = state.x;
	this.y = state.y;
	this.dir = state.dir;
}

function OdometryModel(a1, a2, a3, a4)
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

//Sample from the distribution p(x_t+1, u, x), 
//where u is the control/odometry, x is the state
OdometryModel.prototype.sample = function(u, state)
{
	var dx = u.x-u.lastX;
	var dy = u.y-u.lastY;

	//first rotation
	var rot1 = atan2(dy, dx) - u.lastDir;
	//translational distance traveled
	var trans = sqrt(dx*dx + dy*dy);
	//second rotation
	var rot2 = u.dir - u.lastDir - rot1;

	//Bound radians to interval [-pi, pi]
	rot1 = boundRadian(rot1);
	rot2 = boundRadian(rot2);

	//actual sampling
	rot1 += gaussian() * (this.a1*rot1);
	trans += gaussian() * (this.a2*trans);
	rot2 += gaussian() * (this.a3*rot2);

	var x = state.x + trans*cos(state.dir+rot1);
	var y = state.y + trans*sin(state.dir+rot1);

	//disregarding final rotation for now...
	var dir = state.dir + rot1 + rot2;

	return new RobotState(x, y, dir);
}