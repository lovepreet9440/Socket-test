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
    if (nickName.trim().length != 0) {
      socket.emit("login", nickName);
      // login();
    } else {
      document.getElementById("nicknameInput").focus();
    }
  },
  false
);

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
