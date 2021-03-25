let socket_chat=io.connect('/chat');
let socket_draw=io.connect('/draw');

let isChatJoined = false
let isChatOnline = false

let isDrawJoined = false
let isDrawOnline = false

let img_data_base64;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
 $(document).ready(async () => {

    $('#share-copy').click(() => {
        var aux = document.createElement("input"); 
        aux.setAttribute("value", window.location.href); 
        document.body.appendChild(aux); 
        aux.select();
        document.execCommand("copy"); 
        document.body.removeChild(aux);

        alert("The share link has been copied to your clipboard.");
    });

    var username = await getUsername();
    if(username){
        document.getElementById('username').innerHTML = username;
        document.getElementById('roomId').innerHTML = roomId;
    
        initChatSocket();
        socket_chat.emit('join', roomId, imgId, username);
    
        initDrawSocket();
        socket_draw.emit('join', roomId, imgId, username);
        initCanvas(onDrawing);
        
        $('#canvas-clear').on('click', function (e) {
            cls();
        });
    }
    else{
        // Redirect to join page if username is not avaliable
        window.location.href=`/join/${imgId}/?roomId=${roomId}`
    }
});

/**
 * Clear local canvas and boardcast a cls event
 */
function cls(){
    clearPaths();
    socket_draw.emit('cls');
}

/**
 * Clear local canvas and boardcast a cls event
 */
function onDrawing(data){
    socket_draw.emit('post-path', data);
}

// All unsent messages
// TODO : Store them into IndexDB (unsent)
var unsent_msgs = {}


/**
 * Initialises the socket for /chat
 */
function initChatSocket() {
    socket_chat.on('joined', async function () {
        isChatOnline = true
        // it enters the chat
        if (!isChatJoined){
            isChatJoined = true
            
            // TODO : Retrive history from db

        }
        else{
            writeInfo('<b>Rejoined the room.</b>');
        }

        // Post all unsent messages
        // If the server is disconnected, wait for all users to reconnect.
        setTimeout(function(){
            for (var msg_id in unsent_msgs) {
                let message = unsent_msgs[msg_id];
                if(message){
                    socket_chat.emit('post-chat', msg_id, message);
                }
            }
        }, 1000);
    });
    socket_chat.on('new-member', function (userId) {
        // notifies that someone has joined the room
        writeInfo('<b>' + userId + '</b>' + ' has joined the room');
    });
    socket_chat.on('member-left', function (userId) {
        // notifies that someone has left the room
        writeInfo('<b>' + userId + '</b>' + ' has left the room');
    });
    socket_chat.on('posted-chat', async function (msg_id) {
        // message post succeed
        message = unsent_msgs[msg_id]
        delete unsent_msgs[msg_id]
        
        let historyEle = document.getElementById(msg_id);
        historyEle.parentNode.removeChild(historyEle);

        writeOnChatHistory(msg_id, 'Me', message, true)

        // TODO : Store them into IndexDB (history)
    });
    socket_chat.on('recieve-chat', async function (username, msg_id, message) {
        // a message is received
        writeOnChatHistory(msg_id, username, message, false);

        // TODO : Store them into IndexDB (history)
    });
    socket_chat.on('connect', function () {
        if(isChatJoined){
            writeInfo('<b>Reconnected to the server.</b>');
            socket_chat.emit('join', roomId, imgId, username);
        }
    });
    socket_chat.on('disconnect', function () {
        if(isChatJoined){
            isChatOnline = false
            writeInfo('<b>The connection was lost.</b>');
        }
    });
}


function initDrawSocket() {
    socket_draw.on('joined', async function () {
        isDrawOnline = true
        // it enters the chat
        if (!isDrawJoined){
            isDrawJoined = true
        }
        else{
            writeInfo('<b>Rejoined the room. (drawing)</b>');
        }

        // Post all unsent drawings
        // If the server is disconnected, wait for all users to reconnect.
        // setTimeout(function(){
        //     for (var msg_id in unsent_msgs) {
        //         let message = unsent_msgs[msg_id];
        //         if(message){
        //             socket_draw.emit('post-chat', msg_id, message);
        //         }
        //     }
        // }, 1000);
    });
    socket_draw.on('recieve-path', function (data, username) {
        pushPath(data)
        // let cvx = document.getElementById('canvas');
        // let ctx = cvx.getContext('2d');
        // drawOnCanvas(ctx, data.canvas.width, data.canvas.height, data.paths[0].x1, data.paths[0].y1, data.paths[0].x2, data.paths[0].y2, data.color, data.thickness)
    });

    socket_draw.on('connect', function () {
        if(isDrawJoined){
            writeInfo('<b>Reconnected to the server. (drawing)</b>');
            socket_draw.emit('join', roomId, imgId, username);
        }
    });

    socket_draw.on('cls', function () {
        console.log(isDrawJoined);
        if(isDrawJoined){
            
            clearPaths();
        }
    });

    socket_draw.on('disconnect', function () {
        if(isDrawJoined){
            isDrawOnline = false
            writeInfo('<b>The connection was lost. (drawing)</b>');
        }
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let message = document.getElementById('chat-input').value;
    let msg_id = 'msg_' + Math.round(Math.random() * (2 ** 53))

    unsent_msgs[msg_id] = message

    if(isChatOnline){
        socket_chat.emit('post-chat', msg_id, message);
    }
    
    clearInputBox();
    writeOnChatHistory(msg_id, 'Me', message + " <b>(unsent)</b>", true);
}


/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnChatHistory(msgId, username, message, isMe) {
    if (isMe){
        $('#history').append(
            $(`
                <div id="${msgId}" class="m-1 ms-auto">
                    <div class="text-end">
                        ${username}
                    </div>
                    <div class="card ms-auto chat-msg-me">
                        <div class="card-body px-2 py-1">
                            <div>
                                ${message}
                            </div>
                        </div> 
                    </div>
                </div>
            `)
        )
    }
    else{
        $('#history').append(
            $(`
                <div id="${msgId}" class="m-1 me-auto">
                    <div class="text-start">
                        ${username}
                    </div>
                    <div class="card me-auto chat-msg-light">
                        <div class="card-body px-2 py-1">
                            <div>
                                ${message}
                            </div>
                        </div> 
                    </div>
                </div>
            `)
        )
    }

    // scroll to the last element
    let history = document.getElementById('history');
    history.scrollTop = history.scrollHeight;
}

function writeInfo(message){
    $('#history').append(
        $(`
            <div class="m-1 d-flex justify-content-center">
                <div class="rounded px-3 py-1 info-msg">
                    ${message}
                </div>
            </div>
        `)
    )

    // scroll to the last element
    let history = document.getElementById('history');
    history.scrollTop = history.scrollHeight;
}

/**
 * clearInputBox
 */
function clearInputBox() {
    document.getElementById('chat-input').value = '';
}
