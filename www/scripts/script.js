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

socket.on("newMsg", function (user, msg) {
  _displayNewMsg(user, msg);
});

// EVENT LISTENERS
document.getElementById("msg_send_btn").addEventListener(
  "click",
  function () {
    var messageInput = document.getElementById("write_msg"),
      msg = messageInput.value;
    messageInput.value = "";
    messageInput.focus();
    if (msg.trim().length != 0) {
      socket.emit("postMsg", msg);
      _displayNewMsg("me", msg);
      return;
    }
  },
  false
);

document.getElementById("loginBtn").addEventListener(
  "click",
  function () {
    var nickName = document.getElementById("nicknameInput").value;
    if (nickName.trim().length != 0) {
      socket.emit("login", nickName);
      // login();
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

/*   FUNCTIONS   */

function _displayNewMsg(user, msg, color) {
  var container = document.querySelector("#historyMsg");
  // ,
  //   msgToDisplay = document.createElement("p"),

  var today = new Date();
  var time = today.toTimeString().substr(0, 5);
  var dd = today.getDate();

  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  var date = mm + "/" + dd + "/" + yyyy;

  let msgToDisplay;

  user == "me"
    ? (msgToDisplay = `

  <div class="outgoing_msg">
    <div class="sent_msg">
      <p>${msg}</p>
      <span class="time_date"> ${time} | ${date}</span>
    </div>
  </div>

  `)
    : (msgToDisplay = `
  <div class="incoming_msg">
    <div class="incoming_msg_img">
      <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${msg}</p>
        <span class="time_date"> Message by ${user} at ${time} | ${date}</span>
      </div>
    </div>
  </div>
  `);

  // `
  //   <div class="incoming_msg">
  //     <div class="incoming_msg_img">
  //       <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
  //     </div>
  //     <div class="received_msg">
  //       <div class="received_withd_msg">
  //         <p>Test which is a new approach to have all solutions</p>
  //         <span class="time_date"> 11:01 AM | June 9</span>
  //       </div>
  //     </div>
  //   </div>
  //   `;

  //determine whether the msg contains emoji
  // msg = this._showEmoji(msg);
  // msgToDisplay.style.color = color || "#000";
  // msgToDisplay.innerHTML =
  //   user + '<span class="timespan">(' + date + "): </span>" + msg;

  console.log(msgToDisplay);

  container.insertAdjacentHTML("beforeend", msgToDisplay);
  container.scrollTop = container.scrollHeight;
}
