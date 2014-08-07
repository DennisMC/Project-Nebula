<?php

require_once MODX_CORE_PATH . 'components/nebula/model/nebula.class.php';

/** @var modX $modx */
$objLocator = new \Nebula\Locator($modx);

if(array_key_exists('newLocation', $arrRequest['params'])) {
    $arrLocationData = json_decode($arrRequest['params']['newLocation'], true);
    //$arrOutput = "Ninja Test";

    // This variable is json encoded as the “result” in the ajax connector
    $arrOutput = $objLocator->getLocations();
}
else {
    // Return with parameters error
    $intRpcError = -32602;
}
