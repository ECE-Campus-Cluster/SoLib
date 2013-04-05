window.onload = function () {
    var canvas    = document.getElementById('lessonCanvas')
    , users       = $('#users')
    , socket      = io.connect("http://solib.hopto.org:8080")
    , solibClient = new SolibClient(canvas, socket)
    //, solibSlide  = new SolibSlide(canvas)

    // Socket.IO events handler
    socket.on('lesson_infos', function (data) {
        $('#lesson_name').text(data.lesson.name)
        solibClient.slidesArray = data.lesson.slides
        for (var s=0 ; s<data.lesson.slides.length ; s++) {
            appendToSlideList(s)
        }
        // Render first slide on loading
        console.log(data.lesson.slides[0].id)
        solibClient.renderSlide(data.lesson.slides[0])
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

    socket.on('new_drawing', function (drawing) {
        solibClient.renderDrawing(drawing)
    });

    socket.on('new_slide', function (slide) {
        solibClient.slidesArray.push(slide)
        appendToSlideList(slidesArray.length)
    });

    /* Dropdown menu */
    $('.dropdown-toggle').dropdown();

    /* Add new slide */
    $('#new-slide').click(function () {
        //var slide = appendToSlideList(slidesArray.length)
        //window.location.hash = slide.id
        socket.emit("new_slide", { position: solibClient.slidesArray.length })
    });
}

function createSlidePreview(id) {
    var newSlide        = document.createElement('li')
    var thumbnail       = document.createElement('div')
    var imgPreview      = document.createElement('img')
    var center          = document.createElement('center')
    var title           = document.createElement('h3')

    newSlide.className  = "span12"
    newSlide.id         = id + 1
    thumbnail.className = "thumbnail"
    imgPreview.src      = "slide.png"
    imgPreview.width    = "55"
    title.innerHTML     = "Slide #" + newSlide.id

    center.appendChild(title)
    thumbnail.appendChild(imgPreview)
    thumbnail.appendChild(center)
    newSlide.appendChild(thumbnail)

    return newSlide;
}

function appendToSlideList(id) {
    var newSlide = createSlidePreview(id)
    document.getElementById('slides').appendChild(createSlidePreview(id))
    return newSlide
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