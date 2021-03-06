/**
 * Created by kelvinzhang on 7/1/17.
 */

window.onerror = function (msg, url, lineNo, columnNo, error)
{
	let message = [
		'Message: ' + msg,
		'URL: ' + url,
		'Line: ' + lineNo,
		'Column: ' + columnNo,
		'Error object: ' + JSON.stringify(error)
	].join(' - ');

	alert(message);
	return false;
};

let simpleActuation;
let a1Demo;
let a2Demo;
let a3Demo;
let a4Demo;

let measurementDemo;
let sensorDemo;

let motionDemo;
let a1MDemo;
let a2MDemo;
let a3MDemo;
let a4MDemo;

let mclDemo;

const actuationNoiseSliderFormat = {
	min: 0,
	max: 0.5,
	step: 0.01,
	value: 0.01
};

function initMotionDemo()
{
	const path = vanillaPath;
	const x = path[0].x;
	const y = path[0].y;
	const dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);
	const filter = new ParticleFilter(
		500,
		new OdometryModel(
			getValue('motion_a1') / 100.0,
			getValue('motion_a2') / 100.0,
			getValue('motion_a3') / 100.0,
			getValue('motion_a4') / 100.0),
		undefined,
		new RobotState(x, y, dir));
	let slider = new Slider("#motion_stride");


	//Individual Simulations
	const s_path = simPath;
	const st_path = straightPath;
	const s_x = s_path[0].x;
	const s_y = s_path[0].y;
	const s_dir = atan2(s_path[1].y - s_path[0].y, s_path[1].x - s_path[0].x);
	const st_x = st_path[0].x;
	const st_y = st_path[0].y;
	const st_dir = atan2(st_path[1].y - st_path[0].y, st_path[1].x - st_path[0].x);
	const exaggerateFilterNoise = Number(document.getElementById("actuation_noise").value);
	const smallParticleCount = 100;

	//These filters have no sensor mode,
	const filterA1 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(exaggerateFilterNoise, 0, 0, 0),
		undefined,	//no sensor model
		new RobotState(s_x, s_y, s_dir));
	const filterA2 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(0, exaggerateFilterNoise, 0, 0),
		undefined,
		new RobotState(st_x, st_y, st_dir));
	const filterA3 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(0, 0, exaggerateFilterNoise, 0),
		undefined,
		new RobotState(st_x, st_y, st_dir));
	const filterA4 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(0, 0, 0, exaggerateFilterNoise),
		undefined,
		new RobotState(s_x, s_y, s_dir));


	slider.on("slide", function (sliderValue)
	{
		motionDemo.stride = sliderValue;
		a1MDemo.stride = sliderValue/10000.0;
		a2MDemo.stride = sliderValue;
		a3MDemo.stride = sliderValue;
		a4MDemo.stride = sliderValue/10000.0;
	});

	let a1Slider = new Slider('#motion_a1', actuationNoiseSliderFormat);
	let a2Slider = new Slider('#motion_a2', actuationNoiseSliderFormat);
	let a3Slider = new Slider('#motion_a3', actuationNoiseSliderFormat);
	let a4Slider = new Slider('#motion_a4', actuationNoiseSliderFormat);

	a1Slider.on('slide', (value) => motionDemo.a1 = value);
	a2Slider.on('slide', (value) => motionDemo.a2 = value);
	a3Slider.on('slide', (value) => motionDemo.a3 = value);
	a4Slider.on('slide', (value) => motionDemo.a4 = value);

	let robot = new Robot(filter, path, 0, 0, slider.getValue());
	let robotA1 = new Robot(filterA1, s_path, 0, 0, slider.getValue()/10000.0);
	let robotA2 = new Robot(filterA2, st_path, 0, 0, slider.getValue());
	let robotA3 = new Robot(filterA3, st_path, 0, 0, slider.getValue());
	let robotA4 = new Robot(filterA4, s_path, 0, 0, slider.getValue()/10000.0);
	motionDemo = new RobotDemo('motion_canvas', 'motion_minicanvas', getMap(), robot);
	a1MDemo = new RobotDemo('motion_a1_demo', '', getSimMap(), robotA1);
	a2MDemo = new RobotDemo('motion_a2_demo', '', getSimMap(), robotA2);
	a3MDemo = new RobotDemo('motion_a3_demo', '', getSimMap(), robotA3);
	a4MDemo = new RobotDemo('motion_a4_demo', '', getSimMap(), robotA4);
}

function initMCLDemo()
{
	let slider = new Slider("#mcl_stride", {
		min: 0.01,
		max: 0.2,
		step: 0.01,
		value: 0.04
	});
	slider.on("slide", (sliderValue) => mclDemo.stride = sliderValue);

	let a1Slider = new Slider('#mcl_a1', actuationNoiseSliderFormat);
	let a2Slider = new Slider('#mcl_a2', actuationNoiseSliderFormat);
	let a3Slider = new Slider('#mcl_a3', actuationNoiseSliderFormat);
	let a4Slider = new Slider('#mcl_a4', actuationNoiseSliderFormat);

	a1Slider.on('slide', (value) => mclDemo.a1 = value);
	a2Slider.on('slide', (value) => mclDemo.a2 = value);
	a3Slider.on('slide', (value) => mclDemo.a3 = value);
	a4Slider.on('slide', (value) => mclDemo.a4 = value);

	let sensorRadiusSlider = new Slider('#mcl_sensorRadius', {
		min: 1,
		max: 10,
		step: 0.5
	});
	sensorRadiusSlider.on('slide', (value) => mclDemo.setSensorRadius(value));

	let sensorNoiseSlider = new Slider('#mcl_sensorNoise', {
		min: 0,
		max: 0.3,
		step: 0.01
	});
	sensorNoiseSlider.on('slide', (value) => mclDemo.setSensorNoise(value));

	let colorResSlider = new Slider('#mcl_colorRes', {
		min: 1,
		max: 20,
		step: 1
	});
	colorResSlider.on('slide', (value) => measurementDemo.setColoringResolution(value));

	// let pRatioSlider = new Slider('#mcl_pRatio', {
	// 	min: 0,
	// 	max: 1,
	// 	step: 0.01,
	// 	formatter: function (value)
	// 	{
	// 		return round(value * 100) + "%";
	// 	}
	// });
	// pRatioSlider.on('slide', function (value)
	// {
	// 	mclDemo.robot.filter.resampleRatio = value;
	// });


	const path = vanillaPath;
	const x = path[0].x;
	const y = path[0].y;
	const dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);
	const filter = new ParticleFilter(
		getValue('mcl_nParticles'),
		new OdometryModel(
			a1Slider.getValue(),
			a2Slider.getValue(),
			a3Slider.getValue(),
			a4Slider.getValue()),
		new BeamModel(
			sensorNoiseSlider.getValue(),
			sensorRadiusSlider.getValue(),
			getMap()),
		new RobotState(x, y, dir));
	robot = new Robot(filter, path, 19, getValue('mcl_sensorRadius'), getValue('mcl_stride'));
	mclDemo = new RobotDemo('mcl_canvas', 'mcl_minicanvas', getMap(), robot);
}

function simulateAllActuations()
{
	a1Demo.simulateActuation();
	a2Demo.simulateActuation();
	a3Demo.simulateActuation();
	a4Demo.simulateActuation();
}

function initActuationDemo()
{
	//Noise parameters
	const a1 = 0.02;
	const a2 = 0.02;
	const a3 = 0.02;
	const a4 = 0.02;

	const firstMove = 2;
	const turn = Math.PI / 6;
	const secondMove = 2;

	simpleActuation = new ActuationDemo('simple_actuation', firstMove, turn, secondMove,
		a1, a2, a3, a4);
	simpleActuation.simulateActuation();

	let noiseSlider = document.getElementById('actuation_noise');
	const noise = Number(noiseSlider.value);
	a1Demo = new ActuationDemo('actuation_a1', firstMove, turn, secondMove,
		noise, 0, 0, 0);
	a2Demo = new ActuationDemo('actuation_a2', firstMove, turn, secondMove,
		0, noise, 0, 0);
	a3Demo = new ActuationDemo('actuation_a3', firstMove, turn, secondMove,
		0, 0, noise, 0);
	a4Demo = new ActuationDemo('actuation_a4', firstMove, turn, secondMove,
		0, 0, 0, noise);
	noiseSlider.addEventListener('input', function(event)
	{
		const sliderValue = Number(event.target.value);
		a1Demo.a1 = sliderValue;
		a2Demo.a2 = sliderValue;
		a3Demo.a3 = sliderValue;
		a4Demo.a4 = sliderValue;

		a1MDemo.a1 = sliderValue;
		a2MDemo.a2 = sliderValue;
		a3MDemo.a3 = sliderValue;
		a4MDemo.a4 = sliderValue;
	});
	noiseSlider.addEventListener('change', simulateAllActuations);
	simulateAllActuations();
}

function initMeasurementDemo()
{
	let map = getMap();
	// compactMap(map);
	let nLasersSlider = new Slider('#nLasers', {
		min: 6,
		max: 36,
		step: 1
	});
	nLasersSlider.on('slide', (value) => measurementDemo.setNLasers(value));
	nLasersSlider.on('slideStop', () => measurementDemo.colorMapIfShould());

	let sensorRadiusSlider = new Slider('#sensorRadius', {
		min: 1,
		max: 10,
		step: 0.5
	});
	sensorRadiusSlider.on('slide', (value) => measurementDemo.sensorRadius = value);
	sensorRadiusSlider.on('slideStop', () => measurementDemo.colorMapIfShould());

	let sensorNoiseSlider = new Slider('#sensorNoise', {
		min: 0,
		max: 0.5,
		step: 0.02
	});
	sensorNoiseSlider.on('slide', (value) => measurementDemo.sensorNoise = (value));
	sensorNoiseSlider.on('slideStop', () => measurementDemo.colorMapIfShould());

	let colorResSlider = new Slider('#colorRes', {
		min: 1,
		max: 20,
		step: 1
	});
	colorResSlider.on('slide', (value) => measurementDemo.setColoringResolution(value));
	colorResSlider.on('slideStop', () => measurementDemo.colorMapIfShould());

	measurementDemo = new BeamModelDemo('sensor_model_demo', map,
		sensorRadiusSlider.getValue(), sensorNoiseSlider.getValue(), 'sensor_model_mini');
}

function onFirstAppear(selector, callback)
{
	$(selector).appear().on('appear', function (event, $targets)
	{
		callback(event, $targets);
		$(selector).off('appear');
	});
}

function initSensorDemo(id)
{
	let noiseSlider = new Slider("#sensor_demo_sensorNoise", {
		min: 0,
		max: 4,
		step: 0.2,
		value: 2
	});
	sensorDemo = new SensorDemo(id, noiseSlider.getValue());
	noiseSlider.on("slideStop", (sliderValue) => sensorDemo.setSensorNoise(sliderValue));
	let repSlider = new Slider('#nSamples', {
		min: 0,
		max: 5,
		step: 0.2,
		value: 2,
		formatter: (value) => {return round(Math.pow(10, value));}
	});
}

(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

function showFPS(bool)
{
	a1MDemo.showFPS = bool;
	a2MDemo.showFPS = bool;
	a3MDemo.showFPS = bool;
	a4MDemo.showFPS = bool;
	motionDemo.showFPS = bool;
	mclDemo.showFPS = bool;
}

function init()
{
	smoothenPath(vanillaPath);
	// onFirstAppear('#simple_actuation', function (e, $t)
	// {
		initActuationDemo();
	// });
	// onFirstAppear('#motion_a1_demo', function (e, $t)
	// {
		initMotionDemo();
	// });
	onFirstAppear('#mcl_canvas', initMCLDemo);
	onFirstAppear('#sensor_model_demo', initMeasurementDemo);
	onFirstAppear('#sensor_demo', (e) => initSensorDemo(e.target.id));
}
