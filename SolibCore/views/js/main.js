window.onload = function () {
    var canvas     = document.getElementById("lessonCanvas")
    , usersList    = document.getElementById("users")
    , socket       = io.connect("http://solib.hopto.org:8080")
    , solibClient  = new SolibClient(canvas, socket)
    //, solibSlide = new SolibSlide(canvas)

    // Socket.IO events handlers
    socket.on("lesson_infos", function (lesson) {
        document.getElementById("lesson_name").innerHTML = lesson.name
        solibClient.slidesArray = lesson.slides
        for (var s=0 ; s<lesson.slides.length ; s++)
            appendToSlidesPreview(s)
        solibClient.renderSlide(lesson.slides[0]) // Render first slide on loading
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
        // TODO add idSlide to drawing object
        // Drawing has been made on current slide for current user
        //if (drawing.idSlide == solibClient.currentSlideId)
            solibClient.renderDrawing(drawing)
        // Drawing has been made on another slide
        //else solibClient.slidesArray[drawing.idSlide].drawings.push(drawing)
    });

    socket.on("new_slide", function (slide) {
        solibClient.slidesArray.push(slide)
        appendToSlidesPreview(solibClient.slidesArray.length - 1)
    });

    // Dropdown menu
    $(".dropdown-toggle").dropdown();

    // Add new slide
    $("#new-slide").click(function () {
        socket.emit("new_slide", { position: solibClient.slidesArray.length })
        window.location.hash = solibClient.slidesArray.length
    });

    // Change current slide
    $(".thumbnail").click(function () {
        console.log('slide click')
        solibClient.renderSlide(solibClient.slidesArray[$(this).id])
    });

    // Connected users list animation
    $("#popopen").click(function () {
        openConnectedUsers($(this))
    });
}

/**
* Create a slide via createSlidePreview
* and append it to the HTML list as a thumbnail.
*
* @param {int} id The slide id from DB, who will be the DOMElement id.
* @return {void}
*/
function appendToSlidesPreview (id) {
    var newSlide = createSlidePreview(id)
    document.getElementById('slides').appendChild(createSlidePreview(id))
}

/**
* Create a HTML slide thumbnail.
*
* @param {int} id The id of the created element corresponding to the true slide id
* @return {DOMElement} The thumbnail
*/
function createSlidePreview (id) {
    var newSlide   = document.createElement('li')
    var thumbnail  = document.createElement('div')
    var imgPreview = document.createElement('img')
    var center     = document.createElement('center')
    var title      = document.createElement('h3')

    newSlide.className  = "span12"
    newSlide.id         = id
    thumbnail.className = "thumbnail"
    imgPreview.src      = "slide.png"
    imgPreview.width    = "55"
    var idSlide         = parseInt(newSlide.id) + 1
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
function openConnectedUsers (elem) {
    if (elem.length) {
        elem.animate({ right: "-5px" }, 500)
        elem.id = "popclose"
    } else {
        elem.animate({ right: "-205px" }, 500)
        elem.id = "popopen"
    }
}