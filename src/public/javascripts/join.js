// parse imgId
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

function getRoomId() {
  return getQueryVariable('roomId')
}

function getImgId() {
  const result = window.location.pathname.split('/')[2]
  if ( result != null ){
     return decodeURI(result);
  }
  else{
     return null;
  }
}

$(document).ready(async () => {

  
  if (isTemplate){
    // Parse url
    var imgId = getImgId();
    var roomId = getRoomId();
    $('#imgId').val(imgId)
    $('#roomId').val(roomId)
    $('#backgroundImage').css("background-image", `url(/img/raw/${imgId})`)
  }

  $('#joinBtn').click(async () => {
    imgId = $('#imgId').val();
    roomId = $('#roomId').val();
    username = $('#username').val();

    await storeUsername(username);
    window.location.href=`/room/${imgId}/${roomId}/`
  });

  $('#genRoomIdBtn').click(() => {
    $('#roomId').val('Room-' + Math.round(Math.random() * 100000));
  });

  $('#genUsernameBtn').click(() => {
    $('#username').val('User-' + Math.round(Math.random() * 100000));
  });

  username = await getUsername();
  $('#username').val(username);
});
