var app = require("express")();
let arr = [];
app.get("/", (req, res) => {
  let name = new Date().getTime().toString();
  if (arr.length > 0) {
    if (arr[arr.length - 1].num < 2) {
      arr[arr.length - 1].num += 1;
      name = arr[arr.length - 1].name;
    } else {
      arr.push({ name, num: 1 });
    }
  } else {
    arr.push({ name, num: 1 });
  }
  res.json({ status: arr[arr.length - 1].num === 1, roomName: name });
});
const server = require("http").Server(app);
const options = {
  /* ... */
};
const io = require("socket.io")(server, options);

let obj = {};
io.on("connection", socket => {
  socket.on("A", function(something) {
    console.log("A");
    let nameRoom = something;
    socket.emit(nameRoom, "connect room");
    socket.on(nameRoom + "connect", data => {
      console.log("nameRoomconnect");
      if (obj[`${nameRoom}`]) {
        obj[`${nameRoom}`].connected = 2;
        io.emit(nameRoom + "start", { status: 0 });
      } else {
        obj[`${nameRoom}`] = {};
        obj[`${nameRoom}`].connected = 1;
      }
      console.log("connected room " + JSON.stringify(obj));
      socket.on(nameRoom + "data", data => {
        console.log("nameRoombuoc" + JSON.stringify(data));
        socket.broadcast.emit(nameRoom + "dataRe", data);
      });
    });
  });
});

server.listen(3000);
