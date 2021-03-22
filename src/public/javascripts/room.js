let socket_chat=io.connect('/chat');
let socket_draw=null;

let isJoined = false
let isOnline = false

let img_data_base64;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    initChatSocket();
    socket_chat.emit('join', roomId, imgId, username);

    initCanvas(socket_draw, $("#image").attr('src'));
}

// All unsent messages
// TODO : Store them in IndexDB
var unsent_msgs = {}


/**
 * Initialises the socket for /chat
 */
function initChatSocket() {
    socket_chat.on('joined', async function () {
        isOnline = true
        // it enters the chat
        if (!isJoined){
            isJoined = true

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
        if(isJoined){
            writeOnChatHistory('<b>Reconnected to the server.</b>');
            socket_chat.emit('join', roomId, imgId, username);
        }
    });
    socket_chat.on('disconnect', function () {
        if(isJoined){
            isOnline = false
            writeOnChatHistory('<b>The connection was lost.</b>');
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

    if(isOnline){
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