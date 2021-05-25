<?php
require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v1/connect.php');
require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v1/db.php');
$get=(object)$_GET;
$hostID=1;
$classID=1010;
$get->top=9999;
$names="keyname,subject,summary,msg,errmsg,mailmsg";


$class=fetch_object(query("SELECT id,config FROM om.class WHERE id=$classID;"));
$class->config=json_decode($class->config);

$q="
    SET NOCOUNT ON;
    SELECT I.keyname,p.* 
    FROM (SELECT * FROM api.fieldspivot($hostID,$classID)) X PIVOT(max(value) 
    FOR name in ($names)) P 
    INNER JOIN api.items I ON I.id=P.id;
";
echo $q;
$res = query($q);
while ($row=fetch_object($res)) $items->{$row->keyname}=$row;
//echo json_encode($items);

$res = query("SELECT TOP $get->top name as keyname,subject,summary,msg,errmsg,mailmsg FROM aim.cfg.msg_");

while ($row=fetch_object($res)) {
    $q=$l='';
    foreach ($class->config->fields as $key => $field) if (isset($row->$key) && $row->$key!=$items->{$row->keyname}->$key) {
         $field=(object)array(classID=>$field->classID,value=>$row->{$key}); 
        $l.="$key=$field->value;"; 
        $q.=prepareexec("api.itemfieldPost @id=@id,@name='".dbvalue($key)."',@hostId=$hostID,",$field); 
    }
    if ($q){
        $q=PHP_EOL."SET NOCOUNT ON;DECLARE @id INT;EXEC api.itemlinkget @classID=$class->id,@hostId=$hostID,@keyname='$row->keyname',@id=@id OUTPUT;$q;SELECT @id AS id;";
        echo PHP_EOL.$l;
        $item=fetch_object(query($q));
        //echo json_encode($item);
        itemGet(array(id=>$item->id,autohostID=>$hostID,all=>0));
    }
}
?>