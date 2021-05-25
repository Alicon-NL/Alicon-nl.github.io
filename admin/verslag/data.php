<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/aim/v1/api/connect.php');
$filter = " <= '01-02-2014'";
$tables = [
	'boek'=>"SELECT BoekingID ID,Datum,Bedrag,KasGiro,BTWprocent,Omschrijving,FaktuurNR,PostID,RelatieID,bank_dt BankDT FROM aliconadmin.gb.boeking WHERE Datum $filter ORDER BY Datum",
	// 'boek'=>"SELECT BoekingID ID,Datum,Bedrag,KasGiro,BTWprocent,Omschrijving,FaktuurNR,PostID,RelatieID FROM aliconadmin.gb.boeking WHERE BoekingID = 106 ORDER BY Datum",
	'post'=>"SELECT PostID ID,bedrijf_id BedrijfID,BoekNR,Omschrijving FROM aliconadmin.dbo.post",
	'relatie'=>'SELECT RelatieID ID,Relatie FROM aliconadmin.dbo.relatie',
	'bedrijf'=>'SELECT bedrijf_id ID,Bedrijf,rek_nr RekeningNR FROM aliconadmin.gb.bedrijf',
	'boekbank'=>"SELECT BB.BoekingID ID,BB.BankID,BB.Bedrag FROM aliconadmin.gb.boekingbank BB INNER JOIN aliconadmin.dbo.aliconBank BANK ON BANK.ID=BB.BankID AND Bank.Datum $filter INNER JOIN aliconadmin.gb.boeking BK ON BK.BoekingID = BB.BoekingID AND BK.Datum $filter",
	'bank'=>"SELECT ID,Datum,AfBij,AfBijBedrag,Mededelingen,Rekening,Tegenrekening FROM aliconadmin.dbo.aliconBank WHERE Datum $filter ORDER BY Datum",
	'beginbalans'=>'SELECT * FROM aliconadmin.b17.beginbalans',
];

$res = query($q='SET NOCOUNT ON;'.implode(';',array_values($tables)));
foreach (array_keys($tables) as $key) {
	$data[$key] = [];
	while ($row = fetch_object($res)) {
		$data[$key][] = $row;
	}
	next_result ( $res );
}

header('Content-Type: application/json');
echo json_encode($data);
