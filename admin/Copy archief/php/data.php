<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

if (isset($_POST[q])) {
    $q=$_POST[q];
    switch ($_POST[lijst]) {
        case 'lijst':
            $dbname="aliconadmin";
            $query="SELECT rapportId,naam FROM dbo.rapportage";
            break;
    }
}
else if (isset($_POST[id])) {
    $id=$_POST[id];
    switch ($_POST[lijst]) {
        case 'klanten':
            $dbname="abisingen";
            $query="SELECT * FROM www.klant WHERE id = '$id'";
            break;
    }
}
if ($query) {
    include_once "../../www/php/db/dbconnect.php"; 
    $res = mssql_query($query);
    $all[row]=array();
    while ($row = mssql_fetch_assoc($res)) {
        array_push($all[row],$row);
    }
    echo utf8_encode(json_encode($all));
}

?>
