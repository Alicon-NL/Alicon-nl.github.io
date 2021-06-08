<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Admin</title>
    <script src="admin.js"></script>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open Sans">
    <link rel="stylesheet" type="text/css" href="../style/admin.css">
</head>
<body>
    <form id="findform" method="get">
        <table><tr>
    <?php
    $par[bedrijf]='';
    $par[jaar]='';
    $par[post]='';
    $par[relatie]='';
    $par[omschrijving]='';
    $par[relatie]='';
    $par[van]='';
    $par[tot]='';
    foreach ($_GET as $key => $value) $par[$key]=$value;
    foreach ($par as $key => $value) {
        if ($key=='van' || $key=='tot' ) $type='date'; else $type='text';
        echo "<td><label>$key</label>";
        echo "<input placeholder='$key' name='$key' type='$type' value='$value'/></td>";
    }
    echo "<td><input type='submit' value='find' /></td>";
        ?>
        </tr></table>
    </form>
    <table id="result">
        <?php

        ini_set('display_errors',1);
        ini_set('display_startup_errors',1);
        error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

        foreach ($_GET as $key => $value) {
            if ($value) {
                if ($q) $q.=' AND ';
                if ($key=='van') {$q.="datum >= '$value'";}
                else if ($key=='tot') { $q.="datum < '$value'"; }
                else {$q.="$key like '%$value%'"; }
            }
        }

        if ($q) {
            include_once "../../www/php/db/dbconnect.php"; 
            $q="SELECT bedrijf,jaar,kwartaal,boeknrenoms,relatie,saldo as bedrag,datum,omschrijving FROM aliconadmin.gb.balansview where $q order by datum";

            //echo $q;

            $res = mssql_query($q);
            $i=1;
            $bedrag=0;
            while ($row = mssql_fetch_assoc($res)) {
                if ($i==1) {
                    echo "<tr>";
                    foreach ($row as $key => $value) {
                        echo "<th>$key</th>";
                    }
                    echo "<th>bedragCum</th>";
                    echo "</tr>";
                }
                if ($jaar!=$row[jaar]) {
                    echo "<tr><td colspan=100    ><h1>".$row[jaar]."</h1></td></tr>";
                    $bedrag=0;
                }
                $jaar = $row[jaar];

                $bedrag+=$row[bedrag];
                echo "<tr>";
                foreach ($row as $key => $value) {
                    if ($key=='datum') $value=substr($value,0,10);
                    echo "<td class='$key'><a href='?$key=$value'>$value</a></td>";
                }
                echo "<td class='bedrag'>".number_format ($bedrag,2)."</td>";
                echo "</tr>";
                $i++;
            }
        }



        ?>
    </table>
</body>
</html>
