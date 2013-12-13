function init()
{
	var length = localStorage.getItem( "length" );
	var height = localStorage.getItem( "height" );
	var width = localStorage.getItem( "width" );
	var depth = localStorage.getItem( "depth" );
	if( length > 0 )
		document.getElementById("tankinfo").length.value = length;
	if( height > 0 )
		document.getElementById("tankinfo").height.value = height;
	if( width > 0 )
		document.getElementById("tankinfo").width.value = width;
	if( depth > 0 )
		document.getElementById("tankinfo").depth.value = depth;
	draw();
}
function draw() 
{
	var conversion = 231;
	var minimum = 0.1;
	var maximum = 60;
	var units = "gallons";
	
	var length = document.getElementById("tankinfo").length.value;
	if( length < minimum ) length = minimum;
	else if ( length > maximum ) length = maximum;
	var height = document.getElementById("tankinfo").height.value;
	var width = document.getElementById("tankinfo").width.value;
	
	if( height < minimum ) height = minimum;
	else if ( height > maximum ) height = maximum;
	if( width < minimum ) width = minimum;
	else if ( width > maximum ) width = maximum;
	if( depth < minimum ) depth = minimum;
	else if ( depth > height ) width = height;
	
	var diameter = width;
	var rectangleheight = height - width;
	
	var radius = diameter / 2;
	var depth = document.getElementById("tankinfo").depth.value;

	if( depth < radius) {
		var depthforrectagle = 0;
		var depthforcircle = radius - depth;
	} else if ( depth < ( radius + rectangleheight ) ) {
		var depthforrectagle = depth - radius;
		var depthforcircle = 0;
	} else {
		var depthforrectagle = rectangleheight;
		var depthforcircle = depth - rectangleheight - radius;
	}
	
	var angle = 2 * Math.acos(depthforcircle / radius);
	var segmentarea = Math.pow(radius,2) / 2 * ( angle - Math.sin(angle) );
	var segmentvolume = segmentarea * length / conversion;
	var rectaglevolume = depthforrectagle * width * length / conversion;
	
	var rectaglecapacity = Math.round( rectangleheight * width * length / conversion * 10 ) / 10;
	var circlecapacity = Math.round( Math.PI * Math.pow( radius, 2) * length / conversion * 10 ) / 10;
	var tankcapacity = rectaglecapacity + circlecapacity;
	
	if( depth < radius) {
		var tankcontains = Math.round( segmentvolume * 10 ) / 10;
	} else if ( depth < ( radius + rectangleheight ) ) {
		var tankcontains =  Math.round( ( segmentvolume + rectaglevolume ) * 10) / 10;
	} else {
		var tankcontains = Math.round( ( tankcapacity - segmentvolume ) * 10) / 10;
	}
		
	localStorage.setItem( "length", length );
	localStorage.setItem( "height", height );
	localStorage.setItem( "width", width );
	localStorage.setItem( "depth", depth );
	 
	
	var canvas = document.getElementById('tank');
	var context = canvas.getContext('2d');

	// color entire canvas black
	context.beginPath();
	context.rect(0, 0, 320, 320);
	context.fillStyle = "black";
	context.fill();
	
	// draw white semicircle to represent bottom of tank
	context.beginPath();
	context.arc(160, 160 + rectangleheight * 2, radius * 4, Math.PI, 0, true);
	context.fillStyle = "white";
	context.fill();
	
	// draw white semicircle to represent top of tank
	context.beginPath();
	context.arc(160, 160 - rectangleheight * 2, radius * 4, 0, Math.PI, true);
	context.fillStyle = "white";
	context.fill();
	
	// draw white rectagle to represent midsection of tank
	if ( rectangleheight > 0 ) {
	context.beginPath();
	context.rect(160 - diameter * 2, 160 - rectangleheight * 2, diameter * 4, rectangleheight * 4 );
	context.fillStyle = "white";
	context.fill(); }
	
	// drawblack rectangle "filling" tank up to proper level
	context.beginPath();
	//var ycoord = 300 * ( ( diameter - depth ) / diameter ) + 10 ;
	var ycoord =  ( ( 160 + rectangleheight * 2 ) + radius * 4 ) - ( depth * 4 );
	context.rect(160 - diameter * 2, ycoord, diameter * 4, depth * 4);
	context.fillStyle = "black";
	context.fill();
	
	// outline white semicircle to represent bottom of tank
	context.beginPath();
	context.arc(160, 160 + rectangleheight * 2, radius * 4, Math.PI, 0, true);
	context.strokeStyle = "white";
	context.stroke();

	// outline left and right sides of white rectangle to represent midsection of tank
	if ( rectangleheight > 0 )
	{
		context.beginPath();
		context.rect(160 - diameter * 2, 160 - rectangleheight * 2, 1, rectangleheight * 4 );
		context.fillStyle = "white";
		context.fill(); 
		context.beginPath();
		context.rect(159 + diameter * 2,  160 - rectangleheight * 2, 1, rectangleheight * 4 );
		context.fillStyle = "white";
		context.fill(); 
	}
	
	// outline white semicircle to represent top of tank
	context.beginPath();
	context.arc(160, 160 - rectangleheight * 2, radius * 4, 0, Math.PI, true);
	context.strokeStyle = "white";
	context.stroke();
	
	// write the capacity and remaining text
	context.beginPath();
	context.font = "10pt Arial";
	context.fillStyle = "gray";
	context.textBaseline = "top";
	if( ycoord < 125 ) ycoord = 125;
	else if( ycoord > 195 ) ycoord = 195;
	else ycoord -= 20;
	context.fillText("Capacity: " + tankcapacity + " " + units, 160 - diameter, ycoord);
	context.fillText(tankcontains + " " + units + " remaining", 160 - diameter, ycoord + 20 );
	
};
