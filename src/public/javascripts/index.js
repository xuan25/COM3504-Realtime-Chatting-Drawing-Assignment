let username = null;
let roomNo = null;
let socket_chat=io.connect('/chat');
let socket_draw=null;
let imageUrl=null;

let isJoined = false
let isOnline = false


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    //@todo here is where you should initialise the socket operations as described in teh lectures (room joining, chat message receipt etc.)
    initChatSocket();
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
            hideLoginInterface(roomNo, username);
            isJoined = true

            let chatHistories = await getChatHistories(roomNo+imageUrl)
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
        await storeChatHistory(roomNo+imageUrl, 'Me', msg_id, message)
    });
    socket_chat.on('recieve-chat', async function (username, msg_id, message) {
        // a message is received
        // TODO : Store them in IndexDB
        writeOnChatHistory('<b>' + username + ':</b> ' + message);
        await storeChatHistory(roomNo+imageUrl, username, msg_id, message)
    });
    socket_chat.on('connect', function () {
        if(isJoined){
            writeOnChatHistory('<b>Reconnected to the server.</b>');
            socket_chat.emit('join', roomNo, imageUrl, username);
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
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    username = document.getElementById('name').value;
    imageUrl= document.getElementById('image_url').value;
    if (!username) username = 'Unknown-' + Math.random();
    //join the room
    initCanvas(socket_draw, imageUrl);
    socket_chat.emit('join', roomNo, imageUrl, username);
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
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * clearInputBox
 */
function clearInputBox() {
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

