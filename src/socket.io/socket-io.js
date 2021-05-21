exports.init = function (io) {
    /**
     * Chatting socket info dictionary
     * for retriving user infos by socket id
     */
    const socket_info_dict = {};

    /**
     * Chatting namespace
     */
    const chat = io.of("/chat").on("connection", function (socket) {
        try {
            /**
             * "join" when user create or join a room
             */
            socket.on("join", function (room, image_uri, username) {
                // generate a socket room identifier
                socket_room = room + " @ " + image_uri;

                // store user info
                socket_info_dict[socket.id] = {
                    socket_room: socket_room,
                    username: username,
                };

                // let user join
                socket.join(socket_room);
                socket.emit("joined");

                // inform others
                socket.broadcast.to(socket_room).emit("new-member", username);
            });

            /**
             * "post-chat" when user post a chat message
             * emit meg_id to the serder via "post-chat" indicates that the server received the msg
             * broadcast to others via "recieve-chat"
             */
            socket.on("post-chat", function (msgId, message) {
                // socket validation
                socket_info = socket_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // retrive user info
                socket_room = socket_info["socket_room"];
                username = socket_info["username"];

                // server received confirmation
                socket.emit("posted-chat", msgId);

                // broadcast to others
                socket.broadcast.to(socket_room).emit("recieve-chat", username, msgId, message);
            });

            /**
             * "disconnect" when a user disconnected
             * emit left user via "member-left" to inform others
             */
            socket.on("disconnect", function () {
                // socket validation
                socket_info = socket_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // retrive user info
                socket_room = socket_info["socket_room"];
                username = socket_info["username"];

                // delete user info
                delete socket_info_dict[socket.id];

                // broadcast to others
                socket.broadcast.to(socket_room).emit("member-left", username);
            });
        } catch (e) { }
    });

    /**
     * Drawing socket info dictionary
     * for retriving user infos by socket id
     */
    const socket_draw_info_dict = {};

    /**
     * Drawing namespace
     */
    const draw = io.of("/draw").on("connection", function (socket) {
        try {
            /**
             * "join" when user create or join a room
             */
            socket.on("join", function (room, image_uri, username) {
                // generate a socket room identifier
                socket_room = room + " @ " + image_uri;

                // store user info
                socket_draw_info_dict[socket.id] = {
                    socket_room: socket_room,
                    username: username,
                };

                // let user join
                socket.join(socket_room);
                socket.emit("joined");

                // inform others (reserved)
                // socket.broadcast.to(socket_room).emit('new-member', username);
            });

            /**
             * "post-path" when user post a drawing path
             * broadcast to others via "recieve-path"
             */
            socket.on("post-path", function (data) {
                // socket validation
                socket_info = socket_draw_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // retrive user info
                socket_room = socket_info["socket_room"];
                username = socket_info["username"];

                // server received confirmation (reserved)
                // socket.emit('posted-path', path_id);

                // broadcast to others
                socket.broadcast.to(socket_room).emit("recieve-path", data, username);
            });

            /**
             * "cls" when a user cleared the canvas
             * broadcast to others via "cls"
             */
            socket.on("cls", function () {
                // socket validation
                socket_info = socket_draw_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // retrive user info
                socket_room = socket_info["socket_room"];
                username = socket_info["username"];

                // broadcast to others
                socket.broadcast.to(socket_room).emit("cls");
            });

            /**
             * "disconnect" when a user disconnected
             */
            socket.on("disconnect", function () {
                // socket validation
                socket_info = socket_draw_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // retrive user info (reserved)
                // socket_room = socket_info["socket_room"]
                // username = socket_info["username"]

                // delete user info
                delete socket_draw_info_dict[socket.id];

                // broadcast to others (reserved)
                // socket.broadcast.to(socket_room).emit('member-left', username);
            });
        } catch (e) { }
    });

    /**
     * Knowledge Graph socket info dictionary
     * for retriving user infos by socket id
     */
     const socket_kg_info_dict = {};

    /**
     * Knowledge Graph namespace
     */
    const kg = io.of("/kg").on("connection", function (socket) {
        try {
            /**
             * "join" when user create or join a room
             */
            socket.on("join", function (room, image_uri, username) {
                // generate a socket room identifier
                socket_room = room + " @ " + image_uri;

                // store user info
                socket_kg_info_dict[socket.id] = {
                    socket_room: socket_room,
                    username: username,
                };

                // let user join
                socket.join(socket_room);
                socket.emit("joined");
            });

            /**
             * "post-kg" when user post a kg
             * broadcast to others via "recieve-kg"
             */
            socket.on("post-kg", function (data) {
                // socket validation
                socket_info = socket_kg_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // retrive user info
                socket_room = socket_info["socket_room"];
                username = socket_info["username"];

                // broadcast to others
                socket.broadcast.to(socket_room).emit("recieve-kg", data, username);
            });

            /**
             * "disconnect" when a user disconnected
             */
            socket.on("disconnect", function () {
                // socket validation
                socket_info = socket_kg_info_dict[socket.id];
                if (!socket_info) {
                    return;
                }

                // delete user info
                delete socket_kg_info_dict[socket.id];
            });
        } catch (e) { }
    });
};
