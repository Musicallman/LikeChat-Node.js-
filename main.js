$(function () {

    const socket = new WebSocket("ws://127.0.0.1:8081");
    socket.onopen = function () {
        console.log('успешно открыт');
    };

    getMessage();
    setTimeout(function () {
        $('body, html').scrollTop($(document).height());
    }, 300);


    $('#send, .send').click(function (e) {
        e.preventDefault();
        postMessage();
    });


    socket.onmessage = function (p1) {

        //console.log(p1);
        let data = JSON.parse(p1.data);
        $('.messages').append(`<div class="message">
                                            <div class="username">${data['username'] }</div>
                                            <div class="text">${data['message']}</div>
                                            <div class="time">${data['time']}</div>
                                   </div>`);

    };


    function postMessage() {
        let username = encodeHTML($('#username').val()),
            message = encodeHTML($('#text').val()),
            date = new Date(),
            minutes,
            time = `${date.getHours()}:`;
        minutes = date.getMinutes();

        minutes <= 9 ? time = `${date.getHours()}:0${minutes}` : time = `${date.getHours()}:${minutes}`;


        if (username === '' || message === '') {
            alert('Заполните все поля!');
            return;
        }
        $('#text').val('');
        let user = {
            username: username,
            message: message,
            time: time
        };

        let juser = JSON.stringify(user);

        socket.send(juser);

    }

});


function encodeHTML(raw) {

    return raw.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';');
}


function getMessage() {
    $.get('http://127.0.0.1:3131', function (data) {
        let parsedata = JSON.parse(data);
        console.log(data);
        let i = 0;
        for (const key in parsedata) {
            i++;
        }
        $('.messages').html('');
        for (let k = 0; k < i; k++) {
            $('.messages').append(`<div class="message">
                                            <div class="username">${parsedata[k]['username'] }</div>
                                            <div class="text">${parsedata[k]['message']}</div>
                                            <div class="time">${parsedata[k]['date']}</div>
                                   </div>`);
        }
    });
}

//


