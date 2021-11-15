<?php
require_once($_SERVER['DOCUMENT_ROOT']."/../vendor/autoload.php");
use Dompdf\Dompdf;

$dompdf = new Dompdf();
$dompdf->set_option('isRemoteEnabled', TRUE);
$dompdf->load_html(file_get_contents('php://input'));
$dompdf->set_paper("a4");
// $dompdf->setBasePath($this->projectDir . DIRECTORY_SEPARATOR . 'www');
// $dompdf->set_base_path($_SERVER['DOCUMENT_ROOT']'https://aliconnect.nl/aliconnect/aliconnect.sdk/src/css/pdf.css');
$dompdf->render();
$dompdf->stream("HALLO.pdf", array("Attachment" => false));
