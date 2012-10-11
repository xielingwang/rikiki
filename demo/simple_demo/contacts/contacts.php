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
    if (in_array($method, array('PUT','POST'))) {
        $raw = file_get_contents('php://input');
        $_POST = json_decode($raw, true);
    }
}
$map = array(
    'GET' => 'query',
    'PUT' => 'update',
    'POST' => 'create',
    'DELETE' => 'delete',
);
$action = $map[$method];
if (isset($_GET['action'])) $action = $_GET['action'];

if (isset($_GET['process_style']) and $_GET['process_style'] == 'http-status') 
    header($messages[$code], true, $code);

    session_start();
if (!isset($_SESSION['contacts'])) {
    $contacts = array();
    $emails = array('gmail','yahoo','126','163','foxmail');
    $strings = "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; rejoiceth not in iniquith, but rejoiceth in the truth; beareth all things, believeth all things, hopeth all things, endureth all things. Charity never faileth";
    $words = preg_split("/[\s,;\.]+/i", ucwords($strings));
    for($i = 1; $i <= 50; $i++) {
        $first_index = rand(0, sizeof($words) - 1);
        $last_index = rand(0, sizeof($words) - 1);
        $firstname = $words[$first_index];
        $lastname = $words[$last_index];
        $contacts[] = array(
            'id' => uniqid(),
            'first_name' => $firstname,
            'last_name' => $lastname,
            'telephone' => rand(1300,1899).rand(1000000, 9999999),
            'email' => strtolower($firstname . '_' . $lastname).'@'.$emails[rand(0, sizeof($emails) - 1)].'.com',
            );
    }
    $_SESSION['contacts'] = $contacts;
}
$contacts = $_SESSION['contacts'];

function contact_filter($item) {
    foreach ($item as $k => $v) {
        if ($k == 'id') continue;
        if (stripos($v, $_GET['keywords']) !== false)
            return true;
    }
}

$optioned = array('telephone','email');
$needed = array('first_name','last_name');
switch($action) {
    case 'query':
    default:
    if (empty($_GET['id'])) {
        if (isset($_GET['keywords']) and trim($_GET['keywords']))
            $contacts = array_filter($contacts, 'contact_filter');
        echo json_encode(array('total' => sizeof($contacts), 'list' => array_values($contacts)));
    }
    else {
        foreach($contacts as $v) {
            if ($v['id'] == $_GET['id']) {
                echo json_encode($v);
                return;
            }
        }
        header($messages[404], true, 404);
    }
    break;
    case 'create':
    $contact = array();
    foreach($needed as $key) {
        if (empty($_POST[$key])) {
            header($messages[400], true, 400);
            echo json_encode(array('msg' => $key, 'action' => $action, 'raw' => $raw));
            return;
        }
        $contact[$key] = $_POST[$key];
    }
    foreach($optioned as $key) {
        if (empty($_POST[$key])) continue;
        $contact[$key] = $_POST[$key];
    }
    $contact['id'] = uniqid();
    $contacts[] = $contact;
    $_SESSION['contacts'] = $contacts;
    break;
    case 'update':
    if (empty($_GET['id']))
        header($messages[400], true, 400);
    else {
        $found = false;
        foreach($contacts as $k => $v) {
            if ($v['id'] == $_GET['id']) {
                $found = true;
                break;
            }
        }
        if ($found) {
            foreach(array_merge($optioned, $needed) as $key) {
                if (empty($_POST[$key])) continue;
                $contacts[$k][$key] = $_POST[$key];
            }
        }
        else {
            header($messages[404], true, 404);
        }
    }
    $_SESSION['contacts'] = $contacts;
    break;
    case 'delete':
    if (empty($_GET['id']))
        header($messages[400], true, 400);
    else {
        $found = false;
        foreach($contacts as  $k => $contact) {
            if ($contact['id'] == $_GET['id']) {
                $found = true;
                break;
            }
        }
        if ($found) unset($contacts[$k]);
        else
            header($messages[201], true, 201);
    }
    $_SESSION['contacts'] = $contacts;
    break;
}