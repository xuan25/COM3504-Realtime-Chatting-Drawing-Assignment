$(document).ready(async () => {
  $('#joinBtn').click(async () => {
    imgId = $('#imgId').val();
    roomId = $('#roomId').val();
    username = $('#username').val();

    await storeUsername(username);
    window.location.href=`/join/${imgId}/${roomId}/`
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
