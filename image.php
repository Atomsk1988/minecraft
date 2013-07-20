<?php
//Report any errors
ini_set ("display_errors", "1");
error_reporting(E_ALL);
 
//Set the correct content type 
header('content-type: image/png');
 
//Create our basic image stream 
//125px width, 125px height
$image = imagecreatetruecolor(200, 100);
 
//Set the background color
$blue = imagecolorallocate($image, 0, 0, 255);
 
//Set up another color just to show how the first color declared is used as the background color when we use imagecreate() 
//Notice how blue is applied to the background, *not* red.
$red = imagecolorallocate($image, 255, 0, 0);
 

 for($n=0;$n<(200*100);$n++){
 	$y = floor($n/200);
	$x = $n-($y*200);
 	imagesetpixel ($image, $x, $y, $red);
 }
//save the image as a png and output 
imagepng($image);
 
//Clear up memory used
imagedestroy($image);
?>