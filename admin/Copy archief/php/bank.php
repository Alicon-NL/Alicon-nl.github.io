<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Bank</title>
    <script src="admin.js"></script>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open Sans">
    <link rel="stylesheet" type="text/css" href="../style/admin.css">
</head>
<body>
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

        include_once "../../www/php/db/dbconnect.php"; 
            $q="SELECT * FROM aliconadmin.dbo.admin_bank order by bedrijf,datum";


                      //$line .=  $q;

            $res = mssql_query($q);
            $i=1;
            $bedrag=0;
            while ($row = mssql_fetch_assoc($res)) {
                if ($jaar!=$row[jaar] || $bedrijf!=$row[bedrijf]) {
                    $jaar = $row[jaar];
                }
                if ($bedrijf!=$row[bedrijf]) {
                    $bedrijf=$row[bedrijf];
                    $bedrag=0;
                }

                $bedrag+=$row[bedrag];
                $refname=$row['refname'];
                $l=false;
                $line .=  "<tr>";
                foreach ($row as $key => $value) {
                    $class='';
                    if (is_numeric($value)) {
                        if ($value<0) $class='neg';
                        $class.=' number';
                        $value=number_format ($value,2);
                    }
                    if ($key=='datum') $value=substr($value,0,10);
                    //$line .=  "<td class='$key'><a href='?$key=$value'>$value</a></td>";
                    $line .=  "<td class='$key $class'>";
                    if (!$l) $line .=  "<a name='$refname'>";
                    $line .=  "$value</td>";
                    $l=true;
                }
                $line .=  "<td class='bedrag'>".number_format ($bedrag,2)."</td>";
                $line .=  "</tr>";
                $jaarbody[$jaar][$bedrijf] = $line.$jaarbody[$jaar][$bedrijf];


                $line='';
                $i++;
            }

            foreach($jaarbody as $jaar => $jaardata) {
                $j = "<tr><td colspan=100    ><h1>$jaar</h1></td></tr>";
                foreach($jaardata as $bedrijf => $body) {
                    $j .= "<tr><td colspan=100    ><h1>$bedrijf</h1></td></tr>".$body;
                }
                $jj = $j . $jj;
            }
            echo $jj;

        ?>
    </table>
</body>
</html>
