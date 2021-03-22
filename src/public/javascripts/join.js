$(document).ready(() => {
    $('#joinBtn').click(() => {
      imgId = $('#imgId').val();
      roomId = $('#roomId').val();

      window.location.href=`/join/${imgId}/${roomId}/`
    });
  });