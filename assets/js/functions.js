'use strict'

function NewTask(content, isDone) {
	this.content = content;
	this.isDone = isDone;
}

$(document).ready(function () {

	if(localStorage.getItem('arrLocal') != undefined) {
		arr = JSON.parse(localStorage.getItem('arrLocal'));

		createElementFromStorage();
	}

	function createElementFromStorage() {
		for (var i = 0; i < arr.length; i++) {
			var newLi = document.createElement('li');
			newLi.innerHTML = arr[i].content;
			$('.list').append(newLi);
			newLi.setAttribute('data-index', i);
			var index = newLi.getAttribute('data-index');
			newLi.onclick = functionIsDone;

			if (JSON.parse(localStorage.getItem('arrLocal'))[i].isDone == true) {
				newLi.classList.add('strike');
				newLi.innerHTML = "Выполнено";
			}
		}
	}


	$('#btn').click(function () {
		var value = $('input').val();

		if (value == '') {
			alert(":(");
			return false;
		} 

		$('input').val("");

		var newTask = new NewTask(value, false);
		arr.push(newTask);
		
		var arrInJSONFormat = JSON.stringify(arr); // преобразовываеем в понятный вид ДЖЕЙСОНА
		localStorage.setItem('arrLocal', arrInJSONFormat); // устанавлиаем локал
		
		createElement(value, arr.length - 1);
	})
});


function createElement(value, index) {
	var Elem = document.createElement('li');
	Elem.innerHTML = value;
	Elem.setAttribute('data-index', index)
	Elem.onclick = functionIsDone;
	$('.list').append(Elem);
}

function functionIsDone() {
	var index = $(this).attr('data-index');

	$(this).addClass('strike');

	var self = $(this);

	setTimeout(function () {
		self.text("Выполнено")
	}, 2000);

	arr[index].isDone = true;
	var arrInJSONFormat = JSON.stringify(arr); // преобразовываеем в понятный вид ДЖЕЙСОНА
	localStorage.setItem('arrLocal', arrInJSONFormat); // устанавлиаем локал

}

$('#sendAjax').click(function () {
	var JSONArrAjax = JSON.stringify(arr);

	if(arr.length != 0) {
		
		$.ajax({
			type: "POST",
			url: root + '/posts',
			data: JSONArrAjax
		}).done(function () {
			alert("На сервер ушли данные в формате JSON:" + JSONArrAjax);
		}).fail(function (){
			alert("Oooooooops") // на любой левый сервер работает
		})

	} else {
		alert("Oooooooooooooops");
	}
})

$('#clear').click(function () {
	localStorage.clear();
	arr.length = 0;
	$('.list').empty();
})



function sendDataToServerByWebSockets() {

	if(arr.length != 0) {

	    websocket = new WebSocket(wsUri);
	    websocket.onopen = function (evt) {
	        onOpen(evt)
	    };
	    websocket.onclose = function (evt) {
	        onClose(evt)
	    };
	    websocket.onmessage = function (evt) {
	        onMessage(evt)
	    };
	    websocket.onerror = function (evt) {
	        onError(evt)
	    };

	} else {
		alert("Ooooooooooops #2");
	}
}

function onOpen() {
    writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
}


function onClose() {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToScreen('RESPONSE: ' + evt.data);
    websocket.close();
}

function onError(evt) {
    writeToScreen('ERROR: ' + evt.data);
}

function doSend(message) {
    message = JSON.stringify(arr);
    writeToScreen("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message) {
    console.log(message);
}