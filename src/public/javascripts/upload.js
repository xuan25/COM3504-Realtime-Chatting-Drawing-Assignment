var localMediaStream = null;
var videoStreamInited = false;

$(document).ready(function() {
	initPanel();
  initSnapshot();
});

function initPanel(){
  $("#urlPanel").show();
  $("#filePanel").hide();
  $("#cameraPanel").hide();

  $('#selectBox').change(function() {
    sel = $('#selectBox').val()
    if (sel === "1") {
      $("#urlPanel").show();
      $("#filePanel").hide();
      $("#cameraPanel").hide();
      deinitVideoStream();
    }
    else if (sel === "2") {
      $("#urlPanel").hide();
      $("#filePanel").show();
      $("#cameraPanel").hide();
      deinitVideoStream();
    }
    else {
      $("#urlPanel").hide();
      $("#filePanel").hide();
      $("#cameraPanel").show();
      initVideoStream();
    }
  });
}

function deinitVideoStream(){
  if(!videoStreamInited){
    return;
  }
  videoStreamInited = false;
  localMediaStream.getTracks()[0].stop();
  localMediaStream = null;
}

function initVideoStream(){
  if(videoStreamInited){
    return;
  }
  videoStreamInited = true;

  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(async function(stream){
    await navigator.mediaDevices.enumerateDevices();
    let mediaElement = document.getElementById('previewVideo');
    mediaElement.srcObject = stream;
    localMediaStream = stream;
    
    setTimeout(() => {
      var video = document.getElementById('previewVideo');
      var canvas = document.getElementById('shotCanvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }, 100);
  })
  .catch(function(err){
    console.log("Device not available")
    console.log(err)
  });
}

function initSnapshot(){
  $("#shotBtn").click(function(){
    if (localMediaStream) {
      var video = document.getElementById('previewVideo');
      var canvas = document.getElementById('shotCanvas');
      var ctx = canvas.getContext('2d');

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			
      ctx.drawImage(video, 0, 0);  
      console.log(canvas.toDataURL('image/png'))
    }
  });
}
