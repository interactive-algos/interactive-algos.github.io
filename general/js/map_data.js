function getMap()
{
	//   var map =
	//   [
	//       new Line(30, 0, 110, 130),
	//       new Line(110, 130, 220, 60),
	//       new Line(270, 0, 370, 130),
	//       new Line(370, 130, 460, 60),
	//       new Line(700, 200, 550, 230),
	//       new Line(520, 250, 450, 270),
	//       new Line(450, 270, 450, 400),
	//       new Line(540, 0, 540, 130),
	//       new Line(540, 130, 585, 130),
	//       new Line(610, 130, 700, 130),
	//       new Line(0, 340, 220, 270),
	//       new Line(220, 270, 220, 400),
	//       new Line(220, 270, 290, 270),
	//       new Line(370, 270, 450, 270)
	//   ];
	//
	// map.push(new Line(0, 0, canvas.width, 0));
	// map.push(new Line(canvas.width, 0, canvas.width, canvas.height));
	// map.push(new Line(canvas.width, canvas.height, 0, canvas.height));
	// map.push(new Line(0, canvas.height, 0, 0));
	var map = [
		new Line(60.8389, 15.0809, 60.8389, 13.2666),
		new Line(0.9887, 40.3049, 64.8519, 40.2121),
		new Line(7.1836, 40.2121, 7.2962, 31.2908),
		new Line(21.6452, 40.2248, 21.6452, 31.2226),
		new Line(21.6452, 31.2226, 21.7249, 31.3540),
		new Line(30.1670, 40.1591, 30.2467, 31.2882),
		new Line(64.8918, 39.9619, 64.8918, 45.6788),
		new Line(64.8918, 45.6788, 73.7322, 45.6129),
		new Line(73.8915, 40.2248, 108.0588, 40.2248),
		new Line(108.0588, 40.2248, 108.1384, 19.7232),
		new Line(108.1384, 19.7232, 112.0409, 19.5918),
		new Line(112.0409, 19.5918, 111.9613, 12.1666),
		new Line(111.9613, 12.1666, 105.1916, 12.0352),
		new Line(105.1916, 12.0352, 105.1120, 13.1523),
		new Line(105.1120, 13.1523, 104.9526, 13.3493),
		new Line(104.9526, 13.3493, 52.5470, 13.0866),
		new Line(7.3093, 31.2882, 9.3801, 31.2882),
		new Line(12.4065, 30.8940, 12.4065, 31.3540),
		new Line(12.4065, 28.9227, 12.4065, 28.5941),
		new Line(25.3884, 28.3970, 25.3088, 22.3517),
		new Line(32.7954, 28.3312, 32.7156, 22.2861),
		new Line(26.6628, 22.3517, 39.2465, 22.2861),
		new Line(42.6713, 22.3517, 54.1399, 22.3517),
		new Line(5.6367, 13.1523, 5.6367, 19.7889),
		new Line(10.8137, 19.7889, 14.6366, 19.7232),
		new Line(18.9372, 19.6576, 22.2027, 19.6576),
		new Line(9.3801, 13.3493, 9.4597, 19.7232),
		new Line(13.9197, 13.2179, 14.0790, 19.7232),
		new Line(17.5036, 13.0866, 17.4240, 19.5918),
		new Line(22.2027, 13.1523, 22.1230, 19.8547),
		new Line(25.5478, 13.1523, 25.6274, 19.7232),
		new Line(23.3973, 19.6576, 28.4946, 19.7232),
		new Line(30.0874, 13.1523, 30.0079, 19.9204),
		new Line(30.0079, 19.9204, 30.0874, 19.5918),
		new Line(29.5300, 19.6576, 30.5653, 19.6576),
		new Line(33.8307, 13.1523, 33.7510, 19.7889),
		new Line(30.0079, 13.2179, 30.0874, 19.5918),
		new Line(41.1580, 13.0866, 41.0783, 14.1379),
		new Line(41.0783, 15.1236, 41.1580, 19.6576),
		new Line(44.6623, 13.2837, 44.7419, 19.7889),
		new Line(21.8044, 31.3540, 25.1495, 31.2882),
		new Line(64.3343, 31.2882, 73.8119, 31.1569),
		new Line(65.0511, 31.4196, 64.9715, 38.5821),
		new Line(81.7763, 37.1364, 81.7763, 40.0934),
		new Line(84.0063, 31.2882, 89.6610, 31.2882),
		new Line(89.6610, 31.2882, 89.6610, 36.0194),
		new Line(89.6610, 36.0194, 86.5549, 36.0194),
		new Line(86.5620, 40.1887, 86.5620, 37.0989),
		new Line(89.8284, 40.2121, 89.8284, 37.1918),
		new Line(99.8528, 35.9837, 100.9227, 35.9837),
		new Line(100.9790, 37.1918, 101.6830, 37.1686),
		new Line(102.7812, 37.1918, 108.1312, 37.1918),
		new Line(100.8946, 22.3465, 108.1312, 22.3698),
		new Line(81.7470, 22.3930, 80.1982, 22.3930),
		new Line(83.2392, 25.8546, 83.3237, 28.5032),
		new Line(83.2392, 25.9243, 83.2674, 22.4162),
		new Line(84.4219, 22.4394, 84.4219, 28.4101),
		new Line(81.0710, 22.3001, 81.0992, 21.7658),
		new Line(81.0429, 20.0465, 81.0429, 19.8143),
		new Line(104.8650, 19.7446, 105.4563, 19.7213),
		new Line(106.7234, 19.7213, 108.1877, 19.6982),
		new Line(105.1747, 19.7446, 105.1747, 13.2165),
		new Line(103.7105, 19.7213, 100.9227, 19.7213),
		new Line(99.7682, 19.6982, 95.4038, 19.6982),
		new Line(94.1928, 19.6749, 92.8131, 19.6982),
		new Line(91.6586, 19.6749, 88.7865, 19.7213),
		new Line(87.6320, 19.7679, 78.4243, 19.8143),
		new Line(76.9318, 19.7446, 76.2278, 19.7446),
		new Line(75.1297, 19.7446, 72.4828, 19.7213),
		new Line(101.1761, 19.6517, 101.1199, 13.2396),
		new Line(97.4310, 19.6517, 97.4592, 13.2165),
		new Line(93.0383, 19.6749, 93.0947, 13.1235),
		new Line(89.0963, 19.7213, 89.0681, 13.1003),
		new Line(81.1837, 19.7911, 81.1274, 13.0072),
		new Line(76.5939, 19.7446, 76.5939, 13.1932),
		new Line(72.9896, 19.8143, 72.9896, 13.1467),
		new Line(68.3716, 13.1467, 68.3434, 19.7446),
		new Line(60.4874, 28.5496, 74.0033, 28.5032),
		new Line(73.9752, 22.5557, 73.9469, 22.0446),
		new Line(73.9469, 22.0446, 65.5840, 21.9051),
		new Line(65.5840, 21.9051, 65.5840, 22.1839),
		new Line(65.5840, 22.1839, 65.6403, 22.4394),
		new Line(65.6403, 22.4394, 65.6403, 28.5032),
		new Line(63.8382, 22.3930, 65.5840, 22.3930),
		new Line(62.5710, 22.3930, 55.5033, 22.3465),
		new Line(59.8396, 19.6982, 61.9234, 19.6749),
		new Line(63.0779, 19.6749, 71.3846, 19.6749),
		new Line(60.8535, 15.0053, 60.8535, 19.6517),
		new Line(57.2210, 19.7213, 57.2491, 13.1235),
		new Line(82.9651, 31.2948, 76.6198, 31.2948),
		new Line(73.7485, 45.6551, 73.7839, 39.7179),
		new Line(73.9257, 40.2443, 73.7662, 40.2296),
		new Line(64.8862, 39.9810, 73.7839, 39.9518),
		new Line(81.7720, 40.0552, 81.7720, 40.2414),
		new Line(86.5633, 36.0108, 86.5633, 35.6964),
		new Line(89.6474, 36.0254, 98.6425, 35.9743),
		new Line(25.3783, 28.3261, 25.3783, 28.4870),
		new Line(17.7035, 19.6837, 15.9844, 19.6837),
		new Line(17.4024, 19.5082, 17.4024, 19.6690),
		new Line(9.7453, 19.7422, 7.1752, 19.7422),
		new Line(6.0765, 19.7860, 5.4559, 19.7714),
		new Line(61.1489, 22.4287, 61.1489, 28.6133),
		new Line(61.1489, 28.6133, 61.1881, 28.4839),
		new Line(39.2602, 22.2847, 42.6654, 22.3510),
		new Line(26.1790, 31.2478, 33.5884, 31.2765),
		new Line(37.3627, 31.2881, 33.5247, 31.2486),
		new Line(55.4450, 31.2881, 39.1235, 31.2881),
		new Line(37.7980, 31.2684, 37.2242, 31.2684),
		new Line(63.1013, 31.2683, 56.3748, 31.2683),
		new Line(74.1967, 35.5492, 74.1745, 31.2155),
		new Line(74.0039, 28.5005, 74.4586, 28.5005),
		new Line(74.4586, 28.5005, 74.4292, 24.5254),
		new Line(73.8128, 31.1559, 74.1703, 31.1541),
		new Line(74.1758, 31.1862, 74.2315, 40.1964),
		new Line(73.9446, 22.0513, 73.9446, 22.5688),
		new Line(23.7588, 31.2971, 23.7324, 30.5562),
		new Line(23.6971, 29.1890, 23.7500, 28.5892),
		new Line(14.3022, 31.2570, 14.1692, 27.1546),
		new Line(14.1692, 27.1546, 16.2204, 27.1356),
		new Line(16.2204, 27.1356, 16.2394, 26.8697),
		new Line(22.5830, 28.6550, 19.7911, 28.6550),
		new Line(23.7503, 28.6408, 31.1366, 28.5032),
		new Line(19.8278, 28.6132, 19.8278, 22.4875),
		new Line(19.8278, 22.3832, 25.2497, 22.3572),
		new Line(16.2656, 27.0323, 16.1665, 19.7728),
		new Line(5.4142, 13.0427, 52.4294, 13.0427),
		new Line(16.2375, 31.3264, 21.6094, 31.2910),
		new Line(14.9180, 31.3381, 14.9298, 32.4219),
		new Line(16.2610, 31.3264, 16.2846, 32.3277),
		new Line(79.4829, 28.6052, 79.5830, 22.1993),
		new Line(74.4326, 22.8286, 74.4524, 22.0373),
		new Line(74.4524, 22.0373, 73.9578, 22.0373),
		new Line(73.9380, 24.5696, 74.4326, 24.5696),
		new Line(74.4276, 22.8272, 73.0992, 22.8070),
		new Line(74.4343, 24.5481, 70.9911, 24.5338),
		new Line(28.5238, 19.8081, 61.7966, 19.7674),
		new Line(60.4267, 28.5820, 48.2768, 28.6090),
		new Line(46.5139, 28.5621, 31.2367, 28.5306),
		new Line(81.8684, 22.2753, 86.9179, 22.2346),
		new Line(86.9179, 22.2346, 86.9383, 22.0513),
		new Line(86.9383, 22.0513, 87.7120, 22.0513),
		new Line(87.7120, 22.0513, 87.7120, 22.2346),
		new Line(87.7120, 22.2346, 93.5963, 22.1735),
		new Line(93.5963, 22.1735, 93.6166, 21.9699),
		new Line(93.6166, 21.9699, 94.4107, 22.0106),
		new Line(94.4107, 22.0106, 94.4107, 22.2549),
		new Line(94.4107, 22.2549, 95.6324, 22.2549),
		new Line(98.0350, 22.2957, 100.2950, 22.2549),
		new Line(100.2950, 22.2549, 100.3154, 21.9495),
		new Line(100.3154, 21.9495, 101.3538, 21.9292),
		new Line(101.3538, 21.9292, 101.3334, 22.3771),
		new Line(101.3334, 22.3771, 102.8401, 22.3567),
		new Line(102.8401, 22.3567, 102.8605, 19.7709),
		new Line(98.0184, 22.2461, 98.1108, 35.9509),
		new Line(95.6037, 28.8723, 95.5633, 22.3149),
		new Line(95.6440, 31.3137, 95.6037, 35.9544),
		new Line(95.6440, 31.2935, 89.6717, 31.2935),
		new Line(95.5633, 28.8925, 79.4825, 28.7916),
		new Line(76.0931, 31.2569, 76.0931, 40.1992),
		new Line(82.9641, 31.2953, 76.0898, 31.2870),
		new Line(67.4098, 22.3231, 71.4502, 22.3416),
		new Line(71.4502, 22.3416, 71.4687, 22.8028),
		new Line(67.4467, 22.3231, 67.4467, 27.8211)
	];
	return map;
}

function compactMap(map)
{
	var minx = map[0].s.x;
	var miny = map[0].s.y;

	map.forEach(function (l)
	{
		minx = min(minx, l.s.x, l.t.x);
		miny = min(miny, l.s.y, l.t.y);
	});

	map.forEach(function (l)
	{
		l.minX -= minx;
		l.maxX -= minx;
		l.minY -= miny;
		l.maxY -= miny;

		l.s.x -= minx;
		l.s.y -= miny;
		l.t.x -= minx;
		l.t.y -= miny;
	});
}


function getSimMap()
{
	m = [
		new Line(0, 5, 10, 5),
		new Line(5, 0, 5, 10)
	];
	return m;
}
