var socket = io.connect();

socket.on("connect", function () {
  document.getElementById("info").textContent = "get yourself a nickname :)";
  document.getElementById("nickWrapper").style.display = "block";
  document.getElementById("nicknameInput").focus();
});

socket.on("nameExisted", function () {
  document.getElementById("info").textContent =
    "!nickname is taken, choose another pls";
});

socket.on("loginSuccess", function () {
  document.title = "hichat | " + document.getElementById("nicknameInput").value;
  document.getElementById("loginWrapper").style.display = "none";
  document.getElementById("write_msg").focus();
});

socket.on("newMsg", function (user, msg, color) {
  _displayNewMsg(user, msg, color);
});

// EVENT LISTENERS
function login() {
  document.getElementById("msg_send_btn").addEventListener(
    "click",
    function () {
      var messageInput = document.getElementById("write_msg"),
        msg = messageInput.value,
        color = document.getElementById("colorStyle").value;
      messageInput.value = "";
      messageInput.focus();
      if (msg.trim().length != 0) {
        socket.emit("postMsg", msg, color);
        _displayNewMsg("me", msg, color);
        return;
      }
    },
    false
  );
}

document.getElementById("loginBtn").addEventListener(
  "click",
  function () {
    var nickName = document.getElementById("nicknameInput").value;
    if (nickName.trim().length != 0) {
      socket.emit("login", nickName);
      login();
    } else {
      document.getElementById("nicknameInput").focus();
    }
  },
  false
);

// document.getElementById("write_msg").addEventListener(
//   "keyup",
//   function (e) {
//     var messageInput = document.getElementById("messageInput"),
//       msg = messageInput.value,
//       color = document.getElementById("colorStyle").value;
//     if (e.keyCode == 13 && msg.trim().length != 0) {
//       messageInput.value = "";
//       socket.emit("postMsg", msg, color);
//       _displayNewMsg("me", msg, color);
//     }
//   },
//   false
// );

// FUNCTIONS

function _displayNewMsg(user, msg, color) {
  var container = document.getElementById("historyMsg"),
    msgToDisplay = document.createElement("p"),
    date = new Date().toTimeString().substr(0, 8);
  //determine whether the msg contains emoji
  // msg = this._showEmoji(msg);
  msgToDisplay.style.color = color || "#000";
  msgToDisplay.innerHTML =
    user + '<span class="timespan">(' + date + "): </span>" + msg;
  container.appendChild(msgToDisplay);
  container.scrollTop = container.scrollHeight;
}
