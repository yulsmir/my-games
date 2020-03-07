$(document).ready(function() {
	'use strict';

	paper.install(window);
	paper.setup(document.getElementById('mainCanvas'));
	console.log('main.js loaded');


	var tool = new Tool ();

	var c = Shape.Circle(200, 200, 80);
	c.fillColor = 'black';
	var text = new PointText(200, 200);
	text.justification = 'center';
	text.fillColor = 'white';
	text.fontSize = 20;
	text.content = 'hello world';

	tool.onMouseDown = function(event) {
		var c = Shape.Circle(event.point, 20);
		c.fillColor = 'blue';
};

    /*var c = Shape.Circle(200, 200, 100);
	c.fillColor = 'red';*/
	/*var c;


	var circle = new Shape.Circle(new Point(50, 50), 50);
	circle.fillColor = 'green';
	circle = 5;*/

/*
	for(var x=25; x<400; x+=50) {
		for(var y=25; y<400; y+=50) {
			c = new Shape.Circle(new Point(x, y), 50);
			c.fillCollor = 'green';
			console.log('Drawing circle');
		}
	}*/

});
