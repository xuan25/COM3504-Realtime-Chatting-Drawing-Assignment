let username = null;
let roomNo = null;
let socket_chat=io.connect('/chat');
let socket_draw=null;
let img_data_base64;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    initFileLoader();
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
    socket_chat.on('joined', function () {
       // it enters the chat
       hideLoginInterface(roomNo, username);
    });
    socket_chat.on('new-member', function (userId) {
        // notifies that someone has joined the room
        writeOnChatHistory('<b>' + userId + '</b>' + ' has joined the room');
    });
    socket_chat.on('member-left', function (userId) {
        // notifies that someone has left the room
        writeOnChatHistory('<b>' + userId + '</b>' + ' has left the room');
    });
    socket_chat.on('posted-chat', function (msg_id) {
        // message post succeed
        message = unsent_msgs[msg_id]
        delete unsent_msgs[msg_id]
        // TODO : Store them in IndexDB
        writeOnChatHistory('<b>Me:</b> ' + message);
    });
    socket_chat.on('recieve-chat', function (username, msg_id, message) {
        // a message is received
        // TODO : Store them in IndexDB
        writeOnChatHistory('<b>' + username + ':</b> ' + message);
    });
}


function initFileLoader() {
    let fileInput = document.getElementById('localImage');
    fileInput.addEventListener('change', function () {
        // check is the file is selected
        if (!fileInput.value) {
            info.innerHTML = 'No file selected';
            return;
        }
        // check the file
        let file = fileInput.files[0];
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            alert('Invalid file format');
            return;
        }
        // get the file
        let reader = new FileReader();
        reader.onload = function(e) {
            img_data_base64 = e.target.result;
        };
        // read the file by dataURL(Base64)
        reader.readAsDataURL(file);
    });
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    username = document.getElementById('name').value;
    let imageUrl = document.getElementById('image_url').value;
    if (imageUrl === "") {
        imageUrl = img_data_base64;

        // TODO: 
        // Upload img data via Ajax, get an url from server
        // change imageUrl 

    }
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
    let msg_id = 'msg_' + Math.round(Math.random() * 10000)
    unsent_msgs[msg_id] = message
    socket_chat.emit('post-chat', msg_id, message);
    clearInputBox();
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

