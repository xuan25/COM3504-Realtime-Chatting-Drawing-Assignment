var localMediaStream = null;
var videoStreamInited = false;

let img_data_local_base64 = null;
let img_data_camera_base64 = null;

$(document).ready(function() {
	initPanel();
  initFileLoader();
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
      // console.log(canvas.toDataURL('image/png'))
      img_data_camera_base64 = canvas.toDataURL('image/png');
    }
  });
}

function initFileLoader() {
  let fileInput = document.getElementById('fromFile');
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
        img_data_local_base64 = e.target.result;
      };
      // read the file by dataURL(Base64)
      reader.readAsDataURL(file);
  });
}

function upload() {
  title = $("#title").val();
  author = $("#author").val();
  description = $("#description").val();

  sel = $('#selectBox').val()
  if (sel === "1") { //url
    imgUrl = $("#fromUrl").val()
    createRoomByUrl(imgUrl, title, author, description);
  }
  else if (sel === "2") { //local file
    createRoomByUpload(img_data_local_base64, title, author, description)
  }
  else { //camera
    createRoomByUpload(img_data_camera_base64, title, author, description)
  }
}


function createRoomByUrl(imgUrl, title, author, description){
  createRoom(title, author, description, "http", imgUrl)
}

function createRoomByUpload(data, title, author, description){
  createRoom(title, author, description, "data", data)
}

function createRoom(title, author, description, imgType, img){
  data = { title: title, author: author, desc: description, imgType: imgType, img: img }
  json = JSON.stringify(data);

  $.ajax({
    url: "/upload",
    type: "POST",
    data: json,

    contentType: "application/json",
    success: function (response) {
      // TODO: Show room num & link
      console.log(JSON.stringify(response));
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}



