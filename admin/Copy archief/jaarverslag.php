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
require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v1/connect.php');
$db[aim]->dbname='aliconadmin';

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

// BEGIN BALANS OPHALEN
$res = db(aim)->query("EXEC [gb].[boekingPostViewJaarBegin] '$bedrijf',".$jaar);
while ($row = db(aim)->fetch_array($res)) {
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

//BOEKINGEN
if (isset($_GET[start])) $start=$_GET[start]; else $start=0;
if (isset($_GET[eind])) $eind=$_GET[eind]; else $eind = 90000000;

$res = db(aim)->query("gb.boekingPostViewJaar '$bedrijf',$jaar,$start,$eind");
while ($row = db(aim)->fetch_array($res)) {
    $bank=$row;
    if ($row[bedrijf]==$bedrijf) {
        $bank[saldo]=$bank[bedrag];

        if ($bank[kasgiro]=='b') {
            if ($bank[bank_dt]) {
                $bank[datum]=$bank[bank_dt];
                if ($bank[bankjaar] > $bank[jaar]) {
                    $row['kasgiro']=' BANK';
                    $row['url']="kas".$row[boekingId];
                    $row['name']="boek".$row[boekingId];
                    //$bank['kasgiro']=' BOEK DEB';
                    //$bank['url']=$row['name'];
                    //$bank['name']=$row['url'];
                    //$row[btw]=0;
                    //$row[bedrag]=-$row[bedrag];
                    $row[saldo]=-$row[bedrag];
                    if ($bank[boeknr]==177000) array_push($post[2230000]->rows,$row);
                    else array_push($post[1211000]->rows,$row);
                }
                
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
                    if ($bank[boeknr]==171000)
                        array_push($post[2251000]->rows,$bank);
                    else
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
        echo 'ERROR';
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

//if ($post[1212000]->vorigsaldo) $post[2220000]->vorigsaldo=$post[1212000]->vorigsaldo;




function calcboeknr($volgnr) {
    global $post,$toe;
    //$post[$volgnr]->som=0;
    if ($post[$volgnr]->tot)
        $post[$volgnr]->som += $post[$volgnr]->tot;

    if ($post[$volgnr]->subitems) {
        foreach ($post[$volgnr]->subitems as $nr => $sub) {
            calcboeknr($sub->volgnr);
            if (isset($post[$sub->volgnr]->som))
                $post[$volgnr]->som += $post[$sub->volgnr]->som;
        }
    }

    if ($volgnr==310000000) {
        $toe .= "<p><b>VENNOOT IS ".round(-$post[$volgnr]->som*0.20).'</p>';
        
        $post[2251000]->som=round(-$post[$volgnr]->som*0.20);
        $post[320000000]->som=round(-$post[$volgnr]->som*0.20);
        //array_push($post[2251000]->rows,array(relatie=>'Vennootschapsbelasting',bedrag=>$post[320000000]->som,kasgiro=>'b',saldo=>$post[320000000]->som));

    }
    return;
}


function writeboeknr($volgnr,$level,$pre,$fak=1,$somtot,$somtot2,&$sompar1,&$sompar2) {
    global $post;
    //$post[$volgnr]->som=round($post[$volgnr]->som);
    //$post[$volgnr]->vorigsaldo=round($post[$volgnr]->vorigsaldo);
    if (!$somtot) {
        $somtot=$post[$volgnr]->som;
        $somtot2=$post[$volgnr]->vorigsaldo;
    }
    $som1=0;
    $som2=0;
    if ($post[$volgnr]->subitems) {
        foreach ($post[$volgnr]->subitems as $nr => $sub) {
            $content .= writeboeknr($sub->volgnr,$level+1,$pre.++$i.'.',$fak,$somtot,$somtot2,$som1,$som2);
        }
    }
    else {
        $som1=$post[$volgnr]->som;
        $som2=$post[$volgnr]->vorigsaldo;
    }

//    if ($volgnr==2220000) { echo $post[$volgnr]->som.','.$som1.','.$sompar1; die();}

    $sompar1+=$som1;
    $sompar2+=$som2;


    //if (isset($post[$volgnr]->som)) {
        if ($post[$volgnr]->subitems) {
            $content="<tr class='n n$level'><td colspan=5  style='padding-left:".(($level-1)*20)."px'><a name='".$post[$volgnr]->naam."'></a><h$level>".$post[$volgnr]->naam."</h$level></td></tr>".
            //$content="<tr class='n n$level'><td colspan=10  style='padding-left:".(($level-1)*20)."px'><a name='".$post[$volgnr]->naam."'></a>".$post[$volgnr]->naam."</td></tr>".
                $content;
        }
        if ($post[$volgnr]->rows) $href="href='#".$post[$volgnr]->volgnr."'"; else $href='';
        $content.="<tr class='n v$volgnr n$level totaal'><td style='padding-left:".(($level-1)*20)."px'><a $href>Totaal ".$post[$volgnr]->naam." <small>$volgnr</small></a></td><td>".
            n($fak * $som1)."</td><td><small>".
            n(($fak * $som1)/$somtot*100,1)."%</small></td><td>".
            n($fak * $som2  )."</td><td><small>".
            n(($fak * $som2)/$somtot2*100,1)."%</small></td></tr>";
    //}


    return $content.$subcontent;
}


calcboeknr(3000000,2);



//if (($btwtot+($btwvoordruk-$btwafgedragen)) < 0) {
//    $post[1212000]->subitems=$post[2220000]->subitems;
//    $post[2220000]->subitems=null;
//    //$post[1212000]->tot=$post[2220000]->tot;
//    //$post[1212000]->vorigsaldo=$post[2220000]->vorigsaldo;
//    //$post[2220000]->tot=null;

//}

//if (($btwtot+($btwvoordruk-$btwafgedragen)) < 0) {
//    $post[1212000]=$post[2220000];
//    $post[2220000]=null;
//}


    // Winstreserves bij boeken gebaseerd op winst
$post[2130000]->som+=-$post[300000000]->som;


calcboeknr(1);


//var_dump($post[2220000]->som);
//die();
if ($post[2220000]->som>0) {
    $post[1212000]->som=$post[2220000]->som;
    $post[1212000]->subitems=$post[2220000]->subitems;
    $post[2220000]->som=0;
    $post[2220000]->subitems=null;
}
if ($post[2220000]->vorigsaldo>0) {
    $post[1212000]->vorigsaldo=$post[2220000]->vorigsaldo;
    $post[2220000]->vorigsaldo=0;
} 
//calcboeknr(1);
//echo $post[1212000]->som.'>'.$post[2220000]->som;die();


//var_dump($post);


$jr.="<footer />";
$jr.="<table>";
$jr.=writeboeknr(1000000,1);
$jr.="</table><footer /><table>";
$jr.=writeboeknr(2000000,1,'',-1);
$jr.="</table><footer /><table>";
$jr.=utf8_encode(writeboeknr(3000000,1,'',1,$post[311100000]->som,$post[311100000]->vorigsaldo));
$jr.="</table>";

$jr.="<footer />";
//$jr.="<h1>Toelichting op de jaarrekening</h1>";
//$jr.=file_get_contents("jv_toelichting_$bedrijf.htm");
//$jr.=file_get_contents("jv_toelichting.htm");

//$jr.=file_get_contents('jv_overigegegevens.htm')
//    //.date("d-m-Y")
//    ."</p>";

//$jr.="<footer />";

if (isset($_GET[toe])) {
    $jr.="<div class='toe'>";
    $jr.= $toe;
    $jr.="</div>";
}

$jr = str_replace('$jaar',$jaar,$jr);
$jr = str_replace('#datum#',date("d-m-Y"),$jr);
$jr = str_replace('$bedrijf',$bedrijf,$jr);
echo $jr;
//exit();


if (isset($_GET[save])) {
    foreach ($post as $key => $data) if ($key > 3 && $data->som) {
        $q.="EXEC postUpdateJaar '$key','$bedrijf',".$data->som.",".$jaar.";";
    }
    db(aim)->query($q);
    file_put_contents("jaarverslag $bedrijf $jaar.htm",$jr);
}




?>