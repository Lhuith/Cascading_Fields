<?php
$texture = $_POST['image'];

// Create connection


if( is_dir('Island/') === false ){
    mkdir('Island/', 7777); // Create Directory
}

file_put_contents('Island/Map.png', file_get_contents($texture));
?>