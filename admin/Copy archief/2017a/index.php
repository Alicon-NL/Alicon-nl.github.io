<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/aim/api/connect.php');
$db[aim]->dbname='aliconadmin';
$get=(object)$_GET;


$res = db(aim)->query("EXEC b17.balansget $get->jaar");
// BEGIN BALANS
while ($row = db(aim)->fetch_object($res)) {
    $data[$row->boekNr][$row->bedrijf][begin]=round((float)$row->bedrag,0);;
}
db(aim)->next_result ( $res );
//// EIND BALANS
//while ($row = db(aim)->fetch_object($res)) {
//    $data[$row->boekNr][$row->bedrijf][eind]=round((float)$row->bedrag,0);;
//}
//db(aim)->next_result ( $res );
// BOEKREGELS
while ($row = db(aim)->fetch_object($res)) {
    $row->bedrag=(float)$row->bedrag;
    if (!$data[$row->boekNr][$row->bedrijf][regels]) $data[$row->boekNr][$row->bedrijf][regels]=array();
    array_push($data[$row->boekNr][$row->bedrijf][regels],$row);
}
//db(aim)->next_result ( $res );
////// BTW
//while ($row = db(aim)->fetch_object($res)) {
//    $data[btw][$row->q][$row->post][$row->bedrijf]=(float)$row->excl;
//}

$body=file_get_contents('verslag.htm');
$body=str_replace('</head>',"<title>$get->jaar</title><script>data=".json_encode($data).'</script></head>',$body);
exit($body);


?>