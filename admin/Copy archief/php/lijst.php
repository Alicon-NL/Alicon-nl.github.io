<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title><?php echo $_GET['t']; ?></title>
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open Sans">
    <link rel="stylesheet" type="text/css" href="../style/admin.css">
</head>
<body>
        <?php

        ini_set('display_errors',1);
        ini_set('display_startup_errors',1);
        error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

        include_once "../../www/php/db/dbconnect.php"; 

        $rap = mssql_fetch_assoc(mssql_query('SELECT * FROM aliconadmin.dbo.rapportage WHERE rapportId='.$_GET[i]));

        echo "<h1>".$rap['naam']."</h1>";


            $q=$rap[q];

            //echo $q;
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

            $res = mssql_query($q);
            $i=1;
            $bedrag=0;
            
            foreach(explode(",",$rap[tot]) as $colname) {
                $tot0[$colname]=0;
            }
            foreach(explode(",",$rap[tot]) as $colname) {
                $tot1[$colname]=0;
            }
            //echo array_search('bedrag',$tot);
            //var_dump($tot);

            while ($row = mssql_fetch_assoc($res)) {
                if (!$fieldnames) {
                    $fieldnames=array();
                    foreach ($row as $key => $value) array_push($fieldnames,$key);
                }

                if ($sub1=='' || $sub1<>$row[sub1]) {
                    if ($tot1) {
                        echo "<tr>";
                        foreach ($fieldnames as $key) {
                            if ($tot1[$key]!=0) {
                                echo td($tot1[$key]); 
                                $tot1[$key]=0;
                            }
                            else {
                                echo td();
                            }
                            }
                            echo "</tr>";
                                //array_search 
                            }
                        }


                    if ($sub0=='' || $sub0<>$row[sub0]) {

                        if ($tot0) {
                            echo "<tr>";
                            foreach ($fieldnames as $key) {
                                if ($tot0[$key]!=0) {
                                    echo td($tot0[$key]); 
                                    $tot0[$key]=0;
                                }
                        else {
                            echo td();}
                    }
                    echo "</tr>";
                    //array_search 
                    }


                    }


                    if ($sub0=='' || $sub0<>$row[sub0]) {
                        $sub0=$row[sub0];
                        echo "</table><h2>$sub0</h2><table>";
                    }

                    if ($sub1=='' || $sub1<>$row[sub1]) {
                        $sub1=$row[sub1];
                        echo "</table><h3>$sub1</h3><table>";
                        echo "<tr>";
                        foreach ($row as $key => $value) {
                            echo "<th>$key</th>";
                        }
                        echo "<th>bedragCum</th>";
                        echo "<th>openstaandCum</th>";
                        echo "</tr>";
                    }


                    foreach ($tot0 as $key => $value) { //echo "<br>$key ".$tot[$key]; 
                        $tot0[$key]+=$row[$key];}//$tot[$key]+='123.23'; } //$row[$key]; }
                    foreach ($tot1 as $key => $value) { //echo "<br>$key ".$tot[$key]; 
                        $tot1[$key]+=$row[$key];}//$tot[$key]+='123.23'; } //$row[$key]; }

                $bedrag+=$row[bedrag];
                $openstaand+=$row[openstaand];
                $l=false;
                $refname=$row['refname'];
                echo "<tr>";
                foreach ($row as $key => $value) {
                    $class='';
                    if ($key=='datum') $value=substr($value,0,10);


                    if (!$l) echo "<a name='$refname'>";
                    echo td($value);
                    $l=true;

                }
                echo "</tr>";
                $i++;
            }



        ?>
    </table>
</body>
</html>
