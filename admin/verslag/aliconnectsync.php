<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v1/connect.php');
require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v1/db.php');
$hostID=2347321;
$classID=1180;
$get=(object)$_GET;

$class=fetch_object(query("SELECT id,config FROM om.class WHERE id=$classID;"));
$class->config=json_decode($class->config);

$res = query("
    SET NOCOUNT ON;
    SELECT I.keyID,CONVERT(DATE,ISNULL(I.startDt,GETDATE()))startDt,p.* 
    FROM (SELECT * FROM api.fieldspivot($hostID,$classID)) X PIVOT(max(value) 
    FOR name in (Company,Bedrag,BTW,Kas,BoekNr,Omschrijving,Relatie)) P 
    INNER JOIN api.items I ON I.id=P.id;
");
while ($row=fetch_object($res)) $items->{$row->keyID}=$row;
//echo json_encode($items);

$res = query("
	SELECT TOP $get->top
		convert(varchar(10),boekingId) keyID
		,BD.bedrijf Company
		,P.bedrijf_id
		,CONVERT(date,datum) as startDt
		,excl Bedrag
		,bedrag-excl as BTW
		,CASE WHEN kasgiro IN ('k','c') THEN bedrag END AS Kas
		,P.Omschrijving BoekNr
		,B.Omschrijving
	    ,R.relatie Relatie
	FROM aliconadmin.gb.boeking B
	INNER JOIN aliconadmin.dbo.post P ON B.postId = P.postId
	LEFT OUTER JOIN aliconadmin.dbo.relatie R ON R.relatieid = B.relatieId
	INNER join aliconadmin.gb.bedrijf BD ON BD.bedrijf_id = P.bedrijf_id AND BD.bedrijf IN ('MJVK Beheer BV','Alicon Projects BV','Alicon Systems BV')
");
while ($row=fetch_object($res)) {
    $q=$l='';
    foreach ($class->config->fields as $key => $field) if (isset($row->$key) && $row->$key!=$items->{$row->keyID}->$key) { $field=(object)array(classID=>$field->classID,value=>$row->{$key}); $l.="$key=$field->value;"; $q.=prepareexec("api.itemfieldPost @id=@id,@name='".dbvalue($key)."',@hostId=$hostID,",$field); }
    if ($q){
        $q=PHP_EOL."SET NOCOUNT ON;DECLARE @id INT;EXEC api.itemlinkget @classID=$class->id,@hostId=$hostID,@keyID=$row->keyID,@id=@id OUTPUT;$q;SELECT @id AS id;";
        echo PHP_EOL.$l;
        $item=fetch_object(query($q));
        //echo json_encode($item);
        itemGet(array(id=>$item->id,autohostID=>$hostID,all=>0));
    }
}
?>