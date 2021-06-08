<?php
// =======================================================================================================================================
// =======================================================================================================================================
// BEREKENINGEN


// Vaste Activa
$vasteactiva=0;


// VORDERINGEN

$bij .= "<a name='debiteuren'></a>";
$bij .= t(h2,'Debiteuren');

$vorderingen += $debiteuren;

//echo t(div,l('Vorderingen','#debiteuren').t(span,n($vorderingen)) . t(span,n(0)) . t(span,n(0)) . t(span,n(0)) );

// =======================================================================================================================================
// Liquide middelen
// BANK
$liquidemiddelen = $bank+$kas;

$activa = $vasteactiva+$vorderingen+$liquidemiddelen;

// PASSIVA

// Lang lopende schulden
$langlopendeschulden+=$schuldengroepsmaatschappijen;

// kortlopende schulden
// Crediteuren
$kortlopendeschulden-=$crediteuren;

// Eigenvermogen
$eigenvermogen = @activa+$vorderingen+ $liquidemiddelen-$langlopendeschulden-$kortlopendeschulden;



$kortetermijnmiddelen=$bank+$kas+$vorderingen;
$langetermijnmiddelen=$eigenvermogen+$langlopendeschulden;

?>