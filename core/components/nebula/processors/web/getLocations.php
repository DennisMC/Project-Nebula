<?php

require_once MODX_CORE_PATH . 'components/nebula/model/nebula.class.php';

/** @var modX $modx */
$objLocator = new \Nebula\Locator($modx);

// This variable is json encoded as the “result” in the ajax connector
$arrOutput = $objLocator->getLocations();
