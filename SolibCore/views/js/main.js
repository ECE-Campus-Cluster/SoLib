window.onload = function () {
    var canvas    = document.getElementById('lessonCanvas')
    , users       = $('#users')
    , socket      = io.connect("http://solib.hopto.org:8080")
    , solibClient = new SolibClient(canvas, socket)
    , solibSlide  = new SolibSlide(canvas)
    , slidesArray = {};

    // Socket.IO events handler
    socket.on('lesson_infos', function (data) {
        $('#lesson_name').text(data.lesson.name)
        slidesArray = data.lesson.slides
        console.log(slidesArray)
        // Build slides
        for (var s=0 ; s<data.lesson.slides.length ; s++) {
            appendToSlideList(s)
            // Build drawings
            for (var d=0 ; d<data.lesson.slides[s].drawings.length ; d++) {
                solibClient.renderDrawing(data.lesson.slides[s].drawings[d])
            }
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

    socket.on('coucou', function(data) {
        console.log("coucou");
    })

    socket.on('new_drawing', function (data) {
        solibClient.renderDrawing(data)
    });

    socket.on('new_slide', function(data) {
        appendToSlideList(slidesArray.length)
    });

    /* Dropdown menu */
    $('.dropdown-toggle').dropdown();

    /* Add new slide */
    $('#new-slide').click(function(){
        var slide = appendToSlideList(slidesArray.length)
        window.location.hash = slide.id
        
        var newSlide = {
            drawings: new Array({
                points: new Array()
            })
        }
        slidesArray.push(newSlide);

        socket.emit('new_slide', { slide: newSlide })

    });
}

function createSlidePreview(id) {
    var newSlide        = document.createElement('li')
    var thumbnail       = document.createElement('div')
    var imgPreview      = document.createElement('img')
    var center          = document.createElement('center')
    var title           = document.createElement('h3')

    newSlide.className  = "span12"
    newSlide.id         = id+1
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