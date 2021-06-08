<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
include_once "../db/dbconnect.php"; 

foreach ($_POST as $key => $value) {
    if ($value) {
        if ($q) $q.=' AND ';
        if ($key=='van') {$q.="$key >= '$value'";}
        else if ($key=='tot') { $q.="$key < '$value'"; }
        else {$q.="$key like '%$value%'"; }
    }
}

$q="SELECT * FROM aliconadmin.gb.balansview where $q";

//echo $q;

$res = mssql_query($q);
$all=array();
while ($row = mssql_fetch_assoc($res)) array_push($all,$row);
echo utf8_encode(json_encode($all));
?>