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
select jaar,q,bedrijf,boeknr,boekOms,relatie,datum,excl,btw
from aliconadmin.b17.boeking
WHERE jaar=$get->jaar and bedrijf_id in(2,3,4)
order by boeknr,boekOms,datum,relatie
");
echo "<table><tr><td>Jaar</td><td>Q</td><td>Bedrijf</td><td>Post</td><td>Oms</td><td>Relatie</td><td>Datum</td><td>Bedrag</td><td>Btw</td><td>CUM</td></tr>";
while ($row = fetch_object($res)) {
    echo "<tr>";
    if ($row->boekOms!=$boekOms) {$tot=0;$boekOms=$row->boekOms;}
    $row->CUM=$tot+=$row->excl;
    foreach ($row as $key=>$value) echo "<td style='".(is_numeric($value)?"text-align:right;".($value<0?"color:red;":""):"")."'>".(is_numeric($value)&&!(int)$value?'':$value)."</td>";
    echo "</tr>";
}
echo "</table>";
?>
