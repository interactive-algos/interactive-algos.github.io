/**
 * A simulation of Odometry Reading
 * @constructor
 * @param {RobotState} lastState - The last estimated state of the robot
 * @param {RobotState} state - The current estimated state of the robot
 */
function Odometry(lastState, state)
{
	this.lastX = lastState.x;
	this.lastY = lastState.y;
	this.lastDir = lastState.dir;

	this.x = state.x;
	this.y = state.y;
	this.dir = state.dir;
}

/**
 * A simulation of Odometry Model --
 * A representation of Motion Model
 * @constructor
 * @param {number} a1 - Rotational Noise from rotational movement
 * @param {number} a2 - Rotational noise from translational movement
 * @param {number} a3 - Translational noise from translational movement
 * @param {number} a4 - Final Rotation
 */
function OdometryModel(a1, a2, a3, a4)
{
	this.a1 = a1;
	this.a2 = a2;
	this.a3 = a3;
	this.a4 = a4;
}

/**
 * Sample from the distribution p(x_t+1, u, x)
 * @function
 * @param {Odometry} u - The Odometry reading
 * @param {RobotState} state - The Current Robot State
 */
OdometryModel.prototype.sample = function (u, state)
{
	const dx = u.x - u.lastX;
	const dy = u.y - u.lastY;

	const a1 = this.a1;
	const a2 = this.a2/25;
	const a3 = this.a3;
	const a4 = this.a4;

	//first rotation
	let rot1 = atan2(dy, dx) - u.lastDir;
	//translational distance traveled
	let trans = sqrt(dx * dx + dy * dy);
	//second rotation
	let rot2 = u.dir - u.lastDir - rot1;

	//Bound radians to interval [-pi, pi]
	rot1 = boundRadian(rot1);
	rot2 = boundRadian(rot2);

	const rot1_squared = rot1 * rot1;
	const trans_squared = trans * trans;
	const rot2_squared = rot2 * rot2;

	//actual sampling
	rot1 = gaussian(rot1, sqrt(a1*rot1_squared + a2*trans_squared));
	trans = gaussian(trans, sqrt(a3*trans_squared + a4*rot1_squared + a4*rot2_squared));
	rot2 = gaussian(rot2, sqrt(a1*rot2_squared + a2*trans_squared));

	// if(trans < 0)trans = 0;

	const x = state.x + trans * cos(state.dir + rot1);
	const y = state.y + trans * sin(state.dir + rot1);

	const dir = state.dir + rot1 + rot2;

	return new RobotState(x, y, dir);
};