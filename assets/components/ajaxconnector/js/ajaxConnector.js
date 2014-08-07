function ajaxRpc(strMethod, objParams, intId, callback, strLocalhost, target) {
    var xmlHttp;

    if(window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlHttp = new XMLHttpRequest();
    }
    else { // code for IE6, IE5
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xmlHttp.onreadystatechange = function() {
        if(4 == xmlHttp.readyState && 200 == xmlHttp.status && '' != xmlHttp.responseText) {
            try {
                xmlHttp.responseJSON = JSON.parse(xmlHttp.responseText);
            }
            catch(objException) {
                xmlHttp.responseJSON = {
                    "jsonrpc": '2.0'
                    , "error": {
                        "code": -32700
                        , "message": "Parse error"
                        , "data":    objException.message
                    }
                    , "id": intId
                };
            }
            //console.log(xmlHttp.responseJSON);
            callback(xmlHttp.responseJSON, target);
        }
    };
    xmlHttp.open('POST', strLocalhost + '/assets/components/ajaxconnector/index.php');
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlHttp.send(JSON.stringify({
        jsonrpc: '2.0'
        , method: strMethod
        , params: objParams
        , id: intId
    }));
}