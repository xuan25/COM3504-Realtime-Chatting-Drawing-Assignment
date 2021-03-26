/**
 * get the query variable inside the url
 * @param name 
 * @returns value
 */
function getQueryVariable(name) {
  const reg = new RegExp("(^|&)" + name+ "=([^&]*)(&|$)", "i");
  const result = window.location.search.substr(1).match(reg);
  if ( result != null ){
     return decodeURI(result[2]);
  }
  else{
     return null;
  }
}

/**
 * Get the room id 
 * @returns room id
 */
function getRoomId() {
  return getQueryVariable('roomId')
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
    var imgId = getImgId();
    var roomId = getRoomId();
    // Change content
    $('#imgId').val(imgId)
    $('#roomId').val(roomId)
    $('#backgroundImage').css("background-image", `url(/img/raw/${imgId})`)
  }

  // join button clicked
  $('#joinBtn').click(async () => {
    imgId = $('#imgId').val();
    roomId = $('#roomId').val();
    username = $('#username').val();

    await storeUsername(username);
    window.location.href=`/room/${imgId}/${roomId}/`
  });

  // generate RoomId button clicked
  $('#genRoomIdBtn').click(() => {
    $('#roomId').val('Room-' + Math.round(Math.random() * 100000));
  });

  // generate username clicked
  $('#genUsernameBtn').click(() => {
    $('#username').val('User-' + Math.round(Math.random() * 100000));
  });
  
  // use previous username if avaliable
  username = await getUsername();
  $('#username').val(username);
});
