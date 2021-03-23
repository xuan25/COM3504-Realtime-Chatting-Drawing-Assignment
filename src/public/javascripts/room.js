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
    var username = await getUsername();
    if(username){
        document.getElementById('who_you_are').innerHTML = username;
        document.getElementById('in_room').innerHTML = roomId;
    
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
    clearCanvas();
    socket_draw.emit('cls');
}

/**
 * Clear local canvas and boardcast a cls event
 */
function onDrawing(data){
    socket_draw.emit('post-path', data);
}

// All unsent messages
// TODO : Store them in IndexDB
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

            let chatHistories = await getChatHistories(roomId+imgId)
            for (let chatHistory of chatHistories){
                username = chatHistory.username
                message = chatHistory.message
                writeOnChatHistory('<b>' + username + ':</b> ' + message);
            }
        }
        else{
            writeOnChatHistory('<b>Rejoined the room.</b>');
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
        writeOnChatHistory('<b>' + userId + '</b>' + ' has joined the room');
    });
    socket_chat.on('member-left', function (userId) {
        // notifies that someone has left the room
        writeOnChatHistory('<b>' + userId + '</b>' + ' has left the room');
    });
    socket_chat.on('posted-chat', async function (msg_id) {
        // message post succeed
        message = unsent_msgs[msg_id]
        delete unsent_msgs[msg_id]
        // TODO : Store them in IndexDB
        let historyEle = document.getElementById(msg_id);
        historyEle.parentNode.removeChild(historyEle);

        writeOnChatHistory('<b>Me:</b> ' + message);
        await storeChatHistory(roomId+imgId, 'Me', msg_id, message)
    });
    socket_chat.on('recieve-chat', async function (username, msg_id, message) {
        // a message is received
        // TODO : Store them in IndexDB
        writeOnChatHistory('<b>' + username + ':</b> ' + message);
        await storeChatHistory(roomId+imgId, username, msg_id, message)
    });
    socket_chat.on('connect', function () {
        if(isChatJoined){
            writeOnChatHistory('<b>Reconnected to the server.</b>');
            socket_chat.emit('join', roomId, imgId, username);
        }
    });
    socket_chat.on('disconnect', function () {
        if(isChatJoined){
            isChatOnline = false
            writeOnChatHistory('<b>The connection was lost.</b>');
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
            writeOnChatHistory('<b>Rejoined the room. (drawing)</b>');
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
        let cvx = document.getElementById('canvas');
        let ctx = cvx.getContext('2d');
        drawOnCanvas(ctx, data.canvas.width, data.canvas.height, data.paths[0].x1, data.paths[0].y1, data.paths[0].x2, data.paths[0].y2, data.color, data.thickness)
    });

    socket_draw.on('connect', function () {
        if(isDrawJoined){
            writeOnChatHistory('<b>Reconnected to the server. (drawing)</b>');
            socket_draw.emit('join', roomId, imgId, username);
        }
    });

    socket_draw.on('cls', function () {
        console.log(isDrawJoined);
        if(isDrawJoined){
            
            clearCanvas();
        }
    });

    socket_draw.on('disconnect', function () {
        if(isDrawJoined){
            isDrawOnline = false
            writeOnChatHistory('<b>The connection was lost. (drawing)</b>');
        }
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let message = document.getElementById('chat_input').value;
    let msg_id = 'msg_' + Math.round(Math.random() * (2 ** 53))

    unsent_msgs[msg_id] = message

    if(isChatOnline){
        socket_chat.emit('post-chat', msg_id, message);
    }
    
    clearInputBox();
    writeOnChatHistoryWithId('<b>Me:</b> ' + message + ' <b>(unsent)</b>', msg_id);
}


/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnChatHistory(text) {
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
}

function writeOnChatHistoryWithId(text, id) {
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.id = id
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
}

/**
 * clearInputBox
 */
function clearInputBox() {
    document.getElementById('chat_input').value = '';
}
