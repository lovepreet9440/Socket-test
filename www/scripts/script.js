var socket = io.connect();

socket.on("connect", function () {
  document.getElementById("info").textContent = "Please enter your name";
  document.getElementById("nickWrapper").style.display = "block";
  document.getElementById("nicknameInput").focus();
});

socket.on("nameExisted", function () {
  document.getElementById("info").textContent =
    "!nickname is taken, choose another pls";
});

socket.on("loginSuccess", function () {
  document.title = "Zimo | " + document.getElementById("nicknameInput").value;
  document.getElementById("loginWrapper").style.display = "none";
  document.getElementById("write_msg").focus();
});

socket.on("newMsg", function (user, msg) {
  displayNewMsg(user, msg);
});

socket.on("newImg", function (user, imgData) {
  displayImage(user, imgData);
});

socket.on("system", function (userName, userArr, type) {
  switch (type) {
    case "logout": {
      const userLeft = `
        <hr><p class="userleft">${userName} has left the chat</p><hr>
        `;
      break;
    }
    case "login": {
      const userjoin = `
        <hr><p class="userleft">${userName} has join the chat</p><hr>
        `;
      break;
    }
  }

  document.querySelector(".inbox_chat").innerHTML = "";
  userArr.forEach((user) => refreshPeopleList(user));
  // var msg = nickName + (type == "login" ? " joined" : " left");
  // that._displayNewMsg("system ", msg, "red");
  // document.getElementById("status").textContent =
  //   userCount + (userCount > 1 ? " users" : " user") + " online";
});

// socket.on("newImg", function (user, img, color) {
//   _displayImage(user, img, color);
// });

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
      displayNewMsg("me", msg);
      return;
    }
  },
  false
);

document.getElementById("loginBtn").addEventListener(
  "click",
  function () {
    var nickName = document.getElementById("nicknameInput").value;
    var roomName = document.getElementById("roomNameInput").value;
    var radioBtn = document.getElementsByName("room");

    let selectedValue;
    for (const rb of radioBtn) {
      if (rb.checked) {
        selectedValue = rb.value;
        break;
      }
    }

    if (
      nickName.trim().length != 0 &&
      roomName.trim().length != 0 &&
      selectedValue
    ) {
      if (selectedValue == "join")
        socket.emit("createRoom", roomName, nickName);
      else if (selectedValue == "join")
        socket.emit("createRoom", roomName, nickName);

      const roomHtml = `<h3>${roomName}</h3>`;

      document
        .getElementsByClassName("recent_heading")
        .insertAdjacentHTML("beforeend", roomHtml);

      console.log(document.getElementsByClassName("recent_heading"));

      socket.emit("login", nickName);
    } else {
      if (nickName.trim().length == 0) {
        document.getElementById("info").textContent = "Please enter your name";
        document.getElementById("nicknameInput").focus();
      } else if (roomName.trim().length == 0) {
        document.getElementById("info").textContent = "Please enter room name";
        document.getElementById("roomNameInput").focus();
      } else if (selectedValue == undefined) {
        document.getElementById("info").textContent =
          "Please specify weather you want to join or create room";
      }
    }
  },
  false
);

// document.getElementById("imageInput").addEventListener(
//   "change",
//   function () {
//     if (this.files.length != 0) {
//       var file = this.files[0],
//         reader = new FileReader();
//       // if (!reader) {
//       //     that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
//       //     this.value = '';
//       //     return;
//       // };
//       reader.onload = function (e) {
//         // this.value = "";
//         socket.emit("img", e.target.result);
//         displayImage("me", e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   },
//   false
// );

// FUNCTIONS
function displayNewMsg(user, msg) {
  var container = document.querySelector("#historyMsg");

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

  container.insertAdjacentHTML("beforeend", msgToDisplay);
  container.scrollTop = container.scrollHeight;
}

function refreshPeopleList(user) {
  var peopleContainer = document.querySelector(".inbox_chat");

  var today = new Date();
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

  const peopleElement = `
  <div class="chat_list">
    <div class="chat_people">
      <div class="chat_img">
        <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
      </div>
      <div class="chat_ib">
        <h5>${user}<span class="chat_date">${date}</span></h5>
        <p>
          Test, which is a new approach to have all solutions
          astrology under one roof.
        </p>
      </div>
    </div>
  </div>
  `;

  peopleContainer.insertAdjacentHTML("beforeend", peopleElement);
  peopleContainer.scrollTop = peopleContainer.scrollHeight;
}

function displayImage(user, imgData) {
  console.log(imgData);
  var container = document.getElementById("historyMsg");
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

  let imgToDisplay;

  user == "me"
    ? (imgToDisplay = `
  <div class="outgoing_msg">
    <div class="sent_msg">
    <img src="'${imgData}'"/>
      <span class="time_date"> ${time} | ${date}</span>
    </div>
  </div>
  `)
    : (imgToDisplay = `
  <div class="incoming_msg">
    <div class="incoming_msg_img">
      <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <img src="'${imgData}'"/>
        <span class="time_date"> Message by ${user} at ${time} | ${date}</span>
      </div>
    </div>
  </div>
  `);

  container.insertAdjacentHTML("beforeend", imgToDisplay);
  container.scrollTop = container.scrollHeight;
}

// document.getElementById("imageInput").addEventListener(
//   "change",
//   function () {
//     if (this.files.length != 0) {
//       var file = this.files[0],
//         reader = new FileReader();
//       // color = document.getElementById("colorStyle").value;
//       // if (!reader) {
//       //   that._displayNewMsg(
//       //     "system",
//       //     "!your browser doesn't support fileReader",
//       //     "red"
//       //   );
//       //   this.value = "";
//       //   return;
//       // }
//       reader.onload = function (e) {
//         // this.value = "";
//         socket.emit("img", e.target.result, "#000");
//         _displayImage("me", e.target.result, "#000");
//       };
//       reader.readAsDataURL(file);
//     }
//   },
//   false
// );

// function _displayImage(user, imgData, color) {
//   var container = document.getElementById("historyMsg"),
//     msgToDisplay = document.createElement("p"),
//     date = new Date().toTimeString().substr(0, 8);
//   msgToDisplay.style.color = color || "#000";
//   msgToDisplay.innerHTML =
//     user +
//     '<span class="timespan">(' +
//     date +
//     "): </span> <br/>" +
//     '<a href="' +
//     imgData +
//     '" target="_blank"><img src="' +
//     imgData +
//     '"/></a>';

//   console.log(msgToDisplay);

//   container.insertAdjacentHTML("beforeend", msgToDisplay);
//   container.scrollTop = container.scrollHeight;
// }
