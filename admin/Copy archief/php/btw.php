<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>BTW</title>
    <script src="admin.js"></script>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open Sans">
    <link rel="stylesheet" type="text/css" href="../style/admin.css">
</head>
<body>
    <table id="result">
        <?php

        function td($value) {
            if (is_numeric ($value)) {
                if (is_float ($value)) 
                    $value = number_format ($value,2); 
                if ($value<0) 
                    return "<td class='num neg'>$value</td>";
                else
                    return "<td class='num'>$value</td>";
            }
            else return "<td>$value</td>";
        }



        ini_set('display_errors',1);
        ini_set('display_startup_errors',1);
        error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

        include_once "../../www/php/db/dbconnect.php"; 

        if (isset($_GET[eenheid]))
            $q="select 
        periode
        ,'MJVK Fiscale Eenheid' AS bedrijf
        ,sum(excl) AS excl
        ,sum(btw) AS btw
        ,sum(btw_voorbelast) AS btw_voorbelast
        ,sum(leveringdiensten) AS leveringdiensten
        ,sum(leveringbtw) AS leveringbtw
        ,sum(voorbelast) AS voorbelast
        from aliconadmin.dbo.admin_btw
        WHERE bedrijf in ('Alicon Systems BV','MJVK Beheer BV','Alicon Projects BV')
        group by periode
        "; 
        else
            $q="SELECT * FROM aliconadmin.dbo.admin_btw order by bedrijf,periode";

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
                    echo "<th>OMZET</th>";
                    echo "<th>BTW</th>";
                    echo "<th>VOORBELAST</th>";
                    echo "</tr>";
                }

                if ($bedrijf=='' || $bedrijf<>$row[bedrijf]) {
                    $bedrijf=$row[bedrijf];
                    echo "<tr><td colspan=100    ><h1>$bedrijf</h1></td></tr>";
                    $omzet=0;
                    $btw=0;
                    $voorbelast=0;
                    $bedrag=0;
                }

                $omzet += $row[excl]-$row[leveringdiensten];
                $btw+=$row[btw]-$row[leveringbtw];
                $voorbelast+=$row[btw_voorbelast]-$row[voorbelast];

                $bedrag+=$row[bedrag];
                $l=false;
                $refname=$row['refname'];
                echo "<tr>";
                foreach ($row as $key => $value) {
                    $class='';
                    if ($key=='datum') $value=substr($value,0,10);

                    //echo "<td class='$key'><a href='?$key=$value'>$value</a></td>";

                    if (!$l) $value = "<a name='$refname'>".$value;
                    echo td($value);
                    $l=true;

                }
                echo td($omzet);
                echo td($btw);
                echo td($voorbelast);
                echo "</tr>";
                $i++;
            }



        ?>
    </table>
</body>
</html>
