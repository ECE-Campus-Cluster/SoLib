window.onload = function () {
    var users     = $('#users')
    , socket      = io.connect("http://solib.hopto.org:8080")
    , solibClient = new SolibClient('lessonCanvas', socket)
    // , solibSlide  = new SolibSlide($('canvas#lessonCanvas'))

    // Socket.IO events handler
    socket.on('lesson_infos', function (data) {
        $('#lesson_name').text(data.lesson.name)
        for (var i=0 ; i<data.lesson.drawings.length ; i++) {
            solibClient.renderDrawing(data.lesson.drawings[i])
        }
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
        solibClient.renderDrawing(data)
    });

    /* Dropdown menu */
    $('.dropdown-toggle').dropdown();
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