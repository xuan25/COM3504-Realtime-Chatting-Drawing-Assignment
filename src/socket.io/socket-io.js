exports.init = function (io) {
  /**
   * Chatting socket info dictionary
   * for retriving user infos by socket id
   */
  const socketChatInfoDict = {};

  /**
   * Chatting namespace
   */
  const chat = io.of("/chat").on("connection", function (socket) {
    try {
      /**
       * "join" when user create or join a room
       */
      socket.on("join", function (room, imageUri, username) {
        // generate a socket room identifier
        socketRoom = room + " @ " + imageUri;

        // store user info
        socketChatInfoDict[socket.id] = {
          socketRoom: socketRoom,
          username: username,
        };

        // let user join
        socket.join(socketRoom);
        socket.emit("joined");

        // inform others
        socket.broadcast.to(socketRoom).emit("new-member", username);
      });

      /**
       * "post-chat" when user post a chat message
       * emit meg_id to the serder via "post-chat" indicates that the server received the msg
       * broadcast to others via "recieve-chat"
       */
      socket.on("post-chat", function (msgId, message) {
        // socket validation
        socket_info = socketChatInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // retrive user info
        socketRoom = socket_info["socketRoom"];
        username = socket_info["username"];

        // server received confirmation
        socket.emit("posted-chat", msgId);

        // broadcast to others
        socket.broadcast.to(socketRoom).emit("recieve-chat", username, msgId, message);
      });

      /**
       * "disconnect" when a user disconnected
       * emit left user via "member-left" to inform others
       */
      socket.on("disconnect", function () {
        // socket validation
        socket_info = socketChatInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // retrive user info
        socketRoom = socket_info["socketRoom"];
        username = socket_info["username"];

        // delete user info
        delete socketChatInfoDict[socket.id];

        // broadcast to others
        socket.broadcast.to(socketRoom).emit("member-left", username);
      });
    } catch (e) { }
  });


  /**
   * Drawing socket info dictionary
   * for retriving user infos by socket id
   */
  const socketDrawInfoDict = {};

  /**
   * Drawing namespace
   */
  const draw = io.of("/draw").on("connection", function (socket) {
    try {
      /**
       * "join" when user create or join a room
       */
      socket.on("join", function (room, imageUri, username) {
        // generate a socket room identifier
        socketRoom = room + " @ " + imageUri;

        // store user info
        socketDrawInfoDict[socket.id] = {
          socketRoom: socketRoom,
          username: username,
        };

        // let user join
        socket.join(socketRoom);
        socket.emit("joined");
      });

      /**
       * "post-path" when user post a drawing path
       * broadcast to others via "recieve-path"
       */
      socket.on("post-path", function (data) {
        // socket validation
        socket_info = socketDrawInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // retrive user info
        socketRoom = socket_info["socketRoom"];
        username = socket_info["username"];

        // broadcast to others
        socket.broadcast.to(socketRoom).emit("recieve-path", data, username);
      });

      /**
       * "cls" when a user cleared the canvas
       * broadcast to others via "cls"
       */
      socket.on("cls", function () {
        // socket validation
        socket_info = socketDrawInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // retrive user info
        socketRoom = socket_info["socketRoom"];
        username = socket_info["username"];

        // broadcast to others
        socket.broadcast.to(socketRoom).emit("cls");
      });

      /**
       * "disconnect" when a user disconnected
       */
      socket.on("disconnect", function () {
        // socket validation
        socket_info = socketDrawInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // delete user info
        delete socketDrawInfoDict[socket.id];
      });
    } catch (e) { }
  });

  
  /**
   * Knowledge Graph socket info dictionary
   * for retriving user infos by socket id
   */
   const socketKgInfoDict = {};

  /**
   * Knowledge Graph namespace
   */
  const kg = io.of("/kg").on("connection", function (socket) {
    try {
      /**
       * "join" when user create or join a room
       */
      socket.on("join", function (room, imageUri, username) {
        // generate a socket room identifier
        socketRoom = room + " @ " + imageUri;

        // store user info
        socketKgInfoDict[socket.id] = {
          socketRoom: socketRoom,
          username: username,
        };

        // let user join
        socket.join(socketRoom);
        socket.emit("joined");
      });

      /**
       * "post-kg" when user post a kg
       * broadcast to others via "recieve-kg"
       */
      socket.on("post-kg", function (data) {
        // socket validation
        socket_info = socketKgInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // retrive user info
        socketRoom = socket_info["socketRoom"];
        username = socket_info["username"];

        // broadcast to others
        socket.broadcast.to(socketRoom).emit("recieve-kg", data, username);
      });

      /**
       * "disconnect" when a user disconnected
       */
      socket.on("disconnect", function () {
        // socket validation
        socket_info = socketKgInfoDict[socket.id];
        if (!socket_info) {
          return;
        }

        // delete user info
        delete socketKgInfoDict[socket.id];
      });
    } catch (e) { }
  });
};
