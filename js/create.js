
// ******************************************************** //
//            JS Function to determine if HTML 				//
// 	    - Returns true if string contains html tags			//
// ******************************************************** //
function isHTML(str) {
	var a = document.createElement('div');
	a.innerHTML = str;
	for (var c = a.childNodes, i = c.length; i--; ) {
		if (c[i].nodeType == 1) return true; 
	}
	return false;
}

// initialize mapping of words to frequency
var arr = [{k:"-", v:0}];

// ******************************************************** //
//        JS Function to be run upon 'Search' click			//
//   Returns a bubble cloud associated with word frequency	//
// ******************************************************** //
$('#searchButton').click(function() {
	// obtain text in input box
	var text = $('#website').val().trim();

	// remove HTML
	if(isHTML(text)) {
		text = $(text)[0].textContent;
	}

	// strip words or phrases that occur frequently
	text = text
			.toLowerCase()
			.replace(/[^a-zA-Z]/g, ' ')
			.replace(/\s+/g, ' ')
			.replace(/ s /g, ' ')
			.replace(/ a /g, ' ')
			.replace(/ the /g, ' ')
			.replace(/ i /g, ' ')
			.replace(/ to /g, ' ')
			.replace(/ can /g, ' ')
			.replace(/ that /g, ' ')
			.replace(/ s /g, ' ')
			.replace(/ nt /g, ' ') 
			.replace(/ ll /g, ' ')
			.replace(/ re /g, ' ')
			.replace(/ is /g, ' ')
			.replace(/ and /g, ' ')
			.replace(/ on /g, ' ')
			.replace(/ as /g, ' ')
			.replace(/ of /g, ' ')
			.replace(/ or /g, ' ')
			.replace(/ it /g, ' ')
			.replace(/ at /g, ' ')
			.replace(/ be /g, ' ')
			.replace(/ in /g, ' ')
			.replace(/ an /g, ' ')
			.replace(/ so /g, ' ')
			.replace(/ we /g, ' ')
			.replace(/ here /g, ' ')
			.replace(/ for /g, ' ')
			.replace(/ are /g, ' ')
			.replace(/ not /g, ' ')
			.replace(/ that /g, ' ')
			.replace(/ this /g, ' ')
			.replace(/ by /g, ' ')
			.replace(/ than /g, ' ')
			.replace(/ which /g, ' ')
			.replace(/ all /g, ' ')
			.replace(/ do /g, ' ')
			.replace(/ from /g, ' ')
			.replace(/ who /g, ' ')
			.replace(/ what /g, ' ')
			.replace(/ where /g, ' ')
			.trim();

	// perform mapping between word and its frequency
	var counts = text.replace(/[^\w\s]/g, "").split(/\s+/).reduce(function(map, word){
		map[word] = (map[word]||0)+1;
		return map;
	}, Object.create(null));

	console.log(text);
	console.log(counts);


	// clear contents if something exists
	$('.bubble').remove();

	// build the mapping based on the words detected
	$.each(counts, function(key, value) {
		if(value > 1) {
			arr.push({
				k: key,
				v: value
			});
		}
	});

	console.log(arr);

	// set height and width of the div that contains the bubble cloud
	var width = $(window).width(),
		height = $(window).width();

	// set initial settings for bubble
	var diameter = 960,
		format = d3.format(",d"),
		color = d3.scale.category20c();

	// d3 property to set the packing of circle objects
	var bubble = d3.layout.pack()
		.sort(null)
		.size([width, height])
		.padding(1.5);

	// initialize bubble d3 object
	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "bubble");

	

	// --------------------------------------------------//
	// create nodes based on word map
	var nodes = d3.range(arr.length).map(function(d) { 
			console.log(arr[d].v);
			return {radius: arr[d].v * 10}; 
		}),
		root = nodes[0],
		color = d3.scale.category20c();

	root.radius = 0;
	root.fixed = true;

	// create gravity effect on nodes centered on center of bubble div
	var force = d3.layout.force()
		.gravity(0.02)
		.charge(function(d, i) { return i ? 0 : -2000; })
		.nodes(nodes)
		.size([width, height]);

	force.start();
	// --------------------------------------------------//

	var radius = 1;
	var t = 1;

	// iterate through array of mapped words
	for (var cir = 1; cir < arr.length; cir++) {
		console.log("loop " + cir);
		var node = svg.selectAll(".node")
				// .data(bubble.nodes(classes(root))
				// .filter(function(d) { return !d.children; }))
				.data(nodes.slice(1))
			.enter().append("g")
				.attr("class", "node")
				.attr("transform", function() { return "translate(" + 0 + "," + 0 + ")"; });

		// node.append("title")
		// 	.text(function(d) { return d.className + ": " + format(d.value); });

		// create the circle whose radius is based on the word frequency
		node.append("circle")
			.attr("r", function(d) { 
				return arr[radius++].v * 10; 
			})
			.style("fill", function(d, i) { return color(i % 3); });


		// add text for each word centered on the same location as the bubble
		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.style("color", "white")
			.text(function(d) { 
				return arr[t++].k; 
			});

		radius++;
		t++;
	}


	// adjust force on circles on tick
	force.on("tick", function(e) {
		var q = d3.geom.quadtree(nodes),
			i = 0,
			n = nodes.length;

		while (++i < n) q.visit(collide(nodes[i]));

		svg.selectAll("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		svg.selectAll("text")
			.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; });
	});

	// adjust nodes on mouse move
	svg.on("mousemove", function() {
	  var p1 = d3.mouse(this);
	  root.px = p1[0];
	  root.py = p1[1];
	  force.resume();
	});


	d3.select(self.frameElement).style("height", diameter + "px");

	// math to shift bubbles based on gravity
	function collide(node) {
		var r = node.radius + 16,
				nx1 = node.x - r,
				nx2 = node.x + r,
				ny1 = node.y - r,
				ny2 = node.y + r;
		return function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
						y = node.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = node.radius + quad.point.radius;
				if (l < r) {
					l = (l - r) / l * .5;
					node.x -= x *= l;
					node.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		};
	}
});
