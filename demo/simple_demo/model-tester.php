<?php
/*
if (isset($_GET['action'])) {
    echo $_GET['action'] . "(" . json_encode(array('nick' => 'ADAMN')) . ')';
    return;
}*/

$messages = array(
    // Informational 1xx
    100 => 'Continue',
    101 => 'Switching Protocols',

    // Success 2xx
    200 => 'OK',
    201 => 'Created',
    202 => 'Accepted',
    203 => 'Non-Authoritative Information',
    204 => 'No Content',
    205 => 'Reset Content',
    206 => 'Partial Content',

    // Redirection 3xx
    300 => 'Multiple Choices',
    301 => 'Moved Permanently',
    302 => 'Found',  // 1.1
    303 => 'See Other',
    304 => 'Not Modified',
    305 => 'Use Proxy',
    // 306 is deprecated but reserved
    307 => 'Temporary Redirect',

    // Client Error 4xx
    400 => 'Bad Request',
    401 => 'Unauthorized',
    402 => 'Payment Required',
    403 => 'Forbidden',
    404 => 'Not Found',
    405 => 'Method Not Allowed',
    406 => 'Not Acceptable',
    407 => 'Proxy Authentication Required',
    408 => 'Request Timeout',
    409 => 'Conflict',
    410 => 'Gone',
    411 => 'Length Required',
    412 => 'Precondition Failed',
    413 => 'Request Entity Too Large',
    414 => 'Request-URI Too Long',
    415 => 'Unsupported Media Type',
    416 => 'Requested Range Not Satisfiable',
    417 => 'Expectation Failed',

    // Server Error 5xx
    500 => 'Internal Server Error',
    501 => 'Not Implemented',
    502 => 'Bad Gateway',
    503 => 'Service Unavailable',
    504 => 'Gateway Timeout',
    505 => 'HTTP Version Not Supported',
    509 => 'Bandwidth Limit Exceeded'
);

// TODO:dfsf
$method = "GET";
if (!empty($_SERVER['REQUEST_METHOD'])) {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'PUT')
        $_POST = json_decode(file_get_contents('php://input'));
}
$map = array(
    'GET' => 'query',
    'PUT' => 'update',
    'POST' => 'create',
    'DELETE' => 'delete',
);
$action = $map[$method];
if (isset($_GET['action'])) $action = $_GET['action'];

$code = isset($_GET["code"]) ? $_GET["code"] : 200;
if (isset($messages[$code])) {
    if (isset($_GET['process_style']) and $_GET['process_style'] == 'http-status') 
        header($messages[$code], true, $code);

    if (isset($_GET['output']) and $_GET['output'] == 'xml') {
        $xml = new SimpleXmlElement("<?xml version='1.0' standalone='yes'?><data></data>");
        $xml->status = $code;
        $xml->message = $messages[$code].$code;
        $xml->action = $action;
        $xml->method = $method;
        $xml->post = $_POST;
        $xml->get = $_GET;
        echo $xml->asXML();
    }
    else{
    	echo json_encode(array('action' => $action, 'method' => $method, 'post' => $_POST, 'get' => $_GET, 'status' => $code, 'message' => $messages[$code].$code));
    }
}