<?php
//Header("Content-type: image/png");
$building_data = json_decode($_POST['data'],true);
//$building_data['pixelData'] = array_reverse($building_data['pixelData']);
$str = '-_-';
foreach($building_data as $k => $v){
	$str.=', '+$k;
}
// Grab the dimensions of the pixel array
$width = 800;
$height = 600; 
$palette = array();
// Create the image resource
$img = imagecreatetruecolor($width, $height);
$blue = imagecolorallocate($img, 0,0,255);
// Set each pixel to its corresponding color stored in $building_data
$n=0;
$m=0;
//print_r(count($building_data));

foreach($building_data['colorPalette'] as $k => $v){
	$n++;
	$color = preg_split("/,/",$v);
	$colorRef = imagecolorallocate($img, $color[0], $color[1], $color[2]);
	//if($colorRef === false)echo $k.'TROUBLE!'.$v.','.$color[0].','.$color[1].','.$color[2].'<br>';
	if(array_search($colorRef, $palette)==false)$palette[$k] = $colorRef;	
}

foreach($building_data['pixelData'] as $k1 => $v1){
	$m++;
	$y = floor($k1/$width);
	$x = $k1-($y*$width);

	imagesetpixel($img, $x, $y, $palette[$v1]);
}
//echo $n.','.$m.'.'.count($palette);

$path='../buildings/';
$id = rand(0,999999);

$myFile_name = $path."building".$id;

//IMAGE
//echo $myFile_name.'.png';
$fh = @fopen($myFile_name.'.png', 'w') or die("can't create image file");
fwrite($fh, '');
fclose($fh);

imagepng($img, $myFile_name.'.png');
//imageflip($img,IMG_FLIP_BOTH);
//imagescale($img, 150, 100,IMG_BICUBIC);
// Clean up after ourselves
imagedestroy($img);

//BUILDING STRUCTURE
$json = fopen($myFile_name.'.json', 'w') or die("can't create json file");
header('Content-type: application/json');
fwrite($json, json_encode($building_data['structure']));
fclose($json);

//DB
$db = file_get_contents('../library.json');
$db = json_decode($db,true);
if($db == null){
	$database[0] = 0;
	array_push($database,$id);
}else{
	$fijo[0] = $db[0];
	$variable = array_slice($db, 1);
	if(count($db) >= 7){
		array_unshift($variable, $id);
		array_pop($variable);	
	}else{
		array_push($variable,$id);
	}
	$database = array_merge($fijo, $variable);
}

$json = fopen('../library.json', 'w') or die("can't create lib file");
header('Content-type: application/json');
fwrite($json, json_encode($database));
fclose($json);
echo 'true';
?>