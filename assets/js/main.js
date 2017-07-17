'use strict'

var websocket;
var wsUri = "ws://echo.websocket.org";
var arr = [];
var root = 'https://jsonplaceholder.typicode.com';

$('#sendWebSockets').on('click', sendDataToServerByWebSockets);