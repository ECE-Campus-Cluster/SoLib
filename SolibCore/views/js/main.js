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
            appendToSlidesPreview(lesson.slides[s].id, lesson.slides[s].position)

        solibClient.renderSlide(lesson.slides[0]) // Render first slide on loading

        //Declare event when change current slide
        $("ul.thumbnails#slides li.span12").click(function(){
            solibClient.renderSlide(solibClient.slidesArray[$(this)[0].getAttribute("data-position")])
        });
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
        // Drawing has been made on current slide for current user
        if (drawing.idSlide == solibClient.currentSlideId)
            solibClient.renderDrawing(drawing)
        // Drawing has been made on another slide
        else solibClient.slidesArray[drawing.idSlide].drawings.push(drawing)
    });

    socket.on("new_slide", function (slide) {
        solibClient.slidesArray.push(slide)
        appendToSlidesPreview(slide.id, solibClient.slidesArray.length - 1)
    });

    $(document).ready(function(){
        // Dropdown menu
        $(".dropdown-toggle").dropdown();

        // Add new slide
        $("#new-slide").click(function () {
            socket.emit("new_slide", { position: solibClient.slidesArray.length })
            window.location.hash = solibClient.slidesArray.length
        });
    });

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
    var newSlide   = document.createElement('li')
    var thumbnail  = document.createElement('div')
    var imgPreview = document.createElement('img')
    var center     = document.createElement('center')
    var title      = document.createElement('h3')

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