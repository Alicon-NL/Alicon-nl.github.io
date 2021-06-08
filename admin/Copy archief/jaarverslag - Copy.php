<?php
$jr='
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Jaarrekening $bedrijf $jaar</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8; " />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="jaarverslag.css" rel="stylesheet" />

</head>
<body>
    <p class=titel>Jaarrekening</p>
    ';

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
$dbname='aliconadmin';
require ("/var/www/vhosts/aliconnect.nl/aim/www/aim/db/connect.php");
$bedrijf = $_GET[bedrijf];
$jaar = $_GET[jaar];


$jr.= "<p class=titel>$bedrijf</p><p class=titel>$jaar</p>";



function t($tag,$content,$class) {
    return "<$tag class='$class'>$content</$tag>";
}

function tablerow($row) {
    echo '<tr>';
    foreach ($row as $key => $value) if ($key!='bedrijf') {
        if ($key=='pr') $value=number_format($value,1,",",".");
        else if (is_numeric($value)) $value=number_format($value,0,",",".");
        echo "<td>$value</td>";
    }
    echo '</tr>';
}

function row3 ($name,$bedrag,$tot,$class) {
    echo "<tr class='$class'><td>$name</td><td>".number_format($bedrag,0,",",".")."</td><td>".number_format($bedrag/$tot*100,1,",",".")."</td></tr>";
}
function row5 ($name,$bedrag,$tot,$class) {
    echo "<tr class='$class'><td>$name</td><td>".number_format($bedrag,0,",",".")."</td><td>".number_format($bedrag/$tot*100,1,",",".")."</td></tr>";
}


function n($val,$dig) { if (!$dig) $dig=0; if ($val) return number_format($val,$dig,",",".");}
function n0($val,$dig) { if (!$dig) $dig=0; return number_format($val,$dig,",",".");}

function l($title,$href,$target) {return "<a target='' href='$href'>$title</a>";}

$toe.="<h1>Toelichting</h1>";

$res = sql_query("select PB.VolgNr,BoeknrOms,valtOnderNr,isnull(faktor,1) as faktor,PJ.saldo vorigsaldo,overnemen from postBoekNr PB
    LEFT OUTER JOIN postJaar PJ ON PJ.volgnr = PB.volgnr AND PJ.bedrijf = '$bedrijf' AND jaar = ".($jaar-1)."
    WHERE PB.volgnr<999999999 ORDER BY PB.VolgNr ");
while ($row = sql_fetch_assoc($res)) {
    $post[$row[VolgNr]]->volgnr=$row[VolgNr];
    $post[$row[VolgNr]]->naam=$row[BoeknrOms];
    $post[$row[VolgNr]]->faktor=$row[faktor];
    $post[$row[VolgNr]]->subitems=array();
    $post[$row[VolgNr]]->rows=array();
    $post[$row[VolgNr]]->vorigsaldo=$row[vorigsaldo];
    if ($row[overnemen]) {
        array_push($post[$row[VolgNr]]->rows,array(saldo=>$row[vorigsaldo]*$row[faktor],bedrag=>$row[vorigsaldo]*$row[faktor],relatie=>'Beginbalans',datum=>"1-1-$jaar"));
    }
    if ($row[valtOnderNr]) array_push($post[$row[valtOnderNr]]->subitems,$post[$row[VolgNr]]);
}

////BEGINBALANS
////bank
//$post[1221000]->tot = $post[1221000]->vorigsaldo;
////kas
//$post[1222000]->tot = $post[1222000]->vorigsaldo;
////reserves
//$post[1222000]->tot = $post[1222000]->vorigsaldo;


//BANK
//$res = sql_query("SELECT * FROM bankboekingen WHERE bedrijf='$bedrijf' AND jaar in ($jaar) ORDER BY datum");

//while ($row = sql_fetch_assoc($res)) {
//    array_push($post[1221000]->rows,$row);
//}



//BOEKINGEN
$res = sql_query("gb.boekingPostViewJaar '$bedrijf',$jaar");
while ($row = sql_fetch_assoc($res)) {
    $bank=$row;
    if ($row[bedrijf]==$bedrijf) {
        $bank[saldo]=$bank[bedrag];
        if ($bank[kasgiro]=='b') {
            if ($bank[bank_dt]) {
                $bank[datum]=$bank[bank_dt];
                if ($bank[eigenbedrijf]) {
                    // rekeing is via bank van ander bedrijf betaald => wordt dus kas
                    $row['kasgiro']=' KAS (B)';
                    $row['url']="kas".$row[boekingId];
                    $row['name']="boek".$row[boekingId];
                    $bank['kasgiro']=' BOEK';
                    $bank['url']=$row['name'];
                    $bank['name']=$row['url'];

                    $bank[relatie]=$bank[relatie].' (via '.$bank[eigenbedrijf].')';
                    array_push($post[1222000]->rows,$bank);
                }
                else {
                    // Boeken op bank
                    $row['kasgiro']=' BANK';
                    $row['url']="kas".$row[boekingId];
                    $row['name']="boek".$row[boekingId];
                    $bank['kasgiro']=' BOEK';
                    $bank['url']=$row['name'];
                    $bank['name']=$row['url'];
                    array_push($post[1221000]->rows,$bank);
                }
            }
            else {//if ($row[jaar]==$jaar ) {
                if ($bank[boeknr]==177000) {
                    // LOONHEFFING
                    $row['kasgiro']=' DEB';
                    $row['url']="deb".$row[boekingId];
                    $row['name']="boek".$row[boekingId];
                    $bank['kasgiro']=' BOEK';
                    $bank['url']=$row['name'];
                    $bank['name']=$row['url'];
                    array_push($post[2230000]->rows,$bank);
                }
                else if ($bank[boeknr]==800000) {
                    // DEBITEUREEN
                    $row['kasgiro']=' DEB';
                    $row['url']="deb".$row[boekingId];
                    $row['name']="boek".$row[boekingId];
                    $bank['kasgiro']=' BOEK';
                    $bank['url']=$row['name'];
                    $bank['name']=$row['url'];
                    array_push($post[1211000]->rows,$bank);
                }
                else {
                    // CREDITEUREN
                    $row['kasgiro']=' CRED';
                    $row['url']="cred".$row[boekingId];
                    $row['name']="boek".$row[boekingId];
                    $bank['kasgiro']=' BOEK';
                    $bank['url']=$row['name'];
                    $bank['name']=$row['url'];
                    array_push($post[2211000]->rows,$bank);
                }
            }
        }

        if ($row[jaar]==$jaar) {
            if ($bank[kasgiro]=='k') {
                // KAS
                $row['kasgiro']=' KAS';
                $row['url']="kas".$row[boekingId];
                $row['name']="boek".$row[boekingId];
                $bank['kasgiro']=' BOEK';
                $bank['url']=$row['name'];
                $bank['name']=$row['url'];
                array_push($post[1222000]->rows,$bank);
            }

            // Boek weg op W&V/BALANS 
            if ($row[boeknr]==176000) {
                // BTW Afgedragen
                $row[saldo]=-$row[saldo];
                $btwafgedragen+=$row[saldo];
            }
            array_push($post[$row[volgnr]]->rows,$row);
            // ALS BTW dan boeken op BTW
            if ($row[btw]!=0) {
                $btw=$row;
                $btw[saldo]=-$row[btw];
                if ($row[boeknr]==800000) {
                    // AF te dragen
                    array_push($post[2221100]->rows,$btw);
                    $btwtot+=$row[btw];
                }
                else {
                    // Voordruk
                    array_push($post[2221300]->rows,$btw);
                    $btwvoordruk+=$row[btw];
                }

            }
        }
    }
    else if ($bank[eigenbedrijf]) {
        // rekening is van ander bedrijf maar betaald via dit bedrijf via bank => retour boeken via kas 
        if ($bank[bank_dt]) {
            // KRUISPOST
            //boek regel;
            $bank[relatie]=$bank[bedrijf].' '.$bank[relatie].' BANK';
            //$bank[excl]=0;
            //$bank[btw]=0;
            $bank[datum]=$bank[bank_dt];
            $bank[saldo]=$bank[bedrag];

            //boek kruispost
            $bank['kasgiro']='BANK';
            $bank['url']="kruisbank".$row[boekingId];
            $bank['name']="kruis1".$row[boekingId];
            array_push($post[1900000]->rows,$bank);
            
            //boek bank
            $bank['kasgiro']='KRUIS';
            $bank['url']="kruis1".$row[boekingId];
            $bank['name']="kruisbank".$row[boekingId];
            array_push($post[1221000]->rows,$bank);

            $bank[relatie].=' RETOUR';
            $bank[bedrag]=-$bank[bedrag];
            $bank[saldo]=$bank[bedrag];
            $bank[kasgiro]='k';
            //boek kruispost
            $bank['kasgiro']='KAS';
            $bank['url']="kruis2".$row[boekingId];
            $bank['name']="kruiskas".$row[boekingId];
            array_push($post[1900000]->rows,$bank);

            //boek kas
            $bank['kasgiro']='KRUIS';
            $bank['url']="kruiskas".$row[boekingId];
            $bank['name']="kruis2".$row[boekingId];
            array_push($post[1222000]->rows,$bank);
        }
    }    
    else {
        var_dump($row);
        die();
    }
}


function asc($a, $b) {
    if ($a[datum] == $b[datum]) {
        return 0;
    }
    return ($a[datum] < $b[datum]) ? -1 : 1;
}
function desc($a, $b) {
    if ($a[datum] == $b[datum]) {
        return 0;
    }
    return ($a[datum] > $b[datum]) ? -1 : 1;
}


//$res = sql_query("select * from bankbedragview where datum <'2015-1-1' and bedrijf = 'NL39INGB0006299856'");



//if (($btwtot-$btwvoordruk-$btwafgedragen) > 0) { $btwpostnr=2220000; $post[$btwpostnr]->faktor=-1;} else { $btwpostnr=1212000; }

//$post[$btwpostnr]->rows = array();
//array_push($post[$btwpostnr]->rows,array(saldo=>$btwtot,bedrag=>$btwtot,relatie=>'BTW',datum=>"31-12-$jaar"));
//array_push($post[$btwpostnr]->rows,array(saldo=>$btwvoordruk,bedrag=>$btwvoordruk,relatie=>'BTW voordruk',datum=>"31-12-$jaar"));
//array_push($post[$btwpostnr]->rows,array(saldo=>$btwafgedragen,bedrag=>$btwafgedragen,relatie=>'BTW afgedragen',datum=>"31-12-$jaar"));

//$post[$btwpostnr]->som=$btwtot-$btwvoordruk-$btwafgedragen;

foreach ($post as $obj) {
    if ($post[$obj->volgnr]->rows) {
        $som=null;
        uasort($post[$obj->volgnr]->rows, 'asc');
        $toe.="<a name='".$obj->volgnr."'></a><h2 class='table'><span>".$post[$obj->volgnr]->naam."</span></h2>";
        $toe.= "<table>";
        foreach ($post[$obj->volgnr]->rows as $row) {
            $som[excl]+=$row[excl];
            $som[btw]+=$row[btw];
            $som[bedrag]+=$row[bedrag];
            $som[saldo]+=$row[saldo];
            $toe.= '<tr class="'.$row[kasgiro].'"><td>';
            if ($row[name]) $toe.="<a name='".$row[name]."'></a>";
            $toe.= $row[relatie].' '.$row[boeknr];
            if ($row[url]) $toe.=' <a href="#'.$row[url].'"> zie '.$row[kasgiro].'</a>';
            if ($row[bankbedrag]) $toe.=' ('.n($row[bankbedrag],2).')';

            $toe.= '</td><td>'.$row[datum].'</td><td>'.n0($row[excl],2).'</td><td>'.n0($row[btw],2).'</td><td>'.n0($row[bedrag],2).'</td><td>'.n0($row[saldo],2).'</td><td>'.n0($som[saldo],2).'</td>';

            $toe.='</tr>';
        }
        $toe.= "<tr class='total'><td>".$post[$obj->volgnr]->naam."</td><td></td><td>".n0($som[excl],2).'</td><td>'.n0($som[btw],2).'</td><td>'.n0($som[bedrag],2).'</td><td>'.n0($som[saldo],2).'</td></tr>';
        $toe.= "</table>";
        $post[$obj->volgnr]->tot+=$som[saldo]* $post[$obj->volgnr]->faktor;
    }
}

if (($btwtot+($btwvoordruk-$btwafgedragen)) < 0) { 
    $post[1212000]->subitems=$post[2220000]->subitems;
    $post[2220000]->subitems=null;
} 




        //$post[$btwpostnr]->som=22222;


//function calcboeknr($volgnr,$level) {
//    global $post,$toe,$jr;
//    if ($post[$volgnr]->rows) {
//        $level=2;
//        $toe.="<a name='".$post[$volgnr]->volgnr."'></a><h$level class='table'><span>".$post[$volgnr]->naam."</span></h$level>";
//        $toe.= "<table>";
//        $som=null;

//        uasort($post[$volgnr]->rows, 'asc');

//        foreach ($post[$volgnr]->rows as $row) {
//            $som[excl]+=$row[excl];
//            $som[btw]+=$row[btw];
//            $som[bedrag]+=$row[bedrag];
//            $som[saldo]+=$row[saldo];
//            $toe.= '<tr class="'.$row[kasgiro].'"><td>';
//            if ($row[name]) $toe.="<a name='".$row[name]."'></a>";
//            $toe.= $row[relatie].' '.$row[boeknr];
//            if ($row[url]) $toe.=' <a href="#'.$row[url].'"> zie '.$row[kasgiro].'</a>';
//            if ($row[bankbedrag]) $toe.=' ('.n($row[bankbedrag],2).')';

//            $toe.= '</td><td>'.$row[datum].'</td><td>'.n0($row[excl],2).'</td><td>'.n0($row[btw],2).'</td><td>'.n0($row[bedrag],2).'</td><td>'.n0($row[saldo],2).'</td><td>'.n0($som[saldo],2).'</td>';

//            $toe.='</tr>';
//        }
//        $toe.= "<tr class='total'><td>".$post[$volgnr]->naam."</td><td></td><td>".n0($som[excl],2).'</td><td>'.n0($som[btw],2).'</td><td>'.n0($som[bedrag],2).'</td><td>'.n0($som[saldo],2).'</td></tr>';
//        $toe.= "</table>";
//        $post[$volgnr]->tot+=$som[saldo];
//    }
//    foreach ($post[$volgnr]->subitems as $nr => $sub) {
//        $post[$volgnr]->tot+=calcboeknr($sub->volgnr,$level+1);
//    }
//    // Vennootschap beslasting bepalen
//    if ($volgnr==310000000) {
//        $post[320000000]->tot=round(-$post[$volgnr]->tot*0.20);
//        array_push($post[2251000]->rows,array(relatie=>'Vennootschapsbelasting',bedrag=>$post[320000000]->tot,saldo=>$post[320000000]->tot));
//    }

//    $post[$volgnr]->tot = $post[$volgnr]->tot * $post[$volgnr]->faktor;

//    return $post[$volgnr]->tot;
//}




/*
function writeboeknr($volgnr,$level,$pre,$fak=1,$somtot,$somtot2) {
    global $post;
    //if ($level==2) $content.="<tr><td><h1 class='table'><a href='#".$post[$volgnr]->volgnr."'>".$post[$volgnr]->naam."</a></h1></td></tr>";
 
    if (!$somtot) {
        $somtot=$post[$volgnr]->tot;
        $somtot2=$post[$volgnr]->vorigsaldo;
    }
    if ($post[$volgnr]->tot) {

        if ($post[$volgnr]->subitems) {
            foreach ($post[$volgnr]->subitems as $nr => $sub) {
                //if ($post[$sub->volgnr]->tot) {
                //    $content.="<tr><td><a href='#".$post[$sub->volgnr]->naam."'>".$post[$sub->volgnr]->naam."</a></td><td>".n($fak * $post[$sub->volgnr]->tot  )."</td><td></td><td>".n($fak * $post[$sub->volgnr]->vorigsaldo  )."</td></td><td></tr>";
                //}
                $content .= writeboeknr($sub->volgnr,$level+1,$pre.++$i.'.',$fak,$somtot,$somtot2);
            }
        }
        if ($content) {
            $content="<tr class='n n$level'><td colspan=10  style='padding-left:".(($level-1)*20)."px'><a name='".$post[$volgnr]->naam."'></a><h$level>".$post[$volgnr]->naam."</h$level></td></tr>".
                $content;
        }
        if ($post[$volgnr]->rows) $href="href='#".$post[$volgnr]->volgnr."'"; else $href='';
        $content.="<tr class='n n$level totaal'><td style='padding-left:".(($level-1)*20)."px'><a $href>Totaal ".$post[$volgnr]->naam."</a></td><td>".n($fak * $post[$volgnr]->tot  )."</td><td><small>".n(($fak * $post[$volgnr]->tot)/$somtot*100,1)."%</small></td><td>".n($fak * $post[$volgnr]->vorigsaldo  )."</td><td><small>".n(($fak * $post[$volgnr]->vorigsaldo)/$somtot2*100,1)."%</small></td></tr>";
    }
    //if ($post[$volgnr]->tot) 
    //{
    //    $content.="</tr>";
    //}
    //$jr.="<div class='table'><span>".$post[$volgnr]->naam."</span><span>".n($post[$volgnr]->tot)."</span>";
    //for ($x = 0; $x <= $level; $x++) $jr.="<span></span>";
    //$jr.="</div>";
    return $content.$subcontent;
}
*/



function calcboeknr($volgnr) {
    global $post;
    //if ($level==2) $content.="<tr><td><h1 class='table'><a href='#".$post[$volgnr]->volgnr."'>".$post[$volgnr]->naam."</a></h1></td></tr>";

    if ($post[$volgnr]->tot)
        //$post[$volgnr]->som += round($post[$volgnr]->tot);
        $post[$volgnr]->som += $post[$volgnr]->tot;

    if ($post[$volgnr]->subitems) {
        foreach ($post[$volgnr]->subitems as $nr => $sub) {
            calcboeknr($sub->volgnr);
            if (isset($post[$sub->volgnr]->som))
                $post[$volgnr]->som += $post[$sub->volgnr]->som;
        }
    }

    if ($volgnr==310000000) {
        $post[320000000]->som=round(-$post[$volgnr]->som*0.20);
        //array_push($post[2251000]->rows,array(relatie=>'Vennootschapsbelasting',bedrag=>$post[320000000]->som,kasgiro=>'b',saldo=>$post[320000000]->som));
        $post[2251000]->som=$post[320000000]->som;

    }

    
    //$post[$volgnr]->som=round($post[$volgnr]->som);

    return;
}


function writeboeknr($volgnr,$level,$pre,$fak=1,$somtot,$somtot2) {
    global $post;
    //if ($level==2) $content.="<tr><td><h1 class='table'><a href='#".$post[$volgnr]->volgnr."'>".$post[$volgnr]->naam."</a></h1></td></tr>";

    if (!$somtot) {
        $somtot=$post[$volgnr]->som;
        $somtot2=$post[$volgnr]->vorigsaldo;
    }

    if ($post[$volgnr]->subitems) {
        foreach ($post[$volgnr]->subitems as $nr => $sub) {
            $content .= writeboeknr($sub->volgnr,$level+1,$pre.++$i.'.',$fak,$somtot,$somtot2);
        }
    }
    if (isset($post[$volgnr]->som)) {
        if ($post[$volgnr]->subitems) {
            $content="<tr class='n n$level'><td colspan=10  style='padding-left:".(($level-1)*20)."px'><a name='".$post[$volgnr]->naam."'></a><h$level>".$post[$volgnr]->naam."</h$level></td></tr>".
            //$content="<tr class='n n$level'><td colspan=10  style='padding-left:".(($level-1)*20)."px'><a name='".$post[$volgnr]->naam."'></a>".$post[$volgnr]->naam."</td></tr>".
                $content;
        }
        if ($post[$volgnr]->rows) $href="href='#".$post[$volgnr]->volgnr."'"; else $href='';
        $content.="<tr class='n n$level totaal'><td style='padding-left:".(($level-1)*20)."px'><a $href>Totaal ".$post[$volgnr]->naam." <small>$volgnr</small></a></td><td>".n($fak * $post[$volgnr]->som  )."</td><td><small>".n(($fak * $post[$volgnr]->som)/$somtot*100,1)."%</small></td><td>".n($fak * $post[$volgnr]->vorigsaldo  )."</td><td><small>".n(($fak * $post[$volgnr]->vorigsaldo)/$somtot2*100,1)."%</small></td></tr>";
    }


    return $content.$subcontent;
}


calcboeknr(3000000,2);




if ($post[2220000]->som<0) {
    echo "JA";die();
}

    // Winstreserves bij boeken gebaseerd op winst
$post[2130000]->som+=-$post[300000000]->som;


calcboeknr(1);


$jr.="<footer />";
$jr.="<table>";
$jr.=writeboeknr(1000000,1);
$jr.="</table>";
$jr.="<footer />";
$jr.="<table>";
$jr.=writeboeknr(2000000,1,'',-1);
$jr.="</table>";
$jr.="<footer />";
$jr.="<table>";
$jr.=utf8_encode(writeboeknr(3000000,1,'',1,$post[311100000]->som,$post[311100000]->vorigsaldo));
$jr.="</table>";

$jr.="<footer />";
$jr.="<h1>Toelichting op de jaarrekening</h1>";
$jr.=file_get_contents("jv_toelichting_$bedrijf.htm");
$jr.=file_get_contents("jv_toelichting.htm");

$jr.=file_get_contents('jv_overigegegevens.htm')
    //.date("d-m-Y")
    ."</p>";

$jr.="<footer />";

$jr = str_replace('$bedrijf',$bedrijf,$jr);
$jr = str_replace('$jaar',$jaar,$jr);
$jr = str_replace('#datum#',date("d-m-Y"),$jr);

//echo $jr;
//exit();

//include_once "/var/www/vhosts/aliconnect.nl/www/aliconnect.nl/aim/include/aim-pdfdoc.php";
//$pdf = new pdfdoc();
//$pdf->make($jr);
//    //$pdf->save($filename);
//$pdf->write();
//exit();

$jr.="<div class='toe'>";
$jr.= $toe;
$jr.="</div>";

$jr = str_replace('$bedrijf',$bedrijf,$jr);

echo $jr;
//exit();




if (isset($_GET[save])) foreach ($post as $key => $data) if ($key > 3 && $data->som) {
    $q="EXEC postUpdateJaar '$key','$bedrijf',".$data->som.",".$jaar;
    //echo $q."<br>";
    sql_query("EXEC postUpdateJaar '$key','$bedrijf',".$data->som.",".$jaar);
}

file_put_contents("jaarverslag $bedrijf $jaar.htm",$jr);



?>