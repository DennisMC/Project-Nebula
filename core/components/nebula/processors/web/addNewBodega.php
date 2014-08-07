<?php
require_once MODX_CORE_PATH . 'components/nebula/model/Nebula.class.php';

$objNebula = new Nebula($modx);

if(array_key_exists('newBodega', $arrRequest['params'])) {
//    $arrBodegaData = json_decode($arrRequest['params']['newBodega'], true);
    $arrOutput = "Ninja Test";

    // This variable is json encoded as the “result” in the ajax connector
//    $arrOutput = ->setNewBodea($arrBodegaData);
}
else {
    // Return with parameters error
    $intRpcError = -32602;
}
