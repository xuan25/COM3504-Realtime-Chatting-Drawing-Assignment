exports.init = function(io) {
  const socket_info_dict = {}

  // the chat namespace
  const chat= io.of('/chat').on('connection', function (socket) {
    try {
      /**
       * it creates or joins a room
       */
      socket.on('join', function (room, image_uri, username) {
        socket_room = room + ' @ ' + image_uri
        socket_info_dict[socket.id] = { "socket_room": socket_room, "username": username }

        socket.join(socket_room);
        socket.emit('joined');
        socket.broadcast.to(socket_room).emit('new-member', username);
      });

      socket.on('post-chat', function (msg_id, message) {
        socket_room = socket_info_dict[socket.id]["socket_room"]
        username = socket_info_dict[socket.id]["username"]

        socket.emit('posted-chat', msg_id);
        socket.broadcast.to(socket_room).emit('recieve-chat', username, msg_id, message);
      });

      socket.on('disconnect', function(){
        socket_room = socket_info_dict[socket.id]["socket_room"]
        username = socket_info_dict[socket.id]["username"]
        
        delete socket_info_dict[socket.id]
        socket.broadcast.to(socket_room).emit('member-left', username);
      });
    }
    catch (e) {
    }
  });
}
