$(document).ready(function () {
    // Dropdown menu
    $(".dropdown-toggle").dropdown();

    $('.color').colorpicker().on('changeColor', function (ev) {
        bodyStyle.backgroundColor = ev.color.toHex();
    });

    // Add new slide
    $("#new-slide").click(function () {
        socket.emit("new_slide", { position: solibClient.slidesArray.length })
        window.location.hash = solibClient.slidesArray.length
    });
});