var vanillaPath = [
	{x: 23.68864742857142, y: 29.93092614285714},
	{x: 23.528588999999997, y: 29.93092614285714},
	{x: 23.368530571428565, y: 29.93092614285714},
	{x: 23.20847214285714, y: 29.93092614285714},
	{x: 23.048413714285708, y: 29.93092614285714},
	{x: 22.888355285714283, y: 29.93092614285714},
	{x: 22.72829685714285, y: 29.93092614285714},
	{x: 22.568238428571426, y: 29.93092614285714},
	{x: 22.408179999999994, y: 29.93092614285714},
	{x: 22.24812157142857, y: 29.93092614285714},
	{x: 22.08006022142857, y: 29.914920299999995},
	{x: 21.911998871428572, y: 29.89891445714285},
	{x: 21.7359346, y: 29.874905692857137},
	{x: 21.559870328571428, y: 29.850896928571423},
	{x: 21.383806057142856, y: 29.81888524285714},
	{x: 21.199738864285713, y: 29.786873557142854},
	{x: 21.01567167142857, y: 29.75486187142857},
	{x: 20.83160447857143, y: 29.714847264285712},
	{x: 20.647537285714286, y: 29.666829735714284},
	{x: 20.463470092857143, y: 29.618812207142856},
	{x: 20.27980304607143, y: 29.563592049285713},
	{x: 20.096536145357142, y: 29.501169262142856},
	{x: 19.922072458214284, y: 29.43194399178571},
	{x: 19.756411984642856, y: 29.355916238214284},
	{x: 19.599554724642857, y: 29.273486147499998},
	{x: 19.451900824285715, y: 29.184653719642856},
	{x: 19.31345028357143, y: 29.089418954642856},
	{x: 19.184203102500003, y: 28.988181998571427},
	{x: 19.064159281071433, y: 28.8813429975},
	{x: 18.95331881928572, y: 28.76890195142857},
	{x: 18.85166170983929, y: 28.651218991821427},
	{x: 18.759167945428576, y: 28.528654250142857},
	{x: 18.675397365375005, y: 28.40154785055357},
	{x: 18.599909809000003, y: 28.270239917214283},
	{x: 18.532265115625002, y: 28.13505056698214},
	{x: 18.47200311726786, y: 27.996299916714285},
	{x: 18.41866364594643, y: 27.854308083267856},
	{x: 18.371786533678574, y: 27.709375176196428},
	{x: 18.330911612482144, y: 27.56178129775},
	{x: 18.295578714375, y: 27.41180655017857},
	{x: 18.26532867174018, y: 27.259713029158927},
	{x: 18.23970331732589, y: 27.10574482379464},
	{x: 18.21826649191428, y: 26.950129016981247},
	{x: 18.200604044321423, y: 26.793075685406247},
	{x: 18.186323831397317, y: 26.634778899914284},
	{x: 18.175056718391065, y: 26.47541672550714},
	{x: 18.166456578950886, y: 26.315151221343747},
	{x: 18.1602002951241, y: 26.154129441105354},
	{x: 18.155987757357135, y: 25.984481511932138},
	{x: 18.153541864495526, y: 25.814329398708924},
	{x: 18.15260847376566, y: 25.64377904010812},
	{x: 18.152956350756508, y: 25.47292417034696},
	{x: 18.154376069017935, y: 25.301847169497897},
	{x: 18.156678909659007, y: 25.130619913799013},
	{x: 18.159695760946285, y: 24.959304575946156},
	{x: 18.163275967883873, y: 24.787954425385085},
	{x: 18.175289103222042, y: 24.60861170717504},
	{x: 18.18761505275155, y: 24.429317156548343},
	{x: 18.200151629169408, y: 24.250502080951737},
	{x: 18.220813421658917, y: 24.07219168958772},
	{x: 18.24152188368492, y: 23.89440589472517},
	{x: 18.270215873289953, y: 23.717159921922107},
	{x: 18.29883887698191, y: 23.540464877732926},
	{x: 18.32734673864182, y: 23.364328274900117},
	{x: 18.363706679165933, y: 23.188754517531383},
	{x: 18.407890530771738, y: 23.013745346262127},
	{x: 18.451473725610636, y: 22.839700389474803},
	{x: 18.50244354440163, y: 22.674620160218815},
	{x: 18.55278653437173, y: 22.510477763314086},
	{x: 18.610099356145927, y: 22.355250885977558},
	{x: 18.674379676247394, y: 22.208913298384157},
	{x: 18.745228218297182, y: 22.07143800943091},
	{x: 18.822648531590943, y: 21.942797472687122},
	{x: 18.90664637323028, y: 21.822963766084975},
	{x: 18.996829139271984, y: 21.703905825922693},
	{x: 19.09280563416197, y: 21.593598344323873},
	{x: 19.19460589073858, y: 21.49199311056442},
	{x: 19.301860577804213, y: 21.39063896683919},
	{x: 19.414601036799912, y: 21.2974919429592},
	{x: 19.532478776135473, y: 21.212106262946037},
	{x: 19.65514542089453, y: 21.134037462312545},
	{x: 19.78227255997967, y: 21.062842426126714},
	{x: 19.913531604828695, y: 21.006082338206642},
	{x: 20.04859367902432, y: 20.95531393561668},
	{x: 20.187149536346435, y: 20.91049843003483},
	{x: 20.328909490352622, y: 20.871198298532924},
	{x: 20.47358235295855, y: 20.83697842871899},
	{x: 20.620895402639768, y: 20.807826266091315},
	{x: 20.770574350799773, y: 20.791334376086212},
	{x: 20.92236233342157, y: 20.779111770081766},
	{x: 21.076019905233988, y: 20.770792604108994},
	{x: 21.23132404152072, y: 20.766033189945517},
	{x: 21.388068146993568, y: 20.76411178017804},
	{x: 21.546062070185208, y: 20.764728790540065},
	{x: 21.713134043367887, y: 20.76758657618118},
	{x: 21.881120940278826, y: 20.780412289825964},
	{x: 22.04987711548804, y: 20.802951918390015},
	{x: 22.219270559641767, y: 20.826949155085448},
	{x: 22.389182977816063, y: 20.85177098628114},
	{x: 22.55950891828784, y: 20.87720394777705},
	{x: 22.73015490159757, y: 20.903052867571603},
	{x: 22.901038599521534, y: 20.929139758074328},
	{x: 23.07208801360043, y: 20.955322719065425},
	{x: 23.24324065294831, y: 20.98147482953842},
	{x: 23.41404261506563, y: 21.00748405072936},
	{x: 23.584448153765972, y: 21.03285198623806},
	{x: 23.754418805134428, y: 21.05709294031856},
	{x: 23.92392270572377, y: 21.08013403256429},
	{x: 24.092933906832965, y: 21.10193403325023},
	{x: 24.261431732347145, y: 21.12246238586138},
	{x: 24.429400180124407, y: 21.1416982924828},
	{x: 24.596827364434045, y: 21.159629854579084},
	{x: 24.76370499946831, y: 21.176252268625813},
	{x: 24.930027923963753, y: 21.191567077148893},
	{x: 25.0958136717819, y: 21.205581424612426},
	{x: 25.261082064093603, y: 21.21832737530052},
	{x: 25.42585484526545, y: 21.229861278284595},
	{x: 25.590155352836405, y: 21.24024312665638},
	{x: 25.75400822178047, y: 21.24953497499387},
	{x: 25.917439120877397, y: 21.257800405700802},
	{x: 26.080474519014032, y: 21.26510404107666},
	{x: 26.243141479363757, y: 21.271511098347705},
	{x: 26.405467479390342, y: 21.277087034916416},
	{x: 26.567480254620726, y: 21.28189723105897},
	{x: 26.729206663888775, y: 21.28600670982835},
	{x: 26.89067257496981, y: 21.28947889106332},
	{x: 27.05190276842082, y: 21.29237437714909},
	{x: 27.21292085792186, y: 21.29475077081627},
	{x: 27.373749225404264, y: 21.296662572066577},
	{x: 27.534408969360396, y: 21.298161101781538},
	{x: 27.694919864838266, y: 21.299294449727704},
	{x: 27.85530033372722, y: 21.30010744481032},
	{x: 28.015567424043418, y: 21.3006416430645},
	{x: 28.18373971845524, y: 21.30093533151155},
	{x: 28.35182861383223, y: 21.301023546020133},
	{x: 28.519847135083737, y: 21.300938151466966},
	{x: 28.687807068091267, y: 21.30070798260951},
	{x: 28.855719018052316, y: 21.300358994068695},
	{x: 29.023592471067815, y: 21.299914415465366},
	{x: 29.199438779742653, y: 21.29939491037629},
	{x: 29.38326538650074, y: 21.298818737889903},
	{x: 29.56707589124295, y: 21.298201915649386},
	{x: 29.750875962897922, y: 21.29755838349616},
	{x: 29.934270341260873, y: 21.296900166920583},
	{x: 30.11726319628355, y: 21.296237539619575},
	{x: 30.29985804667222, y: 21.295579182046225},
	{x: 30.482057821839085, y: 21.29493233291575},
	{x: 30.66386492093647, y: 21.294302933212315},
	{x: 30.84528126881165, y: 21.293695762439047},
	{x: 31.02590822268166, y: 21.29311456692023},
	{x: 31.20534676764234, y: 21.292562180025737},
	{x: 31.383597708794476, y: 21.292040634243268},
	{x: 31.560661567792437, y: 21.29155126506846},
	{x: 31.744561550729394, y: 21.29109480672243},
	{x: 31.927314812343788, y: 21.29067147974145},
	{x: 32.10894125286732, y: 21.29028107063914},
	{x: 32.28946062606108, y: 21.28992300399335},
	{x: 32.46889256572854, y: 21.289596407332734},
	{x: 32.64725660943081, y: 21.289300169210783},
	{x: 32.824592226868155, y: 21.289032990864772},
	{x: 33.000958838486035, y: 21.288793431863485},
	{x: 33.18441874590346, y: 21.288579950151323},
	{x: 33.37503130322812, y: 21.2883909368979},
	{x: 33.56445178283451, y: 21.28822474656178},
	{x: 33.76074044221732, y: 21.288079722574707},
	{x: 33.9639536224311, y: 21.28795421904275},
	{x: 34.17414667684233, y: 21.287846618843083},
	{x: 34.39137397712733, y: 21.28775534847645},
	{x: 34.60768599665579, y: 21.287678890015908},
	{x: 34.831137078169526, y: 21.287615790472667},
	{x: 35.05377275053094, y: 21.287564668879494},
	{x: 35.291244191807195, y: 21.28752422137193},
	{x: 35.53519084807436, y: 21.287493224527033},
	{x: 35.77766940178977, y: 21.287470537198942},
	{x: 36.02633936539319, y: 21.287455101070208},
	{x: 36.272851591414494, y: 21.28744594011807},
	{x: 36.52486000757238, y: 21.287442159175914},
	{x: 36.782012901573154, y: 21.28744294175209},
	{x: 37.03635311602608, y: 21.287447547251293},
	{x: 37.28752369783189, y: 21.28745530772766},
	{x: 37.54356833887677, y: 21.287465624283687},
	{x: 37.803745250714975, y: 21.28747796321509},
	{x: 38.06773067259697, y: 21.287491851988737},
	{x: 38.33559800965034, y: 21.28750687512879},
	{x: 38.59903476995211, y: 21.28752267007528},
	{x: 38.86615176180996, y: 21.287538923069377},
	{x: 39.128671254288484, y: 21.28755536511058},
	{x: 39.394338944924115, y: 21.28757176802298},
	{x: 39.65529254626567, y: 21.287587940660412},
	{x: 39.9116905399455, y: 21.287603725274028},
	{x: 40.16328922300166, y: 21.287618994059844},
	{x: 40.409881981894486, y: 21.28763364589909},
	{x: 40.65127839112178, y: 21.28764760329965},
	{x: 40.88728435492497, y: 21.287660809543212},
	{x: 41.118121402141654, y: 21.28767322603945},
	{x: 41.343605521194014, y: 21.28768482988598},
	{x: 41.57196950847959, y: 21.28769561163045},
	{x: 41.795053032661954, y: 21.287705573229303},
	{x: 42.013091798205814, y: 21.28771472619628},
	{x: 42.22631358549425, y: 21.28772308993258},
	{x: 42.43495836005845, y: 21.287730690229587},
	{x: 42.63927641810658, y: 21.287737557934634},
	{x: 42.84753049855049, y: 21.28774372776965},
	{x: 43.051987202232816, y: 21.28774923729249},
	{x: 43.252904974982876, y: 21.287754125990517},
	{x: 43.45055146320889, y: 21.28775843449622},
	{x: 43.66078851635634, y: 21.287762203914696},
	{x: 43.867874314723245, y: 21.28776547525323},
	{x: 44.07206109624153, y: 21.28776828894342},
	{x: 44.27358970982396, y: 21.28777068444679},
	{x: 44.47268900610675, y: 21.28777269993531},
	{x: 44.669575320915705, y: 21.287774372038577},
	{x: 44.86405185313104, y: 21.287775735650094},
	{x: 45.056308471590825, y: 21.287776823785467},
	{x: 45.24652212284168, y: 21.28777766748594},
	{x: 45.43485637110981, y: 21.28777829576113},
	{x: 45.628684609577704, y: 21.287778735565393},
	{x: 45.8281644009844, y: 21.28777901180273},
	{x: 46.02543777474375, y: 21.279776225926987},
	{x: 46.22864056068112, y: 21.271773320276075},
	{x: 46.469905910375786, y: 21.26377031385074},
	{x: 46.70932986575857, y: 21.25576722382024},
	{x: 46.94703291595916, y: 21.247764065609164},
	{x: 47.18312605666534, y: 21.23976085299132},
	{x: 47.41771143623754, y: 21.23175759818845},
	{x: 47.65088302482491, y: 21.223754311971824},
	{x: 47.882366122917446, y: 21.215751003764982},
	{x: 48.11187815286823, y: 21.207747681746273},
	{x: 48.33952943555961, y: 21.200144499021352},
	{x: 48.5650235003827, y: 21.192941461578975},
	{x: 48.786457219149625, y: 21.186138574457868},
	{x: 49.003922661575984, y: 21.179735841838284},
	{x: 49.21750587292088, y: 21.173733267129254},
	{x: 49.42728734865904, y: 21.168130853051117},
	{x: 49.63334247684716, y: 21.162928601713123},
	{x: 49.835741947034485, y: 21.15812651468596},
	{x: 50.03457018374576, y: 21.15372459306914},
	{x: 50.22992574038806, y: 21.149722837553256},
	{x: 50.421901654324365, y: 21.146101241173618},
	{x: 50.61060578644809, y: 21.1428397966661},
	{x: 50.79624115406204, y: 21.139918496514635},
	{x: 50.97900617098324, y: 21.13731733299415},
	{x: 51.15909494876577, y: 21.135016298209116},
	{x: 51.33669757418996, y: 21.132995384127987},
	{x: 51.512000364633316, y: 21.13123458261376},
	{x: 51.68518610299588, y: 21.12971388545089},
	{x: 51.85643335095145, y: 21.12841328436886},
	{x: 52.02591574250347, y: 21.127312771062627},
	{x: 52.193802259787255, y: 21.126393337575376},
	{x: 52.36025649189342, y: 21.1256369763135},
	{x: 52.52543187704747, y: 21.125026680059197},
	{x: 52.689471932784016, y: 21.124546441980918},
	{x: 52.844507549631444, y: 21.132184177070464},
	{x: 52.99866595663623, y: 21.139922957864066},
	{x: 53.14405922411885, y: 21.155752700161948},
	{x: 53.28879612611191, y: 21.171658477317976},
	{x: 53.43297358713577, y: 21.195632205956677},
	{x: 53.56867692858202, y: 21.22766388168926},
	{x: 53.703988865592656, y: 21.259741529096207},
	{x: 53.83097809099799, y: 21.299859915994816},
	{x: 53.94970854714561, y: 21.348011739134712},
	{x: 54.06023700050641, y: 21.404190495607097},
	{x: 54.17101659445341, y: 21.467990286753572},
	{x: 54.27408826805017, y: 21.53940606028894},
	{x: 54.3698902782728, y: 21.618033268137985},
	{x: 54.45845544339577, y: 21.7038681085578},
	{x: 54.53981173546755, y: 21.79650718397425},
	{x: 54.614382860467025, y: 21.895547597032643},
	{x: 54.68218838861596, y: 22.00098704914926},
	{x: 54.74364445549463, y: 22.11242350334952},
	{x: 54.79916399956592, y: 22.229455287821352},
	{x: 54.8411541995406, y: 22.34367813446957},
	{x: 54.869602498389355, y: 22.462713912989035},
	{x: 54.89289721355827, y: 22.5861818242603},
	{x: 54.90339890678749, y: 22.705718375139117},
	{x: 54.909472341760555, y: 22.82896610542551},
	{x: 54.903475040701466, y: 22.947581881941083},
	{x: 54.8937491833924, y: 23.069248559232307},
	{x: 54.872630128247316, y: 23.1856432639177},
	{x: 54.84043534832973, y: 23.304469067321655},
	{x: 54.79746166978, y: 23.417443281502017},
	{x: 54.75238848123154, y: 23.53270927477854},
	{x: 54.689887034883505, y: 23.642023479129087},
	{x: 54.62622085277702, y: 23.753167209344642},
	{x: 54.5540266645805, y: 23.85833411201626},
	{x: 54.473525883206754, y: 23.957338628173556},
	{x: 54.38532204545739, y: 24.050412355505074},
	{x: 54.281598657716344, y: 24.145405670400603},
	{x: 54.17092830130398, y: 24.242582171490433},
	{x: 54.04586184103035, y: 24.333817382410064},
	{x: 53.90693822182706, y: 24.427406804049248},
	{x: 53.762265340622626, y: 24.515232926024606},
	{x: 53.61271461030702, y: 24.59759333778244},
	{x: 53.458344267668174, y: 24.674396563029493},
	{x: 53.29157779158201, y: 24.745941443142964},
	{x: 53.12883635456453, y: 24.82053901887714},
	{x: 52.96250218800594, y: 24.890482908244746},
	{x: 52.79335126940584, y: 24.955677131867574},
	{x: 52.61372802576921, y: 25.01601253043591},
	{x: 52.432355183717696, y: 25.071786168458264},
	{x: 52.2419226797692, y: 25.12288033539866},
	{x: 52.050720898452354, y: 25.169583196240286},
	{x: 51.86699665365129, y: 25.22017095792259},
	{x: 51.6829880045536, y: 25.274921479771116},
	{x: 51.49131183640307, y: 25.32609475761397},
	{x: 51.29976981867485, y: 25.37353815667011},
	{x: 51.10854158784598, y: 25.425487282686447},
	{x: 50.917767981518544, y: 25.47417669752164},
	{x: 50.73597553737294, y: 25.527852263856985},
	{x: 50.555248813901336, y: 25.586742069719786},
	{x: 50.37604079419859, y: 25.651080088664138},
	{x: 50.19838994213311, y: 25.72108588599498},
	{x: 50.02992530230769, y: 25.79656521667028},
	{x: 49.86265817350858, y: 25.869307021253153},
	{x: 49.704974853116994, y: 25.947493083372454},
	{x: 49.54886571218325, y: 26.03130989696752},
	{x: 49.39431506136238, y: 26.120532175690343},
	{x: 49.24930309085788, y: 26.215322905099974},
	{x: 49.10537782113209, y: 26.31543277762141},
	{x: 48.970488887579876, y: 26.420601081278278},
	{x: 48.83655743358423, y: 26.52255248398793},
	{x: 48.70350560076329, y: 26.629006518259608},
	{x: 48.57887699993362, y: 26.747692428854666},
	{x: 48.454608834115334, y: 26.86274124922058},
	{x: 48.33822483431663, y: 26.9818836879091},
	{x: 48.229646291564606, y: 27.10483820734644},
	{x: 48.12879528135363, y: 27.231334534276208},
	{x: 48.03519486966788, y: 27.361094246164065},
	{x: 47.94879072146842, y: 27.493851385854423},
	{x: 47.861128098517995, y: 27.629353031790508},
	{x: 47.78016204826736, y: 27.767760029019684},
	{x: 47.69784566822919, y: 27.900844324535274},
	{x: 47.62176071823251, y: 28.035997245949684},
	{x: 47.54388625509817, y: 28.17340064777437},
	{x: 47.471830991953766, y: 28.312849849093197},
	{x: 47.39720173451839, y: 28.446151324440162},
	{x: 47.327615027593566, y: 28.58113090486921},
	{x: 47.25470541982446, y: 28.709622499703862},
	{x: 47.178113098036754, y: 28.83947915898257},
	{x: 47.097900985967996, y: 28.962560735964473},
	{x: 47.0137342549832, y: 29.08672488451349},
	{x: 46.92568042157174, y: 29.204234818286725},
	{x: 46.83342791423154, y: 29.31498710598924},
	{x: 46.73706620861949, y: 29.41886922360052},
	{x: 46.63630434473608, y: 29.51577888114586},
	{x: 46.531271022295876, y: 29.60602346492385},
	{x: 46.41371119234477, y: 29.68951906968039},
	{x: 46.291793921353545, y: 29.766590094695196},
	{x: 46.16570334502313, y: 29.837168286746067},
	{x: 46.03562045286759, y: 29.901592399947845},
	{x: 45.90174297583272, y: 29.95980830572217},
	{x: 45.756262347611276, y: 30.012148714807832},
	{x: 45.60739142332827, y: 30.05895150950837},
	{x: 45.45533566289729, y: 30.100560198328342},
	{x: 45.29231215280334, y: 30.137323404271047},
	{x: 45.126537387402834, y: 30.169574381024855},
	{x: 44.958637692071306, y: 30.197650577540834},
	{x: 44.78883093886077, y: 30.221873222806074},
	{x: 44.617325793038184, y: 30.24256695846877},
	{x: 44.4443218703948, y: 30.260039488471378},
	{x: 44.270008900174595, y: 30.274601223185268},
	{x: 44.09496703993689, y: 30.286545937444878},
	{x: 43.91936580448476, y: 30.296150511969458},
	{x: 43.74336443562561, y: 30.30367465205304},
	{x: 43.559508399414014, y: 30.30936063183949},
	{x: 43.3679352586153, y: 30.313434062788247},
	{x: 43.176754181154585, y: 30.316103683911205},
	{x: 42.98606051992583, y: 30.317562172770902},
	{x: 42.77993335170249, y: 30.317985974847463},
	{x: 42.574453458182745, y: 30.317536150423894},
	{x: 42.369686291745445, y: 30.31635823926463},
	{x: 42.165668296891454, y: 30.314583092392386},
	{x: 41.962427442381504, y: 30.312327716793913},
	{x: 41.759983734885935, y: 30.30969613419126},
	{x: 41.558729907772374, y: 30.306780252599285},
	{x: 41.35905181627018, y: 30.303660699459872},
	{x: 41.16092985721245, y: 30.300407665264313},
	{x: 40.96433965978759, y: 30.297081706625768},
	{x: 40.76204997791675, y: 30.293734557883393},
	{x: 40.56203136929333, y: 30.2904099003622},
	{x: 40.35624527613463, y: 30.28714413839897},
	{x: 40.14465423986149, y: 30.28396713377935},
	{x: 39.9272194034567, y: 30.280902897939654},
	{x: 39.70390090956954, y: 30.27797024123009},
	{x: 39.47463926418092, y: 30.275183378600126},
	{x: 39.24735860193884, y: 30.27255249362713},
	{x: 39.02198111622108, y: 30.270084260363916},
	{x: 38.79843021894598, y: 30.267782325032627},
	{x: 38.568987962907286, y: 30.265647747138456},
	{x: 38.33354079444262, y: 30.263679402120346},
	{x: 38.10038000920731, y: 30.261874345200397},
	{x: 37.86979585435709, y: 30.26022813851143},
	{x: 37.64208051989854, y: 30.258735143614448},
	{x: 37.41752818870578, y: 30.257388781552944},
	{x: 37.18843309692531, y: 30.256181762622937},
	{x: 36.96269911682837, y: 30.25510628794158},
	{x: 36.73222816816017, y: 30.254154224923383},
	{x: 36.496928921498586, y: 30.25331725867175},
	{x: 36.265098866210366, y: 30.252587021314827},
	{x: 36.029035326488234, y: 30.25195520120881},
	{x: 35.79662690459929, y: 30.25141363394879},
	{x: 35.567744769024294, y: 30.25095437702322},
	{x: 35.33424255731508, y: 30.250569769842496},
	{x: 35.10396504073693, y: 30.25025248076485},
	{x: 34.86913643589067, y: 30.2499955426337},
	{x: 34.637591608620674, y: 30.249792378236624},
	{x: 34.409567407355524, y: 30.249636816990453},
	{x: 34.18530524699488, y: 30.249523104056866},
	{x: 33.956628746541504, y: 30.249445902991123},
	{x: 33.731752501645666, y: 30.249400292930684},
	{x: 33.5104937564157, y: 30.249381761233245},
	{x: 33.28467327510734, y: 30.249386192382083},
	{x: 33.06252498295587, y: 30.249409853889958},
	{x: 32.84388764520474, y: 30.249449379851715},
	{x: 32.628988816267345, y: 30.24950175272003},
	{x: 32.417664307264886, y: 30.249564283808198},
	{x: 32.201735165468534, y: 30.249634592958675},
	{x: 31.989016210261646, y: 30.249710587755832},
	{x: 31.779728158648854, y: 30.249790442606276},
	{x: 31.573680997852286, y: 30.249872577959742},
	{x: 31.370693852888643, y: 30.24995563989808},
	{x: 31.170994810561847, y: 30.250038480278974},
	{x: 30.96639733998548, y: 30.250120137584474},
	{x: 30.7647288148681, y: 30.250199818591888},
	{x: 30.557799388340445, y: 30.250276880955887},
	{x: 30.345430344405774, y: 30.250350816765476},
	{x: 30.135854836132346, y: 30.250421237117543},
	{x: 29.928912354190693, y: 30.250487857729752},
	{x: 29.72443135340111, y: 30.250550485599437},
	{x: 29.52224978922278, y: 30.25060900670145},
	{x: 29.322214660864063, y: 30.250663374706544},
	{x: 29.124161563193113, y: 30.250713600692595},
	{x: 28.92833541762241, y: 30.250759743813372},
	{x: 28.734589776879005, y: 30.25080190288378},
	{x: 28.543187686033413, y: 30.250840208835985},
	{x: 28.35440112595598, y: 30.250874817997712},
	{x: 28.16809041986365, y: 30.250905906141835},
	{x: 27.984123916439827, y: 30.250933663255346},
	{x: 27.802378541626915, y: 30.250958288975372},
	{x: 27.614736402165775, y: 30.2509799886403},
	{x: 27.429093097694, y: 30.250998969904973},
	{x: 27.23734660524863, y: 30.251015439870343},
	{x: 27.03938557722465, y: 30.243026681251102},
	{x: 26.84310890980927, y: 30.23503581467834},
	{x: 26.6483994255076, y: 30.22704303280797},
	{x: 26.455126347781228, y: 30.21904852047951},
	{x: 26.263165883930903, y: 30.203049532315276},
	{x: 26.072400823823198, y: 30.187049156295366},
	{x: 25.882720111027567, y: 30.163044627560883},
	{x: 25.609348571428566, y: 30.251042999999996},
	{x: 25.28923171428571, y: 30.251042999999996},
	{x: 24.969114857142852, y: 30.090984571428567},
	{x: 24.809056428571424, y: 30.090984571428567},
	{x: 24.648997999999995, y: 30.090984571428567},
	{x: 24.488939571428567, y: 30.090984571428567},
	{x: 24.32888114285714, y: 29.93092614285714},
	{x: 24.16882271428571, y: 29.93092614285714},
	{x: 24.00876428571428, y: 29.77086771428571},
	{x: 24.00876428571428, y: 29.77086771428571}
];

var simPath = [
	{x: 9.00, y: 5.00},
	{x: 8.99, y: 4.75},
	{x: 8.97, y: 4.50},
	{x: 8.93, y: 4.25},
	{x: 8.87, y: 4.01},
	{x: 8.80, y: 3.76},
	{x: 8.72, y: 3.53},
	{x: 8.62, y: 3.30},
	{x: 8.51, y: 3.07},
	{x: 8.38, y: 2.86},
	{x: 8.24, y: 2.65},
	{x: 8.08, y: 2.45},
	{x: 7.92, y: 2.26},
	{x: 7.74, y: 2.08},
	{x: 7.55, y: 1.92},
	{x: 7.35, y: 1.76},
	{x: 7.14, y: 1.62},
	{x: 6.93, y: 1.49},
	{x: 6.70, y: 1.38},
	{x: 6.47, y: 1.28},
	{x: 6.24, y: 1.20},
	{x: 5.99, y: 1.13},
	{x: 5.75, y: 1.07},
	{x: 5.50, y: 1.03},
	{x: 5.25, y: 1.01},
	{x: 5.00, y: 1.00},
	{x: 4.75, y: 1.01},
	{x: 4.50, y: 1.03},
	{x: 4.25, y: 1.07},
	{x: 4.01, y: 1.13},
	{x: 3.76, y: 1.20},
	{x: 3.53, y: 1.28},
	{x: 3.30, y: 1.38},
	{x: 3.07, y: 1.49},
	{x: 2.86, y: 1.62},
	{x: 2.65, y: 1.76},
	{x: 2.45, y: 1.92},
	{x: 2.26, y: 2.08},
	{x: 2.08, y: 2.26},
	{x: 1.92, y: 2.45},
	{x: 1.76, y: 2.65},
	{x: 1.62, y: 2.86},
	{x: 1.49, y: 3.07},
	{x: 1.38, y: 3.30},
	{x: 1.28, y: 3.53},
	{x: 1.20, y: 3.76},
	{x: 1.13, y: 4.01},
	{x: 1.07, y: 4.25},
	{x: 1.03, y: 4.50},
	{x: 1.01, y: 4.75},
	{x: 1.00, y: 5.00},
	{x: 1.01, y: 5.25},
	{x: 1.03, y: 5.50},
	{x: 1.07, y: 5.75},
	{x: 1.13, y: 5.99},
	{x: 1.20, y: 6.24},
	{x: 1.28, y: 6.47},
	{x: 1.38, y: 6.70},
	{x: 1.49, y: 6.93},
	{x: 1.62, y: 7.14},
	{x: 1.76, y: 7.35},
	{x: 1.92, y: 7.55},
	{x: 2.08, y: 7.74},
	{x: 2.26, y: 7.92},
	{x: 2.45, y: 8.08},
	{x: 2.65, y: 8.24},
	{x: 2.86, y: 8.38},
	{x: 3.07, y: 8.51},
	{x: 3.30, y: 8.62},
	{x: 3.53, y: 8.72},
	{x: 3.76, y: 8.80},
	{x: 4.01, y: 8.87},
	{x: 4.25, y: 8.93},
	{x: 4.50, y: 8.97},
	{x: 4.75, y: 8.99},
	{x: 5.00, y: 9.00},
	{x: 5.25, y: 8.99},
	{x: 5.50, y: 8.97},
	{x: 5.75, y: 8.93},
	{x: 5.99, y: 8.87},
	{x: 6.24, y: 8.80},
	{x: 6.47, y: 8.72},
	{x: 6.70, y: 8.62},
	{x: 6.93, y: 8.51},
	{x: 7.14, y: 8.38},
	{x: 7.35, y: 8.24},
	{x: 7.55, y: 8.08},
	{x: 7.74, y: 7.92},
	{x: 7.92, y: 7.74},
	{x: 8.08, y: 7.55},
	{x: 8.24, y: 7.35},
	{x: 8.38, y: 7.14},
	{x: 8.51, y: 6.93},
	{x: 8.62, y: 6.70},
	{x: 8.72, y: 6.47},
	{x: 8.80, y: 6.24},
	{x: 8.87, y: 5.99},
	{x: 8.93, y: 5.75},
	{x: 8.97, y: 5.50},
	{x: 8.99, y: 5.25}
];

straightPath = [
	{x: 5, y: 5},
	{x: Number.MAX_SAFE_INTEGER, y: 5}
];
