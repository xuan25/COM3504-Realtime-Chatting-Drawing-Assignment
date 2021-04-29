
// incomming data stream form camera
var localMediaStream = null;
// check the status of the media straem
var videoStreamInited = false;

// store the image data
let img_data_local_base64 = null;
let img_data_camera_base64 = null;


/**
 * Onload
 */
$(document).ready(function() {
	initPanel();
  initFileLoader();
  initSnapshot();
});

/**
 * Initialize the image upload panel
 */
function initPanel(){
  $("#urlPanel").show();
  $("#filePanel").hide();
  $("#cameraPanel").hide();

  $('#selectBox').change(function() {
    sel = $('#selectBox').val()
    if (sel === "1") {
      // from internet url 
      $("#urlPanel").show();
      $("#filePanel").hide();
      $("#cameraPanel").hide();
      deinitVideoStream();
    }
    else if (sel === "2") {
      // from file
      $("#urlPanel").hide();
      $("#filePanel").show();
      $("#cameraPanel").hide();
      deinitVideoStream();
    }
    else {
      // from camera
      $("#urlPanel").hide();
      $("#filePanel").hide();
      $("#cameraPanel").show();
      initVideoStream();
    }
  });
}

/**
 * Close the media stream
 * @returns 
 */
function deinitVideoStream(){
  if(!videoStreamInited){
    return;
  }
  videoStreamInited = false;
  localMediaStream.getTracks()[0].stop();
  localMediaStream = null;
}

/**
 * Initialize the media stream 
 * @returns 
 */
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
      // resize snapshot canvas
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

/**
 * Initialize snapshot event
 */
function initSnapshot(){
  $("#shotBtn").click(function(){
    // draw a snapshot to the canvas
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

/**
 * Get the local image
 */
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

/**
 * get the image data and upload
 */
function upload() {
  title = $("#title").val();
  author = $("#author").val();
  description = $("#description").val();

  sel = $('#selectBox').val()
  if (sel === "1") {
    // from url
    imgUrl = $("#fromUrl").val()
    uploadByUrl(imgUrl, title, author, description);
  }
  else if (sel === "2") {
    // from local file
    uploadByData(img_data_local_base64, title, author, description)
  }
  else {
    // from camera
    uploadByData(img_data_camera_base64, title, author, description)
  }
}

/**
 * upload the image by the internet link
 * @param imgUrl  image url
 * @param title title
 * @param author author
 * @param description description
 */
function uploadByUrl(imgUrl, title, author, description){
  doUpload(title, author, description, "http", imgUrl)
}
/**
 * upload the image by data Url
 * @param  data image data
 * @param  title title
 * @param  author author
 * @param  description description
 */
function uploadByData(data, title, author, description){
  doUpload(title, author, description, "data", data)
}

/**
 * 
 * Get all the information required for submission and submit
 * @param  title title
 * @param  author author
 * @param  description description
 * @param  imgType image type
 * @param  img image
 */
function doUpload(title, author, description, imgType, img){
  $("#submitBtn").prop("disabled", true);
  data = { title: title, author: author, desc: description, imgType: imgType, img: img }
  json = JSON.stringify(data);

  $.ajax({
    url: "/upload",
    type: "POST",
    data: json,

    contentType: "application/json",
    success: function (response) {
      if(response.code == 0){
        successUrl = `/join/${response.data.imgId}`
        window.location.href = successUrl;
      }
      else{
        $("#submitBtn").prop("disabled", false);
        console.log("Upload failed");
      }
      console.log(JSON.stringify(response));
    },
    error: function (xhr, status, error) {
      $("#submitBtn").prop("disabled", false);
      console.log(error);
    },
  });
}



