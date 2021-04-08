var express = require("express"),
  app = express(),
  moment = require("moment"),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server),
  users = [];

//specify the html we will use
app.use("/", express.static(__dirname + "/www"));

server.listen(process.env.PORT || 4000);

console.log(`Server started on port ${process.env.PORT || 4000}`);

io.sockets.on("connection", function (socket) {
  //new user login
  socket.on("login", function (nickname) {
    if (users.indexOf(nickname) > -1) {
      socket.emit("nameExisted");
    } else {
      //socket.userIndex = users.length;
      socket.nickname = nickname;
      users.push(nickname);
      socket.emit("loginSuccess");
      console.log(users);
      // const date = moment(Date.now()).format("MM-DD");
      io.sockets.emit("system", nickname, users, "login");
    }
  });
  //user leaves
  socket.on("disconnect", function () {
    if (socket.nickname != null) {
      //users.splice(socket.userIndex, 1);
      users.splice(users.indexOf(socket.nickname), 1);
      socket.broadcast.emit("system", socket.nickname, users, "logout");
    }
  });
  //new message get
  socket.on("postMsg", function (msg) {
    socket.broadcast.emit("newMsg", socket.nickname, msg);
  });
  //new image get
  // socket.on("img", function (imgData, color) {
  //   socket.broadcast.emit("newImg", socket.nickname, imgData, color);
  // });
});
