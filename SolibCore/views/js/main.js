window.onload = function () {
    var canvas    = document.getElementById("lessonCanvas")
    , usersList   = document.getElementById("users")
    , socket      = io.connect("http://solib.hopto.org:8080")
    , solibClient = new SolibClient(canvas, socket)
    //, solibSlide = new SolibSlide(canvas)

    // Socket.IO events handlers
    socket.on("lesson_infos", function (data) {
        document.getElementById("lesson_name").innerHTML = data.lesson.name
        solibClient.setSlidesArray(data.lesson.slides)

        for (var s=0 ; s<data.lesson.slides.length ; s++)
            appendToSlidesPreview(data.lesson.slides[s].id, data.lesson.slides[s].position)

        // Render first slide on loading
        solibClient.renderSlide(data.lesson.slides[0])
        $("li[data-position=0]").attr("active", true)

        // Binding click on current slide
        $("ul.thumbnails#slides li.span12").click(function () {
            $("ul.thumbnails#slides li.span12").attr("active", false)
            $(this).attr("active", true)
            solibClient.renderSlide(solibClient.getSlidesArray()[$(this)[0].getAttribute("data-position")])
        });

        // Teacher stuff
        solibClient.setTeacher(data.user.isTeacher)
        if (data.user.isTeacher) {
            $(".dropdown-toggle").dropdown()
            $('.color').colorpicker().on('changeColor', function (ev) {
                bodyStyle.backgroundColor = ev.color.toHex();
            });
            // Add new slide
            $("#new-slide").click(function () {
                socket.emit("new_slide", { position: solibClient.getSlidesArray().length })
                window.location.hash = solibClient.getSlidesArray().length
            });
            // Remove slide
            $("#remove").click(function () {
                socket.emit("remove_slide", { idSlide: $("li[active=true]").attr("id"), position: $("li[active=true]").attr("data-position") })
            });
            $("#rubber").click(function () {
                $('#colorpicker').attr("value", "#ffffff")
                $("#color").css({ "background-color": "#ffffff" })
            });
            $("#small").click(function () {
                $("#pencil_width").attr("value", "2")
            });
            $("#medium").click(function () {
                $("#pencil_width").attr("value", "20")
            });
            $("#big").click(function () {
                $("#pencil_width").attr("value", "50")
            });
        }
    });

    socket.on("list_users", function (users) {
        usersList.innerHTML = ""
        for (var i=0 ; i<users.length ; i++) {
            var tr = document.createElement('tr')
            tr.id = users[i].id
            tr.innerHTML = users[i].firstname + " " + users[i].lastname
            usersList.appendChild(tr)
        }
    });

    socket.on("user_disconnected", function (user) {
        $('#'+user.id).remove()
    });

    socket.on("new_drawing", function (drawing) {
        if (drawing.idSlide == solibClient.getCurrentSlideId()) // Render drawing on current slide
            solibClient.renderDrawing(drawing)
        solibClient.getSlidesArray()[$("#" + drawing.idSlide).attr("data-position")].drawings.push(drawing)
    });

    socket.on("new_slide", function (slide) {
        solibClient.getSlidesArray().push(slide)
        appendToSlidesPreview(slide.id, solibClient.getSlidesArray().length - 1)

        $("ul.thumbnails#slides li.span12").click(function () {
            $("ul.thumbnails#slides li.span12").attr("active", false)
            $(this).attr("active", true);
            solibClient.renderSlide(solibClient.getSlidesArray()[$(this)[0].getAttribute("data-position")])
        });
    });

    socket.on("remove_slide", function (data) {
        solibClient.setSlidesArray(data.slides)
        $("#slides").html('')
        for (var s=0 ; s<data.slides.length ; s++)
            appendToSlidesPreview(data.slides[s].id, data.slides[s].position)
        //solibClient.renderSlide(solibClient.getC)
        $("ul.thumbnails#slides li.span12").click(function () {
            $("ul.thumbnails#slides li.span12").attr("active", false)
            $(this).attr("active", true);
            solibClient.renderSlide(solibClient.getSlidesArray()[$(this)[0].getAttribute("data-position")])
        });
    });

    // $("ul.thumbnails#slides").change(function() {

    //     $("ul.thumbnails#slides li.span12").click(function () {
    //         solibClient.renderSlide(solibClient.slidesArray[$(this)[0].getAttribute("data-position")])
    //     });
    // });
}




/**
* Create a slide via createSlidePreview
* and append it to the HTML list as a thumbnail.
*
* @param {int} id The slide id from DB, who will be the DOMElement id.
* @return {void}
*/
function appendToSlidesPreview (id, position) {
    $('#slides').append(createSlidePreview(id, position))
}

/**
* Create a HTML slide thumbnail.
*
* @param {int} id The id of the created element corresponding to the true slide id
* @return {DOMElement} The thumbnail
*/
function createSlidePreview (id, position) {
    var newSlide    = document.createElement('li')
    var thumbnail   = document.createElement('div')
    var imgPreview  = document.createElement('img')
    var center      = document.createElement('center')
    var title       = document.createElement('h3')

    newSlide.className  = "span12"
    newSlide.id         = id
    newSlide.setAttribute("data-position",position)
    thumbnail.className = "thumbnail"
    imgPreview.src      = "img/slide.png"
    imgPreview.width    = "55"
    var idSlide         = parseInt(newSlide.getAttribute("data-position")) + 1
    title.innerHTML     = "Slide " + idSlide

    center.appendChild(title)
    thumbnail.appendChild(imgPreview)
    thumbnail.appendChild(center)
    newSlide.appendChild(thumbnail)

    return newSlide
}

/**
* Open or close the users list.
* 
* @param {DOMElement} elem The HTML element to animate
* @return {void}
*/
function openConnectedUsers (element) {
    if ($("#popopen").length) {
        $(element).animate({ right: "-5px" }, 500)
        element.id = "popclose"
    } else {
        $(element).animate({ right: "-205px" }, 500)
        element.id = "popopen"
    }
}