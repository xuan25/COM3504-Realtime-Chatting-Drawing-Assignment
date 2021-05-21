// socket.io
let socketChat = io.connect('/chat');
let socketDraw = io.connect('/draw');
let socketKg = io.connect('/kg');

// Chatting socket.io status
let isChatJoined = false
let isChatOnline = false

// Drawing socket.io status
let isDrawJoined = false
let isDrawOnline = false

// Kg socket.io status
let isKgJoined = false
let isKgOnline = false

var imgId;
var roomId;
var roomIdDb = imgId+'_'+roomId;

  
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
        socketChat.emit('join', roomId, imgId, username);
    
        initDrawSocket();
        socketDraw.emit('join', roomId, imgId, username);

        initKgSocket();
        socketKg.emit('join', roomId, imgId, username);

        //get the color
        updateInkColor();
        // initailize canvas
        initCanvas(onDrawing);
        // initailize kg
        initKg(kgItemSelected);
        
        $('#canvas-clear').on('click', function (e) {
            // clear canvas
            cls();
            // clear corresponding kg tags
            clearKgTags();
            clearKgHistories(roomIdDb);
        });

        $('#pencilColor').on('click', function (e) {
            updateInkColor();
        });
    }
    else{
        // Redirect to join page if username is not avaliable
        window.location.href=`/join/${imgId}/?roomId=${roomId}`
    }

    initChatHistory(roomIdDb);
    initDrawHistory(roomIdDb);
    initKgHistory(roomIdDb);
});

/**
 * Clear local canvas and boardcast a cls event
 */
function cls(){
    clearPaths();
    clearDrawHistories(roomIdDb);
    socketDraw.emit('cls');
}

/**
 * Get the pencil color when selected
 */
function updateInkColor(){
    if (document.getElementById('color-red').checked == true) {c = 'red'}
    if (document.getElementById('color-blue').checked == true) {c = 'blue'}
    if (document.getElementById('color-yellow').checked == true) {c = 'yellow'}
    if (document.getElementById('color-green').checked == true) {c = 'green'}
    inkColor = c
}

/**
 * onDrawing callback
 * emit paths when drawing
 */
function onDrawing(data){
    socketDraw.emit('post-path', data);
    storeDraw(roomIdDb, data);
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
 function kgItemSelected(event){
    let row = event.row;
    data = {color: inkColor, kg: row}

    socketKg.emit('post-kg', data);
    showKgTag(data)
    storeKg(roomIdDb, data);
}

/**
 * Init chat history from previous sessions
 */
async function initChatHistory(roomIdDb) {
    let histories = await getChatHistories(roomIdDb);
    for (let history of histories) {
        writeOnChatHistory(history.msgId, history.username, history.message, history.isMe, history.isSend);
    }
}

/**
 * Init draw history from previous sessions
 */
async function initDrawHistory(roomIdDb) {
    let histories = await getDrawHistories(roomIdDb);
    for (let history of histories) {
        pushPath(history)
    }
}

/**
 * Init kg history from previous sessions
 */
 async function initKgHistory(roomIdDb) {
    let histories = await getKgHistories(roomIdDb);
    for (let history of histories) {
        showKgTag(history)
    }
}

/**
 * Initialises the socket for /chat
 */
function initChatSocket() {
    socketChat.on('joined', async function () {
        isChatOnline = true
        // joined a room
        if (!isChatJoined){
            isChatJoined = true
        }
        else{
            writeInfo('<b>Rejoined the room.</b>');
        }

        // Post all unsent messages if the connection is back (Feature removed)
        // If the server is disconnected, wait for all users to reconnect.
        // setTimeout(function(){
        //     for (var msgId in unsent_msgs) {
        //         let message = unsent_msgs[msgId];
        //         if(message){
        //             socket_chat.emit('post-chat', msgId, message);
        //         }
        //     }
        // }, 1000);
    });
    socketChat.on('new-member', function (userId) {
        // notifies that someone has joined the room
        writeInfo('<b>' + userId + '</b>' + ' has joined the room');
    });
    socketChat.on('member-left', function (userId) {
        // notifies that someone has left the room
        writeInfo('<b>' + userId + '</b>' + ' has left the room');
    });
    socketChat.on('posted-chat', async function (msgId) {
        // message post succeed

        // remove from unsents
        msg = await getChatHistoryByMsgId(msgId)
        await deleteChatHistoryByMsgId(msgId)

        // display
        let historyEle = document.getElementById(msgId);
        historyEle.parentNode.removeChild(historyEle);
        writeOnChatHistory(msgId, 'Me', msg.message, true, true);

        await storeChatHistory(msg.roomId, msg.username, msg.msgId, msg.message, msg.isMe, true);

    });
    socketChat.on('recieve-chat', async function (username, msgId, message) {
        // a message is received
        writeOnChatHistory(msgId, username, message, false, true);
        await storeChatHistory(roomIdDb, username, msgId, message, false, true);
    });
    socketChat.on('connect', function () {
        if(isChatJoined){
            // Auto rejoin the room if the connection has back
            writeInfo('<b>Reconnected to the server.</b>');
            socketChat.emit('join', roomId, imgId, username);
        }
    });
    socketChat.on('disconnect', function () {
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
    socketDraw.on('joined', async function () {
        isDrawOnline = true
        // joined a room
        if (!isDrawJoined){
            isDrawJoined = true
        }
        else{
            writeInfo('<b>Rejoined the room. (drawing)</b>');
        }

        // Post all unsent drawings (reserved)
        // If the server is disconnected, wait for all users to reconnect.
        // setTimeout(function(){
        //     for (var msgId in unsent_msgs) {
        //         let message = unsent_msgs[msgId];
        //         if(message){
        //             socket_draw.emit('post-chat', msgId, message);
        //         }
        //     }
        // }, 1000);
    });
    
    socketDraw.on('recieve-path', function (data, username) {
        // recieved a path form others
        pushPath(data)
        storeDraw(roomIdDb, data)
    });

    socketDraw.on('connect', function () {
        if(isDrawJoined){
            // Auto rejoin the room if the connection has back
            writeInfo('<b>Reconnected to the server. (drawing)</b>');
            socketDraw.emit('join', roomId, imgId, username);
        }
    });
    
    socketDraw.on('cls', function () {
        // clear canvas event
        clearPaths();
        clearDrawHistories(roomIdDb);

        // clear corresponding kg tags
        clearKgTags();
        clearKgHistories(roomIdDb);
    });

    socketDraw.on('disconnect', function () {
        if(isDrawJoined){
            // connection has lost due to some network issue
            isDrawOnline = false
            writeInfo('<b>The connection was lost. (drawing)</b>');
        }
    });
}

/**
 * Initialises the socket for /kg
 */
 function initKgSocket() {
    socketKg.on('joined', async function () {
        isKgOnline = true
        // joined a room
        if (!isKgJoined){
            isKgJoined = true
        }
        else{
            writeInfo('<b>Rejoined the room. (kg)</b>');
        }
    });
    
    socketKg.on('recieve-kg', function (data, username) {
        // recieved a kg form others
        showKgTag(data)
        storeKg(roomIdDb, data);
    });

    socketKg.on('connect', function () {
        if(isKgJoined){
            // Auto rejoin the room if the connection has back
            writeInfo('<b>Reconnected to the server. (kg)</b>');
            socketKg.emit('join', roomId, imgId, username);
        }
    });

    socketKg.on('disconnect', function () {
        if(isDrawJoined){
            // connection has lost due to some network issue
            isDrawOnline = false
            writeInfo('<b>The connection was lost. (kg)</b>');
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

    let msgId = 'msg_' + Math.round(Math.random() * (2 ** 53))

    // Store to unsent_msgs
    storeChatHistory(roomIdDb, 'Me', msgId, message, true, false)

    // emit chat message if the connection is on
    if(isChatOnline){
        socketChat.emit('post-chat', msgId, message);
    }
    
    // Clear input and show an unsent message
    document.getElementById('chat-input').value = '';
    writeOnChatHistory(msgId, 'Me', message, true, false);

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
 
