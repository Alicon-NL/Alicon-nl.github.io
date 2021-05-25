<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/aim/v1/api/connect.php');
$filter = " <= '12-31-2119'";
$filter = " < '01-01-2117'";
$tables = [
	'boek'=>"SELECT B.BoekingID ID,P.bedrijf_id BedrijfID,CONVERT(DATE,B.Datum)Datum,B.Bedrag,B.KasGiro,B.BTWprocent,B.Omschrijving,B.FaktuurNR,B.RelatieID,CONVERT(DATE,B.bank_dt) BankDT
	FROM aliconadmin.gb.boeking B
	INNER JOIN aliconadmin.dbo.post P ON B.postId = P.postId AND P.bedrijf_id IN (2,3,4)
	WHERE Datum $filter
	ORDER BY Datum DESC
	",
	'regels'=>"SELECT R.ID,R.BedrijfID,R.Datum,R.BoekingID,R.BoekNR,R.Bedrag,R.Omschrijving FROM aliconadmin.gb.regel R WHERE BedrijfID IN (2,3,4) AND Datum $filter ORDER BY Datum, ID",
	'relatie'=>'SELECT RelatieID ID,Relatie FROM aliconadmin.dbo.relatie',
	'bedrijf'=>'SELECT bedrijf_id ID,Bedrijf,rek_nr RekeningNR FROM aliconadmin.gb.bedrijf WHERE bedrijf_id IN (2,3,4)',
];

query('
SET DATEFORMAT DMY
EXEC aliconadmin.gb.beginbalans_aanmaken 2013
EXEC aliconadmin.gb.beginbalans_aanmaken 2014
EXEC aliconadmin.gb.beginbalans_aanmaken 2015
EXEC aliconadmin.gb.beginbalans_aanmaken 2016
EXEC aliconadmin.gb.beginbalans_aanmaken 2017
EXEC aliconadmin.gb.beginbalans_aanmaken 2018
EXEC aliconadmin.gb.beginbalans_aanmaken 2019
EXEC aliconadmin.gb.beginbalans_aanmaken 2020
');

$res = query($q='SET NOCOUNT ON;'.implode(';',array_values($tables)));
// die($q);
foreach (array_keys($tables) as $key) {
	$data[$key] = [];
	while ($row = fetch_object($res)) {
		// $ids[$key][$row->ID] = (object)array_filter((array)$row);
		$data[$key][] = array_filter((array)$row);
	}
	next_result ( $res );
}
// die(json_encode([$ids['boek'][151]]));

// foreach ($ids['regels'] as $id => $row) {
// 	// die(json_encode([$row,$row->BoekingID]));
//
// 	if ($ids['boek'][$row->BoekingID]) {
// 		$ids['boek'][$row->BoekingID]->regels[] = $row;
// 		// die(json_encode([$ids['boek'][$row->BoekingID]]));
// 	}
// }
// unset($ids['regels']);

header('Content-Type: application/json');
// echo json_encode($ids);
echo json_encode($data);
