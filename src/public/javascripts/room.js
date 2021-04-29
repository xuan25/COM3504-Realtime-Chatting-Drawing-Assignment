// socket.io
let socket_chat=io.connect('/chat');
let socket_draw=io.connect('/draw');

// Chatting socket.io status
let isChatJoined = false
let isChatOnline = false
// Drawing socket.io status
let isDrawJoined = false
let isDrawOnline = false

var imgId;
var roomId;
  
/**
 * Get the room id
 * @returns room id
 */
 function getRoomId() {
    const result = window.location.pathname.split('/')[3]
    if ( result != null ){
        return decodeURI(result);
    }
    else{
        return null;
    }
}

/**
 * Get the image id
 * @returns image id
 */
function getImgId() {
    const result = window.location.pathname.split('/')[2]
    if ( result != null ){
        return decodeURI(result);
    }
    else{
        return null;
    }
}

/**
 * Onload
 */
$(document).ready(async () => {

    // If it is a template, adjust the content of the template
    if (isTemplate){
        // Parse url
        imgId = getImgId();
        roomId = getRoomId();
        $('#image').attr("src", `/img/raw/${imgId}`)
    }

    // share button clicked. copy the link to the clipboard
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
        // UI
        document.getElementById('username').innerHTML = username;
        document.getElementById('roomId').innerHTML = roomId;
    
        // initailize socket.io
        initChatSocket();
        socket_chat.emit('join', roomId, imgId, username);
    
        initDrawSocket();
        socket_draw.emit('join', roomId, imgId, username);

        // initailize canvas
        initCanvas(onDrawing);
        
        $('#canvas-clear').on('click', function (e) {
            cls();
        });
    }
    else{
        // Redirect to join page if username is not avaliable
        window.location.href=`/join/${imgId}/?roomId=${roomId}`
    }

    initChatHistory(roomId);
});

/**
 * Clear local canvas and boardcast a cls event
 */
function cls(){
    clearPaths();
    socket_draw.emit('cls');
}

/**
 * onDrawing callback
 * emit paths when drawing
 */
function onDrawing(data){
    socket_draw.emit('post-path', data);
}

/**
 * Init chat history from previous sessions
 */
 async function initChatHistory(roomId) {
    let histories = await getChatHistories(roomId);
    for (let history of histories) {
        writeOnChatHistory(history.msgId, history.username, history.message, history.isMe, history.isSend);
    }
}

/**
 * Initialises the socket for /chat
 */
function initChatSocket() {
    socket_chat.on('joined', async function () {
        isChatOnline = true
        // joined a room
        if (!isChatJoined){
            isChatJoined = true
        }
        else{
            writeInfo('<b>Rejoined the room.</b>');
        }

        // Post all unsent messages if the connection is back
        // If the server is disconnected, wait for all users to reconnect.
        // setTimeout(function(){
        //     for (var msg_id in unsent_msgs) {
        //         let message = unsent_msgs[msg_id];
        //         if(message){
        //             socket_chat.emit('post-chat', msg_id, message);
        //         }
        //     }
        // }, 1000);
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

        // remove from unsents
        msg = await getChatHistoryByMsgId(msg_id)
        await deleteChatHistoryByMsgId(msg_id)

        // display
        let historyEle = document.getElementById(msg_id);
        historyEle.parentNode.removeChild(historyEle);
        writeOnChatHistory(msg_id, 'Me', msg.message, true, true);

        await storeChatHistory(msg.roomId, msg.username, msg.msgId, msg.message, msg.isMe, true);

    });
    socket_chat.on('recieve-chat', async function (username, msg_id, message) {
        // a message is received
        writeOnChatHistory(msg_id, username, message, false, true);
        await storeChatHistory(roomId, username, msg_id, message, false, true);
    });
    socket_chat.on('connect', function () {
        if(isChatJoined){
            // Auto rejoin the room if the connection has back
            writeInfo('<b>Reconnected to the server.</b>');
            socket_chat.emit('join', roomId, imgId, username);
        }
    });
    socket_chat.on('disconnect', function () {
        if(isChatJoined){
            // connection has lost due to some network issue
            isChatOnline = false
            writeInfo('<b>The connection was lost.</b>');
        }
    });
}

/**
 * Initialises the socket for /draw
 */
function initDrawSocket() {
    socket_draw.on('joined', async function () {
        isDrawOnline = true
        // joined a room
        if (!isDrawJoined){
            isDrawJoined = true

            // TODO : Retrive history from db


        }
        else{
            writeInfo('<b>Rejoined the room. (drawing)</b>');
        }

        // Post all unsent drawings (reserved)
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
        // recieved a path form others
        pushPath(data)
    });

    socket_draw.on('connect', function () {
        if(isDrawJoined){
            // Auto rejoin the room if the connection has back
            writeInfo('<b>Reconnected to the server. (drawing)</b>');
            socket_draw.emit('join', roomId, imgId, username);
        }
    });
    
    socket_draw.on('cls', function () {
        // clear canvas event
        clearPaths();
    });

    socket_draw.on('disconnect', function () {
        if(isDrawJoined){
            // connection has lost due to some network issue
            isDrawOnline = false
            writeInfo('<b>The connection was lost. (drawing)</b>');
        }
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket.io
 */
async function sendChatText() {
    // get message
    let message = document.getElementById('chat-input').value;

    if (message === ""){
        return;
    }

    let msg_id = 'msg_' + Math.round(Math.random() * (2 ** 53))

    // Store to unsent_msgs
    storeChatHistory(roomId, 'Me', msg_id, message, true, false)

    // emit chat message if the connection is on
    if(isChatOnline){
        socket_chat.emit('post-chat', msg_id, message);
    }
    
    // Clear input and show an unsent message
    document.getElementById('chat-input').value = '';
    writeOnChatHistory(msg_id, 'Me', message, true, false);

    return false
}


/**
 * Show a message
 * @param msgId: message id
 * @param username: username
 * @param message: message
 * @param isMe: my message or from others
 */
 function writeOnChatHistory(msgId, username, message, isMe, isSent) {
    if (isMe){
        if (isSent){
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
                    <div id="${msgId}" class="m-1 ms-auto">
                        <div class="text-end">
                            ${username}
                        </div>
                        <div class="card ms-auto chat-msg-me">
                            <div class="card-body px-2 py-1">
                                <div>
                                    ${message} <b>(unsent)</b>
                                </div>
                            </div> 
                        </div>
                    </div>
                `)
            )
        }
        
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
/**
 * Show a infomation/notice
 * @param message notice message
 */
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
 
