<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/aim/api/connect.php');
$db[aim]->dbname='aliconadmin';
$get=(object)$_GET;


$res = db(aim)->query("SELECT '1-1-$get->jaar' datum,sum(bedrag) bedrag,boeknr,post,'Beginbalans' as omschrijving FROM balans.boeking where boeknr<200000 and jaar<$get->jaar and bedrijf = '$get->bedrijf' group by boeknr,post order by boeknr ");
while ($row = db(aim)->fetch_object($res)) {
    if (!$posten->{$row->post}) $posten->{$row->post}->rows=array();
    array_push($posten->{$row->post}->rows,$row);
}


$res = db(aim)->query("SELECT * FROM balans.boeking WHERE bedrijf='$get->bedrijf' AND jaar=$get->jaar ORDER BY bedrijf,boeknr,datum");
while ($row = db(aim)->fetch_object($res)) {
    $row->rel=array();
    $post->{$row->id} = $row;
    if (!$posten->{$row->post}) $posten->{$row->post}->rows=array();
    array_push($posten->{$row->post}->rows,$post->{$row->id});
}

//$res = db(aim)->query("SELECT * FROM balans.koppel WHERE bedrijf='$get->bedrijf' AND jaar=$get->jaar");
$res = db(aim)->query("SELECT * FROM balans.koppel WHERE bedrijf='$get->bedrijf' ");
while ($row = db(aim)->fetch_object($res)) {
    array_push($post->{$row->id}->rel,$row);
}
$data->posten=$posten;
$data->post=$post;

$body=file_get_contents('verslag.htm');
$body=str_replace('</head>','<script>data='.json_encode($data).'</script></head>',$body);
exit($body);

//exit()

//$res = db(aim)->query("SELECT * FROM balans.credet WHERE bedrijf='$get->bedrijf' AND jaar=$get->jaar ORDER BY bedrijf,link,post,datum");
//while ($row = db(aim)->fetch_object($res)) {
//    if ($row->post) {
//        if (!$posten->{$row->post}) $posten->{$row->post}->rows=array();    
//        if (!$boek->{$row->id}) {
//            $boek->{$row->id}=(object)array(debet=>array(), credet=>array(), id=>$row->id);
//            array_push($posten->{$row->post}->rows,$boek->{$row->id});
//        }
//        array_push($boek->{$row->id}->credet,$row);
//    }
//    else{
//        //if (!$boek->{$row->id}->debet) echo "E";
//        array_push($boek->{$row->id}->debet,$row);
//    }
//}

//$res = db(aim)->query("SELECT * FROM balans.debet WHERE bedrijf='$get->bedrijf' AND jaar=$get->jaar ORDER BY datum");
//while ($row = db(aim)->fetch_object($res)) {
//}

//$res = db(aim)->query("SELECT * FROM balans.post WHERE bedrijf='$get->bedrijf' AND jaar=$get->jaar ORDER BY datum");
//while ($row = db(aim)->fetch_object($res)) {
//    if (!$post->{$row->BoekNrEnOms}) $post->{$row->BoekNrEnOms}=(object)array(rows=>array());    
//    $boek->{$row->boekingId}=(object)array(debet=>array(),credet=>array(),id=>'boek'.$row->boekingId);
//    array_push($post->{$row->BoekNrEnOms}->rows,$boek->{$row->boekingId});
//    array_push($boek->{$row->boekingId}->debet,$row);
//    if ($row->kas==k) {
//        $kas->{$row->boekingId}=(object)array(debet=>array(),credet=>array(),id=>'kas'.$row->boekingId);
//        array_push($post->kas->rows,$kas->{$row->boekingId});
//        array_push($kas->{$row->boekingId}->debet,$row);
//        array_push($kas->{$row->boekingId}->credet,$row);
//        array_push($boek->{$row->boekingId}->credet,$row);
//    }
//}

//$res = db(aim)->query("SELECT * FROM balans.bankboek WHERE bedrijf='$get->bedrijf' AND jaar=$get->jaar ORDER BY datum");
//while ($row = db(aim)->fetch_object($res)) {
//    $row->credethref = "bank".$row->bankId; 
//    array_push($bank->{$row->bankId}->credet,$row);
//    array_push($boek->{$row->boekingId}->credet,$row);
//}

//var_dump($boek);


//echo "$jr<table>";
//foreach ($posten as $postnaam => $post) {
//    echo "<tr><td colspan=50><h2>$postnaam</h2></td></tr>";
//    foreach ($post as $row) {
//        $bedrag = $row->bedrag;
//        echo "<tr><td><a name='$row->id'></a>$row->datum</td><td>$row->omschrijving</td><td>$row->bedrag</td><td></td></tr>";
//        foreach ($row->debet as $debet) {
//            $bedrag+=$debet->bedrag;
//            echo "<tr><td>".(($debet->datum!=$row->datum)?$debet->datum:'')."</td><td><a href='#$debet->link'>$debet->omschrijving</a></td><td></td><td>$debet->bedrag</td></tr>";
//        }
//        if ($bedrag)
//    }
//    //    if ($boekrow->deb) {
//    //        foreach ($boekrow->debet as $row) {
//    //        }
//    //        foreach ($boekrow->credet as $row) {
//    //            echo "<tr><td></td><td><a href='#$row->credethref'>$row->credetOms</a></td><td></td><td>".(-$row->bedrag)."</td></tr>";
//    //        }
//    //    }
//    //    else {
//    //        foreach ($boekrow->debet as $row) {
//    //            echo "<tr><td>$row->datum</td><td>$row->debetOms</td><td>$row->bedrag</td><td></td></tr>";
//    //        }
//    //        foreach ($boekrow->credet as $row) {
//    //            echo "<tr><td></td><td><a href='#$row->credethref'>$row->credetOms</a></td><td></td><td>".(-$row->bedrag)."</td></tr>";
//    //        }
//    //    }
//    //}
//    //foreach ($boek->credet as $row) {
//    //    echo "<tr><td>$row->datum</td><td>$row->omschrijving</td><td>$row->bedrag</td><td></td></tr>";
//    //}
//}
//echo "</table>";



?>