<?php
/**
 * Ajax Connector - Connects to packages in "core/components" and runs processors defined in "core/components/mypackage/processors/web/..."
 * Based on: http://www.virtudraft.com/blog/ajaxs-connector-file-using-modxs-main-index.php.html
 *
 * This implementation follows the JSON-rpc 2.0 specifications:
 * http://www.jsonrpc.org/specification
 *
 * @version 2014-08-07
 */

// Start the output buffer to catch all output before the actual content returned from the remote procedure call,
//  so it can be discarded instead of corrupting the AJAX JSON output
ob_start();

// Error codes: http://www.jsonRpc.org/specification#error_object
$arrRpcErrorDefinitions = array(
    -32700   => 'Parse error'
    , -32600 => 'Invalid Request'
    , -32601 => 'Method not found'
    , -32602 => 'Invalid params'
    , -32603 => 'Internal error'
);

$intRpcError = null;
$arrErrorData = array('strMessage' => 'No error-data available.');

// Get data from client
$strJsonRequest = file_get_contents('php://input');

// Decode JSON-RPC request
$arrRequest = json_decode($strJsonRequest, true);

if(!$arrRequest) {
    // Return parse error
    $intRpcError = -32700;
}

if(!empty($arrRequest['method'])) {
    @session_cache_limiter('public');
    define('MODX_REQP', false);
}

define('MODX_API_MODE', true);
if(array_key_exists('CONTEXT_DOCUMENT_ROOT', $_SERVER)) {
    $strRootPath = $_SERVER['CONTEXT_DOCUMENT_ROOT'];
}
else {
    $strRootPath = $_SERVER['DOCUMENT_ROOT'];
}
require_once $strRootPath . '/index.php';
/** @var $modx \modX */

if(is_array($arrRequest)
    && array_key_exists('method', $arrRequest)
    && (substr($arrRequest['method'], 0, 4) === 'web/')
    && file_exists(MODX_CORE_PATH . 'components/' . $arrRequest['id'] . '/processors/' . $arrRequest['method'] . '.php')
) {
    $arrVersion = $modx->getVersionData();
    if (version_compare($arrVersion['full_version'], '2.1.1-pl') >= 0) {
        if($modx->user->hasSessionContext($modx->context->get('key'))) {
            $_SERVER['HTTP_MODAUTH'] = $_SESSION['modx.' . $modx->context->get('key') . '.user.token'];
        }
        else {
            $_SESSION['modx.' . $modx->context->get('key') . '.user.token'] = 0;
            $_SERVER['HTTP_MODAUTH'] = 0;
        }
    }
    else {
        $_SERVER['HTTP_MODAUTH'] = $modx->site_id;
    }
    $_REQUEST['HTTP_MODAUTH'] = $_SERVER['HTTP_MODAUTH'];

    // Define the output array
    $arrOutput = null;

    // Run the processor (Builds the output array)
    try {
        require_once MODX_CORE_PATH . 'components/' . $arrRequest['id'] . '/processors/' . $arrRequest['method'] . '.php';
    }
    catch(FailException $objException) {
        // Do nothing
    }

    // Build output array in JSON-Rpc 2.0 format
    if(array_key_exists('id', $arrRequest)) {
        $arrJsonOutput = array(
            'jsonrpc'  => '2.0'
            , 'result' => $arrOutput
            , 'id'     => $arrRequest['id']
        );

    }

}
else {
    // Return "Method does not exist"
    $intRpcError = -32601;
}

if(!is_null($intRpcError)) {
    $arrJsonOutput = array(
        'jsonrpc' => '2.0'
        , 'error' => array(
            'code'      => $intRpcError
            , 'message' => $arrRpcErrorDefinitions[$intRpcError] . ' ('.$arrRequest['method'].')'
            , 'data'    => $arrErrorData
        )
        , 'id'    => $arrRequest['id']
    );
}

// Clear the output buffer of any output generated along the way, as it will break the client-side JSON decoding
ob_end_clean();

// Only respond if id was provided (Else we assume Notification)
if(is_array($arrRequest) && array_key_exists('id', $arrRequest)) {
    echo json_encode($arrJsonOutput);
}
