<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v1/connect.php');
$hostID=2347321;
$classID=1180;
$get=(object)$_GET;

$res = query("
	SET NOCOUNT ON
	SET DATEFORMAT DMY
    SELECT I.keyID,CONVERT(DATE,ISNULL(I.startDt,GETDATE()))startDt,p.* 
    FROM (SELECT * FROM api.fieldspivot($hostID,$classID)) X PIVOT(max(value) 
    FOR name in (Company,Bedrag,BTW,Kas,BoekNr,Omschrijving,Relatie)) P 
    INNER JOIN api.items I ON I.id=P.id;
");

while ($row = fetch_object($res)) {
    echo PHP_EOL.json_encode($row);
}


die();

// BEGIN BALANS
while ($row = db(aim)->fetch_object($res)) {
    $data[$row->boekNr][$row->bedrijf][begin]=round((float)$row->bedrag,0);
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

$body=file_get_contents('verslag18.htm');
$body=str_replace('</head>',"<title>$get->jaar</title><script>data=".json_encode($data).'</script></head>',$body);
exit($body);


?>