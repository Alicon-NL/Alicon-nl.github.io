<style>
    * {font-family:arial}
    body > div {display:table-row;}
    body > div > div {display:table-cell;padding:5px;border:solid 1px #DDD;text-align:right;}
    label {font-size:8pt;display:block;}
    .totjaar {color:green;font-weight:bold;}
    .tot {color:blue;font-weight:bold;}
    .number {text-align:right;}

    </style>
<body>
    <h1>BTW Aangifte</h1>
    <table>
<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/aim/srv/connect.php');
$db[aim]->dbname='aliconadmin';

$q="SELECT * FROM aliconadmin.rap.btwaangifte ORDER BY jaar DESC,eenheid,periode,bedrijf";

//$dbname = 'aliconadmin1';
//require ("../../../aim/db/connect.php"); 

$res = db(aim)->query($q);

function cell($name) {
    global $row,$totperiode,$totjaar;
    echo "<td><label>$name</label><div class='number'>";
    echo number_format($row[$name],0);
    echo "</div></td>";
}

$totperiode=array(omzet=>0,btw=>0,voorbelast=>0,Aangifte_Omzet=>0,Aangifte_BTW=>0,Aangifte_Voorbelast=>0,Verschil_Omzet=>0,Verschil_BTW=>0,Verschil_Voorbelast=>0,NogTeBetalen=>0);
//$totperiode[omzet]=0;$totperiode[btw]=0;$totperiode[voorbelast]=0;$totperiode[Aangifte_Omzet]=0;$totperiode[Aangifte_BTW]=0;$totperiode[Aangifte_Voorbelast]=0;

function echototperiode() {
    global $row,$totperiode,$totjaar,$hastot,$periode;
    if ($hastot) {
        $hastot=false;
        echo "<tr class='tot'><td>$periode</td><td></td>";
        foreach ($totperiode as $key => $value) { echo "<td class=number>".number_format($totperiode[$key],0)."</td>";}
        echo "</tr>";
    }
}
function echototjaar() {
    global $row,$totperiode,$totjaar,$hastot,$periode,$jaar;
    if ($hastot) {
        echototperiode();
        echo "<tr class='totjaar'><td>$jaar</td><td></td>";
        foreach ($totjaar as $key => $value) { echo "<td class=number>".number_format($totjaar[$key],0)."</td>";}
        echo "</tr>";
    }
}

while ($row = db(aim)->fetch_assoc($res)) {
    if ($jaar != $row[jaar]) {
        echototjaar();
        foreach ($totperiode as $key => $value) { $totperiode[$key]=0; $totjaar[$key]=0; }
        $jaar = $row[jaar];
        echo "<tr><td colspan=99><h1>$jaar</h1></td></tr>";
    }
    if ($eenheid != $row[eenheid]) {
        echototjaar();
        foreach ($totperiode as $key => $value) { $totperiode[$key]=0; $totjaar[$key]=0; }
        $eenheid = $row[eenheid];
        echo "<tr><td colspan=99><h2>$eenheid</h2></td></tr>";
    }
    if ($periode != $row[periode]) {
        echototperiode();
        foreach ($totperiode as $key => $value) $totperiode[$key]=0; 
        $periode = $row[periode];
        echo "<tr><td><label>Periode</label><div>".$row[periode]."</div></td>";
    }
    else
        echo "<tr><td></td>";

    echo "<td><label>Bedrijf</label><div>".$row[bedrijf]."</div></td>";

    $row[Verschil_Omzet]=$row[omzet]-$row[Aangifte_Omzet];
    $row[Verschil_BTW]=$row[btw]-$row[Aangifte_BTW];
    $row[Verschil_Voorbelast]=$row[voorbelast]-$row[Aangifte_Voorbelast];
    $row[NogTeBetalen]=$row[btw]-$row[Aangifte_BTW]-$row[voorbelast]+$row[Aangifte_Voorbelast];

    foreach ($totperiode as $key => $value) { 
        $totperiode[$key] += $row[$key];
        $totjaar[$key] += $row[$key];
        cell($key);
    }
    $hastot = true;

    echo "</tr>";

}
echototjaar();



?>
    </table>
</body>
