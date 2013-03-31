window.onload = function () {
    var users  = $('#users')
    , socket   = io.connect("http://solib.hopto.org:8080")
    , solib    = new SolibClient('lessonCanvas', socket)

    // Socket.IO events handler
    socket.on('lesson_infos', function (data) {
        $('#lesson_name').text(data.lesson_name)
    });

    socket.on('list_users', function (data) {
        users[0].innerHTML = ""
        for (var i=0 ; i<data.users.length ; i++) {
            var tr = document.createElement('tr')
            tr.id = data.users[i].id
            tr.innerHTML = data.users[i].firstname + " " + data.users[i].lastname
            users.append(tr)
        }
    });

    socket.on('user_disconnected', function (data) {
        $('#'+data.user.id).remove()
    });

    socket.on('new_drawing', function (data) {
        solib.drawFromPoints(data.points)
    });
}

function openConnectedUsers(element) {
    if ($("#popopen").length) {
        $(element).animate({
          right: "-5px"
        }, 500);
        element.id = "popclose"
    }
    else {
        $(element).animate({
          right: "-205px"
        }, 500);
        element.id = "popopen"
    }
}