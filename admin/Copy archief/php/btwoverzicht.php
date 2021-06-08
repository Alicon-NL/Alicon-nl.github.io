<style>
    * {font-family:arial;position:relative;}
    body {padding-top:20px;}
    body > div {display:table-row;}
    table {border-collapse:collapse;table-layout:fixed;}
    td {white-space:nowrap;padding-right:5px;border-right:solid 1px #DDD;}
    label {font-size:8pt;display:block;}
    .totjaar {color:green;font-weight:bold;}
    .tot {color:blue;font-weight:bold;}
    .tot td {border-top:solid 1px #DDD;border-bottom:solid 1px #DDD;}
    .numeric {text-align:right;}
    #header {font-weight:bold;font-size:8pt;}
    .header {position:fixed;background-color:#DDD;top:0;z-index:1;}
    .header td {height:30px;}
     

    </style>
<body>
    <table>
<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

include_once "../../www/php/db/dbconnect.php"; 

$q="SELECT jaar,kwartaal,bedrijf,boeknr,post,datum,excl,btw,bedrag,relatie,omschrijving FROM aliconadmin.rap.boeking WHERE btw<>0 ORDER BY jaar,kwartaal,bedrijf,boeknr,datum";
$res = mssql_query($q);

$totfield=array(excl,btw);

$totcol=array(post=>'',bedrijf=>'',kwartaal=>'',jaar=>'');


function val($val) {
    if (is_float($val)) return "<td class='numeric'>".number_format($val,2)."</td>";
    else if (is_numeric($val)) return "<td class='numeric'>$val</td>";
    else return "<td>$val</td>";
}

function showtot($key) {
    global $totcol,$totrow,$totfield,$fieldnames;
    echo "<tr class=tot>";
    foreach($fieldnames as $fieldname) {
        if ($fieldname==$key) {
            echo val($totrow[$key][value]);
        }
        else if (in_array($fieldname, $totfield )) {
            echo val($totrow[$key][tot][$fieldname]);
            $totrow[$key][tot][$fieldname]=0;
        }
        else 
            echo "<td></td>";
    }
    echo "</tr>";
}


while ($row = mssql_fetch_assoc($res)) {
    if (!$fieldnames) {
        echo "<tr id=header>";
        $fieldnames = array(); foreach ($row as $fieldname => $value) {
            array_push($fieldnames,$fieldname);
            echo "<td>$fieldname</td>";
        }
        echo "</tr>";
    }
    foreach ($totcol as $key => $value) {
        if ($totrow[$key][value] != $row[$key]) {
            showtot($key);
            $totrow[$key][value] = $row[$key];
        }
        foreach($totfield as $key1) {
            $totrow[$key][tot][$key1]+=$row[$key1];
        }
    }

    echo "<tr>";
    foreach($row as $key => $value) {
        echo val($value); 
    }
    echo "</tr>";

}
foreach ($totcol as $key => $value) {showtot($key);}



?>
    </table>
<script>
    with (document.getElementById('header')){
        var p=nextElementSibling;
        var c=children;
        for (var i=0,e;e=c[i];i++) {
            var w=e.offsetWidth;
            e.style.width=w;
            p.children[i].style.width=w;
        }
        className='header';
    }
        

</script>
</body>
