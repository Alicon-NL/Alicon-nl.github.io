<style>
    *{font-family:arial;}
    table{border-collapse:collapse;}
    td{white-space:nowrap;border:solid 1px #ccc;padding:3px;}
</style>
<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/aim/v1/api/connect.php');
//$db[aim]->dbname='aliconadmin';
$get=(object)$_GET;
$res = query("
EXEC aliconadmin.api.omzetbelastingoverzicht
");
echo "<table><tr><td>Jaar</td><td>Periode</td><td>Omzet</td><td>BTW</td><td>Kosten</td><td>VB</td><td>Aang.Omzet</td><td>Aang.BTW</td><td>Aang.VB</td><td>Verschil.Omzet</td><td>Verschil.BTW</td><td>Verschil.VB</td><td>Jaar.Omzet</td></tr>";
while ($row = fetch_object($res)) {
    echo "<tr>";

    $row->vOmzet=$omzet+=$row->Omzet-$row->AangOmzet;
    $row->vBTW=$btw+=$row->BTW-$row->AangBTW;
    $row->vVB=$vb+=$row->VB-$row->AangVB;
    if ($jaar!=$row->Jaar) {$comzet=0;$jaar=$row->Jaar;}
    $row->cOmz=$comzet+=$row->Omzet;
    foreach ($row as $key=>$value) echo "<td style='".(is_numeric($value)?"text-align:right;".($value<0?"color:red;":""):"")."'>".(is_numeric($value)&&!(int)$value?'':$value)."</td>";
    echo "</tr>";
}
echo "</table>";
?>