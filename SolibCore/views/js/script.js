window.onload = function () {
  var users = document.getElementById("users")
  socket    = io.connect("http://can.vas:8080")

  socket.on('list_users', function (data) {
    users.innerHTML = ''
    for (var i=0 ; i<data.users.length ; i++) {
      var tr = document.createElement('tr')
      tr.id = data.users[i].id
      tr.innerHTML = data.users[i].firstname + " " + data.users[i].lastname
      users.appendChild(tr)
    }
  });

  socket.on('user_disconnected', function (data) {
    document.getElementById(data.user.id).remove();
  });
}

function coucou(element) {
  // alert(element.id)
  if(element.id == "popopen"){
    element.style.right="-5px"
    element.id = "popclose"
  }
  else {
    element.style.right="-205px"
    element.id = "popopen"
  }
}