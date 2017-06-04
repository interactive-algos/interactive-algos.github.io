/**
 * Created by kelvinzhang on 6/3/17.
 */


var vanillaPath = [
	{x: 25, y: 302},
	{x: 25, y: 301},
	{x: 25, y: 298},
	{x: 24, y: 293},
	{x: 24, y: 284},
	{x: 24, y: 273},
	{x: 24, y: 271},
	{x: 24, y: 266},
	{x: 24, y: 262},
	{x: 24, y: 258},
	{x: 25, y: 255},
	{x: 25, y: 252},
	{x: 25, y: 248},
	{x: 25, y: 246},
	{x: 25, y: 245},
	{x: 25, y: 243},
	{x: 25, y: 241},
	{x: 25, y: 240},
	{x: 25, y: 239},
	{x: 25, y: 237},
	{x: 25, y: 236},
	{x: 25, y: 233},
	{x: 25, y: 232},
	{x: 25, y: 231},
	{x: 25, y: 229},
	{x: 25, y: 227},
	{x: 25, y: 226},
	{x: 25, y: 225},
	{x: 25, y: 223},
	{x: 25, y: 222},
	{x: 25, y: 219},
	{x: 25, y: 218},
	{x: 25, y: 216},
	{x: 25, y: 214},
	{x: 25, y: 212},
	{x: 25, y: 210},
	{x: 25, y: 208},
	{x: 25, y: 206},
	{x: 25, y: 204},
	{x: 25, y: 203},
	{x: 25, y: 199},
	{x: 25, y: 196},
	{x: 25, y: 194},
	{x: 25, y: 190},
	{x: 25, y: 185},
	{x: 25, y: 182},
	{x: 25, y: 178},
	{x: 25, y: 175},
	{x: 25, y: 173},
	{x: 25, y: 169},
	{x: 25, y: 166},
	{x: 25, y: 163},
	{x: 25, y: 161},
	{x: 25, y: 157},
	{x: 25, y: 155},
	{x: 25, y: 153},
	{x: 25, y: 152},
	{x: 25, y: 150},
	{x: 25, y: 149},
	{x: 25, y: 149},
	{x: 25, y: 147},
	{x: 25, y: 147},
	{x: 25, y: 146},
	{x: 25, y: 146},
	{x: 25, y: 145},
	{x: 25, y: 145},
	{x: 25, y: 144},
	{x: 25, y: 144},
	{x: 25, y: 143},
	{x: 26, y: 142},
	{x: 26, y: 142},
	{x: 26, y: 140},
	{x: 27, y: 140},
	{x: 27, y: 139},
	{x: 28, y: 139},
	{x: 28, y: 138},
	{x: 28, y: 138},
	{x: 29, y: 138},
	{x: 29, y: 138},
	{x: 30, y: 138},
	{x: 30, y: 138},
	{x: 31, y: 138},
	{x: 31, y: 138},
	{x: 32, y: 138},
	{x: 32, y: 138},
	{x: 33, y: 138},
	{x: 34, y: 138},
	{x: 35, y: 138},
	{x: 36, y: 138},
	{x: 36, y: 138},
	{x: 37, y: 138},
	{x: 39, y: 138},
	{x: 39, y: 139},
	{x: 40, y: 139},
	{x: 41, y: 139},
	{x: 41, y: 140},
	{x: 43, y: 141},
	{x: 43, y: 142},
	{x: 44, y: 142},
	{x: 46, y: 144},
	{x: 46, y: 145},
	{x: 47, y: 145},
	{x: 48, y: 147},
	{x: 49, y: 148},
	{x: 49, y: 148},
	{x: 50, y: 150},
	{x: 51, y: 150},
	{x: 51, y: 151},
	{x: 53, y: 152},
	{x: 53, y: 152},
	{x: 54, y: 153},
	{x: 55, y: 154},
	{x: 56, y: 155},
	{x: 57, y: 156},
	{x: 58, y: 157},
	{x: 59, y: 158},
	{x: 60, y: 159},
	{x: 61, y: 160},
	{x: 62, y: 161},
	{x: 63, y: 162},
	{x: 64, y: 163},
	{x: 66, y: 163},
	{x: 67, y: 164},
	{x: 68, y: 164},
	{x: 70, y: 165},
	{x: 73, y: 166},
	{x: 75, y: 166},
	{x: 77, y: 167},
	{x: 79, y: 167},
	{x: 81, y: 167},
	{x: 83, y: 167},
	{x: 87, y: 167},
	{x: 90, y: 167},
	{x: 92, y: 167},
	{x: 94, y: 167},
	{x: 98, y: 167},
	{x: 101, y: 167},
	{x: 104, y: 167},
	{x: 107, y: 167},
	{x: 110, y: 167},
	{x: 113, y: 167},
	{x: 115, y: 167},
	{x: 119, y: 166},
	{x: 121, y: 166},
	{x: 123, y: 166},
	{x: 125, y: 166},
	{x: 127, y: 166},
	{x: 130, y: 166},
	{x: 132, y: 166},
	{x: 134, y: 165},
	{x: 136, y: 165},
	{x: 138, y: 164},
	{x: 140, y: 164},
	{x: 142, y: 163},
	{x: 144, y: 163},
	{x: 145, y: 162},
	{x: 147, y: 162},
	{x: 149, y: 161},
	{x: 151, y: 160},
	{x: 152, y: 160},
	{x: 154, y: 159},
	{x: 155, y: 158},
	{x: 158, y: 157},
	{x: 160, y: 157},
	{x: 161, y: 157},
	{x: 163, y: 156},
	{x: 167, y: 154},
	{x: 169, y: 153},
	{x: 171, y: 152},
	{x: 172, y: 151},
	{x: 174, y: 150},
	{x: 175, y: 149},
	{x: 178, y: 148},
	{x: 179, y: 147},
	{x: 180, y: 146},
	{x: 181, y: 145},
	{x: 183, y: 144},
	{x: 185, y: 143},
	{x: 186, y: 141},
	{x: 188, y: 140},
	{x: 189, y: 139},
	{x: 191, y: 137},
	{x: 193, y: 136},
	{x: 194, y: 135},
	{x: 196, y: 133},
	{x: 197, y: 132},
	{x: 198, y: 131},
	{x: 200, y: 130},
	{x: 203, y: 126},
	{x: 204, y: 126},
	{x: 205, y: 124},
	{x: 207, y: 123},
	{x: 208, y: 122},
	{x: 209, y: 120},
	{x: 209, y: 119},
	{x: 211, y: 118},
	{x: 212, y: 117},
	{x: 213, y: 116},
	{x: 214, y: 115},
	{x: 215, y: 114},
	{x: 217, y: 111},
	{x: 218, y: 110},
	{x: 219, y: 109},
	{x: 220, y: 108},
	{x: 221, y: 107},
	{x: 222, y: 106},
	{x: 223, y: 105},
	{x: 224, y: 105},
	{x: 224, y: 104},
	{x: 225, y: 104},
	{x: 226, y: 104},
	{x: 226, y: 103},
	{x: 227, y: 103},
	{x: 228, y: 103},
	{x: 229, y: 103},
	{x: 230, y: 103},
	{x: 231, y: 103},
	{x: 233, y: 103},
	{x: 234, y: 103},
	{x: 237, y: 103},
	{x: 238, y: 103},
	{x: 240, y: 103},
	{x: 242, y: 103},
	{x: 244, y: 103},
	{x: 246, y: 103},
	{x: 249, y: 103},
	{x: 252, y: 103},
	{x: 255, y: 103},
	{x: 257, y: 103},
	{x: 260, y: 103},
	{x: 262, y: 103},
	{x: 264, y: 103},
	{x: 266, y: 103},
	{x: 268, y: 104},
	{x: 270, y: 105},
	{x: 271, y: 107},
	{x: 272, y: 107},
	{x: 273, y: 108},
	{x: 274, y: 109},
	{x: 275, y: 109},
	{x: 275, y: 110},
	{x: 277, y: 110},
	{x: 277, y: 111},
	{x: 278, y: 111},
	{x: 278, y: 112},
	{x: 279, y: 112},
	{x: 279, y: 112},
	{x: 280, y: 113},
	{x: 280, y: 113},
	{x: 280, y: 113},
	{x: 281, y: 114},
	{x: 281, y: 114},
	{x: 282, y: 114},
	{x: 282, y: 115},
	{x: 282, y: 115},
	{x: 283, y: 116},
	{x: 283, y: 116},
	{x: 284, y: 117},
	{x: 284, y: 117},
	{x: 285, y: 118},
	{x: 285, y: 118},
	{x: 286, y: 120},
	{x: 286, y: 120},
	{x: 287, y: 121},
	{x: 287, y: 122},
	{x: 288, y: 122},
	{x: 289, y: 124},
	{x: 289, y: 125},
	{x: 290, y: 126},
	{x: 290, y: 126},
	{x: 291, y: 128},
	{x: 292, y: 129},
	{x: 292, y: 129},
	{x: 293, y: 131},
	{x: 294, y: 132},
	{x: 294, y: 133},
	{x: 295, y: 134},
	{x: 296, y: 135},
	{x: 297, y: 136},
	{x: 298, y: 138},
	{x: 299, y: 139},
	{x: 300, y: 141},
	{x: 302, y: 142},
	{x: 303, y: 144},
	{x: 305, y: 146},
	{x: 307, y: 149},
	{x: 310, y: 151},
	{x: 311, y: 153},
	{x: 315, y: 157},
	{x: 317, y: 159},
	{x: 318, y: 159},
	{x: 319, y: 160},
	{x: 322, y: 161},
	{x: 323, y: 162},
	{x: 323, y: 162},
	{x: 324, y: 163},
	{x: 327, y: 163},
	{x: 328, y: 163},
	{x: 329, y: 163},
	{x: 330, y: 163},
	{x: 332, y: 163},
	{x: 334, y: 163},
	{x: 335, y: 163},
	{x: 337, y: 163},
	{x: 339, y: 162},
	{x: 341, y: 162},
	{x: 342, y: 162},
	{x: 343, y: 161},
	{x: 345, y: 160},
	{x: 347, y: 160},
	{x: 349, y: 159},
	{x: 350, y: 158},
	{x: 354, y: 156},
	{x: 356, y: 154},
	{x: 357, y: 152},
	{x: 359, y: 151},
	{x: 361, y: 150},
	{x: 362, y: 149},
	{x: 363, y: 147},
	{x: 364, y: 147},
	{x: 366, y: 146},
	{x: 367, y: 145},
	{x: 368, y: 144},
	{x: 369, y: 144},
	{x: 371, y: 143},
	{x: 372, y: 142},
	{x: 373, y: 141},
	{x: 374, y: 141},
	{x: 375, y: 141},
	{x: 377, y: 139},
	{x: 378, y: 138},
	{x: 379, y: 138},
	{x: 382, y: 137},
	{x: 384, y: 136},
	{x: 386, y: 135},
	{x: 387, y: 135},
	{x: 389, y: 134},
	{x: 391, y: 134},
	{x: 394, y: 132},
	{x: 396, y: 131},
	{x: 397, y: 131},
	{x: 399, y: 130},
	{x: 402, y: 129},
	{x: 404, y: 129},
	{x: 405, y: 129},
	{x: 406, y: 128},
	{x: 408, y: 127},
	{x: 410, y: 127},
	{x: 412, y: 127},
	{x: 413, y: 127},
	{x: 414, y: 127},
	{x: 416, y: 126},
	{x: 417, y: 126},
	{x: 418, y: 126},
	{x: 419, y: 125},
	{x: 421, y: 125},
	{x: 423, y: 125},
	{x: 425, y: 125},
	{x: 427, y: 125},
	{x: 429, y: 125},
	{x: 430, y: 125},
	{x: 433, y: 125},
	{x: 434, y: 125},
	{x: 437, y: 125},
	{x: 438, y: 125},
	{x: 440, y: 125},
	{x: 445, y: 125},
	{x: 447, y: 125},
	{x: 449, y: 125},
	{x: 451, y: 125},
	{x: 453, y: 125},
	{x: 455, y: 125},
	{x: 457, y: 125},
	{x: 458, y: 125},
	{x: 459, y: 125},
	{x: 462, y: 125},
	{x: 463, y: 125},
	{x: 464, y: 125},
	{x: 465, y: 125},
	{x: 467, y: 125},
	{x: 469, y: 125},
	{x: 470, y: 125},
	{x: 472, y: 125},
	{x: 473, y: 125},
	{x: 474, y: 125},
	{x: 475, y: 125},
	{x: 476, y: 125},
	{x: 477, y: 125},
	{x: 478, y: 126},
	{x: 479, y: 126},
	{x: 480, y: 126},
	{x: 481, y: 127},
	{x: 482, y: 129},
	{x: 482, y: 129},
	{x: 483, y: 131},
	{x: 484, y: 131},
	{x: 484, y: 132},
	{x: 485, y: 133},
	{x: 485, y: 133},
	{x: 486, y: 134},
	{x: 487, y: 134},
	{x: 487, y: 134},
	{x: 488, y: 135},
	{x: 488, y: 135},
	{x: 489, y: 135},
	{x: 489, y: 136},
	{x: 490, y: 136},
	{x: 490, y: 136},
	{x: 492, y: 136},
	{x: 492, y: 136},
	{x: 492, y: 137},
	{x: 493, y: 137},
	{x: 493, y: 137},
	{x: 494, y: 137},
	{x: 494, y: 137},
	{x: 495, y: 138},
	{x: 496, y: 138},
	{x: 496, y: 138},
	{x: 497, y: 138},
	{x: 497, y: 139},
	{x: 498, y: 139},
	{x: 498, y: 139},
	{x: 499, y: 139},
	{x: 499, y: 139},
	{x: 500, y: 139},
	{x: 500, y: 140},
	{x: 501, y: 140},
	{x: 501, y: 140},
	{x: 502, y: 140},
	{x: 502, y: 141},
	{x: 503, y: 141},
	{x: 503, y: 141},
	{x: 504, y: 141},
	{x: 504, y: 142},
	{x: 506, y: 142},
	{x: 506, y: 142},
	{x: 507, y: 143},
	{x: 510, y: 143},
	{x: 511, y: 143},
	{x: 512, y: 143},
	{x: 512, y: 143},
	{x: 514, y: 143},
	{x: 514, y: 143},
	{x: 515, y: 143},
	{x: 515, y: 143},
	{x: 516, y: 143},
	{x: 516, y: 143},
	{x: 516, y: 144},
	{x: 517, y: 144},
	{x: 517, y: 144},
	{x: 517, y: 144},
	{x: 518, y: 145},
	{x: 518, y: 146},
	{x: 518, y: 147},
	{x: 518, y: 148},
	{x: 519, y: 150},
	{x: 520, y: 151},
	{x: 520, y: 152},
	{x: 521, y: 153},
	{x: 521, y: 155},
	{x: 522, y: 156},
	{x: 522, y: 156},
	{x: 523, y: 157},
	{x: 523, y: 158},
	{x: 524, y: 158},
	{x: 524, y: 159},
	{x: 524, y: 159},
	{x: 524, y: 160},
	{x: 524, y: 161},
	{x: 524, y: 162},
	{x: 524, y: 163},
	{x: 524, y: 163},
	{x: 524, y: 165},
	{x: 524, y: 165},
	{x: 524, y: 166},
	{x: 524, y: 167},
	{x: 524, y: 168},
	{x: 524, y: 169},
	{x: 524, y: 169},
	{x: 524, y: 170},
	{x: 524, y: 171},
	{x: 524, y: 171},
	{x: 524, y: 172},
	{x: 524, y: 172},
	{x: 524, y: 173},
	{x: 524, y: 173},
	{x: 524, y: 175},
	{x: 524, y: 175},
	{x: 524, y: 176},
	{x: 523, y: 177},
	{x: 523, y: 177},
	{x: 522, y: 178},
	{x: 521, y: 179},
	{x: 520, y: 179},
	{x: 519, y: 180},
	{x: 519, y: 181},
	{x: 518, y: 181},
	{x: 517, y: 182},
	{x: 516, y: 183},
	{x: 515, y: 184},
	{x: 515, y: 185},
	{x: 513, y: 185},
	{x: 512, y: 186},
	{x: 511, y: 187},
	{x: 510, y: 187},
	{x: 508, y: 188},
	{x: 507, y: 188},
	{x: 507, y: 189},
	{x: 505, y: 190},
	{x: 502, y: 190},
	{x: 498, y: 192},
	{x: 497, y: 192},
	{x: 494, y: 193},
	{x: 492, y: 194},
	{x: 490, y: 194},
	{x: 488, y: 194},
	{x: 486, y: 194},
	{x: 484, y: 194},
	{x: 482, y: 194},
	{x: 481, y: 194},
	{x: 481, y: 195},
	{x: 479, y: 195},
	{x: 479, y: 195},
	{x: 478, y: 195},
	{x: 478, y: 195},
	{x: 477, y: 195},
	{x: 476, y: 195},
	{x: 475, y: 195},
	{x: 474, y: 195},
	{x: 473, y: 196},
	{x: 472, y: 196},
	{x: 471, y: 196},
	{x: 469, y: 197},
	{x: 468, y: 197},
	{x: 468, y: 197},
	{x: 466, y: 197},
	{x: 465, y: 198},
	{x: 464, y: 198},
	{x: 462, y: 198},
	{x: 461, y: 199},
	{x: 460, y: 200},
	{x: 459, y: 201},
	{x: 458, y: 201},
	{x: 456, y: 202},
	{x: 455, y: 203},
	{x: 454, y: 204},
	{x: 453, y: 204},
	{x: 452, y: 205},
	{x: 451, y: 206},
	{x: 450, y: 206},
	{x: 449, y: 207},
	{x: 448, y: 208},
	{x: 446, y: 209},
	{x: 446, y: 209},
	{x: 445, y: 210},
	{x: 443, y: 210},
	{x: 442, y: 212},
	{x: 442, y: 212},
	{x: 440, y: 213},
	{x: 440, y: 213},
	{x: 439, y: 214},
	{x: 439, y: 214},
	{x: 438, y: 215},
	{x: 437, y: 215},
	{x: 437, y: 216},
	{x: 435, y: 217},
	{x: 434, y: 218},
	{x: 433, y: 219},
	{x: 432, y: 219},
	{x: 431, y: 221},
	{x: 429, y: 221},
	{x: 428, y: 222},
	{x: 427, y: 222},
	{x: 426, y: 224},
	{x: 424, y: 224},
	{x: 423, y: 225},
	{x: 422, y: 226},
	{x: 421, y: 226},
	{x: 420, y: 226},
	{x: 418, y: 227},
	{x: 417, y: 227},
	{x: 416, y: 228},
	{x: 415, y: 229},
	{x: 413, y: 229},
	{x: 412, y: 229},
	{x: 411, y: 230},
	{x: 410, y: 230},
	{x: 409, y: 231},
	{x: 407, y: 232},
	{x: 406, y: 232},
	{x: 405, y: 233},
	{x: 404, y: 233},
	{x: 403, y: 233},
	{x: 403, y: 234},
	{x: 401, y: 234},
	{x: 401, y: 234},
	{x: 400, y: 234},
	{x: 399, y: 235},
	{x: 397, y: 235},
	{x: 396, y: 235},
	{x: 395, y: 236},
	{x: 394, y: 236},
	{x: 392, y: 236},
	{x: 390, y: 237},
	{x: 388, y: 238},
	{x: 387, y: 238},
	{x: 385, y: 238},
	{x: 383, y: 239},
	{x: 381, y: 240},
	{x: 379, y: 240},
	{x: 377, y: 240},
	{x: 375, y: 241},
	{x: 373, y: 241},
	{x: 371, y: 241},
	{x: 369, y: 242},
	{x: 367, y: 242},
	{x: 365, y: 242},
	{x: 363, y: 243},
	{x: 362, y: 243},
	{x: 361, y: 243},
	{x: 360, y: 243},
	{x: 357, y: 243},
	{x: 356, y: 243},
	{x: 354, y: 243},
	{x: 352, y: 243},
	{x: 351, y: 243},
	{x: 349, y: 243},
	{x: 347, y: 244},
	{x: 346, y: 244},
	{x: 344, y: 244},
	{x: 343, y: 244},
	{x: 341, y: 244},
	{x: 339, y: 244},
	{x: 337, y: 244},
	{x: 336, y: 244},
	{x: 334, y: 243},
	{x: 330, y: 243},
	{x: 329, y: 243},
	{x: 327, y: 243},
	{x: 325, y: 243},
	{x: 323, y: 243},
	{x: 322, y: 243},
	{x: 321, y: 243},
	{x: 319, y: 243},
	{x: 317, y: 243},
	{x: 316, y: 243},
	{x: 315, y: 242},
	{x: 313, y: 242},
	{x: 312, y: 242},
	{x: 310, y: 242},
	{x: 309, y: 242},
	{x: 308, y: 241},
	{x: 307, y: 241},
	{x: 305, y: 241},
	{x: 304, y: 241},
	{x: 302, y: 241},
	{x: 301, y: 241},
	{x: 299, y: 241},
	{x: 297, y: 241},
	{x: 295, y: 241},
	{x: 294, y: 241},
	{x: 292, y: 241},
	{x: 290, y: 241},
	{x: 287, y: 241},
	{x: 286, y: 241},
	{x: 285, y: 241},
	{x: 283, y: 241},
	{x: 280, y: 241},
	{x: 279, y: 240},
	{x: 278, y: 240},
	{x: 276, y: 239},
	{x: 274, y: 239},
	{x: 273, y: 239},
	{x: 272, y: 239},
	{x: 271, y: 239},
	{x: 269, y: 239},
	{x: 267, y: 239},
	{x: 266, y: 239},
	{x: 265, y: 238},
	{x: 264, y: 237},
	{x: 262, y: 237},
	{x: 261, y: 237},
	{x: 260, y: 237},
	{x: 259, y: 236},
	{x: 258, y: 236},
	{x: 256, y: 236},
	{x: 255, y: 236},
	{x: 254, y: 236},
	{x: 253, y: 236},
	{x: 251, y: 236},
	{x: 250, y: 235},
	{x: 247, y: 235},
	{x: 246, y: 235},
	{x: 245, y: 235},
	{x: 243, y: 235},
	{x: 233, y: 235},
	{x: 230, y: 235},
	{x: 229, y: 235},
	{x: 227, y: 235},
	{x: 225, y: 236},
	{x: 223, y: 236},
	{x: 221, y: 237},
	{x: 218, y: 237},
	{x: 216, y: 238},
	{x: 215, y: 239},
	{x: 213, y: 239},
	{x: 211, y: 240},
	{x: 209, y: 241},
	{x: 207, y: 241},
	{x: 206, y: 242},
	{x: 205, y: 242},
	{x: 203, y: 243},
	{x: 202, y: 243},
	{x: 201, y: 244},
	{x: 200, y: 244},
	{x: 199, y: 245},
	{x: 197, y: 246},
	{x: 195, y: 246},
	{x: 194, y: 247},
	{x: 192, y: 248},
	{x: 191, y: 248},
	{x: 189, y: 249},
	{x: 188, y: 250},
	{x: 187, y: 250},
	{x: 186, y: 250},
	{x: 185, y: 251},
	{x: 184, y: 251},
	{x: 183, y: 252},
	{x: 182, y: 252},
	{x: 181, y: 253},
	{x: 180, y: 254},
	{x: 178, y: 254},
	{x: 177, y: 255},
	{x: 176, y: 255},
	{x: 175, y: 256},
	{x: 174, y: 257},
	{x: 172, y: 257},
	{x: 171, y: 258},
	{x: 170, y: 259},
	{x: 166, y: 260},
	{x: 165, y: 261},
	{x: 164, y: 262},
	{x: 162, y: 264},
	{x: 161, y: 265},
	{x: 158, y: 266},
	{x: 157, y: 267},
	{x: 155, y: 268},
	{x: 154, y: 268},
	{x: 153, y: 269},
	{x: 151, y: 269},
	{x: 150, y: 270},
	{x: 148, y: 271},
	{x: 147, y: 271},
	{x: 145, y: 271},
	{x: 144, y: 272},
	{x: 142, y: 273},
	{x: 141, y: 273},
	{x: 140, y: 273},
	{x: 138, y: 273},
	{x: 137, y: 274},
	{x: 136, y: 275},
	{x: 134, y: 275},
	{x: 132, y: 276},
	{x: 131, y: 276},
	{x: 130, y: 277},
	{x: 128, y: 278},
	{x: 127, y: 278},
	{x: 124, y: 279},
	{x: 123, y: 279},
	{x: 122, y: 279},
	{x: 121, y: 280},
	{x: 121, y: 280},
	{x: 119, y: 280},
	{x: 118, y: 280},
	{x: 117, y: 280},
	{x: 116, y: 280},
	{x: 115, y: 281},
	{x: 113, y: 281},
	{x: 112, y: 281},
	{x: 111, y: 281},
	{x: 110, y: 281},
	{x: 108, y: 281},
	{x: 107, y: 281},
	{x: 106, y: 281},
	{x: 105, y: 281},
	{x: 105, y: 281},
	{x: 104, y: 281},
	{x: 102, y: 281},
	{x: 102, y: 281},
	{x: 101, y: 281},
	{x: 101, y: 281},
	{x: 100, y: 282},
	{x: 100, y: 282},
	{x: 99, y: 282},
	{x: 97, y: 282},
	{x: 96, y: 282},
	{x: 96, y: 282},
	{x: 95, y: 283},
	{x: 93, y: 283},
	{x: 93, y: 283},
	{x: 92, y: 283},
	{x: 92, y: 283},
	{x: 91, y: 283},
	{x: 91, y: 283},
	{x: 90, y: 283},
	{x: 90, y: 283},
	{x: 89, y: 283},
	{x: 89, y: 283},
	{x: 88, y: 283},
	{x: 88, y: 283},
	{x: 87, y: 283},
	{x: 86, y: 283},
	{x: 86, y: 283},
	{x: 84, y: 283},
	{x: 84, y: 283},
	{x: 83, y: 283},
	{x: 82, y: 283},
	{x: 82, y: 284},
	{x: 80, y: 284},
	{x: 80, y: 284},
	{x: 79, y: 284},
	{x: 78, y: 284},
	{x: 78, y: 284},
	{x: 77, y: 284},
	{x: 77, y: 284},
	{x: 77, y: 284},
	{x: 76, y: 284},
	{x: 76, y: 284},
	{x: 75, y: 284},
	{x: 75, y: 284},
	{x: 73, y: 285},
	{x: 73, y: 285},
	{x: 72, y: 285},
	{x: 71, y: 285},
	{x: 71, y: 285},
	{x: 70, y: 286},
	{x: 70, y: 286},
	{x: 69, y: 286},
	{x: 69, y: 286},
	{x: 68, y: 286},
	{x: 68, y: 286},
	{x: 67, y: 286},
	{x: 67, y: 287},
	{x: 65, y: 287},
	{x: 65, y: 287},
	{x: 64, y: 288},
	{x: 63, y: 288},
	{x: 62, y: 289},
	{x: 61, y: 289},
	{x: 61, y: 289},
	{x: 60, y: 289},
	{x: 60, y: 289},
	{x: 59, y: 290},
	{x: 59, y: 290},
	{x: 58, y: 290},
	{x: 58, y: 290},
	{x: 57, y: 291},
	{x: 56, y: 291},
	{x: 56, y: 291},
	{x: 55, y: 291},
	{x: 55, y: 291},
	{x: 54, y: 292},
	{x: 54, y: 292},
	{x: 53, y: 292},
	{x: 53, y: 292},
	{x: 52, y: 293},
	{x: 51, y: 293},
	{x: 50, y: 293},
	{x: 50, y: 293},
	{x: 49, y: 293},
	{x: 49, y: 294},
	{x: 48, y: 294},
	{x: 47, y: 294},
	{x: 47, y: 294},
	{x: 46, y: 294},
	{x: 46, y: 294},
	{x: 45, y: 295},
	{x: 45, y: 295},
	{x: 45, y: 295},
	{x: 44, y: 295},
	{x: 44, y: 296},
	{x: 43, y: 296},
	{x: 43, y: 296},
	{x: 42, y: 296},
	{x: 42, y: 296},
	{x: 41, y: 297},
	{x: 41, y: 297},
	{x: 40, y: 297},
	{x: 39, y: 297},
	{x: 39, y: 297},
	{x: 38, y: 298},
	{x: 38, y: 298},
	{x: 37, y: 298},
	{x: 37, y: 298},
	{x: 36, y: 298},
	{x: 36, y: 298},
	{x: 36, y: 299},
	{x: 35, y: 299},
	{x: 35, y: 299},
	{x: 34, y: 299},
	{x: 34, y: 299},
	{x: 33, y: 299},
	{x: 33, y: 299},
	{x: 32, y: 300},
	{x: 32, y: 300},
	{x: 31, y: 300},
	{x: 31, y: 300},
	{x: 31, y: 300},
	{x: 30, y: 300},
	{x: 30, y: 300},
	{x: 29, y: 300},
	{x: 29, y: 300},
	{x: 29, y: 301},
	{x: 28, y: 301},
	{x: 28, y: 301},
	{x: 27, y: 301},
	{x: 27, y: 301},
	{x: 26, y: 301},
	{x: 26, y: 301},
	{x: 26, y: 301}
];