<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>BALANS</title>
    <script src="admin.js"></script>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open Sans">
    <link rel="stylesheet" type="text/css" href="../style/admin.css">
</head>
<body>
    <h1>Balans <?php echo $_GET[jaar];?></h1>
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
            $q="aliconadmin.dbo.admin_balans_jaar ".$_GET['jaar'];

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

                if ($bedrijf=='' || $bedrijf<>$row[bedrijf]) {
                    $bedrijf=$row[bedrijf];
                    echo "<tr><td colspan=100    ><h1>$bedrijf</h1></td></tr>";
                    $bedrag=0;
                }

                if ($jaar=='' || $jaar!=$row[jaar]) {
                    $jaar = $row[jaar];
                    echo "<tr><td colspan=100    ><h1>$jaar</h1></td></tr>";
                    //$bedrag=0;
                }

                $bedrag+=$row[bedrag];
                echo "<tr>";
                foreach ($row as $key => $value) {
                    $class='';
                    if ($key=='datum') $value=substr($value,0,10);

                    if (is_numeric($value)) {
                        if ($value<0) $class='neg';
                        $class.=' number';
                        $value=number_format ($value,2);
                    }
                    //echo "<td class='$key'><a href='?$key=$value'>$value</a></td>";
                    echo "<td class='$key $class'>$value</td>";
                }
                if ($bedrag<0) $class='neg'; else $class='';
                echo "<td class='bedrag $class'>".number_format ($bedrag,2)."</td>";
                echo "</tr>";
                $i++;
            }



        ?>
    </table>
</body>
</html>
